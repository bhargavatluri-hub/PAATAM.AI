"""Cuts the recorded teacher voice-over into lines and lays them onto the demo video.

    python mix-recording.py <ffmpeg> <recording> <video-in.mp4> <video-out.mp4>

The recording is one take of the whole script with pauses between lines (lines 12 and 13
were recorded twice; the clearer take of each is used). Each line is cut from the
recording, lightly cleaned up, and placed at the moment its scene starts in demo.html.
Lines play at their natural pace: the scene timings in demo.html were lengthened to fit them.
"""
import subprocess
import sys

FFMPEG, RECORDING, VIDEO_IN, VIDEO_OUT = sys.argv[1:5]

# (start in video, cut from recording: start, end) — seconds.
LINES = [
    (0.8, 0.77, 5.58),       # 01 Every answer has a story…
    (5.85, 8.46, 22.58),     # 02 I am a teacher…
    (20.4, 24.80, 28.09),    # 03 And it all happens on one grading desk.
    (24.0, 28.74, 45.40),    # 04 The overview shows…
    (41.1, 48.20, 52.77),    # 05 In Classes…
    (46.7, 53.62, 59.63),    # 06 Student Analytics…
    (53.1, 63.01, 67.14),    # 07 My answer keys…
    (58.7, 68.98, 73.11),    # 08 The exam generator…
    (64.4, 76.16, 82.47),    # 09 Our principal…
    (73.1, 85.14, 89.28),    # 10 Students see…
    (78.8, 92.62, 96.46),    # 11 And parents get updates…
    (84.9, 114.73, 125.12),  # 12 From the student… (second take)
    (95.9, 128.62, 133.23),  # 13 Paatam. Marks in minutes… (first take)
]
PRE, POST, FADE = 0.08, 0.18, 0.03

# Phone recording clean-up: remove rumble and hiss, gentle compression; loudness is normalised after mixing.
CLEAN = "highpass=f=85,lowpass=f=11000,afftdn=nf=-30,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=150"

inputs, chains = [], []
for i, (at, a, b) in enumerate(LINES):
    a, b = a - PRE, b + POST
    inputs += ["-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", RECORDING]
    ms = int((at - PRE) * 1000)
    chains.append(
        f"[{i + 1}:a]aresample=48000,{CLEAN},afade=t=in:d={FADE},afade=t=out:st={b - a - FADE:.3f}:d={FADE},"
        f"adelay={ms}|{ms}[a{i}]"
    )
mix = "".join(f"[a{i}]" for i in range(len(LINES)))
fc = ";".join(chains) + f";{mix}amix=inputs={len(LINES)}:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,apad[vo]"

probe = subprocess.run([FFMPEG, "-hide_banner", "-i", VIDEO_IN], capture_output=True, text=True).stderr
h, m, sec = probe.split("Duration: ")[1].split(",")[0].split(":")
video_dur = int(h) * 3600 + int(m) * 60 + float(sec)
subprocess.run(
    [FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-i", VIDEO_IN, *inputs,
     "-filter_complex", fc, "-map", "0:v", "-map", "[vo]",
     "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-t", f"{video_dur:.3f}", "-movflags", "+faststart", VIDEO_OUT],
    check=True,
)
print("wrote", VIDEO_OUT)
