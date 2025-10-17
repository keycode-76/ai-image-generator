/**
 * 🔧 Firebase Functions 主檔案（最終版）
 */
console.log("index.js!")
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

// 🔧 直接使用環境變數和備用方案
let stripeSecret;

try {
  // 嘗試讀取 runtimeconfig.json（本地開發）
  const localConfig = require('./.runtimeconfig.json');
  if (localConfig.stripe && localConfig.stripe.secret) {
    stripeSecret = localConfig.stripe.secret;
    console.log("✅ 使用本地 runtimeconfig.json 中的 Stripe 金鑰");
  }
} catch (error) {
  // 如果讀取失敗，使用環境變數或備用金鑰
  stripeSecret = process.env.STRIPE_SECRET_KEY || "sk_test_51SI7Te2KKjbc3s12RAo0aO6LpMQg2X2q4j308FOtm3Drb9EwtpH6D1Rrg31fHKRRxiBhnOFn9EuLDdP1SaoBwAQY00JhTsEr0N";
  console.log("✅ 使用環境變數/備用 Stripe 金鑰");
}

const stripe = require("stripe")(stripeSecret);
const axios = require("axios");

admin.initializeApp();

// =====================================================
// 🧩 Stripe 結帳功能
// =====================================================
exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  // 設置 CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    console.log("Creating checkout session...");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Plan",
              description: "升級為 Premium 會員，享受更多功能",
            },
            unit_amount: 500, // $5 USD
          },
          quantity: 1,
        },
      ],
      success_url: "https://genhorror-60.web.app/success.html",
      cancel_url: "https://genhorror-60.web.app/cancel.html",
    });

    console.log("Checkout session created:", session.id);
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

// =====================================================
// 🧩 Stripe 結帳功能 V2 (Callable)
// =====================================================
exports.createCheckoutSessionV2 = functions.https.onCall(async (data, context) => {
  try {
    console.log("Creating checkout session with data:", data);

    // 獲取方案類型和價格數據
    const planType = data.planType || 'basic';
    const priceData = data.priceData || {
      name: 'GenHorror.ai 基本方案',
      description: '每月 NT$99，適合個人創作者',
      unit_amount: 9900,
      currency: 'twd'
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: priceData.currency || "twd",
            product_data: {
              name: priceData.name,
              description: priceData.description,
            },
            unit_amount: priceData.unit_amount,
          },
          quantity: 1,
        },
      ],
      success_url: `https://genhorror-60.web.app/success.html?plan=${planType}`,
      cancel_url: "https://genhorror-60.web.app/pricing.html",
      metadata: {
        planType: planType,
        userId: context.auth ? context.auth.uid : null
      }
    });

    console.log("Checkout session created:", session.id);
    return { url: session.url };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new functions.https.HttpsError('internal', 'Failed to create checkout session', error.message);
  }
});

// =====================================================
// 🎨 免費生圖功能
// =====================================================

// 🔧 圖片生成數量配置 - 只需修改這個變數
const IMAGES_TO_GENERATE = 1; // 設置要生成的圖片數量 (1-4 張)

async function generateWithPollinations(prompt, style) {
  console.log(`使用免費 API 生成 ${IMAGES_TO_GENERATE} 張圖片...`);
  
  // 🔧 風格配置已移至前端統一管理，後端直接使用前端處理好的提示詞
  // 前端會進行風格增強，後端只需要添加基本的質量標籤
  const enhancedPrompt = `${prompt}, high quality, detailed`;
  const encodedPrompt = encodeURIComponent(enhancedPrompt);
  
  // 🔧 添加 5 秒延遲
  await new Promise(resolve => setTimeout(resolve, 5000));

  // 🔧 根據配置生成指定數量的圖片
  const imageUrls = [];
  for (let i = 1; i <= IMAGES_TO_GENERATE; i++) {
    imageUrls.push(
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${i}&nologo=true`
    );
  }
  
  return imageUrls;
}

// =====================================================
// ☁️ 雲端函數 - 圖片生成（允許未驗證調用）
// =====================================================
exports.generateImage = functions.https.onCall(async (data, context) => {
    // 允許未登入用戶使用
    console.log('generateImage 函數被調用，context.auth:', context.auth ? '已驗證' : '未驗證');
    
    const { prompt, style } = data.data;
    
    // 🔧 基本調試信息
    console.log('接收到的 prompt:', prompt);
    console.log('接收到的 style:', style);
    
    // 使用 IP 或其他方式識別用戶（可選）
    const userId = context.auth ? context.auth.uid : `anonymous_${Date.now()}`;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      console.log('❌ 無效的提示詞:', prompt);
      throw new functions.https.HttpsError("invalid-argument", "請輸入有效的提示詞！");
    }

    try {
      console.log(`用戶 ${userId} 要生成圖片: "${prompt}", 風格: ${style}`);

      const imageUrls = await generateWithPollinations(prompt.trim(), style);

      if (!imageUrls || imageUrls.length === 0) {
        console.error('圖片生成失敗：返回空結果');
        throw new Error("無法生成圖片");
      }

      console.log(`生成成功，返回 ${imageUrls.length} 張圖片`);

      // 只有登入用戶才保存到 Firestore
      if (context.auth) {
        try {
          await admin.firestore().collection("users").doc(userId).collection("generations").add({
            prompt: prompt.trim(),
            style: style || "core",
            images: imageUrls,
            apiUsed: "pollinations",
            userType: "free",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log('記錄已保存到 Firestore');
        } catch (firestoreError) {
          console.error('保存到 Firestore 失敗:', firestoreError);
          // 不影響主要功能，繼續執行
        }
      }

      console.log("✅ 圖片生成完成！");
      return {
        success: true,
        images: imageUrls,
        userType: context.auth ? "authenticated" : "anonymous",
        prompt: prompt.trim(),
        style: style || "core"
      };
    } catch (error) {
      console.error("❌ 生成失敗:", error);
      console.error("錯誤詳情:", error.message, error.stack);
      throw new functions.https.HttpsError("internal", "生成失敗: " + error.message);
    }
  });

console.log("🔥 Firebase Functions 載入成功！");