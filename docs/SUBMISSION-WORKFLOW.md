# 内容投稿与发布流程

## 概览

```
受信任用户 → 在网站点「📝」投稿 → GitHub Issue 提交
    → 管理员收到邮件通知 → 审核内容
    → 编辑 data/lessonXX.js → git push → 网站自动更新
    → 关闭 Issue
```

## 一、投稿者操作

1. 打开网站 `https://musicjayzhou.github.io/cantonese_learning/`
2. 点击页面顶部右上角的 **📝** 图标
3. 在 GitHub Issue 页面填写表单（粤拼、繁体中文、英文等）
4. 点击 **Submit new issue**

> 投稿者需有免费 GitHub 账号。音频为可选项，可附上下载链接。

## 二、管理员审核

1. 收到 GitHub 的 Issue 通知邮件
2. 打开 Issue，审核内容是否准确
3. 如需修改，直接在 Issue 中回复讨论
4. 审核通过 → 进入发布步骤

## 三、发布到网站

### 情况 A：向现有课程添加内容

以新增一条颜色词汇为例：

1. 打开 `data/lesson01.js`
2. 找到对应 section（如 `colour`）的 `items` 数组
3. 在末尾添加新条目：

```javascript
{
  "jyut": "投稿者填的粤拼",
  "zh": "投稿者填的中文",
  "en": "投稿者填的英文",
  "audio": "audio/lesson01/colour/items/20.mp3"  // 如有音频则填路径，无则删除此行
}
```

4. 如有音频文件，将文件放到 `audio/lesson01/colour/items/` 目录
5. 保存文件

### 情况 B：创建新课程

1. 创建新的数据文件 `data/lesson02.js`，结构参考 `lesson01.js`
2. 在 `index.html` 中添加 `<script src="data/lesson02.js"></script>`
3. 更新 `js/data.js` 中的 `SEC_TABS` 等配置

### 推送发布

```powershell
cd D:\Workspace\Cantonese
git add .
git commit -m "新增内容：<简述>"
# 通过 Clash Verge 本机代理推送（端口 7897，VPN 未开时需先开启）
git -c http.proxy=http://127.0.0.1:7897 -c https.proxy=http://127.0.0.1:7897 push origin main
```

推送后 1~2 分钟，GitHub Pages 和 Cloudflare Workers 会自动重新构建，两边网站同步更新。

## 四、完成后

1. 回到 GitHub Issue，回复「已发布 ✅」
2. 关闭 Issue

## 注意事项

- 粤拼（Jyutping）格式请参考 https://jyut.net/
- 繁体中文优先（与现有内容一致）
- 音频文件命名：按目录中已有序号递增
- 如投稿内容有误或质量不佳，直接在 Issue 中说明原因并关闭
