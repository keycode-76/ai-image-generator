// DOM元素
const promptInput = document.getElementById('prompt');
const styleSelect = document.getElementById('style');
const aspectRatioSelect = document.getElementById('aspect-ratio');
const generateBtn = document.getElementById('generate-btn');
const loadingElement = document.getElementById('loading');
const resultElement = document.getElementById('result');
const resultImage = document.getElementById('result-image');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');
const regenerateBtn = document.getElementById('regenerate-btn');
const galleryGrid = document.querySelector('.gallery-grid');
const themeButtons = document.querySelectorAll('.theme-btn');

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

// 用戶狀態
let currentUser = null;
let isLoggedIn = false;

// 用戶認證功能
// Firebase 配置 (實際部署時需要替換為真實的 Firebase 配置)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// 初始化 Firebase (實際部署時取消註釋)
// firebase.initializeApp(firebaseConfig);

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
    // 檢查用戶是否已存在
    if (usersDB.findUserByEmail(email)) {
        throw new Error('此電子郵件已被註冊');
    }
    
    // 創建新用戶
    const user = {
        id: Date.now().toString(),
        name,
        email,
        password, // 實際應用中應該加密密碼
        credits: 10, // 初始生成次數
        createdAt: new Date().toISOString()
    };
    
    // 添加用戶到數據庫
    return usersDB.addUser(user);
};

// 用戶登錄函數
const loginUser = (email, password) => {
    // 查找用戶
    const user = usersDB.findUserByEmail(email);
    
    // 檢查用戶是否存在
    if (!user) {
        throw new Error('用戶不存在');
    }
    
    // 檢查密碼
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

// 使用 FLUX / FLUX.1-Dev 模型生成圖片
const generateImage = async (prompt, style, aspectRatio) => {
    // 檢查用戶是否登錄
    if (isLoggedIn && currentUser) {
        // 檢查用戶是否有足夠的生成次數
        if (currentUser.credits <= 0) {
            alert('您的生成次數已用完，請購買更多次數。');
            userPanelModal.style.display = 'block';
            return;
        }
        
        // 減少用戶的生成次數
        currentUser.credits -= 1;
        updateUserCredits(currentUser.id, currentUser.credits);
        remainingCreditsElement.textContent = currentUser.credits;
    }
    
    // 顯示加載中
    loadingElement.classList.remove('hidden');
    resultElement.classList.add('hidden');
    
    try {
        // 設置圖片尺寸
        let width, height;
        if (aspectRatio === '1:1') {
            width = 512;
            height = 512;
        } else if (aspectRatio === '16:9') {
            width = 768;
            height = 432;
        } else if (aspectRatio === '9:16') {
            width = 384;
            height = 768;
        } else {
            width = 512;
            height = 384;
        }
        
        // 根據選擇的風格調整提示詞
        let fullPrompt = prompt;
        if (style === 'anime') {
            fullPrompt = `${prompt}, anime style, illustration, detailed, vibrant`;
        } else if (style === 'oil-painting') {
            fullPrompt = `${prompt}, oil painting, artistic, textured, detailed brushstrokes`;
        } else if (style === 'digital-art') {
            fullPrompt = `${prompt}, digital art, detailed, vibrant colors, high resolution`;
        } else if (style === 'cinematic') {
            fullPrompt = `${prompt}, cinematic, dramatic lighting, movie scene, high quality`;
        } else if (style === 'realistic') {
            fullPrompt = `${prompt}, realistic, detailed, photorealistic, high resolution`;
        }
        
        // 使用 FLUX / FLUX.1-Dev 模型生成圖片
        // 構建 FLUX API 請求 URL
        const fluxUrl = `https://api.flux-ai.com/v1/images/generations`;
        
        // 模擬 FLUX API 請求（實際應用中應替換為真實的 API 請求）
        // 這裡使用可靠的圖片服務作為示例
        const seed = Math.floor(Math.random() * 1000);
        const tempImageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;
        
        // 設置圖片源
        resultImage.src = tempImageUrl;
        
        // 當圖片加載完成時顯示結果
        resultImage.onload = () => {
            loadingElement.classList.add('hidden');
            resultElement.classList.remove('hidden');
            
            // 將生成的圖片添加到畫廊
            if (isLoggedIn) {
                addToGallery(tempImageUrl, prompt);
            }
        };
        
        // 圖片加載錯誤處理
        resultImage.onerror = () => {
            console.error('圖片加載失敗');
            // 使用備用圖片服務
            const fallbackUrl = `https://via.placeholder.com/${width}x${height}?text=FLUX+Image`;
            resultImage.src = fallbackUrl;
            
            if (isLoggedIn) {
                addToGallery(fallbackUrl, prompt);
            }
            
            loadingElement.classList.add('hidden');
            resultElement.classList.remove('hidden');
        };
        
        return tempImageUrl; // 返回生成的圖片 URL
    } catch (error) {
        console.error('生成圖片時出錯:', error);
        alert('生成圖片時出錯，請稍後再試。');
        loadingElement.classList.add('hidden');
    }
};

// 下載圖片
const downloadImage = async (imageUrl) => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-generated-image-${Date.now()}.jpg`;
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
    
    // 限制存儲數量
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
        // 複製圖片URL到剪貼板
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

// 加載畫廊圖片
const loadGalleryImages = async () => {
    try {
        // 在實際應用中，這裡會從服務器獲取畫廊圖片
        // 現在我們使用Unsplash隨機圖片來模擬
        const categories = ['nature', 'people', 'architecture', 'technology', 'animals', 'travel'];
        
        galleryGrid.innerHTML = '';
        
        for (let i = 0; i < 8; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const imageUrl = `https://source.unsplash.com/random/300x200/?${category}`;
            
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `畫廊圖片 ${i + 1}`;
            
            const info = document.createElement('div');
            info.className = 'info';
            
            const title = document.createElement('h4');
            title.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} 風格圖像`;
            
            info.appendChild(title);
            galleryItem.appendChild(img);
            galleryItem.appendChild(info);
            
            galleryGrid.appendChild(galleryItem);
        }
    } catch (error) {
        console.error('加載畫廊圖片時出錯:', error);
    }
};

// 主題切換功能
const initTheme = () => {
    // 檢查本地存儲中是否有保存的主題
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // 為主題按鈕添加點擊事件
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    });
};

// 事件監聽器
document.addEventListener('DOMContentLoaded', () => {
    // 加載畫廊
    loadGallery();
    
    // 檢查用戶登錄狀態
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        updateUIForLoggedInUser();
    }
    
    // 初始化主題
    initTheme();
    
    // 生成按鈕點擊事件
    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('請輸入圖像描述');
            return;
        }
        
        const style = styleSelect.value;
        const aspectRatio = aspectRatioSelect.value;
        
        await generateImage(prompt, style, aspectRatio);
    });
    
    // 下載按鈕點擊事件
    downloadBtn.addEventListener('click', () => {
        downloadImage(resultImage.src);
    });
    
    // 分享按鈕點擊事件
    shareBtn.addEventListener('click', () => {
        shareImage(resultImage.src);
    });
    
    // 重新生成按鈕點擊事件
    regenerateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        const style = styleSelect.value;
        const aspectRatio = aspectRatioSelect.value;
        
        await generateImage(prompt, style, aspectRatio);
    });
    
    // 登入按鈕點擊事件
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
    
    // 註冊按鈕點擊事件
    signupBtn.addEventListener('click', () => {
        signupModal.style.display = 'block';
    });
    
    // 切換到註冊
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
    });
    
    // 切換到登入
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
    
    // 關閉模態框
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
            userPanelModal.style.display = 'none';
        });
    });
    
    // 點擊模態框外部關閉
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        } else if (e.target === signupModal) {
            signupModal.style.display = 'none';
        } else if (e.target === userPanelModal) {
            userPanelModal.style.display = 'none';
        }
    });
    
    // 註冊表單提交
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('密碼不匹配');
            return;
        }
        
        try {
            const user = registerUser(name, email, password);
            currentUser = user;
            isLoggedIn = true;
            
            // 保存用戶狀態
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // 更新 UI
            updateUIForLoggedInUser();
            
            // 關閉模態框
            signupModal.style.display = 'none';
            
            alert('註冊成功！');
        } catch (error) {
            alert(error.message);
        }
    });
    
    // 登入表單提交
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        
        try {
            const user = loginUser(email, password);
            currentUser = user;
            isLoggedIn = true;
            
            // 保存用戶狀態
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // 更新 UI
            updateUIForLoggedInUser();
            
            // 關閉模態框
            loginModal.style.display = 'none';
            
            alert('登入成功！');
        } catch (error) {
            alert(error.message);
        }
    });
    
    // 登出按鈕點擊事件
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        isLoggedIn = false;
        
        // 清除用戶狀態
        localStorage.removeItem('currentUser');
        
        // 更新 UI
        updateUIForLoggedOutUser();
        
        // 關閉模態框
        userPanelModal.style.display = 'none';
        
        alert('已登出');
    });
    
    // 購買生成次數按鈕點擊事件
    buyCreditsBtn.addEventListener('click', () => {
        // 模擬購買流程
        const credits = parseInt(prompt('請輸入要購買的生成次數：', '10'));
        
        if (isNaN(credits) || credits <= 0) {
            alert('請輸入有效的數字');
            return;
        }
        
        // 更新用戶生成次數
        currentUser.credits += credits;
        updateUserCredits(currentUser.id, currentUser.credits);
        
        // 更新 UI
        remainingCreditsElement.textContent = currentUser.credits;
        
        // 更新本地存儲
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert(`成功購買 ${credits} 次生成次數！`);
    });
    
    // 加載畫廊圖片
     loadGallery();
  });

// 更新已登入用戶的 UI
const updateUIForLoggedInUser = () => {
    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    
    // 添加用戶按鈕
    const userBtn = document.createElement('button');
    userBtn.id = 'user-btn';
    userBtn.className = 'btn-primary';
    userBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
    document.querySelector('.auth-buttons').appendChild(userBtn);
    
    // 用戶按鈕點擊事件
    userBtn.addEventListener('click', () => {
        userNameElement.textContent = currentUser.name;
        remainingCreditsElement.textContent = currentUser.credits;
        userPanelModal.style.display = 'block';
    });
};

// 更新已登出用戶的 UI
const updateUIForLoggedOutUser = () => {
    const userBtn = document.getElementById('user-btn');
    if (userBtn) {
        userBtn.remove();
    }
    
    loginBtn.style.display = 'inline-block';
    signupBtn.style.display = 'inline-block';
};