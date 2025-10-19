# 🔄 Firebase 到 Vercel 遷移檢查清單

## 📋 遷移前準備

### ✅ 備份檢查
- [ ] 備份 Firebase 專案配置
- [ ] 導出 Firestore 數據
- [ ] 記錄所有環境變數
- [ ] 備份自定義域名設定
- [ ] 測試當前網站功能

### ✅ 環境變數清單
```
Firebase 配置：
- API Key
- Auth Domain  
- Project ID
- Storage Bucket
- Messaging Sender ID
- App ID

Stripe 配置：
- Secret Key
- Publishable Key

其他配置：
- 自定義域名
- SSL 證書
```

## 🚀 遷移步驟

### ✅ 1. 專案結構設置
- [x] 創建 `vercel.json` 配置文件
- [x] 創建 `package.json` 文件
- [x] 設置路由規則
- [x] 配置安全標頭

### ✅ 2. API Routes 遷移
- [x] 創建 `/api/create-checkout-session.js`
- [x] 創建 `/api/checkout-session.js`
- [x] 更新前端代碼使用新 API
- [x] 移除 Firebase Functions 依賴

### ✅ 3. 環境變數設定
- [ ] 在 Vercel Dashboard 設定環境變數
- [ ] 測試環境變數是否正確載入
- [ ] 驗證 Stripe 配置
- [ ] 驗證 Firebase 配置

### ✅ 4. 部署測試
- [ ] 本地測試 (`vercel dev`)
- [ ] 預覽環境部署 (`vercel`)
- [ ] 生產環境部署 (`vercel --prod`)
- [ ] 功能測試

## 🧪 測試檢查清單

### ✅ 基本功能測試
- [ ] 主頁加載正常
- [ ] CSS/JS 資源加載
- [ ] 圖片正常顯示
- [ ] 路由正常工作

### ✅ 認證功能測試
- [ ] Google 登入
- [ ] 用戶登出
- [ ] 認證狀態保持
- [ ] 用戶數據載入

### ✅ 圖片生成測試
- [ ] 圖片生成功能
- [ ] 下載功能
- [ ] 分享功能
- [ ] 錯誤處理

### ✅ 付費功能測試
- [ ] Stripe 結帳
- [ ] 支付成功頁面
- [ ] 支付取消頁面
- [ ] 訂單狀態檢查

### ✅ 性能測試
- [ ] 頁面加載速度
- [ ] 圖片加載速度
- [ ] API 響應時間
- [ ] 全球 CDN 性能

## 🔧 故障排除

### ❌ 常見問題
1. **路由 404 錯誤**
   - 檢查 `vercel.json` 路由配置
   - 確認文件路徑正確

2. **環境變數未載入**
   - 檢查 Vercel Dashboard 設定
   - 確認變數名稱正確

3. **API 請求失敗**
   - 檢查 API Routes 代碼
   - 確認 CORS 設定

4. **Firebase 初始化錯誤**
   - 檢查環境變數設定
   - 確認 Firebase 配置正確

### 🔍 調試工具
```bash
# 本地開發
vercel dev

# 查看部署日誌
vercel logs

# 檢查環境變數
vercel env ls
```

## 📊 遷移後對比

### Firebase Hosting
- 部署：`firebase deploy`
- 配置：`firebase.json`
- 域名：`*.web.app`
- 功能：Firebase Functions

### Vercel
- 部署：`vercel --prod`
- 配置：`vercel.json`
- 域名：`*.vercel.app`
- 功能：API Routes

## 🎯 遷移完成檢查

### ✅ 最終驗證
- [ ] 所有功能正常工作
- [ ] 性能優於或等於原版本
- [ ] 安全配置正確
- [ ] 監控和分析設置
- [ ] 備份和恢復計劃

### ✅ 文檔更新
- [ ] 更新部署文檔
- [ ] 更新開發指南
- [ ] 更新故障排除指南
- [ ] 更新環境變數說明

## 🚨 回滾計劃

如果遷移出現問題：
1. 保持 Firebase 部署運行
2. 修復 Vercel 部署問題
3. 重新測試所有功能
4. 確認穩定後再切換域名

## 📞 支援資源

- Vercel 文檔：https://vercel.com/docs
- Stripe 文檔：https://stripe.com/docs
- Firebase 文檔：https://firebase.google.com/docs
