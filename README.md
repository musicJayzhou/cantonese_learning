# 广东话复习宝 🎯

粤语中级学习工具，涵盖词汇、句型、俗语、急口令等多种练习模式。

## 功能

- **学习** — 词汇卡片、句型对话、俗语讲解、急口令挑战、听力理解
- **记忆卡** — 闪卡翻面、分类筛选、掌握 / 加强标记
- **游乐场** — 角色扮演、听写、句子重组、闪电战、问答接龙

学习进度（星星、连击天数、词汇标记）自动保存在浏览器 LocalStorage。

## 本地运行

纯静态网站，无需安装任何依赖。直接用浏览器打开 `index.html` 即可，或用任意静态服务器：

```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

然后访问 `http://localhost:8000`。

## 贡献内容

欢迎提交新的词汇、俗语、例句等学习素材！请通过[投稿表单](https://github.com/musicJayzhou/cantonese_learning/issues/new?template=submit-content.yml)填写，管理员审核后会发布到网站。

## 目录结构

详见 [STRUCTURE.md](STRUCTURE.md)。

## 技术栈

- 原生 HTML / CSS / JavaScript（无框架、无构建步骤）
- 部署于 GitHub Pages
