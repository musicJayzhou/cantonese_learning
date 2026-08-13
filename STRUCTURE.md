<!-- Auto-maintained by Claude Code; manual edits welcome -->
# 广东话复习宝 — 项目结构

粤语学习复习工具，第一课（颜色 / 形状 / 去买嘢 / 俗语 / 急口令）。

## 目录结构

- `index.html` — 页面骨架，引用 CSS / JS / 数据
- `css/` — 样式
  - `app.css` — 全部样式（含移动端 / Pad / 电脑端响应式适配）
- `js/` — 应用逻辑，按依赖顺序加载
  - `store.js` — LocalStorage 持久化、星星 / 连击 / 标记系统、toast 提示、DOM 简写（`$` / `$$`）
  - `confetti.js` — 庆祝粒子动画（canvas）
  - `audio.js` — 音频播放模块（`play()`）及 `[data-audio]` 全局点击委托
  - `data.js` — 课程数据常量（`DATA`、色板 `SWATCH`、形状图标 `SHAPE_IC`、分页 `SEC_TABS`、辅助函数）
  - `learn.js` — 学习视图（词汇卡片、句型对话、俗语展开、急口令、判断题、长按标记）
  - `cards.js` — 记忆卡视图（闪卡翻面、分类筛选、掌握 / 加强标记）
  - `games.js` — 游乐场（角色扮演 / 听写 / 句子重组 / 限时闪电战 / 问答接龙）
  - `main.js` — 导航切换、分页事件、引导层（coach overlay）、首次渲染入口
- `data/` — 课程数据
  - `lesson01.js` — 第一课 JSON 数据（`window.COURSE_DATA`），音频字段为相对路径（~37 KB）
- `audio/lesson01/` — 第一课音频资源（110 个文件，32.7 MB）
  - `colour/` — 颜色主题
    - `items/` — 19 个颜色词汇音频（`01.mp3` … `19.mp3`）
    - `sentences/` — 12 个句型对话音频（`01.m4a` … `12.m4a`）
    - `all_in_one.mp3` — 整段连续朗读
  - `shape/` — 形状主题（结构同 colour：19 items + 14 sentences + all_in_one）
  - `lesson1/` — 第一课"去买嘢"整段音频
    - `vocab.mp3` / `dialogue.mp3` / `comprehension.mp3` / `classifier.mp3` / `supp_vocab.mp3`
  - `suyu/` — 俗语主题
    - `items/` — 10 个俗语音频
    - `items/06_variants/` — 第 6 条俗语的"××声"系列变体（4 个）
    - `all_in_one.mp3`
  - `tongue/` — 急口令
    - `words/` — 4 个单词音频
    - `speeds/` — 3 个速度档（慢 / 中 / 快）
    - `full.mp3` — 完整急口令
  - `pairs/` — 问答对话音频（8 组 × 2 = 16 个，`NN_q.m4a` / `NN_a.m4a`）
- `scripts/` — 工具脚本
  - `extract-audio.ps1` — 从原始 HTML 提取 base64 音频 → 独立文件，生成 `data/lesson01.js`
- `docs/` — 文档
  - `SUBMISSION-WORKFLOW.md` — 内容投稿与发布流程
- `.github/ISSUE_TEMPLATE/` — GitHub Issue 模板
  - `submit-content.yml` — 内容投稿表单模板
- `backup/` — 原始文件备份（已 gitignore）
  - `廣東話複習寶_第01堂-20260813-0000.bak` — 原始 HTML（43.72 MB）
- `第01堂-20260810T060058Z-1-001/` — 课程原始素材（已 gitignore）

## JS 模块加载顺序

```
data/lesson01.js  →  store.js  →  confetti.js  →  audio.js
→  data.js  →  learn.js  →  cards.js  →  games.js  →  main.js
```

`data/lesson01.js` 设置 `window.COURSE_DATA`，`data.js` 读取为 `const DATA`。
各模块通过全局作用域共享变量和函数；`window.xxx` 赋值的函数可被内联 `onclick` 调用。

## 响应式断点

| 断点 | 范围 | 特征 |
|---|---|---|
| 默认（移动端） | < 768px | 640px 居中列、底部全宽导航栏、触摸交互 |
| Tablet | ≥ 768px | 720px 容器、更大的卡片和字体、hover 效果生效 |
| Desktop | ≥ 1024px | 1080px 容器、左侧固定侧边栏导航、学习页双栏（词汇 + 句型）、俗语瀑布流双列、测验选项双列、游乐场双列、滚动条可见 |
