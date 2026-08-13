# 內容投稿與發佈流程

## 概覽

```
受信任用戶 → 在網站點「📝」投稿 → GitHub Issue 提交
    → 管理員收到郵件通知 → 審核內容
    → 編輯 data/lessonXX.js → git push → 網站自動更新
    → 關閉 Issue
```

## 一、投稿者操作

1. 打開網站 `https://musicjayzhou.github.io/cantonese_learning/`
2. 點擊頁面頂部右上角的 **📝** 圖標
3. 在 GitHub Issue 頁面填寫表單（粵拼、繁體中文、英文等）
4. 點擊 **Submit new issue**

> 投稿者需有免費 GitHub 帳號。音頻為可選項，可附上下載連結。

## 二、管理員審核

1. 收到 GitHub 的 Issue 通知郵件
2. 打開 Issue，審核內容是否準確
3. 如需修改，直接在 Issue 中回覆討論
4. 審核通過 → 進入發佈步驟

## 三、發佈到網站

### 情況 A：向現有課程添加內容

以新增一條顏色詞彙為例：

1. 打開 `data/lesson01.js`
2. 找到對應 section（如 `colour`）的 `items` 陣列
3. 在末尾添加新條目：

```javascript
{
  "jyut": "投稿者填的粵拼",
  "zh": "投稿者填的中文",
  "en": "投稿者填的英文",
  "audio": "audio/lesson01/colour/items/20.mp3"  // 如有音頻則填路徑，無則刪除此行
}
```

4. 如有音頻文件，將文件放到 `audio/lesson01/colour/items/` 目錄
5. 保存文件

### 情況 B：創建新課程

1. 創建新的數據文件 `data/lesson02.js`，結構參考 `lesson01.js`
2. 在 `index.html` 中添加 `<script src="data/lesson02.js"></script>`
3. 更新 `js/data.js` 中的 `SEC_TABS` 等配置

### 推送發佈

```powershell
cd D:\Workspace\Cantonese
git add .
git commit -m "新增內容：<簡述>"
git push
```

推送後 1~2 分鐘，GitHub Pages 會自動重新構建，網站即更新。

## 四、完成後

1. 回到 GitHub Issue，回覆「已發佈 ✅」
2. 關閉 Issue

## 注意事項

- 粵拼（Jyutping）格式請參考 https://jyut.net/
- 繁體中文優先（與現有內容一致）
- 音頻文件命名：按目錄中已有序號遞增
- 如投稿內容有誤或質量不佳，直接在 Issue 中說明原因並關閉
