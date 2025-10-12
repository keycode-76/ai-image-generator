// 直接測試 FLUX API
const fetch = require('node-fetch');

async function testFluxDirect() {
    try {
        console.log('直接測試 FLUX API...');
        
        const options = {
            method: "POST",
            headers: {
                "authorization": "Bearer 08c13698a5934153b239962cca42f86b",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "model": "flux-dev",
                "action": "generate",
                "prompt": "a white siamese cat",
                "count": 1
            })
        };

        console.log('請求參數:', options.body);
        
        const response = await fetch("https://api.acedata.cloud/flux/images", options);
        
        console.log('響應狀態:', response.status);
        console.log('響應頭:', response.headers.raw());
        
        if (response.ok) {
            const data = await response.json();
            console.log('成功響應:', JSON.stringify(data, null, 2));
        } else {
            const errorText = await response.text();
            console.log('錯誤響應:', errorText);
        }
        
    } catch (error) {
        console.error('測試失敗:', error.message);
    }
}

testFluxDirect();
