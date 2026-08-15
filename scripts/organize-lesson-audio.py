# -*- coding: utf-8 -*-
"""
Copy lesson02/lesson03 audio from raw-materials into audio/ with web-safe names.
Naming rule: leading index + optional variant letter, e.g.
  "02_a_pìhng-gwó.mp3" -> "02a.mp3" ; "35_leuht- jí.mp3" -> "35.mp3"
  "01A_a_Yāt go ..."   -> "01A_a.m4a"
"""
import pathlib, re, shutil

ROOT = pathlib.Path(r"D:\Workspace\Cantonese")
L2 = ROOT / "raw-materials/20260816/第02堂-20260815T200728Z-1-001/第02堂"
L3 = ROOT / "raw-materials/20260816/第03堂-20260815T200729Z-1-001/第03堂"

JOBS = [
    # (src_dir, dst_dir, mode)
    (L2 / "Fruits/fruit_Sound/fruits sound",            ROOT / "audio/lesson02/fruit/items",  "idx"),
    (L2 / "Fruits/fruit_Sound/Vocabulary",              ROOT / "audio/lesson02/salad/vocab",  "idx"),
    (L2 / "Fruits/fruit_Sound/dialog",                  ROOT / "audio/lesson02/salad/dialog", "dialog"),
    (L2 / "急口令- 02",                                  ROOT / "audio/lesson02/tongue/words", "idx"),
    (L3 / "蔬菜/Vegetable_sound_individual",            ROOT / "audio/lesson03/vegetable/items", "idx"),
    (L3 / "急口令3",                                    ROOT / "audio/lesson03/tongue/words", "idx"),
]
SINGLES = [
    (L2 / "Fruits/fruits_sound_all in one.mp3",   ROOT / "audio/lesson02/fruit/all_in_one.mp3"),
    (L2 / "急口令- 02/急口令_02_慢.mp3",            ROOT / "audio/lesson02/tongue/speeds/01_slow.mp3"),
    (L2 / "急口令- 02/急口令_02_中.mp3",            ROOT / "audio/lesson02/tongue/speeds/02_medium.mp3"),
    (L2 / "急口令- 02/急口令_02_快.mp3",            ROOT / "audio/lesson02/tongue/speeds/03_fast.mp3"),
    (L2 / "急口令- 02/急口令_02_超快.mp3",          ROOT / "audio/lesson02/tongue/speeds/04_veryfast.mp3"),
    (L3 / "蔬菜/vegetable_all in one.mp3",        ROOT / "audio/lesson03/vegetable/all_in_one.mp3"),
    (L3 / "急口令3/chī-sin jī-jyū tìuh jī-jyū-sī chī-jyuh jī syuh-jī_慢.mp3",    ROOT / "audio/lesson03/tongue/speeds/01_slow.mp3"),
    (L3 / "急口令3/chī-sin jī-jyū tìuh jī-jyū-sī chī-jyuh jī syuh-jī_正常.mp3",  ROOT / "audio/lesson03/tongue/speeds/02_normal.mp3"),
    (L3 / "急口令3/黐線蜘蛛條蜘蛛絲黐住枝樹枝 _快.mp3",                          ROOT / "audio/lesson03/tongue/speeds/03_fast.mp3"),
    (L3 / "急口令3/黐線蜘蛛條蜘蛛絲黐住枝樹枝_好快.mp3",                         ROOT / "audio/lesson03/tongue/speeds/04_veryfast.mp3"),
]

copied, skipped, problems = 0, [], []

def safe_name(fname, mode):
    stem, ext = fname.rsplit(".", 1)
    if mode == "dialog":
        m = re.match(r"^(\d+[AB])(?:_([a-z]))?[_ ]", stem)
        return (m.group(1) + (m.group(2) and "_" + m.group(2) or "") + "." + ext) if m else None
    m = re.match(r"^(\d+)_?([a-z])?[_ ]", stem)
    return (m.group(1) + (m.group(2) or "") + "." + ext) if m else None

for src_dir, dst_dir, mode in JOBS:
    dst_dir.mkdir(parents=True, exist_ok=True)
    for f in sorted(src_dir.iterdir()):
        if f.suffix.lower() not in (".mp3", ".m4a"): continue
        nn = safe_name(f.name, mode)
        if not nn:
            skipped.append(str(f)); continue
        tgt = dst_dir / nn
        if tgt.exists():
            problems.append(f"dup target {tgt} <= {f.name}"); continue
        shutil.copy2(f, tgt); copied += 1

for src, dst in SINGLES:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if not src.exists():
        problems.append(f"MISSING {src}"); continue
    shutil.copy2(src, dst); copied += 1

print(f"copied: {copied}")
for s in skipped: print("SKIPPED:", s)
for p in problems: print("PROBLEM:", p)
