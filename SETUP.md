# 專案設定指南

## 🔧 環境變數設定

### 1. 複製環境變數模板
```bash
# 主要專案
cp config.example.js config.js

# Firebase Functions
cp functions/env.example functions/.env
```

### 2. 填入實際金鑰值
編輯 `config.js` 和 `functions/.env` 檔案，填入您的實際 API 金鑰。

## 🔥 Firebase 設定

### 設定 Functions Config
```bash
firebase functions:config:set stripe.secret="你的_stripe_金鑰"
firebase functions:config:set stripe.webhook_secret="你的_webhook_密鑰"
firebase functions:config:set apis.stability_ai="你的_stability_ai_金鑰"
```

### 部署設定
```bash
# 部署 Functions
firebase deploy --only functions

# 部署 Hosting
firebase deploy --only hosting

# 部署全部
firebase deploy
```

## 🛡️ 安全注意事項

### ✅ 安全做法：
- 使用環境變數
- 將敏感檔案加入 .gitignore
- 定期輪換金鑰
- 使用 GitHub Secrets 進行 CI/CD

### ❌ 不安全做法：
- 將金鑰硬編碼在程式碼中
- 將 .env 檔案提交到 Git
- 在客戶端暴露秘密金鑰

## 📁 檔案結構

```
project01/
├── .gitignore              # Git 忽略檔案
├── config.example.js       # 配置模板
├── functions/
│   ├── .gitignore         # Functions Git 忽略
│   └── env.example        # Functions 環境變數模板
├── SETUP.md               # 本設定指南
└── README.md              # 專案說明
```

## 🚀 快速開始

1. **複製模板檔案**
   ```bash
   cp config.example.js config.js
   cp functions/env.example functions/.env
   ```

2. **填入 API 金鑰**
   - 編輯 `config.js`
   - 編輯 `functions/.env`

3. **安裝依賴**
   ```bash
   npm install
   cd functions && npm install
   ```

4. **啟動開發伺服器**
   ```bash
   npm start
   ```

## 🔍 故障排除

### 常見問題

1. **環境變數未載入**
   - 檢查 `.env` 檔案是否存在
   - 確認檔案路徑正確

2. **Firebase Functions 部署失敗**
   - 檢查 Firebase 登入狀態
   - 確認專案 ID 正確

3. **API 金鑰無效**
   - 檢查金鑰格式
   - 確認金鑰權限設定

## 📞 支援

如有問題，請檢查：
1. 環境變數設定
2. Firebase 配置
3. API 金鑰權限
