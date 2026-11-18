# Generator obrazkowych skanów PDF (29 spraw z PDF w dane/zbior: 13 testowych + 16 uczących).
# Uruchamiany na OMENie (Python + Pillow).
# Dla każdej z 29 spraw mających zgloszenie.pdf tworzy skan.pdf (100% obrazek bez warstwy tekstowej):
#   - połowa spraw: tryb skanu (przekrzywienie, lekki szum i rozmycie, kursywa niebieska w wyjaśnieniach),
#   - druga połowa: czysty skan A4 200 DPI (pełne polskie znaki DejaVuSans).
# Nie nadpisuje tekstowego zgloszenie.pdf (używanego do testu lokalnego --zrodlo pdf w Node).

import os
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
    # A4 @ 200 DPI — czytelne polskie diakrytyki i JSON maszyny dla OCR
    width, height = 1654, 2339
    bg = (248, 246, 240) if scan_mode else (255, 255, 255)
    img = Image.new("RGB", (width, height), bg)
    draw = ImageDraw.Draw(img)

    font_title = pick_font(FONT_CANDIDATES, 34)
    font_body = pick_font(FONT_CANDIDATES, 26)
    font_hand = pick_font(FONT_ITALIC_CANDIDATES, 27)

    y = 90
    margin_x = 100
    in_wyjasnienia = False

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            y += 22
            continue
        if line.startswith("ZAWIADOMIENIE O WYPADKU"):
            draw.text((margin_x, y), line, fill=(15, 20, 30), font=font_title)
            y += 50
            draw.line((margin_x, y, width - margin_x, y), fill=(60, 60, 60), width=2)
            y += 22
            continue
        if line == "WYJAŚNIENIA POSZKODOWANEGO":
            in_wyjasnienia = True
            y += 16
            draw.text((margin_x, y), line, fill=(15, 20, 30), font=font_title)
            y += 46
            continue

        font = font_hand if (scan_mode and in_wyjasnienia) else font_body
        color = (25, 35, 85) if (scan_mode and in_wyjasnienia) else (15, 15, 15)
        for wrapped in textwrap.wrap(line, width=88, break_long_words=False, break_on_hyphens=False) or [""]:
            if y > height - 90:
                break
            draw.text((margin_x, y), wrapped, fill=color, font=font)
            y += 38

    if scan_mode:
        # Przekrzywienie skanu (±1.0° .. ±2.2°)
        angle = rng.choice([-1, 1]) * rng.uniform(1.0, 2.2)
        img = img.rotate(angle, resample=Image.BICUBIC, expand=False, fillcolor=(242, 240, 234))
        # Lekkie rozmycie i szum skanera
        img = img.filter(ImageFilter.GaussianBlur(radius=0.45))
        px = img.load()
        for _ in range(int(width * height * 0.008)):
            x = rng.randrange(width)
            yy = rng.randrange(height)
            delta = rng.randint(-28, 20)
            r, g, b = px[x, yy]
            px[x, yy] = (
                max(0, min(255, r + delta)),
                max(0, min(255, g + delta)),
                max(0, min(255, b + delta)),
            )

    return img


def main():
    rng = random.Random(13)
    case_dirs = []
    for split in ("testowy", "uczacy"):
        split_dir = ZBIOR / split
        if not split_dir.exists():
            continue
        for p in sorted(split_dir.iterdir()):
            if p.is_dir() and (p / "zgloszenie.pdf").exists() and (p / "zgloszenie.txt").exists():
                case_dirs.append((split, p))

    total = 0
    noisy_scans = 0
    for idx, (split, case_dir) in enumerate(case_dirs):
        text = (case_dir / "zgloszenie.txt").read_text(encoding="utf-8")
        # Co druga sprawa w każdym zbiorze dostaje zniekształcenia skanera (szum, przekrzywienie, kursywa)
        is_noisy = (idx % 2 == 0)
        img = render_page_image(text, rng, scan_mode=is_noisy)
        # Obrazkowy PDF bez warstwy tekstowej (100% raster pod OCR)
        img.save(case_dir / "skan.pdf", "PDF", resolution=200.0)
        total += 1
        if is_noisy:
            noisy_scans += 1

    print(f"SKANY_PDF_OK: total={total} znieksztalcone={noisy_scans} czyste={total - noisy_scans}")


if __name__ == "__main__":
    main()
