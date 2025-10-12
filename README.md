# FLUX AI 圖片生成器

一個使用 FLUX.1 dev API 的現代化 AI 圖片生成網站，支持多種風格和並行生成。

## 功能特色

- 🎨 **多種風格**：Core Style、Retro Pixel、Cyberpunk、80's Slasher
- 🖼️ **並行生成**：一次生成3張圖片
- 🌍 **多語言支持**：中文、英文、西班牙文、德文、日文
- 🎯 **智能提示詞增強**：根據選擇的風格自動優化提示詞
- 📱 **響應式設計**：完美適配桌面和移動設備
- 🌙 **黑色極簡風格**：現代化的用戶界面
- 💾 **本地存儲**：記住用戶偏好和生成的圖片

## 技術棧

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **後端**：Node.js, Express
- **API**：FLUX.1 dev
- **構建工具**：Vite

## 快速開始

### 方法一：使用啟動腳本

**Windows 用戶：**
```bash
start.bat
.\start.bat
```

**Linux/Mac 用戶：**
```bash
./start.sh
```

### 方法二：手動啟動

1. **安裝依賴**
```bash
npm install
```

2. **配置環境變量**
創建 `.env` 文件：
```env
FLUX_API_KEY=08c13698a5934153b239962cca42f86b
PORT=3000
NODE_ENV=development
```

3. **啟動服務器**
```bash
npm start
```

4. **訪問網站**
打開瀏覽器訪問：http://localhost:3000

## 風格說明

### Core Style
- 關鍵詞：Pool core, backroom, Plastiboo
- 適合：現代藝術、抽象風格

### Retro Pixel
- 關鍵詞：PC-98 game, Yames, dungeon crawler
- 適合：復古遊戲、像素藝術

### Cyberpunk
- 關鍵詞：Blade runner, Ariel Perez, robot
- 適合：科幻、未來主義

### 80's Slasher
- 關鍵詞：80's horror movie, slasher movie, mask killer
- 適合：恐怖、驚悚風格

## API 端點

- `POST /api/flux/generate` - 生成圖片
- `GET /api/health` - 健康檢查

## 開發模式

```bash
npm run dev
```

## 構建生產版本

```bash
npm run build
```

## 項目結構

```
project01/
├── server.js          # Express 服務器
├── package.json       # 項目配置
├── index.html         # 主頁面
├── css/
│   └── style.css      # 樣式文件
├── js/
│   ├── script.js      # 主要邏輯
│   └── translations.js # 多語言翻譯
├── start.bat          # Windows 啟動腳本
├── start.sh           # Linux/Mac 啟動腳本
└── README.md          # 說明文檔
```

## 注意事項

1. 確保已安裝 Node.js (版本 14 或更高)
2. API Key 已預配置，可直接使用
3. 首次運行會自動安裝依賴包
4. 生成的圖片會保存在本地畫廊中

## 故障排除

### 常見問題

1. **服務器無法啟動**
   - 檢查 Node.js 是否已安裝
   - 確認端口 3000 未被占用

2. **圖片生成失敗**
   - 檢查網絡連接
   - 確認 API Key 有效

3. **依賴安裝失敗**
   - 嘗試清除 npm 緩存：`npm cache clean --force`
   - 刪除 node_modules 文件夾重新安裝

## 授權

MIT License

## 更新日誌

### v1.0.0
- 初始版本發布
- 支持 FLUX.1 dev API
- 實現多風格並行生成
- 添加多語言支持
- 優化為黑色極簡風格
