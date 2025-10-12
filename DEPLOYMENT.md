# AI 圖片生成網站部署指南

本文檔提供了將 AI 圖片生成網站部署到生產環境的詳細步驟。

## 部署前準備

1. **AI 圖片生成 API**
   - 本項目使用 [Pollinations.ai](https://pollinations.ai/) 作為免費的圖片生成 API
   - 無需註冊或 API 密鑰，可直接使用
   - 備選選項（如需更高質量或自定義功能）：
     - [Stability AI API](https://stability.ai/api)
     - [OpenAI DALL-E API](https://openai.com/dall-e-3)

2. **準備後端服務**
   - 創建 Firebase 項目用於用戶認證和數據存儲
   - 設置 Firebase Authentication 和 Firestore 數據庫
   - 獲取 Firebase 配置信息

3. **更新配置文件**
   - 在 `js/script.js` 中更新 Firebase 配置
   - 替換 AI 圖片生成 API 的模擬實現

## 部署步驟

### 1. 本地測試

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

確保所有功能正常運行，包括：
- 用戶註冊和登錄
- 圖片生成
- 畫廊顯示
- 圖片下載和分享

### 2. 構建生產版本

```bash
# 構建生產版本
npm run build
```

構建完成後，生產文件將位於 `dist` 目錄中。

### 3. 部署選項

#### 選項 A：靜態網站託管 (推薦)

1. **Firebase Hosting**
   ```bash
   # 安裝 Firebase CLI
   npm install -g firebase-tools

   # 登錄 Firebase
   firebase login

   # 初始化 Firebase 項目
   firebase init hosting

   # 部署到 Firebase
   firebase deploy --only hosting
   ```

2. **Netlify**
   - 創建 Netlify 帳戶
   - 拖放 `dist` 目錄到 Netlify 部署區域，或使用 Netlify CLI：
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

#### 選項 B：使用傳統網頁託管

1. 將 `dist` 目錄中的文件上傳到您的網頁託管服務器
2. 確保服務器配置為將所有請求路由到 `index.html`

## 上線後檢查清單

1. **功能測試**
   - 測試用戶註冊和登錄
   - 測試圖片生成功能
   - 測試畫廊和分享功能

2. **性能優化**
   - 使用 [Google PageSpeed Insights](https://pagespeed.web.dev/) 檢查性能
   - 優化圖片和資源加載

3. **安全檢查**
   - 確保 API 密鑰安全存儲
   - 設置適當的 Firebase 安全規則
   - 啟用 HTTPS

4. **監控設置**
   - 設置 Google Analytics 或其他分析工具
   - 配置錯誤監控 (如 Sentry)

## 維護計劃

1. **定期更新**
   - 更新依賴包
   - 檢查 API 變更

2. **用戶反饋收集**
   - 添加反饋表單
   - 監控用戶行為

3. **擴展計劃**
   - 添加更多 AI 模型選項
   - 實現高級功能 (如圖像編輯)
   - 添加訂閱計劃

## 故障排除

如果遇到部署問題：

1. 檢查控制台錯誤
2. 確認 API 密鑰和配置正確
3. 檢查 Firebase 規則設置
4. 確保 CORS 設置正確

## 聯繫支持

如需進一步幫助，請聯繫：[您的聯繫信息]