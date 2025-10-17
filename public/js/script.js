// 等待 DOM 加載完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 網站初始化開始...');
    
    // 檢查 Firebase 是否可用
    if (typeof firebase === 'undefined') {
        console.error('Firebase 未加載！');
        showNotice('Firebase 加載失敗，請刷新頁面', 'error');
        return;
    }
    
    console.log('Firebase 可用，版本:', firebase.SDK_VERSION);
    
    // 初始化變量
    let currentUser = null;
    let countdownTimer;
    
    // 獲取 DOM 元素
    const promptInput = document.getElementById('prompt');
    const styleSelect = document.getElementById('style');
    const generateBtn = document.getElementById('generate-btn');
    const loadingElement = document.getElementById('loading');
    const resultElement = document.getElementById('result');
    const countdownContainer = document.getElementById('countdown-container');
    // countdownElement 已移除，現在使用 Circle Loading 動畫
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const logoutBtn = document.getElementById('logout-btn');
    const galleryGrid = document.querySelector('.gallery-grid');
    
    // Circle Loading 功能
    function startCountdown(duration, callback) {
        console.log('開始 Circle Loading，持續時間:', duration, '秒');
        console.log('countdownContainer:', countdownContainer);
        
        // 顯示 Circle Loading 容器，隱藏其他元素
        if (countdownContainer) {
        countdownContainer.classList.remove('hidden');
            console.log('Circle Loading 容器已顯示');
        } else {
            console.error('countdownContainer 元素未找到');
        }
        
        if (loadingElement) loadingElement.classList.add('hidden');
        if (resultElement) resultElement.classList.add('hidden');
        
        // 設置定時器，在指定時間後執行回調
        countdownTimer = setTimeout(() => {
            console.log('Circle Loading 完成，執行回調');
                countdownContainer.classList.add('hidden');
                if (callback) callback();
        }, duration * 1000);
    }
    
    function stopCountdown() {
        if (countdownTimer) {
            clearTimeout(countdownTimer);
            countdownTimer = null;
        }
        countdownContainer.classList.add('hidden');
    }
    
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
    // 在 DOMContentLoaded 事件內部，Firebase 初始化之後添加：

// 初始化 Firebase Functions
const functions = firebase.functions();
// 如果需要設定區域（可選）
// const functions = firebase.functions('us-central1');

console.log('Firebase Functions 初始化完成！');

// 修改 generateImage 函數
async function generateImage() {
    const prompt = promptInput.value.trim();
    
    // 從風格卡片獲取選擇的風格
    const selectedStyleCard = document.querySelector('.style-card.selected');
    const style = selectedStyleCard ? selectedStyleCard.dataset.style : 'retro';
    
    if (!prompt) {
        showNotice('請輸入圖片描述！', 'warning');
        return;
    }
    
    try {
        // 隱藏預覽佔位符
        const previewPlaceholder = document.getElementById('preview-placeholder');
        if (previewPlaceholder) {
            previewPlaceholder.style.display = 'none';
        }
        
        // 開始 5 秒倒數
        startCountdown(5, async () => {
            try {
                // 使用正確的函數呼叫方式
                const generateImageFunction = functions.httpsCallable('generateImage');
                
                // 🔧 前端統一處理風格增強，後端只負責生成
                const selectedStyle = STYLE_MAP[style] || 'dark mechanical';
                const enhancedPrompt = `${prompt}, ${selectedStyle}, high quality, detailed, artwork`;
                
                const result = await generateImageFunction({
                    prompt: enhancedPrompt,
                    style: style
                });
                
                const data = result.data;
                
                if (data && data.success && data.images && data.images.length > 0) {
                    console.log('圖片生成成功，顯示結果');
                    displayResult(data.images, prompt, style);
                } else {
                    console.error('伺服器返回無效數據:', data);
                    throw new Error('伺服器返回無效數據');
                }
            } catch (error) {
                console.error('Firebase Function 錯誤:', error.message);
                
                // 根據錯誤類型顯示不同訊息
                let errorMessage = '生成圖片時發生錯誤';
                if (error.code === 'unavailable') {
                    errorMessage = '伺服器暫時無法連接，請檢查網路連線';
                } else if (error.code === 'permission-denied') {
                    errorMessage = '請先登入帳號才能使用此功能';
                } else if (error.code === 'internal') {
                    errorMessage = '伺服器內部錯誤，請稍後再試';
                } else if (error.code === 'invalid-argument') {
                    errorMessage = '請輸入有效的提示詞！';
                } else if (error.message.includes('not found')) {
                    errorMessage = '生成功能暫時不可用';
                } else if (error.code === 'unauthenticated') {
                    errorMessage = '身份驗證失敗，正在使用備用方案...';
                    console.log('身份驗證失敗，直接使用備用方案');
                    await generateImagesDirectly(prompt, style);
                    return;
                } else {
                    errorMessage = `錯誤: ${error.message}`;
                }
                
                showNotice(errorMessage, 'error');
                console.log('嘗試使用備用方案生成圖片...');
                // 使用直接呼叫 Pollinations API 作為備用方案
                await generateImagesDirectly(prompt, style);
            }
        });
        
    } catch (error) {
        console.error('生成過程錯誤:', error);
        showNotice('發生錯誤: ' + error.message, 'error');
        stopCountdown();
    }
}

// 修改 displayResult 函數，添加 style 參數
function displayResult(images, prompt, style) {
    if (!resultElement) return;
    
    // 隱藏 Circle Loading 容器
    if (countdownContainer) {
        countdownContainer.classList.add('hidden');
    }
    
    resultElement.innerHTML = '';
    
    // 直接顯示第一張圖片（簡化結構）
    if (images && images.length > 0) {
        const img = document.createElement('img');
        img.alt = `${prompt}`;
        img.className = 'generated-image';
        img.loading = 'lazy';
        img.src = images[0];
        
        // 使用更好的圖片加載方法
        loadImageWithFallback(img, images[0]);
        
        resultElement.appendChild(img);
        
        // 更新預覽操作按鈕
        updatePreviewActions(images[0], prompt);
    }
    
    resultElement.classList.remove('hidden');
    resultElement.style.display = 'flex';
    
    // 隱藏倒數計時器
    // const countdownContainer = document.getElementById('countdown-container');
    if (countdownContainer) {
        countdownContainer.classList.add('hidden');
    }
    
    // 保存生成記錄（如果用戶已登入）
    if (currentUser) {
        saveGenerationToFirestore(currentUser.uid, prompt, images, style);
    }
}

// 更新預覽操作按鈕
function updatePreviewActions(imageUrl, prompt) {
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    
    if (downloadBtn) {
        downloadBtn.onclick = () => downloadImage(imageUrl, `ai-image-${Date.now()}.jpg`);
    }
    
    if (shareBtn) {
        shareBtn.onclick = () => shareImage(imageUrl);
    }
}

// 🔧 圖片生成數量配置 - 與後端保持一致
const IMAGES_TO_GENERATE = 1; // 設置要生成的圖片數量 (1-4 張)

// 🔧 統一的風格配置 - 前端和備用方案共用
const STYLE_MAP = {
    'retro': 'Dark outdoor nighttime setting, Create a found-footage style photograph that authentically mimics an old digital from the early 2000s era . The image quality should feel like genuine paranormal documentation with heavy VHS compression artifacts, visible horizontal scan lines, extreme pixelation, color banding, digital color shift, and grainy digital noise throughout. The overall aesthetic is deliberately degraded and low-fidelity, capturing that distinctive early internet horror era look with authentic analog-to-digital decay',
    // 'retro': 'Retro horror movie poster, 1970s style, film grain, cinematic lighting, eerie suburban night, detailed',
    'retro-pixel': '8-bit pixel art, retro horror dungeon crawler, low resolution, Yames style',
    'cyberpunk': 'Cyberpunk horror scene, neon lighting, masked figure before CRT TV, 1980s analog room, film grain',
    'slasher': 'Vintage slasher film poster, pale mask, dim living room, CRT television glow, 1970s horror aesthetic'
};

// 🔧 通用通知函數 - 替代 alert
function showNotice(message, type = 'info') {
    console.log('顯示通知:', message, type);
    // 創建通知元素
    const notice = document.createElement('div');
    notice.className = 'backup-notice';
    
    // 根據類型設置不同的樣式和圖標
    let backgroundColor, iconClass;
    switch(type) {
        case 'success':
            backgroundColor = 'rgb(76, 175, 80)'; // 綠色
            iconClass = 'fas fa-check-circle';
            break;
        case 'error':
            backgroundColor = 'rgb(244, 67, 54)'; // 紅色
            iconClass = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            backgroundColor = 'rgb(255, 165, 0)'; // 橙色
            iconClass = 'fas fa-exclamation-triangle';
            break;
        case 'info':
        default:
            backgroundColor = 'rgb(33, 150, 243)'; // 藍色
            iconClass = 'fas fa-info-circle';
            break;
    }
    
    notice.style.cssText = `background: ${backgroundColor}; color: white; padding: 12px; border-radius: 6px; margin: 10px 0; font-size: 14px; position: fixed; top: 20px; right: 20px; z-index: 10000; max-width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);`;
    notice.innerHTML = `<i class="${iconClass}"></i> ${message}`;
    
    // 添加到頁面
    document.body.appendChild(notice);
    
    // 3秒後自動移除
    setTimeout(() => {
        if (notice.parentNode) {
            notice.parentNode.removeChild(notice);
        }
    }, 3000);
}

// 備用方案：直接呼叫 Pollinations API
async function generateImagesDirectly(prompt, style) {
    try {
        console.log('使用備用方案生成圖片...');
        
        const selectedStyle = STYLE_MAP[style] || 'dark mechanical';
        const enhancedPrompt = `${prompt}, ${selectedStyle}, high quality, detailed, artwork`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        
        // 🔧 根據配置生成指定數量的圖片
        const timestamp = Date.now();
        const imageUrls = [];
        for (let i = 1; i <= IMAGES_TO_GENERATE; i++) {
            imageUrls.push(
                `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${timestamp + i}&nologo=true`
            );
        }
        
        console.log('備用方案圖片生成完成');
        displayResult(imageUrls, prompt, style);
        
        // 顯示備用方案提示
        const resultElement = document.getElementById('result');
        if (resultElement) {
            const notice = document.createElement('div');
            notice.className = 'backup-notice';
            notice.innerHTML = '<i class="fas fa-info-circle"></i> 使用備用圖片生成服務';
            notice.style.cssText = 'background: #ffa500; color: #000; padding: 8px; border-radius: 4px; margin: 10px 0; font-size: 14px;';
            resultElement.insertBefore(notice, resultElement.firstChild);
        }
        
    } catch (error) {
        console.error('直接生成失敗:', error);
        displayFallbackImages(prompt);
    }
}
    
    // 專門的圖片加載函數，避免無限循環
    function loadImageWithFallback(imgElement, imageUrl) {
        let errorHandled = false;
        
        imgElement.onload = function() {
            console.log('圖片加載成功:', imageUrl);
        };
        
        imgElement.onerror = function() {
            if (!errorHandled) {
                errorHandled = true;
                console.error('圖片加載失敗，使用備用圖片:', imageUrl);
                // 使用不會出錯的 SVG 圖片
                imgElement.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#1a1a2e"/><text x="256" y="256" font-family="Arial" font-size="14" fill="white" text-anchor="middle">圖片生成失敗</text><text x="256" y="280" font-family="Arial" font-size="12" fill="#ccc" text-anchor="middle">請嘗試重新生成</text></svg>';
                
                // 移除事件監聽器，防止再次觸發
                imgElement.onerror = null;
                imgElement.onload = null;
            }
        };
        
        // 開始加載圖片
        imgElement.src = imageUrl;
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
            showNotice('下載失敗，請稍後再試', 'error');
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
                    showNotice('圖片鏈接已複製到剪貼板！', 'success');
                })
                .catch(error => {
                    console.error('複製鏈接時出錯:', error);
                    showNotice('複製鏈接時出錯，請手動複製: ' + imageUrl, 'error');
                });
        }
    }
    
    function displayFallbackImages(prompt) {
        const fallbackImages = [
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#1a1a2e"/><text x="256" y="256" font-family="Arial" font-size="20" fill="white" text-anchor="middle">黑暗機械風格</text></svg>'
        ];
        
        displayResult(fallbackImages, prompt);
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
            generateBtn.addEventListener('click', generateImage);
        }
        
        // 登入按鈕
        if (loginBtn) {
            console.log('✅ 找到登入按鈕，添加事件監聽器');
            console.log('🔍 登入按鈕元素:', loginBtn);
            console.log('🔍 登入按鈕類別:', loginBtn.className);
            console.log('🔍 登入按鈕文字:', loginBtn.textContent);
            
            loginBtn.addEventListener('click', function(event) {
                console.log('🖱️ 登入按鈕被點擊！');
                console.log('📊 點擊事件詳情:', {
                    type: event.type,
                    target: event.target,
                    currentTarget: event.currentTarget,
                    timestamp: new Date().toISOString()
                });
                console.log('🔍 檢查 loginModal 元素:', loginModal);
                
                if (loginModal) {
                    console.log('📱 顯示登入模態框');
                    console.log('🔍 模態框當前樣式:', loginModal.style.display);
                    console.log('🔍 模態框類別:', loginModal.className);
                    console.log('🔍 模態框是否隱藏:', loginModal.classList.contains('hidden'));
                    
                    // 移除 hidden 類別來顯示模態框
                    loginModal.classList.remove('hidden');
                    console.log('✅ 模態框顯示設置完成（移除 hidden 類別）');
                    console.log('🔍 設置後類別:', loginModal.className);
                } else {
                    console.error('❌ loginModal 元素未找到！');
                }
            });
        } else {
            console.error('❌ 登入按鈕元素未找到！');
        }

        // Premium 按鈕
        const payButton = document.getElementById('pay-button');
        if (payButton) {
            console.log('✅ 找到 Premium 按鈕，添加事件監聽器');
            console.log('🔍 Premium 按鈕元素:', payButton);
            console.log('🔍 Premium 按鈕類別:', payButton.className);
            console.log('🔍 Premium 按鈕文字:', payButton.textContent);
            
            payButton.addEventListener('click', function(event) {
                console.log('🖱️ Premium 按鈕被點擊！');
                console.log('📊 點擊事件詳情:', {
                    type: event.type,
                    target: event.target,
                    currentTarget: event.currentTarget,
                    timestamp: new Date().toISOString()
                });
                console.log('🔗 準備跳轉到付費頁面');
                console.log('🔍 當前頁面 URL:', window.location.href);
                console.log('🔍 目標頁面:', 'pricing.html');
                
                // 延遲一下以便看到 console.log
                setTimeout(() => {
                    console.log('🚀 執行頁面跳轉...');
                    window.location.href = 'pricing.html';
                }, 100);
            });
        } else {
            console.log('ℹ️ Premium 按鈕未找到（可能不在當前頁面）');
        }
        
        // 註冊按鈕 - 已移除，通過登入頁面切換
        
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
                    showNotice('登入成功！', 'success');
                } catch (error) {
                    showNotice('登入失敗: ' + error.message, 'error');
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
                    showNotice('密碼不一致', 'warning');
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
                    showNotice('註冊成功！', 'success');
                } catch (error) {
                    showNotice('註冊失敗: ' + error.message, 'error');
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
                    showNotice('Google 登入成功！', 'success');
                } catch (error) {
                    showNotice('Google 登入失敗: ' + error.message, 'error');
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
                    showNotice('Google 註冊成功！', 'success');
                } catch (error) {
                    showNotice('Google 註冊失敗: ' + error.message, 'error');
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
                    showNotice('已登出', 'info');
                } catch (error) {
                    showNotice('登出失敗: ' + error.message, 'error');
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
                }
            });
        }
        
        if (switchToLogin) {
            switchToLogin.addEventListener('click', function(e) {
                e.preventDefault();
                if (signupModal) signupModal.style.display = 'none';
                if (loginModal) {
                    loginModal.style.display = 'block';
                }
            });
        }
    }
    
    
    
    // 初始化語言
    function initLanguage() {
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            const savedLanguage = localStorage.getItem('language') || 'en';
            languageSelect.value = savedLanguage;
            
            languageSelect.addEventListener('change', function(e) {
                const selectedLanguage = e.target.value;
                localStorage.setItem('language', selectedLanguage);
                translatePage(selectedLanguage);
                // showNotice(`語言已切換到: ${selectedLanguage === 'zh' ? '中文' : '英文'}`, 'info');
            });
        }
        
        // 風格卡片選擇
        initializeStyleCards();
        
        // 漢堡選單
        initializeHamburgerMenu();
    }
    
    // 初始化風格卡片選擇
    function initializeStyleCards() {
        const styleCards = document.querySelectorAll('.style-card');
        let selectedStyle = 'retro'; // 默認選擇 retro
        
        styleCards.forEach(card => {
            // 設置默認選擇
            if (card.dataset.style === selectedStyle) {
                card.classList.add('selected');
            }
            
            card.addEventListener('click', function() {
                // 移除所有卡片的選中狀態
                styleCards.forEach(c => c.classList.remove('selected'));
                
                // 添加當前卡片的選中狀態
                this.classList.add('selected');
                
                // 更新隱藏的選擇器（如果存在）
                const styleSelect = document.getElementById('style');
                if (styleSelect) {
                    styleSelect.value = this.dataset.style;
                }
                
                console.log('選擇風格:', this.dataset.style);
            });
        });
    }
    
    // 初始化漢堡選單
    function initializeHamburgerMenu() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const navLinks = document.getElementById('navLinks');
        
        if (hamburgerMenu && navLinks) {
            hamburgerMenu.addEventListener('click', function() {
                hamburgerMenu.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
            
            // 點擊導航連結時關閉選單
            navLinks.querySelectorAll('a, button').forEach(item => {
                item.addEventListener('click', function() {
                    hamburgerMenu.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
        }
    }
    
    // 翻譯功能
    function translatePage(language) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[language] && translations[language][key]) {
                element.textContent = translations[language][key];
                }
            });
        }
    
    // 初始化翻譯
    function initTranslation() {
        const savedLanguage = localStorage.getItem('language') || 'en';
        translatePage(savedLanguage);
    }
    
    // 執行初始化
    initLanguage();
    initEventListeners();
    initTranslation();
    
    console.log('網站初始化完成！');
});

// 全局認證功能函數（供其他頁面使用）
window.initAuthFeatures = function() {
    console.log('初始化認證功能...');
    
    // 登入按鈕
    const loginBtn = document.getElementById('login-btn');
    // 在 initEventListeners 函數中修改登入按鈕事件
    if (loginBtn) {
        console.log('✅ 找到登入按鈕，添加事件監聽器');
        
        loginBtn.addEventListener('click', function(event) {
            console.log('🖱️ 登入按鈕被點擊！');
            
            if (loginModal) {
                console.log('📱 顯示登入模態框');
                
                // 方案1: 使用 display 屬性（確保顯示）
                loginModal.style.display = 'block';
                
                // 方案2: 同時移除 hidden 類並設置 display
                loginModal.classList.remove('hidden');
                loginModal.style.display = 'block';
                
                console.log('✅ 模態框顯示設置完成');
            } else {
                console.error('❌ loginModal 元素未找到！');
            }
        });
    } else {
        console.error('❌ [全局] 登入按鈕元素未找到');
    }

    // 登入表單
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password);
                const loginModal = document.getElementById('login-modal');
                if (loginModal) loginModal.classList.add('hidden');
                showNotice('登入成功！', 'success');
                // 重新載入頁面以更新 UI
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                showNotice('登入失敗: ' + error.message, 'error');
            }
        });
    }

    // 註冊表單
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            if (password !== confirmPassword) {
                showNotice('密碼不一致', 'warning');
                return;
            }
            
            try {
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                await userCredential.user.updateProfile({
                    displayName: name
                });
                const signupModal = document.getElementById('signup-modal');
                if (signupModal) signupModal.classList.add('hidden');
                signupForm.reset();
                showNotice('註冊成功！正在跳轉到付費頁面...', 'success');
                // 跳轉到付費頁面
                setTimeout(() => {
                    window.location.href = 'pricing.html';
                }, 2000);
            } catch (error) {
                showNotice('註冊失敗: ' + error.message, 'error');
            }
        });
    }

    // 關閉模態框
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const loginModal = document.getElementById('login-modal');
            const signupModal = document.getElementById('signup-modal');
            if (loginModal) loginModal.classList.add('hidden');
            if (signupModal) signupModal.classList.add('hidden');
        });
    });

    // 切換登入/註冊表單
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
    
    if (switchToSignup) {
        switchToSignup.addEventListener('click', function(e) {
            e.preventDefault();
            const loginModal = document.getElementById('login-modal');
            const signupModal = document.getElementById('signup-modal');
            if (loginModal) loginModal.classList.add('hidden');
            if (signupModal) signupModal.classList.remove('hidden');
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            const loginModal = document.getElementById('login-modal');
            const signupModal = document.getElementById('signup-modal');
            if (signupModal) signupModal.classList.add('hidden');
            if (loginModal) loginModal.classList.remove('hidden');
        });
    }

    // Google 登入/註冊
    const googleLoginBtn = document.getElementById('google-login-btn');
    const googleSignupBtn = document.getElementById('google-signup-btn');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async function() {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                await firebase.auth().signInWithPopup(provider);
                const loginModal = document.getElementById('login-modal');
                if (loginModal) loginModal.classList.add('hidden');
                showNotice('Google 登入成功！', 'success');
                setTimeout(() => { window.location.reload(); }, 1000);
            } catch (error) {
                showNotice('Google 登入失敗: ' + error.message, 'error');
            }
        });
    }
    
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', async function() {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                await firebase.auth().signInWithPopup(provider);
                const signupModal = document.getElementById('signup-modal');
                if (signupModal) signupModal.classList.add('hidden');
                showNotice('Google 註冊成功！正在跳轉到付費頁面...', 'success');
                setTimeout(() => {
                    window.location.href = 'pricing.html';
                }, 2000);
            } catch (error) {
                showNotice('Google 註冊失敗: ' + error.message, 'error');
            }
        });
    }

    // 更新 UI 狀態
    firebase.auth().onAuthStateChanged(function(user) {
        console.log('認證狀態變化:', user ? '已登入' : '已登出');
        updateAuthUI(user);
    });
};

// 全局更新認證 UI 函數
window.updateAuthUI = function(user) {
    const loginBtn = document.getElementById('login-btn');
    const payButton = document.getElementById('pay-button');
    
    if (user) {
        // 用戶已登入
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        if (payButton) {
            payButton.textContent = user.displayName || '用戶面板';
            payButton.onclick = function() {
                // 可以添加用戶面板功能
                console.log('用戶面板');
            };
        }
    } else {
        // 用戶未登入
        if (loginBtn) {
            loginBtn.style.display = 'inline-block';
        }
        if (payButton) {
            payButton.textContent = '升級為 Premium';
            payButton.onclick = function() {
                window.location.href = 'pricing.html';
            };
        }
    }
};

// 全局通知函數
window.showNotice = function(message, type = 'info') {
    console.log('顯示通知:', message, type);
    // 創建通知元素
    const notice = document.createElement('div');
    notice.className = 'backup-notice';
    
    // 根據類型設置樣式
    let bgColor, textColor;
    switch(type) {
        case 'success':
            bgColor = '#4CAF50';
            textColor = '#fff';
            break;
        case 'warning':
            bgColor = '#ff9800';
            textColor = '#fff';
            break;
        case 'error':
            bgColor = '#f44336';
            textColor = '#fff';
            break;
        case 'info':
        default:
            bgColor = '#2196F3';
            textColor = '#fff';
            break;
    }
    
    notice.style.cssText = `background: ${bgColor}; color: ${textColor}; padding: 8px; border-radius: 4px; margin: 10px 0; font-size: 14px; position: fixed; top: 20px; right: 20px; z-index: 10000;`;
    notice.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    
    // 插入到頁面
    document.body.appendChild(notice);
    
    // 3秒後自動移除
    setTimeout(() => {
        if (notice.parentNode) {
            notice.parentNode.removeChild(notice);
        }
    }, 3000);
};

// // 全局函數
// window.viewImage = function(imageUrl) {
//     window.open(imageUrl, '_blank');
// };
// // 在 Firebase 初始化後添加
// console.log('Firebase 初始化完成！');

// // 初始化 Firebase Functions
// const functions = firebase.functions();
// console.log('Firebase Functions 初始化完成！');

// 如果需要，可以設定區域（可選）
// const functions = firebase.functions('us-central1');
// const functions = firebase.functions('us-central1');