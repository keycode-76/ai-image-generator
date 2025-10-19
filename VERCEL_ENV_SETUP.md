# Vercel 環境變數設置指南

## 🚀 如何在 Vercel 中設置環境變數

### 步驟 1：訪問 Vercel Dashboard
1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇您的專案 `genfeer`
3. 點擊 **Settings** 標籤
4. 在左側選單中選擇 **Environment Variables**

### 步驟 2：添加環境變數
在 Environment Variables 頁面中，添加以下變數：

#### Firebase 配置
```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyAO9j3fqIuuwwf2znCBba1af7SW6Be7Tn4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = genfeer-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = genfeer-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = genfeer-ai.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 788596046031
NEXT_PUBLIC_FIREBASE_APP_ID = 1:788596046031:web:ff880f82c1d1d727bddfba
```

#### Stripe 配置
```
STRIPE_SECRET_KEY = sk_test_51SI7Te2KKjbc3s12RAo0aO6LpMQg2X2q4j308FOtm3Drb9EwtpH6D1Rrg31fHKRRxiBhnOFn9EuLDdP1SaoBwAQY00JhTsEr0N
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_51SI7Te2KKjbc3s12LNonNzqt79F7u4hwYXpNCiGeW0r9tU5GxzLqvzS7pTCo1KhpfpBeEe7x6kjPD8vznJmhpnWe00fIr5Juil
```

#### 其他配置
```
NODE_ENV = production
```

### 步驟 3：設置環境範圍
對於每個環境變數：
- **Production**: ✅ 勾選
- **Preview**: ✅ 勾選  
- **Development**: ✅ 勾選

### 步驟 4：重新部署
設置完成後：
1. 點擊 **Save** 保存所有環境變數
2. 回到專案主頁
3. 點擊 **Deployments** 標籤
4. 點擊最新部署右側的 **⋯** 選單
5. 選擇 **Redeploy** 重新部署

## 🔍 驗證設置

### 檢查環境變數是否生效
1. 訪問 `https://genfeer.vercel.app/pricing`
2. 打開瀏覽器開發者工具 (F12)
3. 點擊「開始訂閱方案」
4. 查看 Network 標籤中的 API 請求
5. 確認不再出現 401 錯誤

### 檢查 Vercel Functions
1. 在 Vercel Dashboard 中
2. 選擇 **Functions** 標籤
3. 確認可以看到以下 Functions：
   - `/api/create-checkout-session`
   - `/api/checkout-session`

## 🚨 常見問題

### 問題 1：環境變數不生效
**解決方案**：重新部署專案
```bash
vercel --prod
```

### 問題 2：Stripe 401 錯誤
**解決方案**：檢查 `STRIPE_SECRET_KEY` 是否正確設置

### 問題 3：Firebase 連接失敗
**解決方案**：檢查所有 `NEXT_PUBLIC_FIREBASE_*` 變數是否正確設置

## 📝 注意事項

1. **安全性**：環境變數設置後，程式碼中的硬編碼密鑰會被環境變數覆蓋
2. **重新部署**：每次修改環境變數後都需要重新部署
3. **測試**：建議先在 Preview 環境測試，確認無誤後再部署到 Production

## ✅ 完成檢查清單

- [ ] 所有環境變數已設置
- [ ] 環境變數範圍已正確配置
- [ ] 專案已重新部署
- [ ] Stripe 結帳功能正常
- [ ] Firebase 連接正常
- [ ] 所有頁面正常載入
