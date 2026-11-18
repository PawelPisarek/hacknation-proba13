# Skrypt OCR uruchamiany na OMENie (--klasa gpu-tlo, GTX 1050 4 GB).
# Odczytuje skan.png (dla spraw ze skanem) lub zgloszenie.pdf dla zbioru testowego
# i zapisuje tekst do ocr.txt, który ocenia ocena/ocen.mjs --zrodlo ocr.

import os
import sys
import time
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEST_DIR = ROOT / "dane" / "zbior" / "testowy"


def pdf_to_png(pdf_path: Path, out_png: Path) -> Path:
    if shutil.which("pdftoppm"):
        prefix = str(out_png.with_suffix(""))
        subprocess.run(
            ["pdftoppm", "-png", "-r", "150", "-singlefile", str(pdf_path), prefix],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return out_png
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(str(pdf_path))
        pix = doc[0].get_pixmap(dpi=150)
        pix.save(str(out_png))
        return out_png
    except Exception:
        pass
    try:
        from PIL import Image
        # Jeśli PDF to osadzony obraz lub brak pdftoppm — próbujemy pypdfium2
        import pypdfium2 as pdfium
        pdf = pdfium.PdfDocument(str(pdf_path))
        pil = pdf[0].render(scale=150 / 72).to_pil()
        pil.save(str(out_png))
        return out_png
    except Exception as e:
        raise RuntimeError(f"Nie można zrasteryzować PDF {pdf_path}: {e}")


def run_tesseract(img_path: Path) -> str:
    res = subprocess.run(
        ["tesseract", str(img_path), "stdout", "-l", "pol", "--psm", "6"],
        capture_output=True,
        text=True,
        check=True,
    )
    return res.stdout


def build_easyocr():
    import torch
    import easyocr
    use_gpu = torch.cuda.is_available()
    reader = easyocr.Reader(["pl"], gpu=use_gpu, verbose=False)
    return reader, use_gpu


def run_easyocr(reader, img_path: Path) -> str:
    # paragraph=False + grupowanie po osi Y dla zachowania linii formularza EWYP
    items = reader.readtext(str(img_path), detail=1, paragraph=False)
    if not items:
        return ""
    # Sortuj po środku Y, potem X; łącz elementy w tej samej linii (tolerancja 16 px)
    enriched = []
    for bbox, text, conf in items:
        ys = [pt[1] for pt in bbox]
        xs = [pt[0] for pt in bbox]
        enriched.append((sum(ys) / 4.0, min(xs), text))
    enriched.sort(key=lambda t: (t[0], t[1]))
    lines = []
    cur = []
    cur_y = None
    for y, x, txt in enriched:
        if cur_y is None or abs(y - cur_y) <= 18:
            cur.append((x, txt))
            cur_y = y if cur_y is None else (cur_y * 0.7 + y * 0.3)
        else:
            cur.sort(key=lambda t: t[0])
            lines.append(" ".join(t[1] for t in cur))
            cur = [(x, txt)]
            cur_y = y
    if cur:
        cur.sort(key=lambda t: t[0])
        lines.append(" ".join(t[1] for t in cur))
    return "\n".join(lines) + "\n"


def main():
    t0 = time.time()
    preferred = sys.argv[1] if len(sys.argv) > 1 else "auto"

    engine = None
    reader = None
    if preferred in ("auto", "tesseract") and shutil.which("tesseract"):
        langs = subprocess.run(["tesseract", "--list-langs"], capture_output=True, text=True).stdout
        if "pol" in langs.split():
            engine = "tesseract-pol"

    if engine is None and preferred in ("auto", "easyocr"):
        try:
            reader, use_gpu = build_easyocr()
            engine = f"easyocr-{'gpu' if use_gpu else 'cpu'}"
        except Exception as e:
            if preferred == "easyocr":
                raise
            print(f"easyocr niedostępny: {e}", file=sys.stderr)

    if engine is None:
        raise RuntimeError("Brak dostępnego silnika OCR (ani tesseract-pol, ani easyocr).")

    case_dirs = sorted(p for p in TEST_DIR.iterdir() if p.is_dir())
    done = 0
    scans = 0
    for d in case_dirs:
        scan_png = d / "skan.png"
        pdf_file = d / "zgloszenie.pdf"
        tmp_png = d / "_tmp_page.png"
        if scan_png.exists():
            src = scan_png
            scans += 1
        elif pdf_file.exists():
            src = pdf_to_png(pdf_file, tmp_png)
        else:
            continue

        if engine.startswith("tesseract"):
            text = run_tesseract(src)
        else:
            text = run_easyocr(reader, src)

        (d / "ocr.txt").write_text(text, encoding="utf-8")
        if tmp_png.exists():
            tmp_png.unlink()
        done += 1

    dt = time.time() - t0
    print(f"OCR_OK: engine={engine} files={done} scans={scans} time={dt:.1f}s")


if __name__ == "__main__":
    main()
