#!/bin/bash

echo "正在啟動 FLUX AI 圖片生成器..."
echo

# 檢查 Node.js 是否已安裝
if ! command -v node &> /dev/null; then
    echo "錯誤：未檢測到 Node.js，請先安裝 Node.js"
    echo "下載地址：https://nodejs.org/"
    exit 1
fi

# 檢查是否已安裝依賴
if [ ! -d "node_modules" ]; then
    echo "正在安裝依賴包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "錯誤：依賴安裝失敗"
        exit 1
    fi
fi

# 創建 .env 文件（如果不存在）
if [ ! -f ".env" ]; then
    echo "正在創建環境配置文件..."
    cat > .env << EOF
# FLUX API 配置
FLUX_API_KEY=08c13698a5934153b239962cca42f86b

# 服務器配置
PORT=3000
NODE_ENV=development
EOF
fi

echo "啟動服務器..."
echo "服務器將在 http://localhost:3000 運行"
echo "按 Ctrl+C 停止服務器"
echo

npm start
