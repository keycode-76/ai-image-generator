#!/bin/bash
echo "🚀 開始部署..."

# 檢查環境變數是否存在
if [ ! -f "config.js" ]; then
    echo "❌ 錯誤: 請先建立 config.js 檔案"
    echo "💡 提示: 執行 npm run setup 來複製模板檔案"
    exit 1
fi

# 檢查 Firebase 登入狀態
if ! firebase projects:list > /dev/null 2>&1; then
    echo "❌ 錯誤: 請先登入 Firebase"
    echo "💡 提示: 執行 firebase login"
    exit 1
fi

# 部署 Firebase Functions
echo "📦 部署 Firebase Functions..."
firebase deploy --only functions

# 部署 Firebase Hosting
echo "🌐 部署網站..."
firebase deploy --only hosting

echo "✅ 部署完成！"
