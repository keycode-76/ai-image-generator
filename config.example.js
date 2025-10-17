// 配置文件模板 - 複製為 config.js 並填入實際值
const config = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || "your_api_key",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your_project.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "your_project_id",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your_project.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef"
  },
  
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY || "pk_test_...",
    secretKey: process.env.STRIPE_SECRET_KEY || "sk_test_...",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "whsec_..."
  },
  
  apis: {
    stabilityAI: process.env.STABILITY_AI_KEY || "sk_...",
    pollinations: process.env.POLLINATIONS_API_KEY || "your_key",
    flux: process.env.FLUX_API_KEY || "your_flux_key"
  },
  
  app: {
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000
  }
};

module.exports = config;
