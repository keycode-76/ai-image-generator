@echo off
REM 批量設置 Vercel 環境變數

echo 設置 Firebase 環境變數...

vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
echo AIzaSyAO9j3fqIuuwwf2znCBba1af7SW6Be7Tn4

vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
echo genfeer-ai.firebaseapp.com

vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
echo genfeer-ai

vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
echo genfeer-ai.firebasestorage.app

vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
echo 788596046031

vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
echo 1:788596046031:web:ff880f82c1d1d727bddfba

echo.
echo 請手動設置 Stripe 環境變數：
echo STRIPE_SECRET_KEY=您的Stripe密鑰
echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=您的Stripe公鑰
echo.
echo 完成後請重新部署：vercel --prod
pause
