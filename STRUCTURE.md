<!-- Auto-maintained by Claude Code; manual edits welcome -->
# 广东话复习宝 — 项目结构

粤语学习复习工具，目前收录三堂课：第01堂（颜色/形状/去买嘢/俗语/急口令01）、第02堂（生果/买杂果沙律/急口令02）、第03堂（蔬菜/急口令03/文法01）。

## 目录结构

- `index.html` — 页面骨架，引用 CSS / JS / 数据
- `css/` — 样式
  - `app.css` — 全部样式（含移动端 / Pad / 电脑端响应式适配、图文卡、文法卡）
- `js/` — 应用逻辑，按依赖顺序加载
  - `store.js` — LocalStorage 持久化、星星 / 连击 / 标记系统、toast 提示、DOM 简写（`$` / `$$`）
  - `confetti.js` — 庆祝粒子动画（canvas）
  - `audio.js` — 音频播放模块（`play()`）及 `[data-audio]` 全局点击委托
  - `data.js` — **多课装载**（`COURSES` 数组、section 类型推断）、课次状态（学习页单课 `curLesson`、练习多选 `pracSel`）、标记 ID 生成（`mkid`）、色板 `SWATCH`、形状图标 `SHAPE_IC`
  - `learn.js` — 学习视图，**按 section.type 渲染**：`vocab`（词汇/分组词汇/词汇+句型）、`dialog`（课文对话，第01堂固定布局 / 第02堂动态 blocks）、`suyu`、`tongue`（N 档速度）、`grammar`（纯阅读文法卡）；长按标记
  - `cards.js` — 记忆卡视图（闪卡翻面、**课次多选 + 分类筛选**、掌握 / 加强标记）
  - `games.js` — 游乐场（角色扮演 / 听写 / 句子重组 / 限时闪电战 / 问答接龙），出题池按课次多选构建，无素材游戏自动降级
  - `main.js` — 导航切换、课次切换事件、引导层、hash 直达链接（`#lesson02`、`#lesson03.grammar`、`#lesson02.cards`）、首次渲染
- `data/` — 课程数据
  - `lesson01.js` — 第01堂（`window.COURSE_DATA`，~37 KB）
  - `lesson02.js` — 第02堂（`window.COURSE_DATA_02`：65 生果卡 + 20 对话生字 + 12 句对话 + 急口令02 四档速度 + pairs/seg）
  - `lesson03.js` — 第03堂（`window.COURSE_DATA_03`：84 蔬菜卡分 7 组 + 急口令3 四档速度 + 文法 19 句）
- `audio/lesson01/` — 第01堂音频（110 个文件，32.7 MB）
  - `colour/` `shape/` `lesson1/` `suyu/` `tongue/` `pairs/`（子结构见 git 历史版本）
- `audio/lesson02/` — 第02堂音频
  - `fruit/items/` — 66 个生果词音频（编号对应讲义页码，变体带 a/b/c 后缀）
  - `fruit/all_in_one.mp3`
  - `salad/vocab/` — 24 个对话生字音频（01a-c / 14a-c 为变体）
  - `salad/dialog/` — 14 个对话句音频（`01A_a/b/c` 为量词变体）
  - `tongue/words/` — 13 词 + `tongue/speeds/`（慢/中/快/超快 4 档）
- `audio/lesson03/` — 第03堂音频
  - `vegetable/items/` — 91 个蔬菜词音频（甘筍/紫洋蔥/蔥頭无音频；57 与 54 同为山藥，未引用）
  - `vegetable/all_in_one.mp3`
  - `tongue/words/` — 7 词 + `tongue/speeds/`（慢/正常/快/好快 4 档）
- `img/` — 从 PDF 讲义提取的词汇配图（WebP，≤400px，共 ~1 MB）
  - `lesson02/fruit/pXX_N.webp` — 生果图（XX = 讲义页码）
  - `lesson03/vegetable/pXX_N.webp` — 蔬菜图
- `scripts/` — 工具脚本
  - `extract-audio.ps1` — 第01堂：从原始 HTML 提取 base64 音频 → 独立文件，生成 `data/lesson01.js`
  - `extract-pdf-text.py` — 从 PDF 讲义提取文字（PyMuPDF，保留粤拼调号）
  - `extract-pdf-images.py` — 从 PDF 提取每词配图并压缩为 WebP
  - `organize-lesson-audio.py` — 从 raw-materials 拷贝音频并重命名为 web 安全文件名
  - `audit-assets.js` — 校验数据文件引用的音频/图片与磁盘一致（无缺失、无冗余）
- `docs/` — 文档
  - `SUBMISSION-WORKFLOW.md` — 内容投稿与发布流程
- `.github/ISSUE_TEMPLATE/` — GitHub Issue 模板
  - `submit-content.yml` — 内容投稿表单模板
- `backup/` — 原始文件备份（已 gitignore）
  - `廣東話複習寶_第01堂-20260813-0000.bak` — 原始 HTML（43.72 MB）
- `raw-materials/` — 课程原始资料，按日期归档（已 gitignore）
  - `20260810/…第01堂…` — 第01堂原始素材
  - `20260816/…第02堂+第03堂…` — 第02/03堂原始素材

## JS 模块加载顺序

```
data/lesson01.js → data/lesson02.js → data/lesson03.js
→ store.js → confetti.js → audio.js
→ data.js → learn.js → cards.js → games.js → main.js
```

`data/lessonNN.js` 分别设置 `window.COURSE_DATA` / `_02` / `_03`；`data.js` 汇总为 `COURSES` 并推断 section `type`（第01堂无 type 字段，按 id 推断）。
各模块通过全局作用域共享变量和函数；`window.xxx` 赋值的函数可被内联 `onclick` 调用。

## 课次模型

- **学习页 = 单课聚焦**：`#lessonTabs` 切换 `curLesson`（存 `cantonese_curLesson`）
- **记忆卡 / 游乐场 = 课次多选**：`pracSel`（存 `cantonese_pracLessons`），`null` 表示「跟住學習頁」
- **标记 ID**：第01堂保留旧格式 `secKey|词`（兼容已有进度）；新课为 `courseId|secKey|词`
- 星星 / 连击 / 最高纪录全课共享

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
4. `scripts/organize-lesson-audio.py` 整理音频到 `audio/lessonNN/…`
5. 新建 `data/lessonNN.js`（设置 `window.COURSE_DATA_NN`，section 声明 `type`），在 `index.html` 加 `<script>`，在 `js/data.js` 的 `COURSES` 数组登记
6. `scripts/audit-assets.js` 校验资产一致性
