# Skrypt OCR uruchamiany na OMENie (--klasa gpu-tlo, GTX 1050 4 GB).
# Odczytuje wszystkie 29 plików PDF w dane/zbior/{testowy,uczacy} (preferując obrazkowy skan.pdf,
# z fallbackiem na zgloszenie.pdf) i zapisuje wynik w ocr.txt w folderze każdej sprawy
# oraz raport zbiorczy w ocena/raport_ocr.json.

import json
import os
import re
import shutil
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
ZBIOR = ROOT / "dane" / "zbior"
RAPORT_PATH = ROOT / "ocena" / "raport_ocr.json"


def gpu_info() -> dict:
    if not shutil.which("nvidia-smi"):
        return {"gpu": None, "vram_total_mib": None, "vram_free_mib": None}
    try:
        out = subprocess.check_output(
            ["nvidia-smi", "--query-gpu=name,memory.total,memory.free", "--format=csv,noheader,nounits"],
            text=True,
            timeout=10,
        ).strip()
        if out:
            parts = [p.strip() for p in out.splitlines()[0].split(",")]
            return {
                "gpu": parts[0] if len(parts) > 0 else None,
                "vram_total_mib": int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else None,
                "vram_free_mib": int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else None,
            }
    except Exception:
        pass
    return {"gpu": None, "vram_total_mib": None, "vram_free_mib": None}


def pdf_to_image(pdf_path: Path, dpi: int = 200) -> Image.Image:
    try:
        import pymupdf as fitz
    except ImportError:
        import fitz  # PyMuPDF

    doc = fitz.open(str(pdf_path))
    try:
        pix = doc[0].get_pixmap(dpi=dpi)
        mode = "RGBA" if pix.alpha else "RGB"
        img = Image.frombytes(mode, [pix.width, pix.height], pix.samples)
        if mode == "RGBA":
            img = img.convert("RGB")
        return img
    finally:
        doc.close()


def deskew_image(img: Image.Image) -> tuple[Image.Image, float]:
    """Proste i szybkie prostowanie przekrzywienia skanu (±3°) przez wariancję projekcji poziomej."""
    gray = ImageOps.grayscale(img)
    # Miniatura do szybkiego wyznaczenia kąta
    small = gray.resize((420, int(420 * gray.height / gray.width)), Image.BILINEAR)
    # Binarna maska ciemnych pikseli (tekst)
    best_angle = 0.0
    best_score = -1.0

    # Najpierw zgrubnie co 0.5°, potem dokładnie co 0.2°
    def score_angle(angle: float) -> float:
        rot = small.rotate(angle, resample=Image.BILINEAR, expand=False, fillcolor=255)
        w, h = rot.size
        data = rot.tobytes()
        # Liczymy ciemne piksele (<180) w każdym wierszu; większa wariancja = bardziej poziome linie tekstu
        row_counts = []
        step = 2
        for y in range(20, h - 20, step):
            row = data[y * w : (y + 1) * w]
            c = sum(1 for px in row if px < 180)
            row_counts.append(c)
        if not row_counts:
            return 0.0
        mean = sum(row_counts) / len(row_counts)
        return sum((c - mean) ** 2 for c in row_counts)

    for step_idx in range(-6, 7):
        ang = step_idx * 0.5
        sc = score_angle(ang)
        if sc > best_score:
            best_score = sc
            best_angle = ang

    center = best_angle
    for delta in (-0.4, -0.2, 0.2, 0.4):
        ang = round(center + delta, 2)
        sc = score_angle(ang)
        if sc > best_score:
            best_score = sc
            best_angle = ang

    if abs(best_angle) >= 0.2:
        img = img.rotate(best_angle, resample=Image.BICUBIC, expand=False, fillcolor=(255, 255, 255))
    return img, best_angle


def run_tesseract(img: Image.Image, tmp_png: Path) -> str:
    gray = ImageOps.autocontrast(ImageOps.grayscale(img), cutoff=1)
    gray.save(tmp_png, "PNG")
    try:
        res = subprocess.run(
            ["tesseract", str(tmp_png), "stdout", "-l", "pol", "--psm", "6"],
            capture_output=True,
            text=True,
            check=True,
        )
        return res.stdout
    finally:
        if tmp_png.exists():
            tmp_png.unlink()


def bez_polskich(t: str) -> str:
    mapa = str.maketrans("ąćęłńóśźżĄĆĘŁŃÓŚŹŻ", "acelnoszzACELNOSZZ")
    return t.translate(mapa).lower()


def token_f1(pred: str, ref: str) -> float:
    p = set(w for w in re.sub(r"[^a-z0-9]+", " ", bez_polskich(pred)).split() if len(w) >= 3)
    r = set(w for w in re.sub(r"[^a-z0-9]+", " ", bez_polskich(ref)).split() if len(w) >= 3)
    if not p and not r:
        return 1.0
    if not p or not r:
        return 0.0
    common = len(p & r)
    prec = common / len(p)
    rec = common / len(r)
    return (2 * prec * rec / (prec + rec)) if (prec + rec) else 0.0


def process_case(split: str, case_dir: Path, engine: str, reader=None) -> dict:
    t0 = time.time()
    skan_pdf = case_dir / "skan.pdf"
    zgl_pdf = case_dir / "zgloszenie.pdf"
    src_pdf = skan_pdf if skan_pdf.exists() else zgl_pdf
    img = pdf_to_image(src_pdf, dpi=200)
    img, deskew_deg = deskew_image(img)
    tmp_png = case_dir / f"_tmp_ocr_{os.getpid()}_{case_dir.name}.png"
    text = run_tesseract(img, tmp_png)
    (case_dir / "ocr.txt").write_text(text, encoding="utf-8")

    ref_path = case_dir / "zgloszenie.txt"
    f1 = token_f1(text, ref_path.read_text(encoding="utf-8")) if ref_path.exists() else None
    return {
        "id": case_dir.name,
        "zbior": split,
        "zrodlo_pdf": src_pdf.name,
        "deskew_deg": deskew_deg,
        "znaki": len(text),
        "token_f1": round(f1, 4) if f1 is not None else None,
        "czas_s": round(time.time() - t0, 2),
    }


def main():
    t0 = time.time()
    gpu = gpu_info()

    if not shutil.which("tesseract"):
        raise RuntimeError("Brak tesseract na OMENie.")
    langs = subprocess.run(["tesseract", "--list-langs"], capture_output=True, text=True).stdout
    if "pol" not in langs.split():
        raise RuntimeError("Brak języka 'pol' w tesseract.")
    engine = "tesseract-5-pol+deskew"

    targets = []
    for split in ("testowy", "uczacy"):
        split_dir = ZBIOR / split
        if not split_dir.exists():
            continue
        for p in sorted(split_dir.iterdir()):
            if p.is_dir() and ((p / "skan.pdf").exists() or (p / "zgloszenie.pdf").exists()):
                targets.append((split, p))

    workers = min(4, os.cpu_count() or 2)
    wyniki = []
    with ThreadPoolExecutor(max_workers=workers) as ex:
        futs = [ex.submit(process_case, split, p, engine) for split, p in targets]
        for fut in as_completed(futs):
            wyniki.append(fut.result())

    wyniki.sort(key=lambda x: (x["zbior"], x["id"]))
    dt = round(time.time() - t0, 2)
    f1_all = [w["token_f1"] for w in wyniki if w["token_f1"] is not None]
    f1_test = [w["token_f1"] for w in wyniki if w["zbior"] == "testowy" and w["token_f1"] is not None]

    raport = {
        "engine": engine,
        "gpu": gpu,
        "liczba_pdf": len(wyniki),
        "testowy": sum(1 for w in wyniki if w["zbior"] == "testowy"),
        "uczacy": sum(1 for w in wyniki if w["zbior"] == "uczacy"),
        "czas_calkowity_s": dt,
        "sredni_token_f1": round(sum(f1_all) / len(f1_all), 4) if f1_all else None,
        "sredni_token_f1_testowy": round(sum(f1_test) / len(f1_test), 4) if f1_test else None,
        "min_token_f1": round(min(f1_all), 4) if f1_all else None,
        "sprawy": wyniki,
    }
    RAPORT_PATH.write_text(json.dumps(raport, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(
        f"OCR_OK: engine={engine} gpu={gpu['gpu']} files={len(wyniki)} "
        f"(testowy={raport['testowy']}, uczacy={raport['uczacy']}) "
        f"token_f1_avg={raport['sredni_token_f1']} min={raport['min_token_f1']} time={dt}s"
    )


if __name__ == "__main__":
    main()
