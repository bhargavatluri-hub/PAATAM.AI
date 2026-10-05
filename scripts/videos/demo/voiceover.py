"""Generates the teacher voice-over for the demo video and muxes it in.

Uses Kokoro (open-weight neural TTS, runs offline) with an Indian female voice.
    python voiceover.py <kokoro-dir> <ffmpeg> <video-in.mp4> <video-out.mp4>
Each line is placed at a fixed time to match the scene timeline in demo.html; if a line
runs longer than its window it is re-synthesised slightly faster (never above 1.18x).
"""
import subprocess
import sys
from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro

KDIR, FFMPEG, VIDEO_IN, VIDEO_OUT = sys.argv[1:5]
VOICE, LANG = "hf_alpha", "en-gb"
BASE_SPEED = 1.0

# (start, end of window, line) — seconds, aligned to demo.html segments.
LINES = [
    (0.8, 5.6, "Every answer has a story. With Paatam, we finally get to understand it."),
    (6.0, 20.0, "I'm a teacher. Paatam reads my students' handwritten answer sheets, question by question. "
                "It suggests marks and feedback, but nothing is final until I check it and approve it. "
                "Then the parent gets the update on WhatsApp."),
    (20.4, 23.0, "And it all happens on one grading desk."),
    (23.4, 35.6, "The overview shows what's been scanned, and what's waiting for my sign-off. "
                 "Six A.I. agents do the heavy lifting, but the final step is always the teacher. "
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
    (90.3, 96.6, "Paatam. Marks in minutes. Judgement stays human. Request a demo for your school."),
]

k = Kokoro(f"{KDIR}/kokoro-v1.0.onnx", f"{KDIR}/voices-v1.0.bin")
work = Path(VIDEO_OUT).with_suffix("").with_name(Path(VIDEO_OUT).stem + "_vo")
work.mkdir(exist_ok=True)

clips = []
for i, (start, end, text) in enumerate(LINES):
    speed = BASE_SPEED
    audio, sr = k.create(text, voice=VOICE, speed=speed, lang=LANG)
    dur = len(audio) / sr
    window = end - start
    if dur > window:
        speed = min(1.18, BASE_SPEED * dur / window * 1.02)
        audio, sr = k.create(text, voice=VOICE, speed=speed, lang=LANG)
        dur = len(audio) / sr
    path = work / f"line{i:02d}.wav"
    sf.write(path, audio, sr)
    clips.append((start, path))
    flag = "  ⚠ overruns" if dur > window + 0.05 else ""
    print(f"{start:5.1f}s  {dur:4.1f}s / {window:4.1f}s  x{speed:.2f}{flag}")

# Mix: place each line, light EQ/compression for a clean broadcast voice, normalise loudness.
inputs, chains = [], []
for i, (start, path) in enumerate(clips):
    inputs += ["-i", str(path)]
    ms = int(start * 1000)
    chains.append(f"[{i + 1}:a]adelay={ms}|{ms}[a{i}]")
mix = "".join(f"[a{i}]" for i in range(len(clips)))
fc = ";".join(chains) + (
    f";{mix}amix=inputs={len(clips)}:normalize=0,"
    "highpass=f=90,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,"
    "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,apad[vo]"
)
probe = subprocess.run([FFMPEG, "-hide_banner", "-i", VIDEO_IN], capture_output=True, text=True).stderr
h, m, sec = probe.split("Duration: ")[1].split(",")[0].split(":")
video_dur = int(h) * 3600 + int(m) * 60 + float(sec)
subprocess.run(
    [FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-i", VIDEO_IN, *inputs,
     "-filter_complex", fc, "-map", "0:v", "-map", "[vo]",
     "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{video_dur:.3f}", "-movflags", "+faststart", VIDEO_OUT],
    check=True,
)
print("wrote", VIDEO_OUT)
