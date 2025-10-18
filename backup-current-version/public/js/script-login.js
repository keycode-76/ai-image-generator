// 簡化的登錄系統
console.log('🚀 簡化登錄系統載入中...');

// 全局變數
let currentUser = null;

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
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // 根據類型設置顏色
    switch (type) {
        case 'success':
            notice.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notice.style.backgroundColor = '#f44336';
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
        notice.style.transform = 'translateX(0)';
    }, 100);
    
    // 自動隱藏
    setTimeout(() => {
        notice.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notice.parentNode) {
                notice.parentNode.removeChild(notice);
            }
        }, 300);
    }, 3000);
}

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
    translatePage();
}

// 簡化的用戶登錄狀態檢查
function checkLoginStatus() {
    const user = firebase.auth().currentUser;
    console.log('檢查登錄狀態:', user ? '已登錄' : '未登錄');
    return user;
}

// 更新已登錄用戶的 UI
function updateUIForLoggedInUser(user) {
    console.log('更新已登錄用戶 UI:', user.email);
    
    // 隱藏登錄按鈕
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.style.display = 'none';
    }
    
    // 顯示用戶信息
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.style.display = 'block';
        userInfo.innerHTML = `
            <span>歡迎, ${user.email}</span>
            <button onclick="logout()" class="btn-logout">登出</button>
        `;
    }
    
    // 顯示生成圖片按鈕
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.style.display = 'block';
    }
}

// 更新未登錄用戶的 UI
function updateUIForLoggedOutUser() {
    console.log('更新未登錄用戶 UI');
    
    // 顯示登錄按鈕
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.style.display = 'block';
    }
    
    // 隱藏用戶信息
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.style.display = 'none';
    }
    
    // 隱藏生成圖片按鈕
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.style.display = 'none';
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

// 登出函數
async function logout() {
    try {
        await firebase.auth().signOut();
        console.log('登出成功');
        showNotice('已登出', 'info');
        updateUIForLoggedOutUser();
    } catch (error) {
        console.error('登出失敗:', error);
        showNotice('登出失敗', 'error');
    }
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
    
    // 關閉模態框
    const closeBtns = document.querySelectorAll('.close-modal');
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
    
    // 升級方案按鈕
    const payButton = document.getElementById('pay-button');
    if (payButton) {
        payButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = 'pricing.html';
        });
    }
}

// Firebase 認證狀態監聽器
firebase.auth().onAuthStateChanged(function(user) {
    console.log('認證狀態變化:', user ? '已登入' : '已登出');
    if (user) {
        console.log('用戶信息:', user.email);
        currentUser = user;
        updateUIForLoggedInUser(user);
    } else {
        console.log('用戶已登出');
        currentUser = null;
        updateUIForLoggedOutUser();
    }
});

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 簡化登錄系統初始化完成！');
    initLanguage();
    initEventListeners();
    console.log('✅ 簡化登錄系統準備就緒！');
});