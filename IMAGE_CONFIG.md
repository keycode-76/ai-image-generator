# 🖼️ 圖片生成數量配置說明

## 📍 配置位置

要調整圖片生成數量，只需修改以下三個文件中的 `IMAGES_TO_GENERATE` 變數：

### 1. Firebase Functions 後端
**文件位置：** `functions/index.js`
```javascript
// 🔧 圖片生成數量配置 - 只需修改這個變數
const IMAGES_TO_GENERATE = 1; // 設置要生成的圖片數量 (1-4 張)
```

### 2. 前端備用方案
**文件位置：** `public/js/script.js`
```javascript
// 🔧 圖片生成數量配置 - 與後端保持一致
const IMAGES_TO_GENERATE = 1; // 設置要生成的圖片數量 (1-4 張)
```

### 3. 本地服務器
**文件位置：** `server.js`
```javascript
// 🔧 圖片生成數量配置 - 與前端和後端保持一致
const IMAGES_TO_GENERATE = 1; // 設置要生成的圖片數量 (1-4 張)
```

## 🔧 如何修改

1. **決定要生成的圖片數量**（建議 1-4 張）
2. **同時修改三個文件**中的 `IMAGES_TO_GENERATE` 變數
3. **確保三個文件中的數值相同**

## 📊 推薦設置

- **1 張圖片**：快速生成，適合測試
- **2 張圖片**：平衡速度與選擇（當前設置）
- **3 張圖片**：更多選擇，稍慢
- **4 張圖片**：最多選擇，較慢

## ⚠️ 注意事項

1. **必須同時修改三個文件**，否則會出現不一致
2. **數量越多，生成時間越長**
3. **Pollinations API 可能有限制**，建議不超過 4 張
4. **修改後需要重新部署 Firebase Functions**

## 🚀 部署步驟

修改後需要重新部署：
```bash
firebase deploy --only functions
firebase deploy --only hosting
```

---
*最後更新：2025-01-16*
