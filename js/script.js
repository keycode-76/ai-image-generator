// DOM元素
const promptInput = document.getElementById('prompt');
const styleSelect = document.getElementById('style');
const aspectRatioSelect = document.getElementById('aspect-ratio');
const generateBtn = document.getElementById('generate-btn');
const loadingElement = document.getElementById('loading');
const resultElement = document.getElementById('result');
const resultImage = document.getElementById('result-image');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn'); // 修正：加上 'd'
const regenerateBtn = document.getElementById('regenerate-btn');
const galleryGrid = document.querySelector('.gallery-grid');
const themeButtons = document.querySelectorAll('.theme-btn');
const languageSelect = document.getElementById('language-select');
// document.addEventListener('DOMContentLoaded', () => {
// 認證相關元素
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const userPanelModal = document.getElementById('user-panel-modal');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const logoutBtn = document.getElementById('logout-btn');
const buyCreditsBtn = document.getElementById('buy-credits-btn');
const userNameElement = document.getElementById('user-name');
const remainingCreditsElement = document.getElementById('remaining-credits');

// 語言狀態
let currentLanguage = 'zh';

// 用戶狀態
let currentUser = null;
let isLoggedIn = false;

// 模擬用戶數據庫
const usersDB = {
    users: JSON.parse(localStorage.getItem('users') || '[]'),
    
    addUser(user) {
        this.users.push(user);
        this.saveUsers();
        return user;
    },
    
    findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    },
    
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }
};

// 用戶註冊函數
const registerUser = (name, email, password) => {
    if (usersDB.findUserByEmail(email)) {
        throw new Error('此電子郵件已被註冊');
    }
    
    const user = {
        id: Date.now().toString(),
        name,
        email,
        password,
        credits: 10,
        createdAt: new Date().toISOString()
    };
    
    return usersDB.addUser(user);
};

// 用戶登錄函數
const loginUser = (email, password) => {
    const user = usersDB.findUserByEmail(email);
    
    if (!user) {
        throw new Error('用戶不存在');
    }
    
    if (user.password !== password) {
        throw new Error('密碼錯誤');
    }
    
    return user;
};

// 更新用戶信用點數
const updateUserCredits = (userId, credits) => {
    const userIndex = usersDB.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        usersDB.users[userIndex].credits = credits;
        usersDB.saveUsers();
    }
};

// 增強提示詞函數 - 添加黑暗、機械、像素風格
// const enhancePrompt = (basePrompt, style) => {
//     const styleKeywords = '黑暗風格 機械 賽博朋克 遊戲像素風格 8-bit 復古遊戲 低解析度 像素藝術 霓虹燈 未來主義 黑暗科技';
    
//     const styleEnhancements = {
//         'core': 'dark core pool core backroom',
//         'retro-pixel': 'retro pixel 8-bit game',
//         'cyberpunk': 'cyberpunk futuristic neon',
//         'slasher': '80s horror movie dark slasher style'
//     };
    
//     const selectedStyle = styleEnhancements[style] || '';
//     return `${basePrompt},  ${selectedStyle}, 高質量, 詳細, 藝術作品`;
// };

// 在 DOMContentLoaded 事件中添加測試
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 加載完成，初始化應用...');
    
    // 測試 API 連接
    testAPIConnection();
    
    // 其餘初始化代碼...
});

// 測試 API 連接
async function testAPIConnection() {
    try {
        console.log('測試 API 連接...');
        
        // 測試健康檢查
        const healthResponse = await fetch('/api/health');
        const healthData = await healthResponse.json();
        console.log('健康檢查:', healthData);
        
        // 測試端點
        const testResponse = await fetch('/api/test');
        const testData = await testResponse.json();
        console.log('測試端點:', testData);
        
    } catch (error) {
        console.error('API 測試失敗:', error);
    }
}

// 簡化的生成函數
const generateImages = async (prompt, style, aspectRatio) => {
    console.log('開始生成圖片...', prompt);

    // 顯示加載
    if (loadingElement) {
        loadingElement.classList.remove('hidden');
        loadingElement.innerHTML = '<div class="loading-spinner"></div><p>AI 正在創作中...</p>';
    }
    if (resultElement) resultElement.classList.add('hidden');

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                style: style,
                aspectRatio: aspectRatio
            })
        });

        if (!response.ok) {
            throw new Error('服務器錯誤，請稍後再試');
        }

        const data = await response.json();
        console.log('生成結果:', data);

        // 提取圖片 URLs
        const imageUrls = data.images.map(img => img.image_url);
        
        // 顯示圖片
        displayGeneratedImages(imageUrls, prompt);

        // 隱藏加載，顯示結果
        if (loadingElement) loadingElement.classList.add('hidden');
        if (resultElement) resultElement.classList.remove('hidden');

        return imageUrls;

    } catch (error) {
        console.error('生成錯誤:', error);
        alert('生成失敗: ' + error.message);
        
        if (loadingElement) loadingElement.classList.add('hidden');
        
        // 顯示備用圖片
        displayFallbackImages(prompt);
    }
};
// 顯示備用圖片
const displayFallbackImages = (prompt) => {
    const fallbackImages = [
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#1a1a2e"/><text x="256" y="256" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">黑暗機械風格</text></svg>',
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#16213e"/><text x="256" y="256" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">賽博朋克城市</text></svg>',
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#0f3460"/><text x="256" y="256" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">像素遊戲藝術</text></svg>'
    ];
    
    displayGeneratedImages(fallbackImages, prompt);
    if (resultElement) resultElement.classList.remove('hidden');
};
// 顯示測試圖片（備用方案）
const displayTestImages = (prompt) => {
    console.log('顯示測試圖片');
    
    // 創建 SVG 數據 URL 作為測試圖片
    const createTestSVG = (text, bgColor) => {
        return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
            <rect width="512" height="512" fill="${bgColor}"/>
            <rect x="50" y="50" width="412" height="412" fill="#333" stroke="#666" stroke-width="2"/>
            <text x="256" y="200" font-family="Arial" font-size="24" fill="white" text-anchor="middle">${text}</text>
            <text x="256" y="250" font-family="Arial" font-size="16" fill="#ccc" text-anchor="middle">黑暗機械像素風格</text>
            <text x="256" y="280" font-family="Arial" font-size="14" fill="#999" text-anchor="middle">${prompt}</text>
        </svg>`;
    };
    
    const testImages = [
        createTestSVG('生成圖片 1', '#1a1a2e'),
        createTestSVG('生成圖片 2', '#16213e'),
        createTestSVG('生成圖片 3', '#0f3460')
    ];
    
    displayGeneratedImages(testImages, prompt);
    
    // 顯示結果區域
    if (resultElement) resultElement.classList.remove('hidden');
};
// 使用本地測試圖片
const displayLocalTestImages = (prompt) => {
    const testImages = [
        '/test-image1.jpg',
        '/test-image2.jpg', 
        '/test-image3.jpg'
    ];
    
    // 創建簡單的彩色占位圖
    const colors = ['#333333', '#666666', '#999999'];
    const imageUrls = colors.map((color, index) => {
        return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="${color}"/><text x="256" y="256" font-family="Arial" font-size="24" fill="white" text-anchor="middle">測試圖片 ${index + 1}</text></svg>`;
    });
    
    displayGeneratedImages(imageUrls, prompt);
};

// 顯示生成的圖片網格
const displayGeneratedImages = (imageUrls, prompt) => {
    // 清空現有結果
    resultElement.innerHTML = '';
    
    // 創建圖片網格容器
    const imagesGrid = document.createElement('div');
    imagesGrid.className = 'images-grid';
    
    imageUrls.forEach((imageUrl, index) => {
        if (!imageUrl) return;
        
        // 創建圖片容器
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        
        // 創建圖片元素
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `${prompt} - 圖片 ${index + 1}`;
        img.className = 'generated-image';
        
        // 圖片加載錯誤處理
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/512x512/ff0000/ffffff?text=圖片加載失敗';
        };
        
        // 創建操作按鈕容器
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'image-actions';
        
        // 下載按鈕
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn-secondary download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> 下載';
        downloadBtn.onclick = () => downloadImage(imageUrl, `flux-image-${index + 1}-${Date.now()}.jpg`);
        
        // 分享按鈕
        const shareBtn = document.createElement('button');
        shareBtn.className = 'btn-secondary share-btn';
        shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> 分享';
        shareBtn.onclick = () => shareImage(imageUrl);
        
        actionsContainer.appendChild(downloadBtn);
        actionsContainer.appendChild(shareBtn);
        
        imageContainer.appendChild(img);
        imageContainer.appendChild(actionsContainer);
        imagesGrid.appendChild(imageContainer);
    });
    
    resultElement.appendChild(imagesGrid);
};

// 下載圖片
const downloadImage = async (imageUrl, filename) => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `ai-generated-image-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('下載圖片時出錯:', error);
        alert('下載圖片時出錯，請稍後再試。');
    }
};

// 添加圖片到畫廊
const addToGallery = (imageUrl, prompt) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = prompt;
    img.onerror = function() {
        this.src = 'https://via.placeholder.com/200x200/666666/ffffff?text=圖片失效';
    };
    
    const caption = document.createElement('p');
    caption.textContent = prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt;
    
    galleryItem.appendChild(img);
    galleryItem.appendChild(caption);
    galleryGrid.prepend(galleryItem);
    
    // 保存到本地存儲
    saveGalleryItem(imageUrl, prompt);
};

// 保存畫廊項目到本地存儲
const saveGalleryItem = (imageUrl, prompt) => {
    const galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
    galleryItems.unshift({
        imageUrl,
        prompt,
        createdAt: new Date().toISOString(),
        userId: currentUser ? currentUser.id : null
    });
    
    if (galleryItems.length > 50) {
        galleryItems.pop();
    }
    
    localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
};

// 加載畫廊
const loadGallery = () => {
    const galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
    galleryGrid.innerHTML = '';
    
    galleryItems.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = item.prompt;
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/200x200/666666/ffffff?text=圖片失效';
        };
        
        const caption = document.createElement('p');
        caption.textContent = item.prompt.length > 50 ? item.prompt.substring(0, 50) + '...' : item.prompt;
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(caption);
        galleryGrid.appendChild(galleryItem);
    });
};

// 分享圖片
const shareImage = (imageUrl) => {
    if (navigator.share) {
        navigator.share({
            title: 'AI生成的圖片',
            text: '查看我用AI生成的圖片！',
            url: imageUrl
        })
        .catch(error => {
            console.error('分享時出錯:', error);
        });
    } else {
        navigator.clipboard.writeText(imageUrl)
            .then(() => {
                alert('圖片鏈接已複製到剪貼板！');
            })
            .catch(error => {
                console.error('複製鏈接時出錯:', error);
                alert('複製鏈接時出錯，請手動複製: ' + imageUrl);
            });
    }
};

// 初始化主題
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    });
};

// 初始化語言
const initLanguage = () => {
    const savedLanguage = localStorage.getItem('language') || 'zh';
    currentLanguage = savedLanguage;
    if (languageSelect) {
        languageSelect.value = savedLanguage;
    }
    
    // 簡單的語言切換示例
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            const selectedLanguage = e.target.value;
            currentLanguage = selectedLanguage;
            localStorage.setItem('language', selectedLanguage);
            alert(`語言已切換到: ${selectedLanguage === 'zh' ? '中文' : '英文'}`);
        });
    }
};

// 更新已登入用戶的 UI
const updateUIForLoggedInUser = () => {
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons && currentUser) {
        // 移除現有用戶按鈕
        const existingUserBtn = document.getElementById('user-btn');
        if (existingUserBtn) {
            existingUserBtn.remove();
        }
        
        // 添加用戶按鈕
        const userBtn = document.createElement('button');
        userBtn.id = 'user-btn';
        userBtn.className = 'btn-primary';
        userBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        authButtons.appendChild(userBtn);
        
        userBtn.addEventListener('click', () => {
            if (userNameElement) userNameElement.textContent = currentUser.name;
            if (remainingCreditsElement) remainingCreditsElement.textContent = currentUser.credits;
            if (userPanelModal) userPanelModal.style.display = 'block';
        });
    }
};

// 更新已登出用戶的 UI
const updateUIForLoggedOutUser = () => {
    const userBtn = document.getElementById('user-btn');
    if (userBtn) {
        userBtn.remove();
    }
    
    if (loginBtn) {
        loginBtn.style.display = 'inline-block';
    }
    if (signupBtn) signupBtn.style.display = 'inline-block';
};

// DOM 加載完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 加載完成，開始初始化...');
    
    // 初始化主題
    initTheme();
    
    // 初始化語言
    initLanguage();
    
    // 測試 API 連接
    testAPIConnection();
    
    // 檢查用戶登錄狀態
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        updateUIForLoggedInUser();
    }
    
    // 生成按鈕事件監聽器
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const prompt = promptInput ? promptInput.value.trim() : '';
            if (!prompt) {
                alert('請輸入圖像描述');
                return;
            }
            
            const style = styleSelect ? styleSelect.value : 'core';
            const aspectRatio = aspectRatioSelect ? aspectRatioSelect.value : '1:1';
            
            console.log('開始生成圖片:', { prompt, style, aspectRatio });
            await generateImages(prompt, style, aspectRatio);
        });
    }
    
    // 登入按鈕事件監聽器
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'block';
        });
    }
    
    // 註冊按鈕事件監聽器
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            if (signupModal) signupModal.style.display = 'block';
        });
    }
    
    // 關閉模態框事件監聽器
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'none';
            if (signupModal) signupModal.style.display = 'none';
            if (userPanelModal) userPanelModal.style.display = 'none';
        });
    });
    
    console.log('初始化完成！');
});

