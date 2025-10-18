const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());
// 告訴 Express，靜態資源都在 public 裡
app.use(express.static(path.join(__dirname, "public")));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// 主頁面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 超簡單的圖片生成 API - 使用 Pollinations.ai
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, style } = req.body;
        
        console.log('收到生成請求:', prompt);
        
        if (!prompt) {
            return res.status(400).json({ error: '請輸入提示詞' });
        }

        // 增強提示詞
        let enhancedPrompt = prompt;
        if (style === 'retro-pixel') {
            enhancedPrompt = `${prompt}, 8-bit pixel art, retro game style, dark mechanical`;
        } else if (style === 'cyberpunk') {
            enhancedPrompt = `${prompt}, cyberpunk, neon lights, futuristic city, dark mechanical`;
        } else if (style === 'slasher') {
            enhancedPrompt = `${prompt}, horror style, dark, scary, mechanical`;
        } else {
            enhancedPrompt = `${prompt}, dark mechanical, cyberpunk, pixel art, 8-bit style`;
        }

        // 編碼提示詞
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        
        // 🔧 圖片生成數量配置 - 與前端和後端保持一致
        const IMAGES_TO_GENERATE = 1; // 設置要生成的圖片數量 (1-4 張)
        
        // 根據配置生成指定數量的圖片
        const imageUrls = [];
        for (let i = 1; i <= IMAGES_TO_GENERATE; i++) {
            imageUrls.push(
                `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${i}`
            );
        }

        console.log(`生成成功: ${imageUrls.length} 張圖片`);

        res.json({
            success: true,
            images: imageUrls.map(url => ({ image_url: url })),
            prompt: enhancedPrompt
        });

    } catch (error) {
        console.error('生成錯誤:', error);
        res.status(500).json({ 
            success: false,
            error: '生成失敗，請稍後再試'
        });
    }
});

// 健康檢查
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: '免費 AI 圖片生成器',
        provider: 'Pollinations.ai',
        message: '服務正常運行中 🚀'
    });
});

// 處理所有其他路由（用於前端路由）
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🎉 免費 AI 圖片生成器運行中！`);
    console.log(`📍 本地訪問: http://localhost:${PORT}`);
    console.log(`🆓 使用 Pollinations.ai - 完全免費無限生成！`);
});