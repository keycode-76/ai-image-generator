const functions = require("firebase-functions");
const stripe = require("stripe")
// ("sk_test_51SI7Te2KKjbc3s12RAo0aO6LpMQg2X2q4j308FOtm3Drb9EwtpH6D1Rrg31fHKRRxiBhnOFn9EuLDdP1SaoBwAQY00JhTsEr0N");

exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  // ✅ 手動處理 CORS（這三個 header 必須在所有情況下都加）
  res.set("Access-Control-Allow-Origin", "https://genhorror-60.web.app");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // ✅ 若是預檢請求 (OPTIONS)，立即回傳成功
  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  // ✅ 僅允許 POST 請求
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

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
