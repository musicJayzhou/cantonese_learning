# -*- coding: utf-8 -*-
"""
Organize 20260817 batch audio (lessons 04-12 + phonics) into audio/ with web-safe names.
Conventions (aligned with lesson02/03):
  vocab items: NN.mp3 / NN[a-c].m4a (N = PDF page / teacher index)
  phone dialog: 01A.mp3 (keep letter-case, like lesson02 salad 01A_a)
  fun/lesson4: vNN / svNN / cNN / dNN[a]
  tongue: words/NN.mp3, speeds/01_slow|02_normal|02_medium|03_fast|04_veryfast|01_xslow
Collisions are auto-lettered (a/b) and logged. Skipped files are logged.
"""
import pathlib, re, shutil, json

ROOT = pathlib.Path(r"D:\Workspace\Cantonese")
B = ROOT / "raw-materials/20260817"
A = ROOT / "audio"

copied, skipped, problems, mapping = 0, [], [], {}

def put(src, dst):
    global copied
    if not src.exists():
        problems.append(f"MISSING {src}"); return
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists():
        problems.append(f"DUP TARGET {dst} <= {src.name}"); return
    shutil.copy2(src, dst); copied += 1
    mapping[str(dst.relative_to(ROOT)).replace("\\","/")] = src.name

def safe(stem):
    """web-safe slug: keep ascii alnum & dash, drop the rest"""
    import unicodedata
    s = unicodedata.normalize("NFKD", stem)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    return s or "x"

def job_idx(src_dir, dst_dir, pat, fmt):
    """Generic numbered job. pat must capture groups for fmt.format(*groups)."""
    if not src_dir.exists():
        problems.append(f"MISSING DIR {src_dir}"); return
    seen = {}
    for f in sorted(src_dir.iterdir(), key=lambda x: x.name):
        if f.suffix.lower() not in (".mp3", ".m4a"): continue
        m = pat.match(f.name)
        if not m:
            skipped.append(f"{src_dir.name}/{f.name}"); continue
        nn = fmt(*m.groups()) + f.suffix.lower()
        if nn in seen:  # collision -> letter the pair
            prev = seen.pop(nn)
            stem, ext = nn.rsplit(".", 1)
            if prev:
                put(prev[0], dst_dir / f"{stem}a.{ext}"); mapping[str((dst_dir / f'{stem}a.{ext}').relative_to(ROOT)).replace("\\","/")] = prev[0].name
            seen[(stem+"b."+ext)] = None
            put(f, dst_dir / f"{stem}b.{ext}")
            problems.append(f"COLLISION lettered: {nn} in {src_dir.name}")
            continue
        seen[nn] = (f,)
        put(f, dst_dir / nn)

N = r"(\d+)"
IDX  = re.compile(r"^(\d+)_?([a-zA-Z])?[_ ]")
PAT_P = re.compile(r"^(?:P(\d+)(?:&\d+)?_?([A-Z])?[_ ]?)+", re.I)
VD   = re.compile(r"^(\d+[AB])(?:_([a-z]))?[_ ]")          # phone sentences
MVD  = re.compile(r"^(\d+)_([AQ])(\d+)([A-D])?[_ ]")       # movie dialogs
GD   = re.compile(r"^(\d+)_?([A-Z])[_ ]")                  # cooking/games dialogs 56_A / 53A
V    = re.compile(r"^V(\d+)_([a-z])?[_ ]", re.I)
SV   = re.compile(r"^SV(\d+)_?([A-Z])?[_ ]", re.I)
CD   = re.compile(r"^C(\d+)[_ ]", re.I)
DD   = re.compile(r"^D(\d+)([A-Z])?[_ ]", re.I)
CLS  = re.compile(r"^P(\d+)_?([A-Z])?_[Cc]lassifier", re.I)

def lower(*gs):
    out = []
    for g in gs:
        out.append(g.lower() if g else "")
    return out

# ---------------- lesson 04 ----------------
job_idx(B/"第04堂/肉/meat_sounds", A/"lesson04/meat/items",
        PAT_P, lambda n, l="": lower(n, l)[0] + lower(n, l)[1])
job_idx(B/"第04堂/肉/meat_sounds/Classifier", A/"lesson04/meat/classifier",
        CLS, lambda n, l=None: lower(n, l or "")[0] + lower(n, l or "")[1])
job_idx(B/"第04堂/第二課 - 打電話/Vocabulary", A/"lesson04/phone/vocab",
        re.compile(r"^V(\d+)_?([a-z])?[_ ]", re.I), lambda n, l=None: "v" + lower(n, l or "")[0] + lower(n, l or "")[1])
job_idx(B/"第04堂/第二課 - 打電話/Setences", A/"lesson04/phone/dialog",
        VD, lambda n, l=None: n + (l or ""))
job_idx(B/"第04堂/第二課 - 打電話/supplementary vocabulary", A/"lesson04/phone/supp",
        IDX, lambda n, l=None: lower(n, l or "")[0] + lower(n, l or "")[1])
job_idx(B/"第04堂/急口令4/sound", A/"lesson04/tongue/words",
        IDX, lambda n, l=None: lower(n, l or "")[0] + lower(n, l or "")[1])
# ---------------- lesson 05 ----------------
job_idx(B/"第05堂/Supplementary Vocabulary-點樣煮/Cooking Methods_sound", A/"lesson05/cooking/items",
        IDX, lambda n, l=None: lower(n, l or "")[0] + lower(n, l or "")[1])
job_idx(B/"第05堂/Supplementary Vocabulary-點樣煮/Cooking Methods_dialogue_sound", A/"lesson05/cooking/dialog",
        GD, lambda n, l: lower(n, l)[0] + lower(n, l)[1])
job_idx(B/"第05堂/急口令-05", A/"lesson05/tongue/words",
        IDX, lambda n, l=None: lower(n, l or "")[0] + lower(n, l or "")[1])
# ---------------- lesson 06 ----------------
job_idx(B/"第06堂/Supplementary Vocabulary-邊度食飯/eating place_sound_individual", A/"lesson06/eatplace/items",
        IDX, lambda n, l=None: lower(n, l or "")[0] + lower(n, l or "")[1])
job_idx(B/"第06堂/急口令-06/急口令_06_sound_individual", A/"lesson06/tongue/words",
        IDX, lambda n, l=None: lower(n, l or "")[0] + lower(n, l or "")[1])
# ---------------- lesson 07 ----------------
job_idx(B/"第07堂/Suplementary Vocabulary-睇戲/movie_sound_individual/movie", A/"lesson07/movie/items",
        IDX, lambda n, l=None: lower(n, l or "")[0] + lower(n, l or "")[1])
job_idx(B/"第07堂/Suplementary Vocabulary-睇戲/movie_sound_individual/dialogs", A/"lesson07/movie/dialog",
        MVD, lambda n, qa, m, l=None: n + qa.lower() + m + (l or "").lower())
job_idx(B/"第07堂/第三課-娛樂/sound_individual/Conversation", A/"lesson07/fun/conversation",
        CD, lambda n: "c" + n)
job_idx(B/"第07堂/第三課-娛樂/sound_individual/Dialogue", A/"lesson07/fun/dialog",
        DD, lambda n, l=None: "d" + n + (l or "").lower())
job_idx(B/"第07堂/第三課-娛樂/sound_individual/supplementary vocabulary", A/"lesson07/fun/supp",
        SV, lambda n, l=None: "sv" + n + (l or "").lower())
# ---------------- lesson 08 ----------------
job_idx(B/"第08堂/Suplementary Vocabulary-童年遊戲/games_sound_individual/Vocabulary", A/"lesson08/games/items",
        IDX, lambda n, l=None: lower(n, l or "")[0] + lower(n, l or "")[1])
job_idx(B/"第08堂/Suplementary Vocabulary-童年遊戲/games_sound_individual/dialog", A/"lesson08/games/dialog",
        GD, lambda n, l: lower(n, l)[0] + lower(n, l)[1])
# ---------------- lesson 10 ----------------
L4 = B/"第10堂/中國人學廣東話中級課Lesson4/中國人學廣東話中級課Lesson4_sound_individual"
job_idx(L4/"Vocabulary", A/"lesson10/lesson4/vocab", V, lambda n, l=None: "v" + n + (l or ""))
job_idx(L4/"Dialogue", A/"lesson10/lesson4/dialog", DD, lambda n, l=None: "d" + n + (l or "").lower())
job_idx(L4/"supplementary vocabulary", A/"lesson10/lesson4/supp", SV, lambda n, l=None: "sv" + n + (l or "").lower())
job_idx(L4/"Conversation", A/"lesson10/lesson4/conversation", CD, lambda n: "c" + n)
job_idx(B/"第10堂/補充生字-貝殼類海產/貝殼類海產-sound-individual", A/"lesson10/shellfish/items",
        PAT_P, lambda n, l="": lower(n, l)[0] + lower(n, l)[1])
job_idx(B/"第10堂/急口令-10/急口令_10_sound_individual", A/"lesson10/tongue/words",
        IDX, lambda n, l=None: lower(n, l or "")[0] + lower(n, l or "")[1])
# ---------------- lesson 11 ----------------
job_idx(B/"第11堂/Supplimentary Vocabulary-新鮮海魚/alive sea fish_sound_individual", A/"lesson11/seafish/items",
        IDX, lambda n, l=None: lower(n, l or "")[0] + lower(n, l or "")[1])
job_idx(B/"第11堂/急口令-11/急口令-11_sound_individual", A/"lesson11/tongue/words",
        IDX, lambda n, l=None: lower(n, l or "")[0] + lower(n, l or "")[1])
# ---------------- lesson 12 ----------------
job_idx(B/"第12堂/Supplimentary Vocabulary-急凍海魚/Fresh Marine fish and frozen fish_sound_individual", A/"lesson12/frozenfish/items",
        PAT_P, lambda n, l="": lower(n, l)[0] + lower(n, l)[1])
job_idx(B/"第12堂/Supplimentary Vocabulary-新鮮淡水魚/Alive fish_fresh water_sound_individual", A/"lesson12/freshfish/items",
        PAT_P, lambda n, l="": lower(n, l)[0] + lower(n, l)[1])
job_idx(B/"第12堂/急口令-12/急口令_12_sound_individual", A/"lesson12/tongue/words",
        IDX, lambda n, l=None: lower(n, l or "")[0] + lower(n, l or "")[1])
# ---------------- tongue 07/08/09 unnumbered words (PDF order) ----------------
for src_dir, dst_dir, order in [
    (B/"第07堂/急口令-07", A/"lesson07/tongue/words",
     ["yahp.mp3","sihk-maht.mp3","saht-yihm-sāt.mp3","gahm-gán.mp3","sahp.mp3","go.mp3","gán-gāp-jai.mp3"]),
    (B/"第08堂/急口令-08", A/"lesson08/tongue/words",
     ["gāai-tàuh.mp3","sāam.mp3","mān.mp3","yāt.mp3","gān.mp3","gāi.mp3","gāai-méih.mp3","gwāi.mp3","máaih.mp3","néih wah.mp3","gwai.mp3","dihng.mp3"]),
    (B/"第09堂/急口令-09", A/"lesson09/tongue/words",
     ["yàuh-chāai.mp3","sūk-sūk.mp3","sung-seun.mp3","sèuhn-suhk.mp3","seun-chūk.mp3","sung-chēut.mp3"]),
]:
    for i, name in enumerate(order, 1):
        put(src_dir/name, dst_dir/f"{i:02d}.mp3")
# ---------------- speeds ----------------
SP = [  # (src_dir, pattern stem contains, dst lesson, [(suffix, outname)])
    (B/"第04堂/急口令4/sound", "lesson04", [("_慢","01_slow"),("_中","02_medium"),("_快","03_fast"),("_超快","04_veryfast")]),
    (B/"第05堂/急口令-05", "lesson05", [("_慢","01_slow"),("_中","02_medium"),("_快","03_fast"),("_超快","04_veryfast")]),
    (B/"第06堂/急口令-06", "lesson06", [("_慢","01_slow"),("_正常","02_normal"),("_快","03_fast"),("_超快","04_veryfast")]),
    (B/"第07堂/急口令-07", "lesson07", [("_慢","01_slow"),("_正常","02_normal"),("_快","03_fast"),("_超快","04_veryfast")]),
    (B/"第08堂/急口令-08", "lesson08", [("_慢","01_slow"),("_正常","02_normal"),("_快","03_fast"),("_超快","04_veryfast")]),
    (B/"第09堂/急口令-09", "lesson09", [("_超慢","01_xslow"),("_慢","02_slow"),("_正常","03_normal"),("_快","04_fast"),("_超快","05_veryfast")]),
    (B/"第10堂/急口令-10", "lesson10", [("_慢","01_slow"),("_正常","02_normal"),("_快","03_fast")]),
    (B/"第11堂/急口令-11", "lesson11", [("慢速度","01_slow"),("正常速度","02_normal"),("快速度","03_fast")]),
    (B/"第12堂/急口令-12", "lesson12", [("慢速度","01_slow"),("正常速度","02_normal"),("快速度","03_fast")]),
]
for src_dir, les, pats in SP:
    for suffix, out in pats:
        hits = [f for f in src_dir.iterdir() if f.is_file() and f.suffix.lower() in (".mp3",".m4a")
                and suffix in f.stem and (suffix != "_慢" or "_超慢" not in f.stem)]
        if len(hits) != 1:
            problems.append(f"SPEED {les}{suffix}: hits={len(hits)} in {src_dir.name}"); continue
        put(hits[0], A/les/"tongue/speeds"/(out + hits[0].suffix.lower()))
# ---------------- all-in-one & big singles ----------------
SINGLES = [
    (B/"第04堂/肉/Meat _all in one.mp3", A/"lesson04/meat/all_in_one.mp3"),
    (B/"第04堂/第二課 - 打電話/中國人學廣東話中級課Lesson02_Vocabulary_all in on.mp3", A/"lesson04/phone/vocab_all_in_one.mp3"),
    (B/"第04堂/第二課 - 打電話/中國人學廣東話中級課Lesson02_Dialogue_all in on.mp3", A/"lesson04/phone/dialog_all_in_one.mp3"),
    (B/"第04堂/第二課 - 打電話/中國人學廣東話中級課Lesson02_supplementary vocabulary_all in on.mp3", A/"lesson04/phone/supp_all_in_one.mp3"),
    (B/"第05堂/Supplementary Vocabulary-點樣煮/Cooking Methods_all in one.mp3", A/"lesson05/cooking/all_in_one.mp3"),
    (B/"第07堂/Suplementary Vocabulary-睇戲/movie_sound_all in one.mp3", A/"lesson07/movie/all_in_one.mp3"),
    (B/"第07堂/第三課-娛樂/中國人學廣東話中級課Lesson03_all in one.mp3", A/"lesson07/fun/all_in_one.mp3"),
    (B/"第07堂/第三課-娛樂/中國人學廣東話中級課Lesson03_Vocabulary.mp3", A/"lesson07/fun/vocab_all_in_one.mp3"),
    (B/"第07堂/第三課-娛樂/中國人學廣東話中級課Lesson03_Dialogue.mp3", A/"lesson07/fun/dialog_all_in_one.mp3"),
    (B/"第07堂/第三課-娛樂/中國人學廣東話中級課Lesson03_Conversation.mp3", A/"lesson07/fun/conversation_all_in_one.mp3"),
    (B/"第07堂/第三課-娛樂/中國人學廣東話中級課Lesson03_supplementary vocabulary.mp3", A/"lesson07/fun/supp_all_in_one.mp3"),
    (B/"第08堂/Suplementary Vocabulary-童年遊戲/children games_all in one.mp3", A/"lesson08/games/all_in_one.mp3"),
    (B/"第09堂/Supplimentary Vocabulary-調味料/Seasoning調味料_all in one.mp3", A/"lesson09/seasoning/all_in_one.mp3"),
    (B/"第10堂/中國人學廣東話中級課Lesson4/中國人學廣東話中級課Lesson4_all in one.mp3", A/"lesson10/lesson4/all_in_one.mp3"),
    (B/"第10堂/中國人學廣東話中級課Lesson4/中國人學廣東話中級課Lesson4_sound_individual/中國人學廣東話中級課Lesson4_Vocabulary.mp3", A/"lesson10/lesson4/vocab_all_in_one.mp3"),
    (B/"第10堂/中國人學廣東話中級課Lesson4/中國人學廣東話中級課Lesson4_sound_individual/中國人學廣東話中級課Lesson4_Dialogue.mp3", A/"lesson10/lesson4/dialog_all_in_one.mp3"),
    (B/"第10堂/中國人學廣東話中級課Lesson4/中國人學廣東話中級課Lesson4_sound_individual/中國人學廣東話中級課Lesson4_Conversation.mp3", A/"lesson10/lesson4/conversation_all_in_one.mp3"),
    (B/"第10堂/中國人學廣東話中級課Lesson4/中國人學廣東話中級課Lesson4_sound_individual/中國人學廣東話中級課Lesson4_supplementary vocabulary.mp3", A/"lesson10/lesson4/supp_all_in_one.mp3"),
    (B/"第10堂/補充生字-貝殼類海產/bui-hok-leuih hói-cháan貝殼類海產_all in one.mp3", A/"lesson10/shellfish/all_in_one.mp3"),
    (B/"第11堂/Supplimentary Vocabulary-新鮮海魚/Alive fish (sea) sàn-sìn-hói-yú新鮮海魚_all in one.mp3", A/"lesson11/seafish/all_in_one.mp3"),
    (B/"第12堂/Supplimentary Vocabulary-急凍海魚/gàp-dung Hói-yú急凍海魚.mp3", A/"lesson12/frozenfish/all_in_one.mp3"),
    (B/"第12堂/Supplimentary Vocabulary-新鮮淡水魚/sān-sīn-táahm-séui-yú新鮮淡水魚.mp3", A/"lesson12/freshfish/all_in_one.mp3"),
]
for src, dst in SINGLES:
    put(src, dst)

# ---------------- phonics ----------------
PH = B/"普通話與廣東話音標對應表"
job_idx(PH/"ex_Initials_individual", A/"phonics/initials/items", GD, lambda n, l: n + l.lower())
job_idx(PH/"ex Finals_individual sounds", A/"phonics/exfinals/items", GD, lambda n, l: n + l.lower())
job_idx(PH/"ex Finals_in group", A/"phonics/exfinals/groups", IDX, lambda n, l=None: n)
job_idx(PH/"finals-comparison with initial", A/"phonics/comparison_initial", IDX, lambda n, l=None: n)
job_idx(PH/"Learning focus sounds", A/"phonics/focus/items", GD, lambda n, l: n + l.lower())
job_idx(PH/"Learning focus sounds", A/"phonics/focus/items", re.compile(r"^(\d+)[_ ]"), lambda n: n)
# finals individual: named by final itself (a.m4a ...); slugify
fi_src = PH/"finals_individual sounds"
for f in sorted(fi_src.iterdir()):
    if f.suffix.lower() not in (".mp3", ".m4a"): continue
    put(f, A/"phonics/finals/items"/(safe(f.stem) + f.suffix.lower()))
# finals comparison: names like "aan aang aam.m4a" -> slug
fc_src = PH/"finals-comparison"
for f in sorted(fc_src.iterdir()):
    if f.suffix.lower() not in (".mp3", ".m4a"): continue
    put(f, A/"phonics/finals/comparison"/(safe(f.stem) + f.suffix.lower()))
# finals groups: "a-aak.mp3" etc already safe-ish; slugify
fg_src = PH/"finals-groups"
for f in sorted(fg_src.iterdir()):
    if f.suffix.lower() not in (".mp3", ".m4a"): continue
    put(f, A/"phonics/finals/groups"/(safe(f.stem) + f.suffix.lower()))
PH_SINGLES = [
    (PH/"Initials_all in one.mp3", A/"phonics/initials/all_in_one.mp3"),
    (PH/"ex普通話與廣東話的音標對應表Initials_all in one.m4a", A/"phonics/initials/ex_all_in_one.m4a"),
    (PH/"Finals-all in one_with initials.mp3", A/"phonics/finals/all_in_one_with_initials.mp3"),
    (PH/"Finals-all in one_without initials.mp3", A/"phonics/finals/all_in_one.mp3"),
    (PH/"ex 普通話與廣東話音標對應表Finals_All in one.mp3", A/"phonics/exfinals/all_in_one.mp3"),
    (PH/"finals-comparison with initial.mp3", A/"phonics/comparison_initial/all_in_one.mp3"),
    (PH/"tone1to6_2-9.m4a", A/"phonics/tone1to6_2-9.m4a"),
    (PH/"tone1to6_si-sik.m4a", A/"phonics/tone1to6_si-sik.m4a"),
    (PH/"learning focus_P04_sāp sāt sāk sām sān sāng_compaision.mp3", A/"phonics/focus/p04_comparison.mp3"),
    (PH/"learning focus_P12-P20.mp3", A/"phonics/focus/p12-p20.mp3"),
    (PH/"learning focus_P21-P22_īn vs īm āan vs āam ān vs ām.mp3", A/"phonics/focus/p21-p22.mp3"),
    (PH/"learning focus_P24_finals-comparison with initial.mp3", A/"phonics/focus/p24_comparison.mp3"),
]
for src, dst in PH_SINGLES:
    put(src, dst)

print(f"copied: {copied}")
print(f"skipped ({len(skipped)}):")
for s in skipped: print("  SKIP:", s)
print(f"problems ({len(problems)}):")
for p in problems: print("  PROB:", p)
(ROOT/".tmp-extract/20260817/audio_mapping.json").write_text(
    json.dumps(mapping, ensure_ascii=False, indent=1), encoding="utf-8")
print("mapping -> .tmp-extract/20260817/audio_mapping.json")
