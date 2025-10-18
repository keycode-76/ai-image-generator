// 乾淨重寫版本的網站 JavaScript 邏輯
console.log('🚀 網站載入完成，開始初始化...');

// 全局變數
let currentUser = null;
let countdownTimer;
let language = 'zh'; // 默認語言
let userGenerationData = null; // 用戶生成數據

// 風格映射 - 增強提示詞
const STYLE_MAP = {
    'retro': 'Dark outdoor nighttime setting, Create a found-footage style photograph that authentically mimics an old digital from the early 2000s era . The image quality should feel like genuine paranormal documentation with heavy VHS compression artifacts, visible horizontal scan lines, extreme pixelation, color banding, digital color shift, and grainy digital noise throughout. The overall aesthetic is deliberately degraded and low-fidelity, capturing that distinctive early internet horror era look with authentic analog-to-digital decay',
    'playing-video-game': " is the SUBJECT, A nostalgic found-footage photograph shot on vintage 35mm film from the 2000s era. Dimly-lit basement room with concrete floors. An aged CRT television displaying crystal clear, highly detailed retro video game graphics of [SUBJECT]game featuring [SUBJECT] as the protagonist, positioned extremely close beside [SUBJECT]'s head. Full-body shot of [SUBJECT] sitting cross-legged on the floor, turned directly toward the camera, eyes looking straight at the viewer, showing direct eye contact while holding a game controller. The TV screen shows the game protagonist that matches [SUBJECT]'s appearance. Warm, muted lighting with heavy grain, color cast. Vintage electronics and worn surfaces. Film texture capturing basement gaming culture nostalgia.",
    'cyberpunk': 'Cyberpunk horror scene, neon lighting, masked figure before CRT TV, 1980s analog room, film grain',
    'slasher': 'Vintage slasher film poster, pale mask, dim living room, CRT television glow, 1970s horror aesthetic'
};

// 要生成的圖片數量
const IMAGES_TO_GENERATE = 1; // 可以調整生成的圖片數量 (1-4 張)

// 方案限制
const PLAN_LIMITS = {
    'free': 10,      // 免費方案：每月2張
    'basic': 1000,  // 基本方案：每月1000張
    'advanced': -1  // 進階方案：無限制 (-1 表示無限制)
};

// 通知函數
function showNotice(message, type = 'info') {
    // 移除現有的通知
    const existingNotice = document.querySelector('.notice');
    if (existingNotice) {
        existingNotice.remove();
    }
    
    // 創建通知元素
    const notice = document.createElement('div');
    notice.className = `notice notice-${type}`;
    notice.textContent = message;
    
    // 添加樣式
    notice.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        transform: translateX(100%) translateY(0);
        padding: 10px 15px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 250px;
        width: auto;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: transform 0.3s ease;
        font-size: 14px;
    `;
    
    // 根據類型設置顏色
    switch (type) {
        case 'success':
            notice.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notice.style.backgroundColor = '#000000';
            break;
        case 'warning':
            notice.style.backgroundColor = '#ff9800';
            break;
        default:
            notice.style.backgroundColor = '#2196F3';
    }
    
    // 添加到頁面
    document.body.appendChild(notice);
    
    // 動畫顯示
    setTimeout(() => {
        notice.style.transform = 'translateX(0) translateY(0)';
    }, 100);
    
    // 自動隱藏
    setTimeout(() => {
        notice.style.transform = 'translateX(100%) translateY(0)';
        setTimeout(() => {
            if (notice.parentNode) {
                notice.parentNode.removeChild(notice);
            }
        }, 300);
    }, 3000);
}

// Circle Loading 功能
function startCountdown(duration, callback) {
    console.log('開始 Circle Loading，持續時間:', duration, '秒');
    
    const countdownContainer = document.getElementById('countdown-container');
    const loadingElement = document.getElementById('loading');
    const resultElement = document.getElementById('result');
    
    if (countdownContainer) {
        countdownContainer.classList.remove('hidden');
        console.log('Circle Loading 已顯示', countdownContainer.className);
    } else {
        console.error('countdownContainer 找不到');
    }
    
    if (loadingElement) loadingElement.classList.add('hidden');
    if (resultElement) resultElement.classList.add('hidden');
}

function stopCountdown() {
    if (countdownTimer) {
        clearTimeout(countdownTimer);
        countdownTimer = null;
    }
    const countdownContainer = document.getElementById('countdown-container');
    if (countdownContainer) countdownContainer.classList.add('hidden');
}

// Firebase 認證狀態監聽器
firebase.auth().onAuthStateChanged(function(user) {
    console.log('認證狀態變化:', user ? '已登入' : '已登出');
    if (user) {
        currentUser = user;
        console.log('用戶已登入:', user.email);
        updateUIForLoggedInUser(user);
    } else {
        currentUser = null;
        console.log('用戶已登出');
        updateUIForLoggedOutUser();
    }
});

// 更新已登入用戶的 UI
function updateUIForLoggedInUser(user) {
    console.log('更新已登入用戶 UI:', user.email);
    
    // 隱藏登入按鈕
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.style.display = 'none';
    }
    
    // 隱藏註冊按鈕（如果存在）
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.style.display = 'none';
    }
    
    // 獲取導航欄容器
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        // 移除現有的用戶按鈕
        const existingUserBtn = document.getElementById('user-btn');
        if (existingUserBtn) {
            existingUserBtn.remove();
        }
        
        // 創建新的用戶按鈕
        const userBtn = document.createElement('button');
        userBtn.id = 'user-btn';
        userBtn.className = 'btn-user';
        userBtn.innerHTML = `<i class="fas fa-user"></i> ${user.displayName || user.email.split('@')[0]}`;
        
        // 將用戶按鈕插入到登入按鈕的位置
        if (loginBtn && loginBtn.parentNode) {
            loginBtn.parentNode.insertBefore(userBtn, loginBtn.nextSibling);
        } else {
            navLinks.appendChild(userBtn);
        }
        
        // 添加點擊事件
        userBtn.addEventListener('click', function() {
            console.log('用戶按鈕被點擊');
            // 更新用戶面板信息
            updateUserPanelInfo(user);
            const userPanelModal = document.getElementById('user-panel-modal');
            if (userPanelModal) {
                userPanelModal.classList.remove('hidden');
                userPanelModal.classList.add('show');
            } else {
                // 如果沒有用戶面板，直接登出
                logout();
            }
        });
    }
    
    // 顯示生成圖片按鈕
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.style.display = 'block';
    }
}

// 更新用戶面板信息
function updateUserPanelInfo(user) {
    // 更新用戶頭像
    const userAvatar = document.getElementById('user-avatar');
    if (userAvatar) {
        userAvatar.src = user.photoURL || 'https://via.placeholder.com/40x40?text=' + (user.displayName || user.email).charAt(0).toUpperCase();
    }
    
    // 更新用戶名稱
    const userName = document.getElementById('user-name');
    if (userName) {
        userName.textContent = user.displayName || user.email.split('@')[0];
    }
    
    // 更新用戶郵箱
    const userEmail = document.getElementById('user-email');
    if (userEmail) {
        userEmail.textContent = user.email;
    }
    
    // 檢查是否需要刷新用戶數據（從付款成功頁面返回）
    const needRefresh = localStorage.getItem('refreshUserData');
    const newPlan = localStorage.getItem('newPlan');
    
    if (needRefresh === 'true' && newPlan) {
        console.log('檢測到方案更新，刷新用戶數據:', newPlan);
        localStorage.removeItem('refreshUserData');
        localStorage.removeItem('newPlan');
        
        // 顯示方案更新通知
        showNotice(`方案已成功切換為 ${newPlan === 'basic' ? '基本方案' : '進階方案'}！`, 'success');
    }
    
    // 載入用戶生成數據
    loadUserGenerationData(user.uid);
}

// 載入用戶生成數據
async function loadUserGenerationData(userId) {
    try {
        console.log('開始載入用戶生成數據:', userId);
        
        // 檢查 Firestore 是否可用
        if (!firebase.firestore) {
            throw new Error('Firestore 不可用');
        }
        
        const userDoc = await firebase.firestore().collection('users').doc(userId).get();
        console.log('用戶文檔存在:', userDoc.exists);
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            console.log('用戶數據:', userData);
            userGenerationData = userData.generationData || {
                currentPlan: 'free',
                startDate: new Date().toISOString(),
                generationCount: 0,
                lastResetDate: new Date().toISOString()
            };
        } else {
            // 新用戶，創建默認數據
            console.log('創建新用戶數據');
            userGenerationData = {
                currentPlan: 'free',
                startDate: new Date().toISOString(),
                generationCount: 0,
                lastResetDate: new Date().toISOString()
            };
            await saveUserGenerationData(userId);
        }
        
        // 檢查是否需要重置（30天週期）
        await checkAndResetGenerationCount(userId);
        
        // 更新UI顯示
        updateGenerationDisplay();
        console.log('用戶生成數據載入完成:', userGenerationData);
    } catch (error) {
        console.error('載入用戶生成數據失敗:', error);
        console.error('錯誤詳情:', error.message, error.code);
        
        // 使用默認數據
        userGenerationData = {
            currentPlan: 'free',
            startDate: new Date().toISOString(),
            generationCount: 0,
            lastResetDate: new Date().toISOString()
        };
        updateGenerationDisplay();
        
        // 顯示錯誤通知
        showNotice('無法載入用戶數據，使用默認設置', 'warning');
    }
}

// 保存用戶生成數據
async function saveUserGenerationData(userId) {
    try {
        console.log('保存用戶生成數據:', userId, userGenerationData);
        
        // 檢查 Firestore 是否可用
        if (!firebase.firestore) {
            throw new Error('Firestore 不可用');
        }
        
        await firebase.firestore().collection('users').doc(userId).set({
            generationData: userGenerationData
        }, { merge: true });
        
        console.log('用戶生成數據保存成功');
    } catch (error) {
        console.error('保存用戶生成數據失敗:', error);
        console.error('錯誤詳情:', error.message, error.code);
        
        // 顯示錯誤通知
        showNotice('無法保存用戶數據，請檢查網絡連接', 'error');
    }
}

// 檢查並重置生成數量（30天週期）
async function checkAndResetGenerationCount(userId) {
    const now = new Date();
    const lastReset = new Date(userGenerationData.lastResetDate);
    const daysDiff = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 30) {
        // 重置生成數量
        userGenerationData.generationCount = 0;
        userGenerationData.lastResetDate = now.toISOString();
        await saveUserGenerationData(userId);
        console.log('生成數量已重置（30天週期）');
    }
}

// 更新生成數量顯示
function updateGenerationDisplay() {
    if (!userGenerationData) return;
    console.log('更新生成數量顯示:', userGenerationData);
    
    const currentPlan = document.getElementById('current-plan');
    const generationCount = document.getElementById('generation-count');
    
    if (currentPlan) {
        const planNames = {
            'free': '免費',
            'basic': '基本',
            'advanced': '進階'
        };
        currentPlan.textContent = planNames[userGenerationData.currentPlan] || '免費';
        currentPlan.className = `plan-badge ${userGenerationData.currentPlan === 'free' ? '' : userGenerationData.currentPlan}`;
    }
    
    if (generationCount) {
        const limit = PLAN_LIMITS[userGenerationData.currentPlan];
        if (limit === -1) {
            generationCount.textContent = `${userGenerationData.generationCount}/∞`;
        } else {
            generationCount.textContent = `${userGenerationData.generationCount}/${limit}`;
        }
    }
}

// 檢查生成限制
function checkGenerationLimit() {
    if (!userGenerationData) return false;
    
    const limit = PLAN_LIMITS[userGenerationData.currentPlan];
    if (limit === -1) {
        return true; // 無限制
    }
    
    return userGenerationData.generationCount < limit;
}

// 增加生成數量
async function incrementGenerationCount(userId) {
    if (!userGenerationData) return;
    
    userGenerationData.generationCount++;
    await saveUserGenerationData(userId);
    updateGenerationDisplay();
}

// 更新未登入用戶的 UI
function updateUIForLoggedOutUser() {
    console.log('更新未登入用戶 UI');
    
    // 顯示登入按鈕
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.style.display = 'block';
    }
    
    // 顯示註冊按鈕（如果存在）
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.style.display = 'block';
    }
    
    // 移除用戶按鈕
    const userBtn = document.getElementById('user-btn');
    if (userBtn) {
        userBtn.remove();
    }
    
    // 保持生成圖片按鈕可見（未登入用戶也可以看到）
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.style.display = 'block';
    }
}

// 登錄函數
async function login(email, password) {
    try {
        console.log('嘗試登錄:', email);
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('登錄成功:', userCredential.user.email);
        showNotice('登錄成功！', 'success');
        return userCredential.user;
    } catch (error) {
        console.error('登錄失敗:', error);
        let errorMessage = '登錄失敗，請重試';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = '用戶不存在';
                break;
            case 'auth/wrong-password':
                errorMessage = '密碼錯誤';
                break;
            case 'auth/invalid-email':
                errorMessage = '電子郵件格式不正確';
                break;
            case 'auth/user-disabled':
                errorMessage = '用戶已被禁用';
                break;
        }
        
        showNotice(errorMessage, 'error');
        throw error;
    }
}

// 註冊函數
async function register(email, password) {
    try {
        console.log('嘗試註冊:', email);
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        console.log('註冊成功:', userCredential.user.email);
        showNotice('註冊成功！', 'success');
        return userCredential.user;
    } catch (error) {
        console.error('註冊失敗:', error);
        let errorMessage = '註冊失敗，請重試';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = '電子郵件已被使用';
                break;
            case 'auth/invalid-email':
                errorMessage = '電子郵件格式不正確';
                break;
            case 'auth/weak-password':
                errorMessage = '密碼太弱，請使用至少6個字符';
                break;
        }
        
        showNotice(errorMessage, 'error');
        throw error;
    }
}

// Google 登錄函數
async function signInWithGoogle() {
    try {
        console.log('開始 Google 登錄流程');
        
        // 檢查 Google 提供者是否可用
        if (!firebase.auth.GoogleAuthProvider) {
            throw new Error('Google 認證提供者不可用');
        }
        
        const provider = new firebase.auth.GoogleAuthProvider();
        
        // 設置額外的 OAuth 參數
        provider.addScope('email');
        provider.addScope('profile');
        
        console.log('使用 Google 提供者登錄');
        const result = await firebase.auth().signInWithPopup(provider);
        
        console.log('Google 登錄成功:', result.user.email);
        showNotice('Google 登錄成功！', 'success');
        
        // 關閉模態框
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');
        if (loginModal) loginModal.classList.add('hidden');
        if (signupModal) signupModal.classList.add('hidden');
        
        return result.user;
    } catch (error) {
        console.error('Google 登錄失敗:', error);
        let errorMessage = 'Google 登錄失敗，請重試';
        
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = '登錄被用戶取消';
                break;
            case 'auth/popup-blocked':
                errorMessage = '彈出視窗被阻擋，請允許彈出視窗';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = '登錄請求被取消';
                break;
            case 'auth/account-exists-with-different-credential':
                errorMessage = '此電子郵件已用其他方式註冊';
                break;
        }
        
        showNotice(errorMessage, 'error');
        throw error;
    }
}

// 登出函數
async function logout() {
    try {
        console.log('開始登出流程...');
        
        // 檢查當前用戶狀態
        const currentUser = firebase.auth().currentUser;
        console.log('當前用戶:', currentUser ? currentUser.email : '無');
        
        await firebase.auth().signOut();
        console.log('Firebase 登出成功');
        
        // 關閉用戶面板
        const userPanelModal = document.getElementById('user-panel-modal');
        if (userPanelModal) {
            userPanelModal.classList.add('hidden');
            userPanelModal.classList.remove('show');
            console.log('用戶面板已關閉');
        }
        
        showNotice('已登出', 'info');
        updateUIForLoggedOutUser();
        console.log('登出流程完成');
    } catch (error) {
        console.error('登出失敗:', error);
        showNotice('登出失敗', 'error');
    }
}

// 全局登出函數（確保可以在任何地方調用）
window.logout = logout;

// 圖片生成功能
async function generateImage() {
    const user = firebase.auth().currentUser;
    if (!user) {
        showNotice('請先登入以使用圖片生成功能', 'warning');
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.classList.remove('hidden');
            loginModal.classList.add('show');
        }
        return;
    }
    
    // 檢查生成限制
    // if (!checkGenerationLimit()) {
    //     showNotice('您已達到本月生成限制，請升級方案以繼續使用', 'warning');
    //     // 跳轉到升級頁面
    //     window.location.href = 'pricing.html';
    //     return;
    // }
    
    const prompt = document.getElementById('prompt').value.trim();
    const selectedStyleCard = document.querySelector('.style-card.selected');
    const style = selectedStyleCard ? selectedStyleCard.getAttribute('data-style') : 'retro';
    
    if (!prompt) {
        showNotice('請輸入提示詞', 'warning');
        // return;
    }
    
    try {
        // 隱藏預覽佔位符
        const previewPlaceholder = document.getElementById('preview-placeholder');
        if (previewPlaceholder) {
            previewPlaceholder.style.display = 'none';
        }
        
        // 顯示 Circle Loading（持續顯示直到圖片生成完成）
        startCountdown(999, () => {
            // 這個回調不會被調用，因為我們會在圖片加載完成時手動停止
        });
        
        // 暫時禁用 Firebase Functions，直接使用備用方案
        console.log('使用備用方案生成圖片（Firebase Functions 暫時禁用）...');
        await generateImagesDirectly(prompt, style);
        
    } catch (error) {
        console.error('圖片生成錯誤:', error);
        showNotice('生成錯誤: ' + error.message, 'error');
        // stopCountdown();
    }
}

// 顯示結果
function displayResult(images, prompt, style) {
    console.log('🎉 圖片生成完成！');
    console.log('📝 提示詞:', prompt);
    console.log('🎨 風格:', style);
    console.log('🖼️ 圖片數量:', images ? images.length : 0);
    console.log('🔗 圖片 URL:', images && images.length > 0 ? images[0] : '無');
    
    const resultElement = document.getElementById('result');
    if (!resultElement) return;
    
    resultElement.innerHTML = '';
    
    // 顯示第一張生成的圖片
    if (images && images.length > 0) {
        const img = document.createElement('img');
        img.alt = `${prompt}`;
        img.className = 'generated-image';
        img.loading = 'lazy';
        img.src = images[0];
        
        // 使用備用圖片加載機制
        loadImageWithFallback(img, images[0]);
        
        resultElement.appendChild(img);
        
        // 更新下載和分享按鈕
        updatePreviewActions(images[0], prompt);
    }
    
    resultElement.classList.remove('hidden');
    resultElement.style.display = 'flex';
    
    // 保存生成記錄到 Firestore（如果用戶已登入）
    if (currentUser) {
        saveGenerationToFirestore(currentUser.uid, prompt, images, style);
    }
}

// 更新下載和分享按鈕
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

// 備用方案 - 使用 Pollinations API
async function generateImagesDirectly(prompt, style) {
    try {
        console.log('使用備用方案生成圖片...');
        
        const selectedStyle = STYLE_MAP[style] || 'dark mechanical';
        const enhancedPrompt = `${prompt}, ${selectedStyle}, high quality, detailed, artwork`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        
        // 生成多張圖片 URL
        const timestamp = Date.now();
        const imageUrls = [];
        for (let i = 1; i <= IMAGES_TO_GENERATE; i++) {
            imageUrls.push(
                `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${timestamp + i}&nologo=true`
            );
        }
        
        console.log('備用方案圖片生成完成');
        // 增加生成數量
        const user = firebase.auth().currentUser;
        if (user) {
            await incrementGenerationCount(user.uid);
        }
        displayResult(imageUrls, prompt, style);
        
    } catch (error) {
        console.error('備用方案錯誤:', error);
        displayFallbackImages(prompt, style);
    }
}

// 圖片加載備用機制
function loadImageWithFallback(imgElement, imageUrl) {
    let errorHandled = false;
    
    imgElement.onload = function() {
        console.log('圖片加載成功:', imageUrl);
        stopCountdown();
    };
    
    imgElement.onerror = function() {
        if (!errorHandled) {
            errorHandled = true;
            console.error('圖片加載失敗，使用備用圖片:', imageUrl);
            // 使用備用的 SVG 圖片
            imgElement.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#1a1a2e"/><text x="256" y="256" font-family="Arial" font-size="14" fill="white" text-anchor="middle">圖片生成失敗</text><text x="256" y="280" font-family="Arial" font-size="12" fill="#ccc" text-anchor="middle">請重試或檢查網絡</text></svg>';
            
            // 移除事件監聽器避免無限循環
            imgElement.onerror = null;
            imgElement.onload = null;
        }
    };
    
    // 開始加載圖片
    imgElement.src = imageUrl;
}

// 下載圖片功能
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
        console.error('下載錯誤:', error);
        showNotice('下載失敗，請重試', 'error');
    }
}

// 分享圖片功能
function shareImage(imageUrl) {
    if (navigator.share) {
        navigator.share({
            title: 'AI生成圖片',
            text: '使用AI生成的圖片',
            url: imageUrl
        }).catch(error => {
            console.error('分享失敗:', error);
        });
    } else {
        navigator.clipboard.writeText(imageUrl)
            .then(() => {
                showNotice('圖片鏈接已複製到剪貼板', 'success');
            })
            .catch(error => {
                console.error('複製失敗:', error);
                showNotice('複製失敗，請手動複製: ' + imageUrl, 'error');
            });
    }
}

// 顯示備用圖片
function displayFallbackImages(prompt, style = 'retro') {
    const fallbackImages = [
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#1a1a2e"/><text x="256" y="256" font-family="Arial" font-size="20" fill="white" text-anchor="middle">生成失敗</text></svg>'
    ];
    
    displayResult(fallbackImages, prompt, style);
}

// 保存生成記錄到 Firestore
async function saveGenerationToFirestore(userId, prompt, imageUrls, style) {
    try {
        // 確保 style 不為 undefined
        const validStyle = style || 'retro';
        
        await firebase.firestore().collection('generations').add({
            userId: userId,
            prompt: prompt,
            images: imageUrls,
            style: validStyle,
            createdAt: new Date().toISOString(),
            timestamp: new Date().getTime()
        });
        console.log('生成記錄已保存到 Firestore');
    } catch (error) {
        console.error('保存到 Firestore 錯誤:', error);
        // 備用方案：保存到 localStorage
        saveGenerationToLocalStorage(userId, prompt, imageUrls, style || 'retro');
    }
}

// 保存生成記錄到 localStorage
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

// 全局下載圖片功能
window.downloadImage = downloadImage;

// 分享圖片功能
window.shareImage = function(imageUrl) {
    const user = firebase.auth().currentUser;
    if (!user) {
        showNotice('請先登入以分享圖片', 'warning');
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.classList.remove('hidden');
            loginModal.classList.add('show');
        }
        return;
    }
    
    if (navigator.share) {
        navigator.share({
            title: 'GenFred.ai 生成的圖片',
            text: '查看我在 GenFred.ai 生成的恐怖圖片！',
            url: imageUrl
        });
    } else {
        // 複製到剪貼板
        navigator.clipboard.writeText(imageUrl).then(() => {
            showNotice('圖片連結已複製到剪貼板', 'success');
        });
    }
};

// 翻譯功能
function translatePage() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
}

// 初始化語言
function initLanguage() {
    // 從 localStorage 獲取語言設置，默認為中文
    language = localStorage.getItem('language') || 'zh';
    console.log('當前語言:', language);
    
    // 設置語言選擇器的值
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = language;
    }
    
    translatePage();
}

// 初始化事件監聽器
function initEventListeners() {
    console.log('初始化事件監聽器...');
    
    // 登錄按鈕
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const loginModal = document.getElementById('login-modal');
            if (loginModal) {
                loginModal.classList.remove('hidden');
                loginModal.classList.add('show');
            }
        });
    }
    
    // 註冊按鈕
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            const signupModal = document.getElementById('signup-modal');
            if (signupModal) {
                signupModal.classList.remove('hidden');
                signupModal.classList.add('show');
            }
        });
    }
    
    // Google 登錄按鈕
    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            console.log('Google 登錄按鈕被點擊');
            signInWithGoogle();
        });
    }
    
    // Google 註冊按鈕
    const googleSignupBtn = document.getElementById('google-signup-btn');
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', function() {
            console.log('Google 註冊按鈕被點擊');
            signInWithGoogle();
        });
    }
    
    // 關閉模態框
    const closeBtns = document.querySelectorAll('.close, .close-modal');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('show');
            }
        });
    });
    
    // 登錄表單
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            try {
                await login(email, password);
                const loginModal = document.getElementById('login-modal');
                if (loginModal) {
                    loginModal.classList.add('hidden');
                    loginModal.classList.remove('show');
                }
            } catch (error) {
                // 錯誤已在 login 函數中處理
            }
        });
    }
    
    // 註冊表單
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            
            try {
                await register(email, password);
                const signupModal = document.getElementById('signup-modal');
                if (signupModal) {
                    signupModal.classList.add('hidden');
                    signupModal.classList.remove('show');
                }
            } catch (error) {
                // 錯誤已在 register 函數中處理
            }
        });
    }
    
    // 切換到註冊
    const switchToSignupBtn = document.getElementById('switch-to-signup');
    if (switchToSignupBtn) {
        switchToSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const loginModal = document.getElementById('login-modal');
            const signupModal = document.getElementById('signup-modal');
            
            if (loginModal) loginModal.classList.add('hidden');
            if (signupModal) signupModal.classList.remove('hidden');
        });
    }
    
    // 切換到登錄
    const switchToLoginBtn = document.getElementById('switch-to-login');
    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const loginModal = document.getElementById('login-modal');
            const signupModal = document.getElementById('signup-modal');
            
            if (signupModal) signupModal.classList.add('hidden');
            if (loginModal) loginModal.classList.remove('hidden');
        });
    }
    
    // 生成圖片按鈕
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateImage);
    }
    
    // 風格卡片選擇
    const styleCards = document.querySelectorAll('.style-card');
    styleCards.forEach(card => {
        card.addEventListener('click', function() {
            // 移除其他卡片的選中狀態
            styleCards.forEach(c => c.classList.remove('selected'));
            // 添加當前卡片的選中狀態
            this.classList.add('selected');
            console.log('選中風格:', this.getAttribute('data-style'));
        });
    });
    
    // 設置默認選中第一個風格
    if (styleCards.length > 0) {
        styleCards[0].classList.add('selected');
    }
    
    // 升級方案按鈕
    const payButton = document.getElementById('pay-button');
    if (payButton) {
        payButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = 'pricing.html';
        });
    }
    
    // 語言選擇
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            language = this.value;
            localStorage.setItem('language', language);
            translatePage();
        });
    }
    
    // 用戶面板登出按鈕
    const userLogoutBtn = document.getElementById('logout-btn');
    if (userLogoutBtn) {
        console.log('找到用戶面板登出按鈕，添加事件監聽器');
        userLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('用戶面板登出按鈕被點擊');
            logout();
        });
    } else {
        console.log('❌ 找不到用戶面板登出按鈕');
    }
    
    // 用戶面板升級方案按鈕
    const userBuyCreditsBtn = document.getElementById('buy-credits-btn');
    if (userBuyCreditsBtn) {
        userBuyCreditsBtn.addEventListener('click', function() {
            console.log('用戶面板升級方案按鈕被點擊');
            window.location.href = 'pricing.html';
        });
    }
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 網站載入完成，開始初始化...');
    
    // 檢查 Firebase 是否可用
    if (typeof firebase === 'undefined') {
        console.error('Firebase 未載入');
        showNotice('Firebase 未載入，請重新整理頁面', 'error');
        return;
    }
    
    console.log('Firebase 已載入，版本:', firebase.SDK_VERSION);
    
    initLanguage();
    initEventListeners();
    console.log('✅ 網站初始化完成！');
});
