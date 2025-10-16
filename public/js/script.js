// 等待 DOM 加載完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 網站初始化開始...');
    
    // 檢查 Firebase 是否可用
    if (typeof firebase === 'undefined') {
        console.error('Firebase 未加載！');
        alert('Firebase 加載失敗，請刷新頁面');
        return;
    }
    
    console.log('Firebase 可用，版本:', firebase.SDK_VERSION);
    
    // 初始化變量
    let currentUser = null;
    
    // 獲取 DOM 元素
    const promptInput = document.getElementById('prompt');
    const styleSelect = document.getElementById('style');
    const generateBtn = document.getElementById('generate-btn');
    const loadingElement = document.getElementById('loading');
    const resultElement = document.getElementById('result');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const logoutBtn = document.getElementById('logout-btn');
    const galleryGrid = document.querySelector('.gallery-grid');
    
    // 監聽認證狀態變化
    firebase.auth().onAuthStateChanged(function(user) {
        console.log('認證狀態變化:', user ? '已登入' : '已登出');
        if (user) {
            // 用戶已登入
            currentUser = user;
            console.log('用戶已登入:', user.email);
            updateUIForLoggedInUser(user);
        } else {
            // 用戶已登出
            currentUser = null;
            console.log('用戶已登出');
            updateUIForLoggedOutUser();
        }
    });
    
    // 更新登入狀態的 UI
    function updateUIForLoggedInUser(user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            // 移除現有用戶按鈕
            const existingUserBtn = document.getElementById('user-btn');
            if (existingUserBtn) {
                existingUserBtn.remove();
            }
            
            // 添加用戶按鈕
            const userBtn = document.createElement('button');
            userBtn.id = 'user-btn';
            userBtn.className = 'btn-primary';
            userBtn.innerHTML = `<i class="fas fa-user"></i> ${user.displayName || user.email}`;
            authButtons.appendChild(userBtn);
            
            userBtn.addEventListener('click', function() {
                const userPanelModal = document.getElementById('user-panel-modal');
                if (userPanelModal) {
                    const userNameElement = document.getElementById('user-name');
                    if (userNameElement) {
                        userNameElement.textContent = user.displayName || user.email;
                    }
                    userPanelModal.style.display = 'block';
                }
            });
        }
    }
    
    function updateUIForLoggedOutUser() {
        const userBtn = document.getElementById('user-btn');
        if (userBtn) {
            userBtn.remove();
        }
        
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (signupBtn) signupBtn.style.display = 'inline-block';
        
        const userPanelModal = document.getElementById('user-panel-modal');
        if (userPanelModal) userPanelModal.style.display = 'none';
    }
    
    // 圖片生成功能
    function enhancePrompt(basePrompt, style) {
        const styleEnhancements = {
            'core': 'dark core, pool core, backroom, plastiboo',
            'retro-pixel': 'retro pixel, 8-bit game, Yames, dungeon crawler',
            'cyberpunk': 'cyberpunk, blade runner, futuristic, neon lights',
            'slasher': '80s horror movie, slasher, dark, scary'
        };
        
        const selectedStyle = styleEnhancements[style] || 'dark mechanical, cyberpunk';
        return `${basePrompt}, ${selectedStyle}, high quality, detailed, artwork`;
    }
    
    async function generateImages(prompt, style) {
        console.log('開始生成圖片...', prompt);

        // 顯示加載
        if (loadingElement) {
            loadingElement.classList.remove('hidden');
            loadingElement.innerHTML = '<div class="loading-spinner"></div><p>AI 正在創作中...</p>';
        }
        if (resultElement) resultElement.classList.add('hidden');
    
        try {
            const enhancedPrompt = enhancePrompt(prompt, style);
            
            // 直接調用 Pollinations.ai API
            const encodedPrompt = encodeURIComponent(enhancedPrompt);
            const imageUrls = [
                `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=1`,
                `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=2`,
                `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=3`
            ];
    
            console.log('生成結果:', imageUrls);
            
            // 顯示圖片
            displayGeneratedImages(imageUrls, prompt);
    
            // 保存生成記錄（如果用戶已登入）
            if (currentUser) {
                await saveGenerationToFirestore(currentUser.uid, prompt, imageUrls, style);
            }
    
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
    }
    
    function displayGeneratedImages(imageUrls, prompt) {
        if (!resultElement) return;
        
        resultElement.innerHTML = '';
        
        const imagesGrid = document.createElement('div');
        imagesGrid.className = 'images-grid';
        
        imageUrls.forEach((imageUrl, index) => {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';
            
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `${prompt} - 圖片 ${index + 1}`;
            img.className = 'generated-image';
            img.loading = 'lazy';
            
            // 圖片加載錯誤處理
            img.onerror = function() {
                console.error('圖片加載失敗:', imageUrl);
                this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#ff4444"/><text x="256" y="256" font-family="Arial" font-size="16" fill="white" text-anchor="middle">圖片加載失敗</text></svg>';
            };
            
            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'image-actions';
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'btn-secondary';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> 下載';
            downloadBtn.onclick = () => downloadImage(imageUrl, `ai-image-${index + 1}-${Date.now()}.jpg`);
            
            const shareBtn = document.createElement('button');
            shareBtn.className = 'btn-secondary';
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> 分享';
            shareBtn.onclick = () => shareImage(imageUrl);
            
            actionsContainer.appendChild(downloadBtn);
            actionsContainer.appendChild(shareBtn);
            imageContainer.appendChild(img);
            imageContainer.appendChild(actionsContainer);
            imagesGrid.appendChild(imageContainer);
        });
        
        resultElement.appendChild(imagesGrid);
    }
     
    async function downloadImage(imageUrl, filename) {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('下載失敗:', error);
            alert('下載失敗，請稍後再試');
        }
    }
    
    function shareImage(imageUrl) {
        if (navigator.share) {
            navigator.share({
                title: 'AI生成的圖片',
                text: '查看我用AI生成的圖片！',
                url: imageUrl
            }).catch(error => {
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
    }
    
    function displayFallbackImages(prompt) {
        const fallbackImages = [
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#1a1a2e"/><text x="256" y="256" font-family="Arial" font-size="20" fill="white" text-anchor="middle">黑暗機械風格</text></svg>',
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#16213e"/><text x="256" y="256" font-family="Arial" font-size="20" fill="white" text-anchor="middle">賽博朋克城市</text></svg>',
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#0f3460"/><text x="256" y="256" font-family="Arial" font-size="20" fill="white" text-anchor="middle">像素遊戲藝術</text></svg>'
        ];
        
        displayGeneratedImages(fallbackImages, prompt);
        if (resultElement) resultElement.classList.remove('hidden');
    }
    
    async function saveGenerationToFirestore(userId, prompt, imageUrls, style) {
        try {
            await firebase.firestore().collection('generations').add({
                userId: userId,
                prompt: prompt,
                images: imageUrls,
                style: style,
                createdAt: new Date().toISOString(),
                timestamp: new Date().getTime()
            });
            console.log('記錄已保存到 Firestore');
        } catch (error) {
            console.error('保存到 Firestore 失敗:', error);
            // 降級到 localStorage
            saveGenerationToLocalStorage(userId, prompt, imageUrls, style);
        }
    }
    
    function saveGenerationToLocalStorage(userId, prompt, imageUrls, style) {
        const record = {
            id: Date.now().toString(),
            userId,
            prompt,
            images: imageUrls,
            style,
            createdAt: new Date().toISOString()
        };
        
        const records = JSON.parse(localStorage.getItem('generation_records') || '[]');
        records.unshift(record);
        localStorage.setItem('generation_records', JSON.stringify(records));
    }

    // Tab 切換功能
    function initTabSwitcher() {
        console.log('初始化 Tab 切換...');
        
        // 登入模態框的 tab 切換
        const loginTabButtons = document.querySelectorAll('#login-modal .tab-btn');
        const loginTabContents = document.querySelectorAll('#login-modal .tab-content');
        
        if (loginTabButtons.length > 0 && loginTabContents.length > 0) {
            console.log('找到登入模態框的 tab 元素');
            
            loginTabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    console.log('點擊登入 tab 按鈕:', button.getAttribute('data-tab'));
                    
                    // 移除所有按鈕的 active
                    loginTabButtons.forEach(btn => btn.classList.remove('active'));
                    // 給目前按下的按鈕 active
                    button.classList.add('active');
            
                    // 隱藏所有 tab-content
                    loginTabContents.forEach(content => content.classList.remove('active'));
            
                    // 顯示對應的內容區塊
                    const target = button.getAttribute('data-tab');
                    const targetContent = document.getElementById(target);
                    if (targetContent) {
                        targetContent.classList.add('active');
                        console.log('顯示內容區塊:', target);
                    }
                });
            });
        }
        
        // 註冊模態框的 tab 切換
        const signupTabButtons = document.querySelectorAll('#signup-modal .tab-btn');
        const signupTabContents = document.querySelectorAll('#signup-modal .tab-content');
        
        if (signupTabButtons.length > 0 && signupTabContents.length > 0) {
            console.log('找到註冊模態框的 tab 元素');
            
            signupTabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    console.log('點擊註冊 tab 按鈕:', button.getAttribute('data-tab'));
                    
                    // 移除所有按鈕的 active
                    signupTabButtons.forEach(btn => btn.classList.remove('active'));
                    // 給目前按下的按鈕 active
                    button.classList.add('active');
            
                    // 隱藏所有 tab-content
                    signupTabContents.forEach(content => content.classList.remove('active'));
            
                    // 顯示對應的內容區塊
                    const target = button.getAttribute('data-tab');
                    const targetContent = document.getElementById(target);
                    if (targetContent) {
                        targetContent.classList.add('active');
                        console.log('顯示內容區塊:', target);
                    }
                });
            });
        }
    }
    
    // 事件監聽器設置
    function initEventListeners() {
        console.log("初始化事件監聽器...");
        
        // 初始化 tab 切換
        initTabSwitcher();
        
        // 生成按鈕
        if (generateBtn && promptInput) {
            generateBtn.addEventListener('click', function() {
                const prompt = promptInput.value.trim();
                if (!prompt) {
                    alert('請輸入提示詞');
                    return;
                }
                
                const style = styleSelect ? styleSelect.value : 'core';
                generateImages(prompt, style);
            });
        }
        
        // 登入按鈕
        if (loginBtn) {
            loginBtn.addEventListener('click', function() {
                if (loginModal) {
                    loginModal.style.display = 'block';
                    // 重置登入模態框的 tab 狀態
                    resetLoginModalTabs();
                }
            });
        }
        
        // 註冊按鈕
        if (signupBtn) {
            signupBtn.addEventListener('click', function() {
                if (signupModal) {
                    signupModal.style.display = 'block';
                    // 重置註冊模態框的 tab 狀態
                    resetSignupModalTabs();
                }
            });
        }
        
        // 登入表單
        if (loginForm) {
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                try {
                    await firebase.auth().signInWithEmailAndPassword(email, password);
                    loginModal.style.display = 'none';
                    loginForm.reset();
                    alert('登入成功！');
                } catch (error) {
                    alert('登入失敗: ' + error.message);
                }
            });
        }
        
        // 註冊表單
        if (signupForm) {
            signupForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const name = document.getElementById('signup-name').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                const confirmPassword = document.getElementById('signup-confirm-password').value;
                
                if (password !== confirmPassword) {
                    alert('密碼不一致');
                    return;
                }
                
                try {
                    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                    // 更新用戶名稱
                    await userCredential.user.updateProfile({
                        displayName: name
                    });
                    signupModal.style.display = 'none';
                    signupForm.reset();
                    alert('註冊成功！');
                } catch (error) {
                    alert('註冊失敗: ' + error.message);
                }
            });
        }
        
        // Google 登入按鈕
        const googleLoginBtn = document.getElementById('google-login-btn');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', async function() {
                try {
                    const provider = new firebase.auth.GoogleAuthProvider();
                    await firebase.auth().signInWithPopup(provider);
                    loginModal.style.display = 'none';
                    alert('Google 登入成功！');
                } catch (error) {
                    alert('Google 登入失敗: ' + error.message);
                }
            });
        }
        
        // Google 註冊按鈕
        const googleSignupBtn = document.getElementById('google-signup-btn');
        if (googleSignupBtn) {
            googleSignupBtn.addEventListener('click', async function() {
                try {
                    const provider = new firebase.auth.GoogleAuthProvider();
                    await firebase.auth().signInWithPopup(provider);
                    signupModal.style.display = 'none';
                    alert('Google 註冊成功！');
                } catch (error) {
                    alert('Google 註冊失敗: ' + error.message);
                }
            });
        }
        
        // 登出按鈕
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async function() {
                try {
                    await firebase.auth().signOut();
                    const userPanelModal = document.getElementById('user-panel-modal');
                    if (userPanelModal) userPanelModal.style.display = 'none';
                    alert('已登出');
                } catch (error) {
                    alert('登出失敗: ' + error.message);
                }
            });
        }
        
        // 關閉模態框
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                if (loginModal) loginModal.style.display = 'none';
                if (signupModal) signupModal.style.display = 'none';
                const userPanelModal = document.getElementById('user-panel-modal');
                if (userPanelModal) userPanelModal.style.display = 'none';
            });
        });
        
        // 點擊模態框外部關閉
        window.addEventListener('click', function(event) {
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
            }
            if (event.target === signupModal) {
                signupModal.style.display = 'none';
            }
            const userPanelModal = document.getElementById('user-panel-modal');
            if (event.target === userPanelModal) {
                userPanelModal.style.display = 'none';
            }
        });
        
        // 切換登入/註冊表單
        const switchToSignup = document.getElementById('switch-to-signup');
        const switchToLogin = document.getElementById('switch-to-login');
        
        if (switchToSignup) {
            switchToSignup.addEventListener('click', function(e) {
                e.preventDefault();
                if (loginModal) loginModal.style.display = 'none';
                if (signupModal) {
                    signupModal.style.display = 'block';
                    resetSignupModalTabs();
                }
            });
        }
        
        if (switchToLogin) {
            switchToLogin.addEventListener('click', function(e) {
                e.preventDefault();
                if (signupModal) signupModal.style.display = 'none';
                if (loginModal) {
                    loginModal.style.display = 'block';
                    resetLoginModalTabs();
                }
            });
        }
    }
    
    // 重置登入模態框的 tab 狀態
    function resetLoginModalTabs() {
        const loginTabButtons = document.querySelectorAll('#login-modal .tab-btn');
        const loginTabContents = document.querySelectorAll('#login-modal .tab-content');
        
        if (loginTabButtons.length > 0 && loginTabContents.length > 0) {
            // 重置到第一個 tab
            loginTabButtons.forEach((btn, index) => {
                if (index === 0) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            loginTabContents.forEach((content, index) => {
                if (index === 0) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        }
    }
    
    // 重置註冊模態框的 tab 狀態
    function resetSignupModalTabs() {
        const signupTabButtons = document.querySelectorAll('#signup-modal .tab-btn');
        const signupTabContents = document.querySelectorAll('#signup-modal .tab-content');
        
        if (signupTabButtons.length > 0 && signupTabContents.length > 0) {
            // 重置到第一個 tab
            signupTabButtons.forEach((btn, index) => {
                if (index === 0) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            signupTabContents.forEach((content, index) => {
                if (index === 0) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        }
    }
    
    // 初始化主題
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
        
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
            });
        });
    }
    
    // 初始化語言
    function initLanguage() {
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            const savedLanguage = localStorage.getItem('language') || 'zh';
            languageSelect.value = savedLanguage;
            
            languageSelect.addEventListener('change', function(e) {
                const selectedLanguage = e.target.value;
                localStorage.setItem('language', selectedLanguage);
                alert(`語言已切換到: ${selectedLanguage === 'zh' ? '中文' : '英文'}`);
            });
        }
    }
    
    // 執行初始化
    initTheme();
    initLanguage();
    initEventListeners();
    
    console.log('✅ 網站初始化完成！');
});

// 全局函數
window.viewImage = function(imageUrl) {
    window.open(imageUrl, '_blank');
};