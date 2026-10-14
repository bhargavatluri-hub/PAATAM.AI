"""Render the Class 7 SSC Hindi sample: printed question paper, a student's
handwritten answer sheet (with strike-throughs, scribbles and insertions) and
the answer key.

    python3 scripts/sample-papers/generate_hindi_class7.py [--seed N] [--out DIR]

Needs Pillow built with libraqm (for Devanagari shaping) and numpy.
Fonts (Kalam for handwriting, Sura for print, both SIL OFL) live in ./fonts.
The web-font subsets split Devanagari and Latin glyphs into separate files, so
every string is drawn as script runs, each with its own font.
"""

import argparse
import math
import os
import re
from functools import lru_cache

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, features

from hindi_class7_content import ANSWER_KEY, QUESTION_PAPER, STUDENT_ANSWERS, STUDENT_HEADER

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
W, H = 1654, 2339  # A4 at 200 dpi

# ---------------------------------------------------------------- fonts / runs


@lru_cache(maxsize=None)
def font(family, weight, script, size):
    path = os.path.join(FONTS, f"{family}-{script}-{weight}.ttf")
    return ImageFont.truetype(path, size, layout_engine=ImageFont.Layout.RAQM)


def is_deva(ch):
    return 0x0900 <= ord(ch) <= 0x097F or ch in "‌‍"


def runs(text):
    """Split text into (script, substring) runs."""
    out = []
    for ch in text:
        s = "devanagari" if is_deva(ch) else "latin"
        if out and out[-1][0] == s:
            out[-1][1] += ch
        else:
            out.append([s, ch])
    return [(s, t) for s, t in out]


def run_width(text, family, weight, size):
    return sum(font(family, weight, s, size).getlength(t) for s, t in runs(text))


def draw_runs(draw, x, baseline, text, family, weight, size, fill):
    for s, t in runs(text):
        f = font(family, weight, s, size)
        draw.text((x, baseline), t, font=f, fill=fill, anchor="ls")
        x += f.getlength(t)
    return x


def check_coverage(lines, family, weights):
    """Fail early if a character has no glyph (needs fontTools; skipped without it)."""
    try:
        from fontTools.ttLib import TTFont
    except ImportError:
        return
    missing = set()
    for w in weights:
        cmaps = {s: TTFont(os.path.join(FONTS, f"{family}-{s}-{w}.ttf")).getBestCmap()
                 for s in ("devanagari", "latin")}
        for line in lines:
            for s, t in runs(line):
                missing |= {ch for ch in t if ord(ch) not in cmaps[s] and not (ch == " " and s == "latin")}
    missing -= {"\u200c", "\u200d"}
    if missing:
        raise SystemExit(f"{family}: no glyph for {sorted(missing)!r}")


# ---------------------------------------------------------------- paper


def paper(rng, lined=True, top=300):
    base = np.zeros((H, W, 3), np.float32)
    base[:] = (247, 245, 236)
    # low-frequency blotches + grain
    low = rng.normal(0, 1, (12, 9)).astype(np.float32)
    low = np.array(Image.fromarray(low, "F").resize((W, H), Image.BICUBIC))
    base += low[..., None] * 2.2
    base += rng.normal(0, 2.6, (H, W, 1))
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    if lined:
        y = top
        while y < H - 120:
            d.line([(0, y), (W, y)], fill=(160, 186, 220), width=2)
            y += LS
        d.line([(MARGIN, 0), (MARGIN, H)], fill=(222, 120, 118), width=2)
        d.line([(MARGIN + 6, 0), (MARGIN + 6, H)], fill=(226, 140, 138), width=1)
    return img


def finish_scan(img, rng):
    """Uneven lighting, slight blur and grain, like a phone scan."""
    a = np.asarray(img).astype(np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    cx, cy = W * rng.uniform(0.35, 0.65), H * rng.uniform(0.3, 0.6)
    r = np.sqrt(((xx - cx) / W) ** 2 + ((yy - cy) / H) ** 2)
    light = 1.0 - 0.07 * r - 0.02 * (xx / W) * rng.uniform(-1, 1)
    a *= light[..., None]
    a += rng.normal(0, 1.8, a.shape)
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    out = out.rotate(rng.uniform(-0.35, 0.35), resample=Image.BICUBIC, fillcolor=(238, 236, 228))
    return out.filter(ImageFilter.GaussianBlur(0.45))


# ---------------------------------------------------------------- handwriting

LS = 84  # ruled line spacing
MARGIN = 190  # red margin line x
HAND = 46  # handwriting size
INK = (24, 44, 128)


def smooth_field(rng, h, w, cells, amp):
    g = rng.normal(0, 1, (max(2, int(h / cells) + 2), max(2, int(w / cells) + 2))).astype(np.float32)
    return np.array(Image.fromarray(g, "F").resize((w, h), Image.BICUBIC)) * amp


def warp(mask, rng, amp):
    """Small elastic distortion so repeated words never look identical."""
    a = np.asarray(mask).astype(np.float32)
    h, w = a.shape
    dx = smooth_field(rng, h, w, 26, amp)
    dy = smooth_field(rng, h, w, 26, amp * 0.8)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    sx = np.clip(xx + dx, 0, w - 1.001)
    sy = np.clip(yy + dy, 0, h - 1.001)
    x0, y0 = sx.astype(int), sy.astype(int)
    fx, fy = sx - x0, sy - y0
    v = (a[y0, x0] * (1 - fx) * (1 - fy) + a[y0, x0 + 1] * fx * (1 - fy)
         + a[y0 + 1, x0] * (1 - fx) * fy + a[y0 + 1, x0 + 1] * fx * fy)
    return Image.fromarray(np.clip(v, 0, 255).astype(np.uint8), "L")


class Hand:
    """One writer: consistent slant and size, with per-word wobble."""

    def __init__(self, rng):
        self.rng = rng
        self.slant = rng.uniform(0.06, 0.12)  # leans right

    def word(self, text, size):
        rng = self.rng
        size = max(18, int(round(size * rng.normal(1.0, 0.035))))
        width = run_width(text, "kalam", 400, size)
        pad = int(size * 0.9)
        cw, ch = int(width + 2 * pad), int(size * 2.6)
        base = int(size * 1.45)
        m = Image.new("L", (cw, ch), 0)
        d = ImageDraw.Draw(m)
        draw_runs(d, pad, base, text, "kalam", 400, size, 255)
        m = warp(m, rng, size * 0.035)
        s = self.slant + rng.normal(0, 0.02)
        m = m.transform(m.size, Image.AFFINE, (1, s, -s * base, 0, 1, 0), resample=Image.BICUBIC)
        m = m.rotate(rng.normal(0, 0.9), resample=Image.BICUBIC, center=(pad, base))
        # pen pressure: alpha varies smoothly along the word
        p = smooth_field(rng, ch, cw, 18, 0.12) + rng.uniform(0.82, 0.97)
        a = np.asarray(m).astype(np.float32) * np.clip(p, 0.55, 1.0)
        m = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "L")
        return m, pad, base, width * rng.normal(1.0, 0.015)


def jitter_line(pts, rng, sd, step=22):
    """Resample a polyline every ~step px with a little vertical tremor."""
    out = [pts[0]]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        n = max(1, int(math.hypot(x1 - x0, y1 - y0) / step))
        for i in range(1, n + 1):
            t = i / n
            out.append((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + (rng.normal(0, sd) if i < n else 0)))
    return out


def pen(draw, pts, fill, width, ss=4):
    """Antialiased polyline with round joints (drawn 4x supersampled)."""
    img = draw._image
    r = width / 2
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    x0, y0 = int(min(xs) - width - 2), int(min(ys) - width - 2)
    x1, y1 = int(max(xs) + width + 3), int(max(ys) + width + 3)
    big = Image.new("L", ((x1 - x0) * ss, (y1 - y0) * ss), 0)
    d = ImageDraw.Draw(big)
    sp = [((x - x0) * ss, (y - y0) * ss) for x, y in pts]
    for a, b in zip(sp, sp[1:]):
        d.line([a, b], fill=fill, width=int(width * ss))
    for x, y in sp:
        d.ellipse((x - r * ss, y - r * ss, x + r * ss, y + r * ss), fill=fill)
    small = big.resize((x1 - x0, y1 - y0), Image.LANCZOS)
    region = img.crop((x0, y0, x1, y1))
    img.paste(ImageChops.lighter(region, small), (x0, y0))


class Sheet:
    """Lays out handwritten paragraphs over ruled answer-sheet pages."""

    def __init__(self, rng, first_top):
        self.rng = rng
        self.hand = Hand(rng)
        self.pages = []
        self.first_top = first_top
        self.new_page()

    # page / line bookkeeping
    def new_page(self):
        top = self.first_top if not self.pages else 260
        self.ink = Image.new("L", (W, H), 0)
        self.draw = ImageDraw.Draw(self.ink)
        self.pages.append({"ink": self.ink, "top": top})
        self.line_y = top
        self.boxes = []  # (deco, group, line_id, x0, y0, x1, y1)
        self.line_id = 0
        self.start_line()

    def start_line(self):
        rng = self.rng
        self.x = MARGIN + 26 + rng.normal(0, 3)
        self.drift0 = rng.normal(-5, 2.5)
        self.slope = rng.normal(-0.004, 0.003)
        self.line_id += 1

    def next_line(self, n=1):
        self.flush_decos()
        self.line_y += LS * n
        if self.line_y > H - 150:
            self.pages[-1]["ink"] = self.ink
            self.new_page()
        else:
            self.start_line()

    def baseline(self, x):
        return self.line_y + self.drift0 + self.slope * (x - MARGIN) + self.rng.normal(0, 1.6)

    def stamp(self, m, x, y):
        region = self.ink.crop((int(x), int(y), int(x) + m.width, int(y) + m.height))
        self.ink.paste(ImageChops.lighter(region, m), (int(x), int(y)))

    def put_word(self, text, x, base_y, size=HAND):
        m, pad, base, adv = self.hand.word(text, size)
        self.stamp(m, x - pad, base_y - base)
        bb = m.getbbox() or (pad, base - size, pad + adv, base)
        return adv, (x - pad + bb[0], base_y - base + bb[1], x - pad + bb[2], base_y - base + bb[3])

    # strokes
    def stroke(self, pts, width=3, sd=0.8):
        pen(self.draw, jitter_line(pts, self.rng, sd), int(255 * self.rng.uniform(0.85, 0.95)), width)

    def flush_decos(self):
        groups = {}
        for deco, gid, lid, x0, y0, x1, y1 in self.boxes:
            g = groups.setdefault((deco, gid, lid), [x0, y0, x1, y1])
            g[0], g[1], g[2], g[3] = min(g[0], x0), min(g[1], y0), max(g[2], x1), max(g[3], y1)
        rng = self.rng
        for (deco, _, _), (x0, y0, x1, y1) in groups.items():
            if deco == "strike":
                ym = y0 + (y1 - y0) * rng.uniform(0.45, 0.6)
                self.stroke([(x0 - 6, ym + rng.normal(0, 3)), (x1 + 6, ym + rng.normal(-4, 3))])
                if rng.random() < 0.5:
                    self.stroke([(x0 - 2, ym + 7), (x1 + 3, ym + 3)], width=2)
            elif deco == "scribble":
                # tight overlapping loops, the way a pen gets dragged over a mistake
                for sweep in range(2):
                    pts, x = [], x0 - 6
                    while x < x1 + 6:
                        pts.append((x, y0 + 4 + rng.normal(0, 4)))
                        x += rng.uniform(4, 8)
                        pts.append((x, y1 - 2 + rng.normal(0, 4)))
                        x += rng.uniform(4, 8)
                    if sweep:
                        pts = [(px + rng.normal(0, 2), py) for px, py in reversed(pts)]
                    pen(self.draw, pts, 238, 4)
            elif deco == "under":
                yb = self.line_y + rng.normal(10, 2)
                self.stroke([(x0 - 4, yb), ((x0 + x1) / 2, yb + rng.normal(1, 2)), (x1 + 6, yb + rng.normal(-1, 2))],
                            width=3, sd=0.6)
        self.boxes = []

    # content
    def margin_label(self, text):
        w = run_width(text, "kalam", 400, HAND)
        x = MARGIN - w - 34 + self.rng.normal(0, 4)
        adv, _ = self.put_word(text, x, self.baseline(x))

    def paragraph(self, text, label=None):
        rng = self.rng
        indent = (len(text) - len(text.lstrip(" "))) * HAND * 0.28
        tokens = []
        gid = 0
        for m in re.finditer(r"~([^~]+)~|#([^#]+)#|\{([^}]+)\}|_([^_]+)_|(\S+)", text):
            gid += 1
            for kind, idx in (("strike", 1), ("scribble", 2), ("insert", 3), ("under", 4), (None, 5)):
                if m.group(idx):
                    if kind == "insert":
                        tokens.append(("insert", m.group(idx), gid))
                    else:
                        for wd in m.group(idx).split():
                            tokens.append((kind, wd, gid))
        if label:
            self.margin_label(label)
        self.x += indent
        for kind, wd, gid in tokens:
            space = HAND * 0.36 * rng.uniform(0.8, 1.35)
            if kind == "insert":
                self.insert(wd, self.x - space * 0.5)
                continue
            w = run_width(wd, "kalam", 400, HAND)
            if self.x + w > W - 80 and self.x > MARGIN + 60 + indent:
                self.next_line()
            adv, bb = self.put_word(wd, self.x, self.baseline(self.x))
            if kind:
                self.boxes.append((kind, gid, self.line_id, *bb))
            self.x += adv + space
        self.next_line()

    def insert(self, text, cx):
        rng = self.rng
        by = self.line_y + rng.normal(0, 2)
        self.stroke([(cx - 11, by + 12), (cx, by - 6), (cx + 10, by + 12)], width=3, sd=0.5)
        size = int(HAND * 0.8)
        words = text.split()
        widths = [run_width(w, "kalam", 400, size) for w in words]
        total = sum(widths) + size * 0.35 * (len(words) - 1)
        x = cx - total / 2 + rng.normal(0, 4)
        y = self.line_y - LS * 0.62
        for wd, w in zip(words, widths):
            self.put_word(wd, x, y + rng.normal(0, 1.5) - (x - cx) * 0.01, size)
            x += w + size * 0.35

    def separator(self):
        y = self.line_y - LS * 0.45
        x0 = MARGIN + 30 + self.rng.normal(0, 6)
        x1 = W - 90 + self.rng.normal(0, 10)
        self.stroke([(x0, y), ((x0 + x1) / 2, y + self.rng.normal(0, 3)), (x1, y + self.rng.normal(-3, 3))],
                    width=3, sd=0.5)
        self.next_line()

    def blot(self):
        rng = self.rng
        x, y = rng.uniform(MARGIN + 40, W - 120), self.line_y - LS * rng.uniform(0.2, 0.6)
        r = rng.uniform(2.5, 4.5)
        self.draw.ellipse((x - r, y - r * 0.8, x + r, y + r * 0.8), fill=245)

    def write(self, paragraphs):
        label = None
        for p in paragraphs:
            if p.startswith("@"):
                label = p[1:]
            elif p == "---":
                self.separator()
            elif p == "":
                self.next_line()
            else:
                self.paragraph(p, label)
                label = None
                if self.rng.random() < 0.06:
                    self.blot()
        self.flush_decos()


def signature(draw, x, y, rng, fill):
    """Invigilator's initials: a loopy squiggle."""
    pts, t = [], 0.0
    for i in range(70):
        t += 0.32
        pts.append((x + i * 2.8 + 14 * math.sin(t * 1.7), y - 18 * math.sin(t) * (1 - i / 90)))
    pen(draw, pts, fill, 3)
    draw.line([(x - 6, y + 14), (x + 190, y + 8)], fill=fill, width=2)


def answer_sheet(rng):
    sheet_top = 640
    sheet = Sheet(rng, first_top=sheet_top)
    sheet.write(STUDENT_ANSWERS)
    pages = []
    for i, p in enumerate(sheet.pages):
        img = paper(rng, top=p["top"])
        d = ImageDraw.Draw(img)
        if i == 0:
            d.rectangle((70, 60, W - 70, sheet_top - 110), fill=(250, 249, 242), outline=(60, 60, 70), width=3)
            title = "उत्तरपत्रिका"
            tw = run_width(title, "sura", 700, 54)
            draw_runs(d, (W - tw) / 2, 140, title, "sura", 700, 54, (40, 40, 50))
            fields = [("नाम", 300, 110, 1000), ("कक्षा", 1120, 1220, W - 110), ("अनुक्रमांक", 300, 290, 700),
                      ("विषय", 760, 860, 1100), ("दिनांक", 1150, 1260, W - 110)]
            ys = [250, 250, 345, 345, 345]
            for (name, _, fx, fx1), y in zip(fields, ys):
                lx = {"नाम": 110, "अनुक्रमांक": 110}.get(name, fx - run_width(name + " :", "sura", 400, 34) - 14)
                draw_runs(d, lx, y, name + " :", "sura", 400, 34, (40, 40, 50))
                x = fx if name not in ("नाम", "अनुक्रमांक") else lx + run_width(name + " :", "sura", 400, 34) + 16
                for dx in range(int(x), int(fx1), 12):
                    d.line([(dx, y + 8), (dx + 5, y + 8)], fill=(90, 90, 100), width=2)
            sup = "पर्यवेक्षक के हस्ताक्षर :"
            draw_runs(d, 110, 445, sup, "sura", 400, 34, (40, 40, 50))
            d.rectangle((470, 400, 820, 470), outline=(90, 90, 100), width=2)
            draw_runs(d, 900, 445, "प्राप्तांक :", "sura", 400, 34, (40, 40, 50))
            d.rectangle((1090, 400, 1300, 470), outline=(90, 90, 100), width=2)
            draw_runs(d, 1320, 445, "/ ४०", "sura", 400, 34, (40, 40, 50))
            # student fills the header in their own hand
            hdr = Sheet.__new__(Sheet)
            hdr.rng, hdr.hand, hdr.ink = rng, sheet.hand, p["ink"]
            hdr.draw = ImageDraw.Draw(hdr.ink)
            spots = {"नाम": (330, 240), "कक्षा": (1240, 240), "अनुक्रमांक": (330, 336),
                     "विषय": (880, 336), "दिनांक": (1275, 336)}
            for k, v in STUDENT_HEADER.items():
                x, y = spots[k]
                for wd in v.split():
                    adv, _ = hdr.put_word(wd, x, y + rng.normal(0, 2))
                    x += adv + HAND * 0.35
            sig = ImageDraw.Draw(p["ink"])
            signature(sig, 520, 445, rng, 215)
        footer = f"पृष्ठ क्र. {to_deva(i + 1)}"
        fw = run_width(footer, "sura", 400, 28)
        draw_runs(d, (W - fw) / 2, H - 50, footer, "sura", 400, 28, (110, 110, 120))
        ink = p["ink"].filter(ImageFilter.GaussianBlur(0.55))
        color = Image.new("RGB", (W, H), INK)
        img = Image.composite(color, img, ink)
        pages.append(finish_scan(img, rng))
    return pages


# ---------------------------------------------------------------- printed docs


def to_deva(n):
    return str(n).translate(str.maketrans("0123456789", "०१२३४५६७८९"))


def wrap(text, width, weight, size):
    words, lines, cur = text.split(" "), [], ""
    for wd in words:
        trial = (cur + " " + wd).strip() if wd else cur + " "
        if cur and run_width(trial, "sura", weight, size) > width:
            lines.append(cur)
            cur = wd
        else:
            cur = trial
    lines.append(cur)
    return lines


def printed(lines, title_footer):
    size, big = 33, 37
    lh = int(size * 1.62)
    left, right = 120, W - 120
    pages, img, d, y = [], None, None, 0

    def new_page():
        nonlocal img, d, y
        img = Image.new("RGB", (W, H), (255, 255, 255))
        d = ImageDraw.Draw(img)
        d.rectangle((70, 70, W - 70, H - 90), outline=(30, 30, 30), width=2)
        pages.append(img)
        y = 150

    new_page()
    for raw in lines:
        if raw == "":
            y += lh // 2
            continue
        if raw == "---":
            d.line([(left, y - lh // 3), (right, y - lh // 3)], fill=(30, 30, 30), width=2)
            y += lh // 3
            continue
        weight, indent, centred, sz = 400, 0, False, size
        text = raw
        if text.startswith("# "):
            weight, centred, sz, text = 700, True, big, text[2:]
        elif text.startswith("## "):
            weight, text = 700, text[3:]
        elif text.startswith(">> "):
            indent, text = 110, text[3:]
        elif text.startswith("> "):
            indent, text = 55, text[2:]
        marks = None
        if " || " in text:
            text, marks = text.split(" || ")
        mw = run_width(marks, "sura", 700, sz) + 30 if marks else 0
        for i, ln in enumerate(wrap(text, right - left - indent - mw, weight, sz)):
            if y > H - 160:
                new_page()
            if centred:
                x = (W - run_width(ln, "sura", weight, sz)) / 2
            else:
                x = left + indent
            draw_runs(d, x, y, ln, "sura", weight, sz, (20, 20, 20))
            if marks and i == 0:
                draw_runs(d, right - run_width(marks, "sura", 700, sz), y, marks, "sura", 700, sz, (20, 20, 20))
            y += int(lh * sz / size)
    for i, pg in enumerate(pages):
        dd = ImageDraw.Draw(pg)
        f = f"{title_footer}  |  पृष्ठ {to_deva(i + 1)} / {to_deva(len(pages))}"
        draw_runs(dd, (W - run_width(f, "sura", 400, 26)) / 2, H - 45, f, "sura", 400, 26, (90, 90, 90))
    return pages


def photocopy(img, rng):
    a = np.asarray(img).astype(np.float32)
    a = a * 0.97 + rng.normal(0, 3.0, a.shape)
    a[..., 2] -= 4  # faint warm tint of cheap paper
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    return out.rotate(rng.uniform(-0.25, 0.25), resample=Image.BICUBIC, fillcolor=(245, 244, 238))


# ---------------------------------------------------------------- main


def save(pages, out, stem, jpg=True):
    if jpg:
        for i, p in enumerate(pages, 1):
            p.save(os.path.join(out, f"{stem}-page-{i}.jpg"), quality=88)
    pages[0].save(os.path.join(out, f"{stem}.pdf"), save_all=True, append_images=pages[1:], resolution=200)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--out", default=os.path.join(HERE, "..", "..", "samples", "hindi-class7-ssc"))
    args = ap.parse_args()
    if not features.check("raqm"):
        raise SystemExit("Pillow needs libraqm for Devanagari shaping")
    check_coverage(QUESTION_PAPER + ANSWER_KEY + ["पृष्ठ क्र. उत्तरपत्रिका पर्यवेक्षक के हस्ताक्षर प्राप्तांक / ०१२३४५६७८९"],
                   "sura", (400, 700))
    check_coverage([re.sub(r"[~#{}_@]", "", s) for s in STUDENT_ANSWERS] + list(STUDENT_HEADER.values()), "kalam", (400,))
    out = os.path.abspath(args.out)
    os.makedirs(out, exist_ok=True)
    rng = np.random.default_rng(args.seed)

    save([photocopy(p, rng) for p in printed(QUESTION_PAPER, "हिंदी - कक्षा सातवीं - प्रथम सत्र परीक्षा")],
         out, "question-paper")
    save(answer_sheet(rng), out, "answer-sheet")
    save(printed(ANSWER_KEY, "उत्तर-सूची - हिंदी - कक्षा सातवीं"), out, "answer-key", jpg=False)
    print("written to", out)


if __name__ == "__main__":
    main()
