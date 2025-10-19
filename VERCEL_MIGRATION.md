# Firebase 到 Vercel 遷移指南

## 🚀 遷移步驟

### 1. 環境變數設定

在 Vercel Dashboard 或使用 CLI 設定以下環境變數：

```bash
# Firebase 配置
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Stripe 配置
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 2. 部署命令

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 登入 Vercel
vercel login

# 初次部署
vercel

# 生產環境部署
vercel --prod
```

### 3. 檢查清單

- [ ] 主頁加載正常
- [ ] CSS/JS 資源加載
- [ ] Firebase 認證工作
- [ ] 圖片生成功能
- [ ] 路由正常工作
- [ ] 環境變數正確
- [ ] HTTPS 強制
- [ ] 404 頁面處理

### 4. 路由配置

已配置的路由：
- `/` → `public/index.html`
- `/pricing` → `public/pricing.html`
- `/success` → `public/success.html`
- `/cancel` → `public/cancel.html`

### 5. 安全標頭

已配置的安全標頭：
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### 6. 快取策略

靜態資源快取：1年
HTML 文件：不快取
