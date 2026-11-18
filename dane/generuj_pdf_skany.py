# Generator PDF i skanów (obraz + szum + przekrzywienie) dla sztucznego zbioru ZANT.
# Uruchamiany na OMENie (Python + Pillow + ReportLab / PyMuPDF).
# Dla >= 50% spraw generuje zgloszenie.pdf, a dla części skan.png + skan.pdf (symulacja skanu).

import os
import sys
import glob
import math
import random
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
ZBIOR = ROOT / "dane" / "zbior"

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
]
FONT_ITALIC_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf",
]


def pick_font(candidates, size):
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def render_page_image(text: str, rng: random.Random, scan_mode: bool) -> Image.Image:
    width, height = 1240, 1754  # A4 @ 150 DPI
    bg = (248, 246, 240) if scan_mode else (255, 255, 255)
    img = Image.new("RGB", (width, height), bg)
    draw = ImageDraw.Draw(img)

    font_title = pick_font(FONT_CANDIDATES, 28)
    font_body = pick_font(FONT_CANDIDATES, 21)
    font_hand = pick_font(FONT_ITALIC_CANDIDATES, 22)

    y = 70
    margin_x = 80
    in_wyjasnienia = False

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            y += 18
            continue
        if line.startswith("ZAWIADOMIENIE O WYPADKU"):
            draw.text((margin_x, y), line, fill=(15, 20, 30), font=font_title)
            y += 42
            draw.line((margin_x, y, width - margin_x, y), fill=(60, 60, 60), width=2)
            y += 18
            continue
        if line == "WYJAŚNIENIA POSZKODOWANEGO":
            in_wyjasnienia = True
            y += 12
            draw.text((margin_x, y), line, fill=(15, 20, 30), font=font_title)
            y += 38
            continue

        font = font_hand if (scan_mode and in_wyjasnienia) else font_body
        color = (25, 35, 80) if (scan_mode and in_wyjasnienia) else (20, 20, 20)
        for wrapped in textwrap.wrap(line, width=82) or [""]:
            if y > height - 80:
                break
            draw.text((margin_x, y), wrapped, fill=color, font=font)
            y += 30

    if scan_mode:
        # Przekrzywienie skanu (±1.2° .. ±2.8°)
        angle = rng.choice([-1, 1]) * rng.uniform(1.2, 2.8)
        img = img.rotate(angle, resample=Image.BICUBIC, expand=False, fillcolor=(238, 236, 230))
        # Lekkie rozmycie i szum skanera
        img = img.filter(ImageFilter.GaussianBlur(radius=0.55))
        px = img.load()
        for _ in range(int(width * height * 0.012)):
            x = rng.randrange(width)
            yy = rng.randrange(height)
            delta = rng.randint(-35, 25)
            r, g, b = px[x, yy]
            px[x, yy] = (
                max(0, min(255, r + delta)),
                max(0, min(255, g + delta)),
                max(0, min(255, b + delta)),
            )

    return img


def main():
    rng = random.Random(13)
    test_dirs = sorted(p for p in (ZBIOR / "testowy").iterdir() if p.is_dir())
    train_dirs = sorted(p for p in (ZBIOR / "uczacy").iterdir() if p.is_dir())

    # Wszystkie 12 testowych + 14 uczących = 26/44 (>50%) dostaje PDF;
    # z tego 6 testowych + 6 uczących = 12 spraw ma symulację skanu (szum, przekrzywienie, pismo pochyłe).
    selected = [(d, True) for d in test_dirs] + [(d, False) for d in train_dirs[:14]]
    pdf_count = 0
    scan_count = 0

    for idx, (case_dir, is_test) in enumerate(selected):
        txt_path = case_dir / "zgloszenie.txt"
        if not txt_path.exists():
            continue
        text = txt_path.read_text(encoding="utf-8")

        # Czysty PDF (obraz A4 zapisany jako PDF) — zawsze
        clean_img = render_page_image(text, rng, scan_mode=False)
        clean_img.save(case_dir / "zgloszenie.pdf", "PDF", resolution=150.0)
        pdf_count += 1

        # Dla połowy wybranych spraw także wersja skanu (PNG + PDF ze skanu)
        make_scan = (idx % 2 == 0) if is_test else (idx < 12 + 6)
        if make_scan:
            scan_img = render_page_image(text, rng, scan_mode=True)
            scan_img.save(case_dir / "skan.png", "PNG")
            scan_img.save(case_dir / "skan.pdf", "PDF", resolution=150.0)
            scan_count += 1

    print(f"PDF_SKANY_OK: pdf={pdf_count} skany={scan_count}")


if __name__ == "__main__":
    main()
