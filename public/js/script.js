// // 網站主要 JavaScript 邏輯
// console.log('🚀 網站載入完成，開始初始化...');

// // 全局變數
//     let currentUser = null;

// // 通知函數
// function showNotice(message, type = 'info') {
//     // 移除現有的通知
//     const existingNotice = document.querySelector('.notice');
//     if (existingNotice) {
//         existingNotice.remove();
//     }
    
//     // 創建通知元素
//     const notice = document.createElement('div');
//     notice.className = `notice notice-${type}`;
//     notice.textContent = message;
    
//     // 添加樣式
//     notice.style.cssText = `
//         position: fixed;
//         top: 20px;
//         right: 20px;
//         padding: 15px 20px;
//         border-radius: 5px;
//         color: white;
//         font-weight: 500;
//         z-index: 10000;
//         max-width: 300px;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.3);
//         transform: translateX(100%);
//         transition: transform 0.3s ease;
//     `;
    
//     // 根據類型設置顏色
//     switch (type) {
//         case 'success':
//             notice.style.backgroundColor = '#4CAF50';
//             break;
//         case 'error':
//             notice.style.backgroundColor = '#f44336';
//             break;
//         case 'warning':
//             notice.style.backgroundColor = '#ff9800';
//             break;
//         default:
//             notice.style.backgroundColor = '#2196F3';
//     }
    
//     // 添加到頁面
//     document.body.appendChild(notice);
    
//     // 動畫顯示
//     setTimeout(() => {
//         notice.style.transform = 'translateX(0)';
//     }, 100);
    
//     // 自動移除
//     setTimeout(() => {
//         notice.style.transform = 'translateX(100%)';
//     setTimeout(() => {
//         if (notice.parentNode) {
//             notice.parentNode.removeChild(notice);
//         }
//         }, 300);
//     }, 3000);
// }

// // 翻譯功能
// function translatePage() {
//     const elements = document.querySelectorAll('[data-translate]');
//     elements.forEach(element => {
//         const key = element.getAttribute('data-translate');
//         if (translations[window.currentLanguage] && translations[window.currentLanguage][key]) {
//             element.textContent = translations[window.currentLanguage][key];
//         }
//     });
// }

// // 初始化語言
// function initLanguage() {
//     // 設置默認語言
//     window.currentLanguage = 'zh';
    
//     // 語言選擇器事件
//     const languageSelect = document.getElementById('language-select');
//     if (languageSelect) {
//         languageSelect.addEventListener('change', function() {
//             window.currentLanguage = this.value;
//             translatePage();
//         });
//     }
    
//     // 初始翻譯
//     translatePage();
// }

// // 初始化事件監聽器
// function initEventListeners() {
//     console.log('初始化事件監聽器...');
    
//     // 獲取 DOM 元素
//     const promptInput = document.getElementById('prompt');
//     const styleSelect = document.getElementById('style');
//     const generateBtn = document.getElementById('generate-btn');
//     const loadingElement = document.getElementById('loading');
//     const resultElement = document.getElementById('result');
//     const countdownContainer = document.getElementById('countdown-container');
    
//     const loginBtn = document.getElementById('login-btn');
//     const signupBtn = document.getElementById('signup-btn');
//     const loginModal = document.getElementById('login-modal');
//     const signupModal = document.getElementById('signup-modal');
//     const loginForm = document.getElementById('login-form');
//     const signupForm = document.getElementById('signup-form');
//     const logoutBtn = document.getElementById('logout-btn');
    
//     // 圖片生成功能
//     async function generateImage() {
//         // 檢查用戶是否已登入
//         const user = firebase.auth().currentUser;
//         if (!user) {
//             showNotice('請先登入以使用圖片生成功能', 'warning');
//             // 自動跳出登入模態框
//             if (loginModal) {
//                 loginModal.classList.remove('hidden');
//                 loginModal.classList.add('show');
//             }
//             return;
//         }
        
//         if (!promptInput || !promptInput.value.trim()) {
//             showNotice('請輸入圖片描述', 'warning');
//             return;
//         }
        
//         const prompt = promptInput.value.trim();
//         const style = styleSelect ? styleSelect.value : 'core';
        
//         // 顯示載入狀態
//         if (loadingElement) {
//             loadingElement.style.display = 'block';
//         }
        
//         if (resultElement) {
//             resultElement.innerHTML = '';
//         }
        
//         try {
//             // 模擬圖片生成（暫時移除 Firebase Functions 依賴）
//             const result = { 
//                 data: { 
//                     success: true, 
//                     images: [
//                         {
//                             url: "https://via.placeholder.com/512x512/ff2828/ffffff?text=Generated+Image",
//                 style: style,
//                             prompt: prompt
//                         }
//                     ]
//                 } 
//             };
            
//             // 處理生成結果
//             if (result.data.success && result.data.images && result.data.images.length > 0) {
//                 displayResults(result.data.images, prompt, style);
//             } else {
//                 showNotice('圖片生成失敗，請重試', 'error');
//             }
//         } catch (error) {
//             console.error('圖片生成錯誤:', error);
//             showNotice('圖片生成失敗: ' + error.message, 'error');
//         } finally {
//             if (loadingElement) {
//                 loadingElement.style.display = 'none';
//             }
//         }
//     }
    
//     // 顯示生成結果
//     function displayResults(images, prompt, style) {
//         if (!resultElement) return;
        
//         resultElement.innerHTML = '';
        
//         images.forEach((image, index) => {
//             const imageContainer = document.createElement('div');
//             imageContainer.className = 'result-image-container';
//             imageContainer.innerHTML = `
//                 <img src="${image.url}" alt="Generated Image ${index + 1}" class="result-image">
//                 <div class="image-actions">
//                     <button class="btn-download" onclick="downloadImage('${image.url}', '${prompt}_${style}_${index + 1}')">
//                         <i class="fas fa-download"></i> 下載
//                     </button>
//                     <button class="btn-share" onclick="shareImage('${image.url}')">
//                         <i class="fas fa-share"></i> 分享
//                     </button>
//                 </div>
//             `;
//             resultElement.appendChild(imageContainer);
//         });
//     }
        
//         // 生成按鈕
//         if (generateBtn && promptInput) {
//             generateBtn.addEventListener('click', generateImage);
//         }
        
//         // 登入按鈕
//         if (loginBtn) {
//         console.log('登入按鈕事件監聽器已設置');
//             loginBtn.addEventListener('click', function(event) {
//             console.log('登入按鈕被點擊');
//                 if (loginModal) {
//                     loginModal.classList.remove('hidden');
//                 loginModal.classList.add('show');
//                 console.log('登入模態框已顯示');
//             }
//         });
//         }

//         // Premium 按鈕
//         const payButton = document.getElementById('pay-button');
//         if (payButton) {
//         console.log('升級方案按鈕事件監聽器已設置');
//             payButton.addEventListener('click', function(event) {
//             event.preventDefault();
//             console.log('升級方案按鈕被點擊');
//             console.log('跳轉到 pricing.html');
//                     window.location.href = 'pricing.html';
//             });
//         } else {
//         console.log('❌ 找不到升級方案按鈕');
//     }
    
//     // 立即註冊按鈕點擊事件
//     const switchToSignupBtn = document.getElementById('switch-to-signup');
//     if (switchToSignupBtn) {
//         switchToSignupBtn.addEventListener('click', function(e) {
//             e.preventDefault();
//             if (loginModal) {
//                 loginModal.classList.remove('show');
//                 loginModal.classList.add('hidden');
//             }
//             if (signupModal) {
//                 signupModal.classList.remove('hidden');
//                 signupModal.classList.add('show');
//             }
//         });
//     }
    
//     // 立即登入按鈕點擊事件
//     const switchToLoginBtn = document.getElementById('switch-to-login');
//     if (switchToLoginBtn) {
//         switchToLoginBtn.addEventListener('click', function(e) {
//             e.preventDefault();
//             if (signupModal) {
//                 signupModal.classList.remove('show');
//                 signupModal.classList.add('hidden');
//             }
//             if (loginModal) {
//                 loginModal.classList.remove('hidden');
//                 loginModal.classList.add('show');
//             }
//         });
//     }
        
//         // 登入表單
//         if (loginForm) {
//         console.log('🔍 檢查登入表單:', loginForm);
//         console.log('✅ 登入表單事件監聽器已設置');
        
//         // 清除錯誤訊息的事件監聽器
//         const emailInput = document.getElementById('login-email');
//         const passwordInput = document.getElementById('login-password');
        
//         if (emailInput && passwordInput) {
//             [emailInput, passwordInput].forEach(input => {
//                 input.addEventListener('input', function() {
//                     const errorElement = document.getElementById('login-error-message');
//                     if (errorElement) {
//                         errorElement.style.display = 'none';
//                     }
//                 });
//             });
//         }
        
//             loginForm.addEventListener('submit', async function(e) {
//                 e.preventDefault();
//             console.log('登入表單提交事件觸發');
//                 const email = document.getElementById('login-email').value;
//                 const password = document.getElementById('login-password').value;
//             console.log('登入嘗試:', email);
            
//             // 隱藏之前的錯誤訊息
//             const errorElement = document.getElementById('login-error-message');
//             if (errorElement) {
//                 errorElement.style.display = 'none';
//             }
            
//             // 檢查輸入是否有效
//             if (!email || !password) {
//                 if (errorElement) {
//                     const errorText = document.getElementById('login-error-text');
//                     if (errorText) {
//                         errorText.textContent = '請填寫所有欄位';
//                         errorElement.style.display = 'flex';
//                     }
//                 }
//                 return;
//             }
            
//             try {
//                 console.log('開始 Firebase 登入...');
//                 console.log('Firebase 實例:', firebase);
//                 console.log('Firebase Auth 實例:', firebase.auth());
//                 const result = await firebase.auth().signInWithEmailAndPassword(email, password);
//                 console.log('Firebase 登入成功！', result);
//                 console.log('用戶信息:', result.user);
//                     loginModal.style.display = 'none';
//                     loginForm.reset();
//                     showNotice('登入成功！', 'success');
//                 } catch (error) {
//                 // 根據錯誤代碼顯示具體的錯誤訊息
//                 let errorMessage = '登入失敗';
                
//                 switch (error.code) {
//                     case 'auth/user-not-found':
//                         errorMessage = '此電子郵件地址尚未註冊，請先註冊帳號';
//                         break;
//                     case 'auth/wrong-password':
//                         errorMessage = '密碼錯誤，請重新輸入';
//                         break;
//                     case 'auth/invalid-credential':
//                         errorMessage = '電子郵件或密碼不正確，請重新輸入';
//                         break;
//                     case 'auth/invalid-email':
//                         errorMessage = '電子郵件格式不正確';
//                         break;
//                     case 'auth/user-disabled':
//                         errorMessage = '此帳戶已被禁用，請聯繫客服';
//                         break;
//                     case 'auth/too-many-requests':
//                         errorMessage = '登入嘗試次數過多，請稍後再試';
//                         break;
//                     case 'auth/network-request-failed':
//                         errorMessage = '網路連線失敗，請檢查網路連線';
//                         break;
//                     default:
//                         errorMessage = '登入失敗: ' + error.message;
//                 }
                
//                 // 在表單內部顯示錯誤訊息
//                 const errorElement = document.getElementById('login-error-message');
//                 const errorText = document.getElementById('login-error-text');
//                 if (errorElement && errorText) {
//                     errorText.textContent = errorMessage;
//                     errorElement.style.display = 'flex';
//                 }
//                 }
//             });
//         }
        
//         // 註冊表單
//         if (signupForm) {
//             signupForm.addEventListener('submit', async function(e) {
//                 e.preventDefault();
//                 const name = document.getElementById('signup-name').value;
//                 const email = document.getElementById('signup-email').value;
//                 const password = document.getElementById('signup-password').value;
                
//             // 檢查輸入是否有效
//             if (!name || !email || !password) {
//                 showNotice('請填寫所有欄位', 'warning');
//                     return;
//                 }
                
//                 try {
//                 // 直接創建用戶帳號
//                 console.log('開始創建用戶帳號...');
//                 console.log('Email:', email);
//                 console.log('Password length:', password.length);
//                     const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
//                 console.log('用戶創建成功！', userCredential);
//                 console.log('用戶信息:', userCredential.user);
//                     await userCredential.user.updateProfile({
//                         displayName: name
//                     });
//                 console.log('用戶資料更新完成');
                
//                 // 關閉註冊 modal
//                 const signupModal = document.getElementById('signup-modal');
//                 if (signupModal) {
//                     signupModal.classList.remove('show');
//                     signupModal.classList.add('hidden');
//                 }
                
//                     signupForm.reset();
//                     showNotice('註冊成功！', 'success');
//                 } catch (error) {
//                     showNotice('註冊失敗: ' + error.message, 'error');
//                 }
//             });
//         }
        
//     // Google 登入按鈕 - 使用事件委派確保按鈕可用
//     document.addEventListener('click', async function(e) {
//         if (e.target && e.target.id === 'google-login-btn') {
//             e.preventDefault();
//                 try {
//                     const provider = new firebase.auth.GoogleAuthProvider();
//                 await firebase.auth().signInWithRedirect(provider);
//                 } catch (error) {
//                 console.error('Google 登入錯誤:', error);
//                     showNotice('Google 登入失敗: ' + error.message, 'error');
//                 }
//         }
//     });
    
//     // Google 註冊按鈕 - 使用事件委派
//     document.addEventListener('click', async function(e) {
//         if (e.target && e.target.id === 'google-signup-btn') {
//             e.preventDefault();
//                 try {
//                     const provider = new firebase.auth.GoogleAuthProvider();
//                 await firebase.auth().signInWithRedirect(provider);
//                 } catch (error) {
//                 console.error('Google 註冊錯誤:', error);
//                     showNotice('Google 註冊失敗: ' + error.message, 'error');
//                 }
//         }
//     });
        
//         // 登出按鈕
//         if (logoutBtn) {
//             logoutBtn.addEventListener('click', async function() {
//                 try {
//                     await firebase.auth().signOut();
//                     const userPanelModal = document.getElementById('user-panel-modal');
//                 if (userPanelModal) userPanelModal.classList.add('hidden');
//                     showNotice('已登出', 'info');
//                 } catch (error) {
//                     showNotice('登出失敗: ' + error.message, 'error');
//                 }
//             });
//         }
        
//     // 購買積分按鈕
//     const buyCreditsBtn = document.getElementById('buy-credits-btn');
//     if (buyCreditsBtn) {
//         buyCreditsBtn.addEventListener('click', function() {
//             window.location.href = 'pricing.html';
//         });
//     }
    
//     // 關閉按鈕功能
//     document.querySelectorAll('.close').forEach(closeBtn => {
//         closeBtn.addEventListener('click', function() {
//             // 關閉登入模態框
//             const loginModal = document.getElementById('login-modal');
//             if (loginModal) {
//                 loginModal.classList.add('hidden');
//                 loginModal.classList.remove('show');
//             }
            
//             // 關閉註冊模態框
//             const signupModal = document.getElementById('signup-modal');
//                 if (signupModal) {
//                 signupModal.classList.add('hidden');
//                 signupModal.classList.remove('show');
//             }
            
//             // 關閉用戶面板模態框
//             const userPanelModal = document.getElementById('user-panel-modal');
//             if (userPanelModal) {
//                 userPanelModal.classList.add('hidden');
//             }
//         });
//     });
// }

// // 更新已登入用戶的 UI
// function updateUIForLoggedInUser(user) {
//     // 隱藏登入按鈕，顯示用戶信息
//     const loginBtn = document.getElementById('login-btn');
    
//     if (loginBtn) {
//         loginBtn.style.display = 'none';
//     }
    
//     // 升級方案按鈕保持顯示，但會檢查登入狀態
    
//     // 創建用戶按鈕
//     const userBtn = document.createElement('button');
//     userBtn.id = 'user-btn';
//     userBtn.className = 'btn-user';
//     userBtn.innerHTML = `<i class="fas fa-user"></i> ${user.displayName || user.email}`;
//     userBtn.style.display = 'inline-block';
    
//     // 插入到 login-btn 的位置
//     if (loginBtn && loginBtn.parentNode) {
//         loginBtn.parentNode.insertBefore(userBtn, loginBtn.nextSibling);
//     }
// }

// // 更新已登出用戶的 UI
// function updateUIForLoggedOutUser() {
//     const userBtn = document.getElementById('user-btn');
//     const userPanelModal = document.getElementById('user-panel-modal');
    
//     if (userBtn) {
//         userBtn.style.display = 'none';
//     }
    
//     if (userPanelModal) {
//         userPanelModal.classList.add('hidden');
//     }
    
//     // 顯示登入按鈕
//     const loginBtn = document.getElementById('login-btn');
//     if (loginBtn) {
//         loginBtn.style.display = 'inline-block';
//     }
// }

// // 下載圖片功能
// window.downloadImage = function(imageUrl, filename) {
//     // 檢查用戶是否已登入
//     const user = firebase.auth().currentUser;
//     if (!user) {
//         showNotice('請先登入以下載圖片', 'warning');
//         // 自動跳出登入模態框
//             const loginModal = document.getElementById('login-modal');
//             if (loginModal) {
//                 loginModal.classList.remove('hidden');
//             loginModal.classList.add('show');
//         }
//         return;
//     }
    
//     const link = document.createElement('a');
//     link.href = imageUrl;
//     link.download = filename || 'generated-image';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// };

// // 分享圖片功能
// window.shareImage = function(imageUrl) {
//     // 檢查用戶是否已登入
//     const user = firebase.auth().currentUser;
//     if (!user) {
//         showNotice('請先登入以分享圖片', 'warning');
//         // 自動跳出登入模態框
//                 const loginModal = document.getElementById('login-modal');
//         if (loginModal) {
//             loginModal.classList.remove('hidden');
//             loginModal.classList.add('show');
//         }
//                 return;
//             }
            
//     if (navigator.share) {
//         navigator.share({
//             title: 'AI 生成的圖片',
//             text: '看看這張由 AI 生成的圖片！',
//             url: imageUrl
//         });
//     } else {
//         // 複製到剪貼板
//         navigator.clipboard.writeText(imageUrl).then(() => {
//             showNotice('圖片連結已複製到剪貼板', 'success');
//         }).catch(() => {
//             showNotice('無法複製連結', 'error');
//         });
//     }
// };

// // 測試 Firebase 認證功能
// window.testFirebaseAuth = async function() {
//     console.log('🧪 測試 Firebase 認證功能...');
//     try {
//         // 測試創建用戶
//         const testEmail = 'test@example.com';
//         const testPassword = 'testpassword123';
        
//         console.log('嘗試創建測試用戶...');
//         const userCredential = await firebase.auth().createUserWithEmailAndPassword(testEmail, testPassword);
//         console.log('✅ 測試用戶創建成功！', userCredential.user.uid);
        
//         // 立即刪除測試用戶
//         await userCredential.user.delete();
//         console.log('✅ 測試用戶已刪除');
        
//         return true;
//             } catch (error) {
//         console.error('❌ Firebase 認證測試失敗:', error.code, error.message);
//         return false;
//     }
// };

// // Firebase 認證狀態監聽器
//     firebase.auth().onAuthStateChanged(function(user) {
//         console.log('認證狀態變化:', user ? '已登入' : '已登出');
//     if (user) {
//         console.log('用戶信息:', user.email);
//         currentUser = user;
//         updateUIForLoggedInUser(user);
//     } else {
//         console.log('用戶已登出');
//         currentUser = null;
//         updateUIForLoggedOutUser();
//     }
// });

// // 頁面載入完成後初始化
// document.addEventListener('DOMContentLoaded', function() {
//     console.log('✅ 網站初始化完成！');
//     initLanguage();
//     initEventListeners();
// });
