"""Generates the teacher voice-over for the demo video and muxes it in.

Uses AI4Bharat Indic-TTS (FastPitch + HiFi-GAN, runs offline), Indian English, female speaker.
Model: https://github.com/AI4Bharat/Indic-TTS/releases/download/v1-checkpoints-release/en.zip
Needs: pip install coqui-tts torch==2.11.0 torchaudio==2.11.0 torchcodec soundfile
    python voiceover.py <indic-tts-en-dir> <ffmpeg> <video-in.mp4> <video-out.mp4>
Each line is placed at a fixed time to match the scene timeline in demo.html; if a line
runs past the start of the next line it is sped up with a pitch-preserving tempo change (never above 1.15x).
"""
import json
import subprocess
import sys
from pathlib import Path

import soundfile as sf
from TTS.utils.synthesizer import Synthesizer

MODEL_DIR, FFMPEG, VIDEO_IN, VIDEO_OUT = sys.argv[1:5]
SPEAKER = "female"
MAX_TEMPO = 1.15

# (start, end of window, line) — seconds, aligned to demo.html segments.
LINES = [
    (0.8, 5.6, "Every answer has a story. With Paatam, we finally get to understand it."),
    (6.0, 20.0, "I am a teacher. Paatam reads my students' handwritten answer sheets, question by question. "
                "It suggests marks and feedback, but nothing is final until I check it and approve it. "
                "Then the parent gets the update on WhatsApp."),
    (20.4, 23.0, "And it all happens on one grading desk."),
    (23.4, 35.6, "The overview shows what's been scanned, and what's waiting for my sign-off. "
                 "Six eh-eye agents do the heavy lifting, but the final step is always the teacher. "
                 "Every suggested mark waits in my review queue."),
    (36.3, 41.3, "In Classes, I can see which concepts a whole section is struggling with."),
    (41.9, 47.0, "Student Analytics tracks every child's progress, exam after exam."),
    (47.5, 52.6, "My answer keys and rubrics guide every mark it suggests."),
    (53.1, 58.3, "The exam generator drafts question papers. I edit them, and I approve them."),
    (58.8, 66.9, "Our principal sees the whole school at a glance: the topics that aren't landing, "
                 "and the students who need help, early."),
    (67.5, 72.6, "Students see my approved feedback, and exactly what to practise next."),
    (73.2, 78.7, "And parents get updates on WhatsApp, only after I approve them."),
    (79.3, 89.6, "From the student, to the teacher, the coordinator, the principal, and the parent, "
                 "everyone sees what they need. And every assessment makes the next lesson better."),
    (90.3, 96.6, "Paatam: marks in minutes, judgement stays human. Request a demo for your school."),
]

# The released config points at the authors' training paths; aim it at the local speakers file.
fp = Path(MODEL_DIR) / "fastpitch"
speakers = str(fp / "speakers.pth")
cfg = json.loads((fp / "config.json").read_text())
cfg["speakers_file"] = speakers
cfg.setdefault("model_args", {})["speakers_file"] = speakers
local_cfg = fp / "config_local.json"
local_cfg.write_text(json.dumps(cfg))

tts = Synthesizer(
    tts_checkpoint=str(fp / "best_model.pth"),
    tts_config_path=str(local_cfg),
    tts_speakers_file=speakers,
    vocoder_checkpoint=str(Path(MODEL_DIR) / "hifigan" / "best_model.pth"),
    vocoder_config=str(Path(MODEL_DIR) / "hifigan" / "config.json"),
    use_cuda=False,
)
work = Path(VIDEO_OUT).with_suffix("").with_name(Path(VIDEO_OUT).stem + "_vo")
work.mkdir(exist_ok=True)

# Trim the model's leading/trailing silence so timing reflects speech only.
TRIM = ("silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
        "silenceremove=start_periods=1:start_threshold=-45dB,areverse")
probe = subprocess.run([FFMPEG, "-hide_banner", "-i", VIDEO_IN], capture_output=True, text=True).stderr
h, m, sec = probe.split("Duration: ")[1].split(",")[0].split(":")
video_dur = int(h) * 3600 + int(m) * 60 + float(sec)

clips = []
for i, (start, end, text) in enumerate(LINES):
    raw = work / f"line{i:02d}_raw.wav"
    tts.save_wav(tts.tts(text, speaker_name=SPEAKER), str(raw))
    # A line may run into the pause before the next one, but never into it.
    next_start = LINES[i + 1][0] if i + 1 < len(LINES) else video_dur
    window = next_start - start - 0.2
    trimmed = work / f"line{i:02d}_trim.wav"
    subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-i", str(raw), "-af", TRIM, str(trimmed)],
                   check=True)
    dur = sf.info(trimmed).duration
    tempo = min(MAX_TEMPO, dur / window * 1.02) if dur > window else 1.0
    path = work / f"line{i:02d}.wav"
    subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-i", str(trimmed),
                    "-af", f"atempo={tempo:.4f}", str(path)], check=True)
    dur = sf.info(path).duration
    clips.append((start, path))
    flag = "  ⚠ overruns" if dur > window + 0.05 else ""
    print(f"{start:5.1f}s  {dur:4.1f}s / {window:4.1f}s  x{tempo:.2f}{flag}")

# Mix: place each line, light EQ/compression for a clean broadcast voice, normalise loudness.
inputs, chains = [], []
for i, (start, path) in enumerate(clips):
    inputs += ["-i", str(path)]
    ms = int(start * 1000)
    chains.append(f"[{i + 1}:a]aresample=48000,adelay={ms}|{ms}[a{i}]")
mix = "".join(f"[a{i}]" for i in range(len(clips)))
fc = ";".join(chains) + (
    f";{mix}amix=inputs={len(clips)}:normalize=0,"
    "highpass=f=90,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,"
    "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,apad[vo]"
)
subprocess.run(
    [FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-i", VIDEO_IN, *inputs,
     "-filter_complex", fc, "-map", "0:v", "-map", "[vo]",
     "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{video_dur:.3f}", "-movflags", "+faststart", VIDEO_OUT],
    check=True,
)
print("wrote", VIDEO_OUT)
