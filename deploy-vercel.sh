#!/bin/bash

# 🚀 Vercel 部署腳本
echo "🚀 開始部署到 Vercel..."

# 檢查 Vercel CLI 是否安裝
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安裝，正在安裝..."
    npm install -g vercel
fi

# 檢查是否已登入
if ! vercel whoami &> /dev/null; then
    echo "🔐 請先登入 Vercel..."
    vercel login
fi

# 設定環境變數（如果尚未設定）
echo "📝 檢查環境變數..."
echo "請確保已設定以下環境變數："
echo "- STRIPE_SECRET_KEY"
echo "- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "- NEXT_PUBLIC_FIREBASE_API_KEY"
echo "- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo "- NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
echo "- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
echo "- NEXT_PUBLIC_FIREBASE_APP_ID"

# 部署到預覽環境
echo "🚀 部署到預覽環境..."
vercel

# 詢問是否部署到生產環境
read -p "是否部署到生產環境？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 部署到生產環境..."
    vercel --prod
    echo "✅ 部署完成！"
else
    echo "✅ 預覽部署完成！"
fi

echo "🎉 部署流程完成！"
