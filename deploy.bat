@echo off
echo 🚀 開始部署...

REM 檢查環境變數是否存在
if not exist "config.js" (
    echo ❌ 錯誤: 請先建立 config.js 檔案
    echo 💡 提示: 執行 npm run setup 來複製模板檔案
    pause
    exit /b 1
)

REM 檢查 Firebase 登入狀態
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo ❌ 錯誤: 請先登入 Firebase
    echo 💡 提示: 執行 firebase login
    pause
    exit /b 1
)

REM 部署 Firebase Functions
echo 📦 部署 Firebase Functions...
firebase deploy --only functions

REM 部署 Firebase Hosting
echo 🌐 部署網站...
firebase deploy --only hosting

echo ✅ 部署完成！
pause
