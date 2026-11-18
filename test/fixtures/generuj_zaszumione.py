# Zaszumione wersje skanów (uruchamiane na OMENie): osadzony JPEG ze skan-W052/W023.pdf →
# obrót 2°, rozmycie, szum, spadek do ~110 dpi → zaszumiony-W052.pdf, zaszumiony-W023.pdf
import io, random, re
from pathlib import Path
from PIL import Image, ImageFilter
F = Path(__file__).resolve().parent
random.seed(11)
for i in ("W052", "W023"):
    raw = (F / f"skan-{i}.pdf").read_bytes()
    m = re.search(rb"stream\r?\n(\xff\xd8.*?\xff\xd9)\r?\nendstream", raw, re.S)
    im = Image.open(io.BytesIO(m.group(1))).convert("L")
    im = im.rotate(2, expand=False, fillcolor=255, resample=Image.BICUBIC)
    im = im.filter(ImageFilter.GaussianBlur(float(__import__("os").environ.get("BLUR","0.9"))))
    im = im.resize((im.width * 3 // 4, im.height * 3 // 4), Image.BILINEAR).resize(im.size, Image.BILINEAR)
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            px[x, y] = max(0, min(255, px[x, y] + random.randint(-int(__import__("os").environ.get("SZUM","40")), int(__import__("os").environ.get("SZUM","40")))))
    im.convert("RGB").save(F / f"zaszumiony-{i}.pdf", "PDF", resolution=200.0)
