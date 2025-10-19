@echo off
REM 🚀 Vercel 部署腳本 (Windows)

echo 🚀 開始部署到 Vercel...

REM 檢查 Vercel CLI 是否安裝
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI 未安裝，正在安裝...
    npm install -g vercel
)

REM 檢查是否已登入
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 請先登入 Vercel...
    vercel login
)

REM 設定環境變數提示
echo 📝 檢查環境變數...
echo 請確保已設定以下環境變數：
echo - STRIPE_SECRET_KEY
echo - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
echo - NEXT_PUBLIC_FIREBASE_API_KEY
echo - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
echo - NEXT_PUBLIC_FIREBASE_PROJECT_ID
echo - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
echo - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
echo - NEXT_PUBLIC_FIREBASE_APP_ID

REM 部署到預覽環境
echo 🚀 部署到預覽環境...
vercel

REM 詢問是否部署到生產環境
set /p deploy_prod="是否部署到生產環境？(y/N): "
if /i "%deploy_prod%"=="y" (
    echo 🚀 部署到生產環境...
    vercel --prod
    echo ✅ 部署完成！
) else (
    echo ✅ 預覽部署完成！
)

echo 🎉 部署流程完成！
pause
