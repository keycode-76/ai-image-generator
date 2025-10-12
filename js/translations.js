// 多語言翻譯數據
const translations = {
    en: {
        // Header
        'Art Center.ai': 'Art Center.ai',
        '首頁': 'Home',
        '畫廊': 'Gallery',
        '關於': 'About',
        '登入': 'Login',
        '註冊': 'Sign Up',
        
        // Hero Section
        '將您的想法轉化為精美圖像': 'Transform Your Ideas into Beautiful Images',
        '免費、無限制、無需註冊，立即開始創作！': 'Free, unlimited, no registration required. Start creating now!',
        
        // Generator Section
        '描述您想要的圖像': 'Describe the image you want',
        '例如：一隻毛茸茸的白貓坐在窗台上，陽光透過窗簾照射進來': 'e.g., A fluffy white cat sitting on a windowsill with sunlight streaming through curtains',
        '風格': 'Style',
        'Core Style': 'Core Style',
        'Retro Pixel': 'Retro Pixel',
        'Cyberpunk': 'Cyberpunk',
        '80\'s Slasher': '80\'s Slasher',
        '比例': 'Aspect Ratio',
        '1:1 (正方形)': '1:1 (Square)',
        '16:9 (寬屏)': '16:9 (Widescreen)',
        '9:16 (垂直)': '9:16 (Portrait)',
        '4:3 (標準)': '4:3 (Standard)',
        '生成圖像': 'Generate Image',
        '正在生成您的圖像...': 'Generating your image...',
        '生成的圖像': 'Generated Image',
        '下載': 'Download',
        '分享': 'Share',
        '重新生成': 'Regenerate',
        
        // Gallery Section
        '靈感畫廊': 'Inspiration Gallery',
        '瀏覽其他用戶創建的精美圖像，獲取創作靈感': 'Browse beautiful images created by other users for creative inspiration',
        
        // About Section
        '關於我們的 AI 圖片生成器': 'About Our AI Image Generator',
        '無限免費使用': 'Unlimited Free Usage',
        '無需註冊，無隱藏費用，無使用限制': 'No registration, no hidden fees, no usage limits',
        '快速生成': 'Fast Generation',
        '在幾秒鐘內將您的描述轉化為高品質圖像': 'Transform your descriptions into high-quality images in seconds',
        '隱私保護': 'Privacy Protection',
        '零數據保留政策，您的提示和生成的圖像不會被存儲': 'Zero data retention policy, your prompts and generated images are not stored',
        '多種風格': 'Multiple Styles',
        '從寫實到動漫，從數位藝術到油畫，多種風格可選': 'From realistic to anime, from digital art to oil painting, multiple styles available',
        
        // Footer
        '&copy; 2024 AI 圖片生成器。保留所有權利。': '&copy; 2024 AI Image Generator. All rights reserved.',
        
        // Login Modal
        '電子郵件': 'Email',
        '密碼': 'Password',
        '還沒有帳號？': "Don't have an account?",
        '立即註冊': 'Sign up now',
        
        // Signup Modal
        '用戶名': 'Username',
        '確認密碼': 'Confirm Password',
        '已有帳號？': 'Already have an account?',
        '立即登入': 'Login now',
        
        // User Panel Modal
        '用戶面板': 'User Panel',
        '歡迎回來，': 'Welcome back, ',
        '您的剩餘生成次數：': 'Your remaining credits: ',
        '登出': 'Logout',
        '購買生成次數': 'Buy Credits',
        
        // Theme buttons
        '白色主題': 'Light Theme',
        '深黑色主題': 'Dark Theme',
        '深藍色主題': 'Blue Theme'
    },
    
    es: {
        // Header
        'Art Center.ai': 'Art Center.ai',
        '首頁': 'Inicio',
        '畫廊': 'Galería',
        '關於': 'Acerca de',
        '登入': 'Iniciar Sesión',
        '註冊': 'Registrarse',
        
        // Hero Section
        '將您的想法轉化為精美圖像': 'Transforma tus ideas en hermosas imágenes',
        '免費、無限制、無需註冊，立即開始創作！': '¡Gratis, ilimitado, sin registro requerido. Comienza a crear ahora!',
        
        // Generator Section
        '描述您想要的圖像': 'Describe la imagen que quieres',
        '例如：一隻毛茸茸的白貓坐在窗台上，陽光透過窗簾照射進來': 'ej., Un gato blanco esponjoso sentado en el alféizar con luz solar filtrándose por las cortinas',
        '風格': 'Estilo',
        'Core Style': 'Estilo Core',
        'Retro Pixel': 'Pixel Retro',
        'Cyberpunk': 'Cyberpunk',
        '80\'s Slasher': 'Slasher 80\'s',
        '比例': 'Proporción',
        '1:1 (正方形)': '1:1 (Cuadrado)',
        '16:9 (寬屏)': '16:9 (Panorámico)',
        '9:16 (垂直)': '9:16 (Retrato)',
        '4:3 (標準)': '4:3 (Estándar)',
        '生成圖像': 'Generar Imagen',
        '正在生成您的圖像...': 'Generando tu imagen...',
        '生成的圖像': 'Imagen Generada',
        '下載': 'Descargar',
        '分享': 'Compartir',
        '重新生成': 'Regenerar',
        
        // Gallery Section
        '靈感畫廊': 'Galería de Inspiración',
        '瀏覽其他用戶創建的精美圖像，獲取創作靈感': 'Explora hermosas imágenes creadas por otros usuarios para inspiración creativa',
        
        // About Section
        '關於我們的 AI 圖片生成器': 'Acerca de Nuestro Generador de Imágenes IA',
        '無限免費使用': 'Uso Gratuito Ilimitado',
        '無需註冊，無隱藏費用，無使用限制': 'Sin registro, sin tarifas ocultas, sin límites de uso',
        '快速生成': 'Generación Rápida',
        '在幾秒鐘內將您的描述轉化為高品質圖像': 'Transforma tus descripciones en imágenes de alta calidad en segundos',
        '隱私保護': 'Protección de Privacidad',
        '零數據保留政策，您的提示和生成的圖像不會被存儲': 'Política de cero retención de datos, tus prompts e imágenes generadas no se almacenan',
        '多種風格': 'Múltiples Estilos',
        '從寫實到動漫，從數位藝術到油畫，多種風格可選': 'Desde realista hasta anime, desde arte digital hasta pintura al óleo, múltiples estilos disponibles',
        
        // Footer
        '&copy; 2024 AI 圖片生成器。保留所有權利。': '&copy; 2024 Generador de Imágenes IA. Todos los derechos reservados.',
        
        // Login Modal
        '電子郵件': 'Correo Electrónico',
        '密碼': 'Contraseña',
        '還沒有帳號？': '¿No tienes una cuenta?',
        '立即註冊': 'Regístrate ahora',
        
        // Signup Modal
        '用戶名': 'Nombre de Usuario',
        '確認密碼': 'Confirmar Contraseña',
        '已有帳號？': '¿Ya tienes una cuenta?',
        '立即登入': 'Inicia sesión ahora',
        
        // User Panel Modal
        '用戶面板': 'Panel de Usuario',
        '歡迎回來，': 'Bienvenido de vuelta, ',
        '您的剩餘生成次數：': 'Tus créditos restantes: ',
        '登出': 'Cerrar Sesión',
        '購買生成次數': 'Comprar Créditos',
        
        // Theme buttons
        '白色主題': 'Tema Claro',
        '深黑色主題': 'Tema Oscuro',
        '深藍色主題': 'Tema Azul'
    },
    
    de: {
        // Header
        'Art Center.ai': 'Art Center.ai',
        '首頁': 'Startseite',
        '畫廊': 'Galerie',
        '關於': 'Über uns',
        '登入': 'Anmelden',
        '註冊': 'Registrieren',
        
        // Hero Section
        '將您的想法轉化為精美圖像': 'Verwandeln Sie Ihre Ideen in wunderschöne Bilder',
        '免費、無限制、無需註冊，立即開始創作！': 'Kostenlos, unbegrenzt, keine Registrierung erforderlich. Jetzt mit dem Erstellen beginnen!',
        
        // Generator Section
        '描述您想要的圖像': 'Beschreiben Sie das gewünschte Bild',
        '例如：一隻毛茸茸的白貓坐在窗台上，陽光透過窗簾照射進來': 'z.B., Eine flauschige weiße Katze sitzt auf einem Fensterbrett mit Sonnenlicht durch Vorhänge',
        '風格': 'Stil',
        'Core Style': 'Core Stil',
        'Retro Pixel': 'Retro Pixel',
        'Cyberpunk': 'Cyberpunk',
        '80\'s Slasher': '80\'er Slasher',
        '比例': 'Seitenverhältnis',
        '1:1 (正方形)': '1:1 (Quadrat)',
        '16:9 (寬屏)': '16:9 (Breitbild)',
        '9:16 (垂直)': '9:16 (Hochformat)',
        '4:3 (標準)': '4:3 (Standard)',
        '生成圖像': 'Bild Generieren',
        '正在生成您的圖像...': 'Ihr Bild wird generiert...',
        '生成的圖像': 'Generiertes Bild',
        '下載': 'Herunterladen',
        '分享': 'Teilen',
        '重新生成': 'Neu Generieren',
        
        // Gallery Section
        '靈感畫廊': 'Inspirations-Galerie',
        '瀏覽其他用戶創建的精美圖像，獲取創作靈感': 'Durchstöbern Sie wunderschöne Bilder anderer Benutzer für kreative Inspiration',
        
        // About Section
        '關於我們的 AI 圖片生成器': 'Über Unseren KI-Bildgenerator',
        '無限免費使用': 'Unbegrenzte Kostenlose Nutzung',
        '無需註冊，無隱藏費用，無使用限制': 'Keine Registrierung, keine versteckten Gebühren, keine Nutzungsbeschränkungen',
        '快速生成': 'Schnelle Generierung',
        '在幾秒鐘內將您的描述轉化為高品質圖像': 'Verwandeln Sie Ihre Beschreibungen in Sekunden in hochwertige Bilder',
        '隱私保護': 'Datenschutz',
        '零數據保留政策，您的提示和生成的圖像不會被存儲': 'Null-Daten-Aufbewahrungsrichtlinie, Ihre Prompts und generierten Bilder werden nicht gespeichert',
        '多種風格': 'Mehrere Stile',
        '從寫實到動漫，從數位藝術到油畫，多種風格可選': 'Von realistisch bis Anime, von digitaler Kunst bis Ölgemälde, mehrere Stile verfügbar',
        
        // Footer
        '&copy; 2024 AI 圖片生成器。保留所有權利。': '&copy; 2024 KI-Bildgenerator. Alle Rechte vorbehalten.',
        
        // Login Modal
        '電子郵件': 'E-Mail',
        '密碼': 'Passwort',
        '還沒有帳號？': 'Noch kein Konto?',
        '立即註冊': 'Jetzt registrieren',
        
        // Signup Modal
        '用戶名': 'Benutzername',
        '確認密碼': 'Passwort Bestätigen',
        '已有帳號？': 'Bereits ein Konto?',
        '立即登入': 'Jetzt anmelden',
        
        // User Panel Modal
        '用戶面板': 'Benutzer-Panel',
        '歡迎回來，': 'Willkommen zurück, ',
        '您的剩餘生成次數：': 'Ihre verbleibenden Credits: ',
        '登出': 'Abmelden',
        '購買生成次數': 'Credits Kaufen',
        
        // Theme buttons
        '白色主題': 'Helles Theme',
        '深黑色主題': 'Dunkles Theme',
        '深藍色主題': 'Blaues Theme'
    },
    
    ja: {
        // Header
        'Art Center.ai': 'Art Center.ai',
        '首頁': 'ホーム',
        '畫廊': 'ギャラリー',
        '關於': 'について',
        '登入': 'ログイン',
        '註冊': '登録',
        
        // Hero Section
        '將您的想法轉化為精美圖像': 'あなたのアイデアを美しい画像に変換',
        '免費、無限制、無需註冊，立即開始創作！': '無料、無制限、登録不要。今すぐ作成を始めましょう！',
        
        // Generator Section
        '描述您想要的圖像': '欲しい画像を説明してください',
        '例如：一隻毛茸茸的白貓坐在窗台上，陽光透過窗簾照射進來': '例：ふわふわの白い猫が窓辺に座り、カーテン越しに日光が差し込んでいる',
        '風格': 'スタイル',
        'Core Style': 'コアスタイル',
        'Retro Pixel': 'レトロピクセル',
        'Cyberpunk': 'サイバーパンク',
        '80\'s Slasher': '80年代スラッシャー',
        '比例': 'アスペクト比',
        '1:1 (正方形)': '1:1 (正方形)',
        '16:9 (寬屏)': '16:9 (ワイドスクリーン)',
        '9:16 (垂直)': '9:16 (縦型)',
        '4:3 (標準)': '4:3 (標準)',
        '生成圖像': '画像生成',
        '正在生成您的圖像...': '画像を生成中...',
        '生成的圖像': '生成された画像',
        '下載': 'ダウンロード',
        '分享': 'シェア',
        '重新生成': '再生成',
        
        // Gallery Section
        '靈感畫廊': 'インスピレーション ギャラリー',
        '瀏覽其他用戶創建的精美圖像，獲取創作靈感': '他のユーザーが作成した美しい画像を閲覧して、創作のインスピレーションを得る',
        
        // About Section
        '關於我們的 AI 圖片生成器': '私たちのAI画像ジェネレーターについて',
        '無限免費使用': '無制限無料使用',
        '無需註冊，無隱藏費用，無使用限制': '登録不要、隠れた料金なし、使用制限なし',
        '快速生成': '高速生成',
        '在幾秒鐘內將您的描述轉化為高品質圖像': '数秒で説明を高品質な画像に変換',
        '隱私保護': 'プライバシー保護',
        '零數據保留政策，您的提示和生成的圖像不會被存儲': 'ゼロデータ保持ポリシー、プロンプトと生成画像は保存されません',
        '多種風格': '複数のスタイル',
        '從寫實到動漫，從數位藝術到油畫，多種風格可選': 'リアルからアニメ、デジタルアートから油絵まで、複数のスタイルが利用可能',
        
        // Footer
        '&copy; 2024 AI 圖片生成器。保留所有權利。': '&copy; 2024 AI画像ジェネレーター。全著作権所有。',
        
        // Login Modal
        '電子郵件': 'メールアドレス',
        '密碼': 'パスワード',
        '還沒有帳號？': 'アカウントをお持ちでない方は？',
        '立即註冊': '今すぐ登録',
        
        // Signup Modal
        '用戶名': 'ユーザー名',
        '確認密碼': 'パスワード確認',
        '已有帳號？': 'すでにアカウントをお持ちですか？',
        '立即登入': '今すぐログイン',
        
        // User Panel Modal
        '用戶面板': 'ユーザーパネル',
        '歡迎回來，': 'おかえりなさい、',
        '您的剩餘生成次數：': '残りクレジット数：',
        '登出': 'ログアウト',
        '購買生成次數': 'クレジット購入',
        
        // Theme buttons
        '白色主題': 'ライトテーマ',
        '深黑色主題': 'ダークテーマ',
        '深藍色主題': 'ブルーテーマ'
    },
    
    zh: {
        // Header
        'Art Center.ai': 'Art Center.ai',
        '首頁': '首頁',
        '畫廊': '畫廊',
        '關於': '關於',
        '登入': '登入',
        '註冊': '註冊',
        
        // Hero Section
        '將您的想法轉化為精美圖像': '將您的想法轉化為精美圖像',
        '免費、無限制、無需註冊，立即開始創作！': '免費、無限制、無需註冊，立即開始創作！',
        
        // Generator Section
        '描述您想要的圖像': '描述您想要的圖像',
        '例如：一隻毛茸茸的白貓坐在窗台上，陽光透過窗簾照射進來': '例如：一隻毛茸茸的白貓坐在窗台上，陽光透過窗簾照射進來',
        '風格': '風格',
        'Core Style': '核心風格',
        'Retro Pixel': '復古像素',
        'Cyberpunk': '賽博朋克',
        '80\'s Slasher': '80年代恐怖',
        '比例': '比例',
        '1:1 (正方形)': '1:1 (正方形)',
        '16:9 (寬屏)': '16:9 (寬屏)',
        '9:16 (垂直)': '9:16 (垂直)',
        '4:3 (標準)': '4:3 (標準)',
        '生成圖像': '生成圖像',
        '正在生成您的圖像...': '正在生成您的圖像...',
        '生成的圖像': '生成的圖像',
        '下載': '下載',
        '分享': '分享',
        '重新生成': '重新生成',
        
        // Gallery Section
        '靈感畫廊': '靈感畫廊',
        '瀏覽其他用戶創建的精美圖像，獲取創作靈感': '瀏覽其他用戶創建的精美圖像，獲取創作靈感',
        
        // About Section
        '關於我們的 AI 圖片生成器': '關於我們的 AI 圖片生成器',
        '無限免費使用': '無限免費使用',
        '無需註冊，無隱藏費用，無使用限制': '無需註冊，無隱藏費用，無使用限制',
        '快速生成': '快速生成',
        '在幾秒鐘內將您的描述轉化為高品質圖像': '在幾秒鐘內將您的描述轉化為高品質圖像',
        '隱私保護': '隱私保護',
        '零數據保留政策，您的提示和生成的圖像不會被存儲': '零數據保留政策，您的提示和生成的圖像不會被存儲',
        '多種風格': '多種風格',
        '從寫實到動漫，從數位藝術到油畫，多種風格可選': '從寫實到動漫，從數位藝術到油畫，多種風格可選',
        
        // Footer
        '&copy; 2024 AI 圖片生成器。保留所有權利。': '&copy; 2024 AI 圖片生成器。保留所有權利。',
        
        // Login Modal
        '電子郵件': '電子郵件',
        '密碼': '密碼',
        '還沒有帳號？': '還沒有帳號？',
        '立即註冊': '立即註冊',
        
        // Signup Modal
        '用戶名': '用戶名',
        '確認密碼': '確認密碼',
        '已有帳號？': '已有帳號？',
        '立即登入': '立即登入',
        
        // User Panel Modal
        '用戶面板': '用戶面板',
        '歡迎回來，': '歡迎回來，',
        '您的剩餘生成次數：': '您的剩餘生成次數：',
        '登出': '登出',
        '購買生成次數': '購買生成次數',
        
        // Theme buttons
        '白色主題': '白色主題',
        '深黑色主題': '深黑色主題',
        '深藍色主題': '深藍色主題'
    }
};

// 導出翻譯對象
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
}