# Fixtures dla testu odczytu skanów (uruchamiane raz na OMENie): skan.pdf spraw W023 i W052 (po generuj_pdf_skany.py)
# oraz „nieczytelny.pdf” (szum, 200 dpi, bez tekstu). Wynik w test/fixtures/.
import random, shutil, subprocess, sys
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parents[2]
subprocess.check_call([sys.executable, str(ROOT / "dane" / "generuj_pdf_skany.py")])
for i in ("W023", "W052"):
    src = ROOT / "dane" / "zbior" / "testowy" / i / "skan.pdf"
    if src.exists():
        shutil.copy(src, ROOT / "test" / "fixtures" / f"skan-{i}.pdf")
random.seed(7)
im = Image.new("L", (1654, 2339))
im.putdata([random.randint(90, 170) for _ in range(1654 * 2339)])
im.convert("RGB").save(ROOT / "test" / "fixtures" / "nieczytelny.pdf", resolution=200)
