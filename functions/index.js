/**
 * 🔧 Firebase Functions 主檔案
 * 功能：
 * 1️⃣ Stripe 結帳（createCheckoutSession）
 * 2️⃣ Stripe Webhook（自動啟用 Premium）
 * 3️⃣ 免費/付費用戶分流生圖（generateImage）
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret); // ✅ 使用安全環境變數
const axios = require("axios");

admin.initializeApp();


// =====================================================
// 🧩 Stripe 結帳功能
// =====================================================
exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "https://genhorror-60.web.app");
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
              description: "升級為 Premium 會員，享受更多功能"
            },
            unit_amount: 500, // $5 美元
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
// 🧾 Stripe Webhook（自動啟用 Premium）
// =====================================================
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = functions.config().stripe.webhook_secret; // ✅ 設於環境變數中

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ 當付款完成事件觸發
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const clientReferenceId = session.client_reference_id; // 前端建立 session 時可以傳用戶 UID

    if (clientReferenceId) {
      try {
        await admin.firestore().collection("users").doc(clientReferenceId).update({
          isPremium: true,
        });
        console.log(`✅ 用戶 ${clientReferenceId} 已升級為 Premium`);
      } catch (err) {
        console.error("❌ 更新用戶 Premium 狀態失敗:", err);
      }
    }
  }

  res.json({ received: true });
});


// =====================================================
// 🎨 免費 / 付費生圖功能
// =====================================================
async function generateWithPollinations(prompt, style) {
  console.log("🐛 使用免費 API 生成圖片...");
  const enhancedPrompt = enhancePrompt(prompt, style);
  const encodedPrompt = encodeURIComponent(enhancedPrompt);

  const imageUrls = [
    `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=1`,
    `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=2`,
    `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=3`
  ];

  return imageUrls;
}

async function generateWithStableDiffusion(prompt, style) {
  console.log("🚀 使用付費 API 生成圖片...");
  const STABLE_API_KEY = functions.config().stable.key; // ✅ 使用安全環境變數
  const STABLE_API_URL = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

  const enhancedPrompt = `${prompt}, ${getStylePrompt(style)}, high quality, detailed`;

  const response = await axios.post(
    STABLE_API_URL,
    {
      text_prompts: [{ text: enhancedPrompt }],
      cfg_scale: 7,
      height: 512,
      width: 512,
      samples: 3,
      steps: 30,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${STABLE_API_KEY}`
      }
    }
  );

  const imageUrls = response.data.artifacts.map(artifact =>
    `data:image/png;base64,${artifact.base64}`
  );
  return imageUrls;
}


// =====================================================
// 🧠 提示詞風格輔助函式
// =====================================================
function enhancePrompt(prompt, style) {
  const styleMap = {
    core: "dark core, pool core, backroom, plastiboo",
    "retro-pixel": "retro pixel, 8-bit game, Yames, dungeon crawler",
    cyberpunk: "cyberpunk, blade runner, futuristic, neon lights",
    slasher: "80s horror movie, slasher, dark, scary",
  };
  return `${prompt}, ${styleMap[style] || "dark mechanical"}, high quality, detailed`;
}

function getStylePrompt(style) {
  const styleMap = {
    core: "dark core, pool core, backroom, plastiboo",
    "retro-pixel": "retro pixel, 8-bit game, Yames, dungeon crawler",
    cyberpunk: "cyberpunk, blade runner, futuristic, neon lights",
    slasher: "80s horror movie, slasher, dark, scary",
  };
  return styleMap[style] || "dark mechanical";
}


// =====================================================
// ☁️ 雲端函數 - 圖片生成主入口
// =====================================================
exports.generateImage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "請先登入哦！");
  }

  const { prompt, style } = data;
  const userId = context.auth.uid;

  if (!prompt) {
    throw new functions.https.HttpsError("invalid-argument", "要告訴我你想畫什麼呀！");
  }

  try {
    console.log(`👤 用戶 ${userId} 要生成圖片: ${prompt}`);

    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    const userData = userDoc.data();

    let imageUrls;
    let apiUsed = "pollinations"; // 預設免費

    if (userData && userData.isPremium === true) {
      console.log("🎉 這是付費用戶，用 Stable Diffusion");
      imageUrls = await generateWithStableDiffusion(prompt, style);
      apiUsed = "stable-diffusion";
    } else {
      console.log("🆓 這是免費用戶，用 Pollinations");
      imageUrls = await generateWithPollinations(prompt, style);
    }

    // 若失敗則回傳備用圖
    if (!imageUrls || imageUrls.length === 0) {
      imageUrls = [
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#1a1a2e"/><text x="256" y="256" font-family="Arial" font-size="16" fill="white" text-anchor="middle">圖片生成中...</text></svg>'
      ];
    }

    // 儲存記錄（建議巢狀）
    await admin.firestore()
      .collection("users")
      .doc(userId)
      .collection("generations")
      .add({
        prompt,
        style: style || "core",
        images: imageUrls,
        apiUsed,
        userType: userData && userData.isPremium ? "premium" : "free",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    console.log("✅ 圖片生成完成！");
    return {
      success: true,
      images: imageUrls,
      userType: userData && userData.isPremium ? "premium" : "free"
    };

  } catch (error) {
    console.error("❌ 生成失敗:", error);
    throw new functions.https.HttpsError("internal", "生成失敗了: " + error.message);
  }
});
