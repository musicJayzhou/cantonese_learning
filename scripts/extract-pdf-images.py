# -*- coding: utf-8 -*-
"""
Extract raw embedded images (no overlaid text) from fruit & vegetable PDFs.
Filters out near-solid backgrounds (white/table fills) via pixel variance.
Output: img/lesson02/fruit/pXX_N.webp, img/lesson03/vegetable/pXX_N.webp
"""
import pymupdf, pathlib
from PIL import Image, ImageStat
import io, shutil

ROOT = pathlib.Path(r"D:\Workspace\Cantonese")
BASE = ROOT / "raw-materials/20260816"
JOBS = [
    ("fruit",     BASE / "第02堂-20260815T200728Z-1-001/第02堂/Fruits/fruit_email.pdf",
     ROOT / "img/lesson02/fruit", list(range(2, 52))),
    ("vegetable", BASE / "第03堂-20260815T200729Z-1-001/第03堂/蔬菜/Vegetable_Lesson_email.pdf",
     ROOT / "img/lesson03/vegetable", list(range(2, 82))),
]
BIG_AREA = 8000   # displayed pt^2
RAW_MIN = 120     # raw px side minimum (skip icons/decor)

def is_photo(img):
    """Reject near-uniform images (backgrounds/fills) and tiny decor."""
    w, h = img.size
    if w < RAW_MIN or h < RAW_MIN:
        return False
    small = img.resize((32, 32)).convert("L")
    st = ImageStat.Stat(small)
    return st.stddev[0] > 12  # photos have texture; fills are flat

for name, path, outdir, pages in JOBS:
    if outdir.exists():
        shutil.rmtree(outdir)
    outdir.mkdir(parents=True)
    doc = pymupdf.open(path)
    n_saved, skipped_pages = 0, []
    for pno in pages:
        page = doc[pno - 1]
        infos = page.get_image_info(xrefs=True)
        big = [i for i in infos if (i["bbox"][2]-i["bbox"][0])*(i["bbox"][3]-i["bbox"][1]) > BIG_AREA and i.get("xref")]
        # dedupe same xref per page, keep first occurrence position
        seen, cands = set(), []
        for i in sorted(big, key=lambda i: (round(i["bbox"][1] / 60), i["bbox"][0])):
            if i["xref"] in seen: continue
            seen.add(i["xref"])
            cands.append(i)
        saved = 0
        for i in cands:
            try:
                raw = doc.extract_image(i["xref"])
                img = Image.open(io.BytesIO(raw["image"])).convert("RGB")
            except Exception:
                continue
            if not is_photo(img):
                continue
            if max(img.size) > 400:
                img.thumbnail((400, 400), Image.LANCZOS)
            saved += 1
            img.save(outdir / f"p{pno:02d}_{saved}.webp", "WEBP", quality=80)
            n_saved += 1
        if saved == 0:
            skipped_pages.append(pno)
    doc.close()
    print(f"{name}: {n_saved} photos saved; pages without photo: {skipped_pages}")
