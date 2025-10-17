const fs = require('fs');
const path = require('path');

function checkEnvironment() {
  console.log('🔍 檢查環境變數...');
  
  const requiredEnvVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_PROJECT_ID',
    'STRIPE_SECRET_KEY'
  ];

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error('❌ 缺少必要的環境變數:', missing.join(', '));
    console.log('💡 請檢查 .env 檔案是否正確設定');
    console.log('📝 參考 SETUP.md 進行設定');
    process.exit(1);
  }
  
  console.log('✅ 環境變數檢查通過');
  
  // 檢查配置檔案
  const configPath = path.join(__dirname, '../config.js');
  if (!fs.existsSync(configPath)) {
    console.log('⚠️  未找到 config.js 檔案');
    console.log('💡 請複製 config.example.js 為 config.js 並填入實際值');
  } else {
    console.log('✅ 配置檔案存在');
  }
}

checkEnvironment();
