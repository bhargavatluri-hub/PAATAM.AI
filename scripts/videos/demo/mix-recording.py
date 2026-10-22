"""Cuts the recorded teacher voice-over into lines and lays them onto the demo video.

    python mix-recording.py <ffmpeg> <recording> <line-12-recording> <rnnoise-model> <video-in.mp4> <video-out.mp4>

The main recording is one take of the whole script with pauses between lines; line 12 was
re-recorded separately. Each line (or phrase) is cut out, cleaned up, and placed on the
moment its scene or caption appears in demo.html. Phrases play at their natural pace: the
scene timings in demo.html were set to fit them. Non-speech sounds in the main recording
(a buzz before line 4, a horn beep before line 6) are left out of the cuts.

Clean-up removes background sound with RNNoise (model: https://github.com/richardpl/arnndn-models,
std.rnnn) and gates everything between words to silence.
"""
import subprocess
import sys

FFMPEG, RECORDING, LINE12, RNNOISE_MODEL, VIDEO_IN, VIDEO_OUT = sys.argv[1:7]
SOURCES = {"main": RECORDING, "l12": LINE12}

# (start in video, source, cut start, cut end) — seconds. Line 4 is split across its three
# overview captions; line 12's pauses are tightened slightly so it fits its scene; line 13 is
# cut into its three phrases (dropping an "and" that isn't in the script) to land with the outro text.
LINES = [
    (0.8, "main", 0.77, 5.58),       # 01 Every answer has a story…
    (5.85, "main", 8.46, 22.58),     # 02 I am a teacher…
    (20.4, "main", 24.80, 28.09),    # 03 And it all happens on one grading desk.
    (25.4, "main", 31.29, 35.58),    # 04 The overview shows… sign-off. (cut lands at 31.21, clear of the buzz)
    (30.5, "main", 36.38, 41.71),    #    Six AI agents… always the teacher.
    (36.6, "main", 42.66, 45.51),    #    Every suggested mark waits in my review queue.
    (41.1, "main", 48.20, 52.77),    # 05 In Classes…
    (47.5, "main", 55.01, 59.65),    # 06 Student Analytics… (after the horn beep)
    (53.1, "main", 63.01, 67.14),    # 07 My answer keys…
    (58.7, "main", 68.98, 73.11),    # 08 The exam generator…
    (64.4, "main", 76.16, 82.47),    # 09 Our principal…
    (73.1, "main", 85.14, 89.28),    # 10 Students see…
    (78.8, "main", 92.62, 96.46),    # 11 And parents get updates…
    (84.4, "l12", 0.63, 1.42),       # 12 From the student,
    (85.59, "l12", 2.19, 4.07),      #    to the teacher, the coordinator,
    (87.87, "l12", 4.72, 6.66),      #    head of the school, and the parent.
    (90.26, "l12", 7.13, 8.78),      #    Everyone sees what they need.
    (92.31, "l12", 9.28, 12.18),     #    And every assessment makes the next lesson better.
    (95.6, "main", 128.48, 129.00),  # 13 Paatam. (first take)
    (96.45, "main", 129.62, 130.76), #    Marks in minutes.
    (98.15, "main", 131.77, 133.23), #    Judgement stays human. (cut lands at 131.69 after the 0.08 s pre-roll)
]
PRE, POST, FADE = 0.08, 0.18, 0.03

# Phone recording clean-up: neural noise removal, rumble/hiss filters, a gate that silences
# everything between words, then gentle compression. Loudness is set after mixing with one fixed gain
# (measured over the whole track), so it never pumps.
CLEAN = (
    f"arnndn=m='{RNNOISE_MODEL}',highpass=f=85,lowpass=f=11000,"
    "agate=threshold=0.02:range=0.001:ratio=10:attack=3:release=180:knee=4,"
    "acompressor=threshold=-22dB:ratio=2.5:attack=8:release=150"
)

inputs, chains = [], []
for i, (at, src, a, b) in enumerate(LINES):
    a, b = max(0, a - PRE), b + POST
    inputs += ["-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", SOURCES[src]]
    ms = int((at - PRE) * 1000)
    chains.append(
        f"[{i + 1}:a]aresample=48000,{CLEAN},afade=t=in:d={FADE},afade=t=out:st={b - a - FADE:.3f}:d={FADE},"
        f"adelay={ms}|{ms}[a{i}]"
    )
mix = "".join(f"[a{i}]" for i in range(len(LINES)))
voice = ";".join(chains) + f";{mix}amix=inputs={len(LINES)}:normalize=0"
TARGET_LUFS = -16

probe = subprocess.run([FFMPEG, "-hide_banner", "-i", VIDEO_IN], capture_output=True, text=True).stderr
h, m, sec = probe.split("Duration: ")[1].split(",")[0].split(":")
video_dur = int(h) * 3600 + int(m) * 60 + float(sec)

# Pass 1: measure integrated loudness of the voice track.
measure = subprocess.run(
    [FFMPEG, "-hide_banner", "-i", VIDEO_IN, *inputs,
     "-filter_complex", voice + ",ebur128=framelog=quiet[out]", "-map", "[out]", "-f", "null", "-"],
    capture_output=True, text=True,
).stderr
integrated = float(measure.split("Integrated loudness:")[1].split("I:")[1].split("LUFS")[0])
gain = TARGET_LUFS - integrated
print(f"voice loudness {integrated:.1f} LUFS, gain {gain:+.1f} dB")

# Pass 2: apply the gain, catch peaks, and mux with the video.
fc = voice + f",volume={gain:.2f}dB,alimiter=limit=0.84:level=false,aresample=48000,apad[vo]"
subprocess.run(
    [FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-i", VIDEO_IN, *inputs,
     "-filter_complex", fc, "-map", "0:v", "-map", "[vo]",
     "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-t", f"{video_dur:.3f}", "-movflags", "+faststart", VIDEO_OUT],
    check=True,
)
print("wrote", VIDEO_OUT)
