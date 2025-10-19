/**
 * 🔧 Vercel API Route - 檢查結帳會話
 * 替代 Firebase Functions 的 getCheckoutSession
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // 設置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      // 支付成功，返回會話信息
      res.status(200).json({
        success: true,
        session: {
          id: session.id,
          payment_status: session.payment_status,
          customer_email: session.customer_details?.email,
          metadata: session.metadata,
        }
      });
    } else {
      // 支付未完成
      res.status(200).json({
        success: false,
        session: {
          id: session.id,
          payment_status: session.payment_status,
        }
      });
    }

  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve checkout session',
      details: error.message 
    });
  }
}
