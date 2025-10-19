/**
 * 🔧 Vercel API Route - Stripe 結帳功能
 * 替代 Firebase Functions 的 createCheckoutSession
 */
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
  // 設置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('Creating checkout session...');
    console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not Set');
    console.log('Request body:', req.body);

    // 檢查 Stripe 密鑰是否存在
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe Secret Key not configured');
      return res.status(500).json({ 
        error: 'Stripe Secret Key not configured',
        details: 'Please set STRIPE_SECRET_KEY environment variable'
      });
    }

    const { plan } = req.body;

    // 根據方案設定價格
    let price, description;
    if (plan === 'basic') {
      price = 9.99;
      description = 'GenFeer.ai 基本方案';
    } else if (plan === 'advanced') {
      price = 19.99;
      description = 'GenFeer.ai 進階方案';
    } else {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description,
            },
            unit_amount: Math.round(price * 100), // 轉換為分
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: {
        plan: plan,
      },
    });

    console.log('Checkout session created:', session.id);
    res.status(200).json({ sessionId: session.id });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}
