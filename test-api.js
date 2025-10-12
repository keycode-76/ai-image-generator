// 測試 API 的簡單腳本
const fetch = require('node-fetch');

async function testAPI() {
    try {
        console.log('測試 FLUX API...');
        
        const response = await fetch('http://localhost:3000/api/flux/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: '一隻可愛的貓',
                style: 'cyberpunk',
                aspectRatio: '1:1'
            })
        });
        
        console.log('響應狀態:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('成功響應:', data);
        } else {
            const errorText = await response.text();
            console.log('錯誤響應:', errorText);
        }
        
    } catch (error) {
        console.error('測試失敗:', error.message);
    }
}

testAPI();
