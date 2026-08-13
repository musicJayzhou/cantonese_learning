# 廣東話複習寶 🎯

粵語中級學習工具，涵蓋詞彙、句型、俗語、急口令等多種練習模式。

## 功能

- **學習** — 詞彙卡片、句型對話、俗語講解、急口令挑戰、聽力理解
- **記憶卡** — 閃卡翻面、分類篩選、掌握 / 加強標記
- **遊樂場** — 角色扮演、聽寫、句子重組、閃電戰、問答接龍

學習進度（星星、連擊天數、詞彙標記）自動保存在瀏覽器 LocalStorage。

## 本地運行

純靜態網站，無需安裝任何依賴。直接用瀏覽器打開 `index.html` 即可，或用任意靜態伺服器：

```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

然後訪問 `http://localhost:8000`。

## 貢獻內容

歡迎提交新的詞彙、俗語、例句等學習素材！請通過[投稿表單](https://github.com/musicJayzhou/cantonese_learning/issues/new?template=submit-content.yml)填寫，管理員審核後會發佈到網站。

## 目錄結構

詳見 [STRUCTURE.md](STRUCTURE.md)。

## 技術棧

- 原生 HTML / CSS / JavaScript（無框架、無構建步驟）
- 部署於 GitHub Pages
