<!-- Auto-maintained by Claude Code; manual edits welcome -->
# 广东话复习宝 — 项目结构

粤语学习复习工具，目前收录十二堂课 + 发音工具书：第01堂（颜色/形状/去买嘢/俗语/急口令01）、第02堂（生果/买杂果沙律/急口令02）、第03堂（蔬菜/急口令03/文法01）、第04堂（肉类/打电话/急口令04/文法02）、第05堂（点样煮/急口令05）、第06堂（边度食饭/急口令06）、第07堂（睇戏/娱乐/急口令07/文法03）、第08堂（童年游戏/急口令08）、第09堂（调味料/急口令09/文法03共享）、第10堂（买生果/贝壳类海产/急口令10）、第11堂（新鲜海鱼/急口令11/文法04）、第12堂（急冻海鱼/淡水鱼/急口令12/文法04共享），以及独立「發音」板块（普通话与广东话音标对应表：声母/韵母/对比/学习重点/声调）。

## 目录结构

- `index.html` — 页面骨架，引用 CSS / JS / 数据
- `css/` — 样式
  - `app.css` — 全部样式（含移动端 / Pad / 电脑端响应式适配、图文卡、文法卡、发音表、课次跳堂）
- `js/` — 应用逻辑，按依赖顺序加载
  - `store.js` — LocalStorage 持久化、星星 / 连击 / 标记系统、toast 提示、DOM 简写（`$` / `$$`）
  - `confetti.js` — 庆祝粒子动画（canvas）
  - `audio.js` — 音频播放模块（`play()`）及 `[data-audio]` 全局点击委托
  - `data.js` — **多课装载**（`COURSES` 数组、section 类型推断）、课次状态（学习页单课 `curLesson`、练习多选 `pracSel`）、标记 ID 生成（`mkid`）、色板 `SWATCH`、形状图标 `SHAPE_IC`
  - `learn.js` — 学习视图，**按 section.type 渲染**：`vocab`（词汇/分组词汇/词汇+句型）、`dialog`（课文对话，第01堂固定布局 / 其余动态 blocks：vocab/dialogue/sents/note，block 级 all-in-one）、`suyu`、`tongue`（N 档速度）、`grammar`（纯阅读文法卡，双堂共享对象 + `also` 互链标注）；课次跳堂下拉；长按标记
  - `cards.js` — 记忆卡视图（闪卡翻面、**课次多选 + 分类筛选**、掌握 / 加强标记）
  - `games.js` — 游乐场（角色扮演 / 听写 / 句子重组 / 限时闪电战 / 问答接龙），出题池按课次多选构建，无素材游戏自动降级
  - `phonics.js` — 發音板块渲染（声母表 / 韵母表 / 对比练习 / 学习重点 / 声调表）
  - `main.js` — 导航切换（含發音 tab）、课次切换事件、引导层、hash 直达链接、首次渲染
- `data/` — 课程数据
  - `lesson01.js` — 第01堂（`window.COURSE_DATA`，~37 KB）
  - `lesson02.js` — 第02堂（`window.COURSE_DATA_02`：65 生果卡 + 20 对话生字 + 12 句对话 + 急口令02 四档速度 + pairs/seg）
  - `lesson03.js` — 第03堂（`window.COURSE_DATA_03`：84 蔬菜卡分 7 组 + 急口令3 四档速度 + 文法 19 句）
  - `lesson04.js` … `lesson12.js` — 第04–12堂（`window.COURSE_DATA_04`…`_12`；文法Lesson3 数据在第07堂、第09堂共享引用 `window.GRAMMAR_L3`，文法Lesson4 同理 `GRAMMAR_L4` 在第11/12堂）
  - `phonics.js` — 發音板块数据（`window.PHONICS_DATA`：19 声母 / 56 韵母练习行 / 对比组 / 学习重点 / 六声）
- `audio/lesson01/` … `audio/lesson12/` — 各课音频（items/words/dialog/supp/speeds/classifier 等子目录 + all_in_one）
- `audio/phonics/` — 發音板块音频（initials / finals / exfinals / comparison_initial / focus）
- `img/lessonNN/<topic>/pXX_N.webp` — 从 PDF 讲义提取的词汇配图（WebP ≤400px；XX = 讲义页码）
- `scripts/` — 工具脚本
  - `extract-audio.ps1` — 第01堂：从原始 HTML 提取 base64 音频 → 独立文件，生成 `data/lesson01.js`
  - `extract-pdf-text.py` — 从 PDF 讲义提取文字（PyMuPDF，保留粤拼调号）
  - `extract-pdf-images.py` — 从 PDF 提取每词配图并压缩为 WebP
  - `organize-lesson-audio.py` — 第02/03堂：从 raw-materials 拷贝音频并重命名为 web 安全文件名
  - `organize-audio-20260817.py` — 第04–12堂+发音：批量整理音频（碰撞自动加字母、速度档归一）
  - `audit-assets.js` — 校验全部数据文件引用的音频/图片与磁盘一致（无缺失、无冗余）
- `docs/` — 文档
  - `SUBMISSION-WORKFLOW.md` — 内容投稿与发布流程
- `.github/ISSUE_TEMPLATE/` — GitHub Issue 模板
  - `submit-content.yml` — 内容投稿表单模板
- `backup/` — 原始文件备份（已 gitignore）
- `raw-materials/` — 课程原始资料，按日期归档（已 gitignore）
  - `20260810/…第01堂…` / `20260816/…第02+03堂…` / `20260817/…第04–12堂+音标对应表…`

## JS 模块加载顺序

```
data/lesson01.js … data/lesson12.js → data/phonics.js
→ store.js → confetti.js → audio.js
→ data.js → learn.js → cards.js → games.js → phonics.js → main.js
```

`data/lessonNN.js` 分别设置 `window.COURSE_DATA` / `_NN`；`data.js` 汇总为 `COURSES` 并推断 section `type`（第01堂无 type 字段，按 id 推断）。
各模块通过全局作用域共享变量和函数；`window.xxx` 赋值的函数可被内联 `onclick` 调用。

## 课次模型

- **学习页 = 单课聚焦**：`#lessonTabs` 切换 `curLesson`（存 `cantonese_curLesson`）；课次多时用「⚡ 跳堂」下拉快速跳转，当前课 tab 自动滚入视野
- **记忆卡 / 游乐场 = 课次多选**：`pracSel`（存 `cantonese_pracLessons`），`null` 表示「跟住學習頁」；chips 行有「✓ 全選」
- **标记 ID**：第01堂保留旧格式 `secKey|词`（兼容已有进度）；新课为 `courseId|secKey|词`；dialog blocks 的词汇卡为 `courseId|secId-<mk>|词`（mk 默认 `v`）
- 星星 / 连击 / 最高纪录全课共享
- **發音板块**独立于课次：`#view-phonics`，子板块状态存 `cantonese_phSec`

## 响应式断点

| 断点 | 范围 | 特征 |
|---|---|---|
| 默认（移动端） | < 768px | 640px 居中列、底部全宽导航栏、触摸交互 |
| Tablet | ≥ 768px | 720px 容器、更大的卡片和字体、hover 效果生效 |
| Desktop | ≥ 1024px | 1080px 容器、左侧固定侧边栏导航、学习页双栏（词汇 + 句型）、俗语瀑布流双列、测验选项双列、游乐场双列、滚动条可见 |

## 新增一课的标准流程

1. 原始资料放入 `raw-materials/<日期>/第NN堂…`
2. `scripts/extract-pdf-text.py` 提取讲义文字 → 整理词汇/对话/急口令内容
3. `scripts/extract-pdf-images.py` 提取配图到 `img/lessonNN/<主题>/`
4. `scripts/organize-lesson-audio.py`（或新批次脚本）整理音频到 `audio/lessonNN/…`
5. 新建 `data/lessonNN.js`（设置 `window.COURSE_DATA_NN`，section 声明 `type`），在 `index.html` 加 `<script>`，在 `js/data.js` 的 `COURSES` 数组登记
6. `scripts/audit-assets.js` 校验资产一致性
