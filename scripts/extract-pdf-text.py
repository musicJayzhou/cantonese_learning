# -*- coding: utf-8 -*-
"""Extract text from course PDFs using PyMuPDF (proper ToUnicode handling)."""
import pymupdf, pathlib, sys

BASE = pathlib.Path(r"D:\Workspace\Cantonese\raw-materials\20260816")
OUT = pathlib.Path(r"D:\Workspace\Cantonese\.tmp-extract")
OUT.mkdir(exist_ok=True)

PDFS = {
    "fruit":    BASE / "第02堂-20260815T200728Z-1-001/第02堂/Fruits/fruit_email.pdf",
    "tongue02": BASE / "第02堂-20260815T200728Z-1-001/第02堂/急口令- 02/急口令_02_email.pdf",
    "grammar":  BASE / "第03堂-20260815T200729Z-1-001/第03堂/中級廣東話文法Lesson01_email.pdf",
    "tongue03": BASE / "第03堂-20260815T200729Z-1-001/第03堂/急口令3/急口令_03_email.pdf",
    "vegetable":BASE / "第03堂-20260815T200729Z-1-001/第03堂/蔬菜/Vegetable_Lesson_email.pdf",
}

for name, path in PDFS.items():
    doc = pymupdf.open(path)
    parts = []
    for i, page in enumerate(doc):
        parts.append(f"\n===== PAGE {i+1} =====\n")
        parts.append(page.get_text("text"))
    (OUT / f"{name}.txt").write_text("".join(parts), encoding="utf-8")
    print(f"{name}: {len(doc)} pages -> {name}.txt")
    doc.close()
