# 广东话复习宝 🎯

粤语中级学习工具，涵盖词汇、句型、俗语、急口令、文法等多种练习模式。目前收录三堂课：

- **第01堂** — 顏色 / 形狀 / 去買嘢 / 俗語 / 急口令01
- **第02堂** — 生果（65 词图文卡）/ 買雜果沙律（对话）/ 急口令02（四档速度）
- **第03堂** — 蔬菜（84 词分组图文卡）/ 急口令03 / 文法01

## 功能

- **学习** — 课次切换；图文词汇卡片、句型对话逐句点读、俗语讲解、急口令速度挑战、文法要点
- **记忆卡** — 闪卡翻面、课次多选 + 分类筛选、掌握 / 加强标记
- **游乐场** — 角色扮演、听写、句子重组、闪电战、问答接龙（按课次范围出题）

学习进度（星星、连击天数、词汇标记）自动保存在浏览器 LocalStorage，标记在学习页与记忆卡之间互通。

## 在线访问

| 站点 | 地址 | 说明 |
|------|------|------|
| 国内镜像（推荐） | https://dorami.vip | Cloudflare Workers + 自定义域名，国内直连 |
| 主站 | https://musicjayzhou.github.io/cantonese_learning/ | GitHub Pages，海外访问稳定 |

两个站点内容完全一致，push 到 main 分支后通过 GitHub Actions 自动同步部署。

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
- 部署：GitHub Pages（主站）+ Cloudflare Workers（国内镜像，自定义域 dorami.vip）
- CI/CD：GitHub Actions（.github/workflows/deploy-cloudflare.yml）push 即自动双端部署
