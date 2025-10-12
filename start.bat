@echo off
echo 正在啟動 FLUX AI 圖片生成器...
echo.

REM 檢查 Node.js 是否已安裝
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 錯誤：未檢測到 Node.js，請先安裝 Node.js
    echo 下載地址：https://nodejs.org/
    pause
    exit /b 1
)

REM 檢查是否已安裝依賴
if not exist "node_modules" (
    echo 正在安裝依賴包...
    npm install
    if %errorlevel% neq 0 (
        echo 錯誤：依賴安裝失敗
        pause
        exit /b 1
    )
)

REM 創建 .env 文件（如果不存在）
if not exist ".env" (
    echo 正在創建環境配置文件...
    echo # FLUX API 配置 > .env
    echo FLUX_API_KEY=08c13698a5934153b239962cca42f86b >> .env
    echo. >> .env
    echo # 服務器配置 >> .env
    echo PORT=3000 >> .env
    echo NODE_ENV=development >> .env
)

echo 啟動服務器...
echo 服務器將在 http://localhost:3000 運行
echo 按 Ctrl+C 停止服務器
echo.

npm start
