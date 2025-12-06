// Authentication JavaScript - Final Fixed Version
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthPage();
});

function initializeAuthPage() {
    const loginForm = document.getElementById('loginForm');
    
    // Tìm input (ưu tiên id="username", fallback sang "email")
    const loginInput = document.getElementById('username') || document.getElementById('email');
    
    // Xóa lỗi khi người dùng bắt đầu nhập liệu
    if (loginInput) {
        loginInput.addEventListener('input', function() {
            const group = this.closest('.form-group');
            const feedback = document.querySelector('.input-feedback');
            if (group) group.classList.remove('error');
            if (feedback) feedback.textContent = '';
        });
    }
    
    // Bắt sự kiện submit form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Các chức năng phụ
    setupSocialAuth();
    checkExistingSession();
}

// ========================
// API Configuration
// ========================
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080', // Port của Spring Boot
};

// ========================
// 1. Gọi API Login
// ========================
async function loginAPI(inputValue, password) {
    const url = `${API_CONFIG.BASE_URL}/auth/login`;
    
    // Body đúng chuẩn theo LoginRequest.java của Backend
    const requestBody = {
        input: inputValue,      // username hoặc email
        password: password       // plain password
    };
    
    console.log('📤 Sending Login Request:', { 
        url, 
        body: { ...requestBody, password: '***' } 
    });
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // Gửi cookie nếu có
            body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        
        console.log('📥 Login Response Status:', response.status);
        console.log('📥 Login Response:', responseData);

        if (!response.ok) {
            // Backend trả về lỗi
            const errorMsg = responseData.message || responseData.error || `Lỗi ${response.status}`;
            throw new Error(errorMsg);
        }

        // Success - trả về data từ response
        if (responseData.data && responseData.data.token) {
            return responseData.data;
        } else if (responseData.token) {
            return { token: responseData.token };
        } else {
            throw new Error('Server không trả về token');
        }
        
    } catch (error) {
        console.error('❌ Login API Exception:', error.message);
        
        // Network errors
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Không thể kết nối đến Server. Kiểm tra Backend đã chạy trên port 8080 chưa?');
        }
        
        throw error;
    }
}

// ========================
// 2. Xử lý Logic Submit
// ========================
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    // Tìm input element (username hoặc email)
    const inputElement = document.getElementById('username') || document.getElementById('email');
    const passwordElement = document.getElementById('password');
    
    if (!inputElement || !passwordElement) {
        showMessage('❌ Lỗi: Không tìm thấy form input (username/email hoặc password)', 'error');
        return;
    }
    
    const inputValue = inputElement.value.trim();
    const password = passwordElement.value;
    const rememberMe = document.querySelector('input[name="remember"]')?.checked || false;
    
    // Validate input
    if (!inputValue || !password) {
        showMessage('⚠️ Vui lòng nhập đầy đủ tài khoản và mật khẩu', 'error');
        return;
    }
    
    // UI: Disable button + loading
    const submitBtn = document.getElementById('loginBtn');
    let originalText = 'Đăng nhập';
    if (submitBtn) {
        originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        submitBtn.disabled = true;
    }
    
    try {
        console.log('🔐 Attempting login for:', inputValue);
        
        // Gọi API login
        const loginData = await loginAPI(inputValue, password);
        
        if (!loginData || !loginData.token) {
            throw new Error('Server không trả về token');
        }
        
        console.log('✓ Login successful, decoding token...');
        
        // Giải mã JWT token
        const decodedToken = decodeJWT(loginData.token);
        
        if (!decodedToken) {
            throw new Error('Token không hợp lệ (không thể decode)');
        }
        
        console.log('✓ Token decoded:', decodedToken);
        
        // Lấy thông tin từ token payload
        const userInfo = decodedToken.user || {};
        const userScope = decodedToken.scope || ''; // e.g., "ROLE_ADMIN" hoặc "ROLE_USER"
        const userId = decodedToken.sub || userInfo.id;
        const userUsername = decodedToken.username || userInfo.username || inputValue;
        const userEmail = decodedToken.email || userInfo.email || '';

        // Chuẩn bị user object để lưu
        // Lưu toàn bộ scope (ví dụ: "ROLE_ADMIN") để có thể check role sau
        const userData = {
            id: userId,
            username: userUsername,
            email: userEmail,
            name: userUsername,
            role: userScope || 'USER',  // e.g., "ROLE_ADMIN", "ROLE_USER"
            token: loginData.token,
            accessToken: loginData.token,
            loginTime: new Date().toISOString(),
            expiresAt: decodedToken.exp ? new Date(decodedToken.exp * 1000).toISOString() : null
        };
        
        console.log('💾 Saving user data:', { ...userData, token: '***' });
        
        // Lưu user info vào storage
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(userData));
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        showMessage(`✓ Đăng nhập thành công! Xin chào ${userData.username}`, 'success');
        
        // Chuyển hướng dựa trên role (normalize: ROLE_ADMIN, admin, ADMIN -> includes ADMIN)
        setTimeout(() => {
            console.log('🔀 Redirecting based on role:', userScope);
            const isAdmin = userScope && userScope.toUpperCase().includes('ADMIN');
            if (isAdmin) {
                console.log('→ Redirecting to admin panel');
                window.location.href = 'admin-books.html';
            } else {
                console.log('→ Redirecting to home');
                window.location.href = 'index.html';
            }
        }, 1000);
        
    } catch (error) {
        // Reset UI button
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
        
        console.error('❌ Login failed:', error);
        
        let msg = error.message || 'Lỗi đăng nhập không xác định';
        
        // Mapping lỗi backend sang tiếng Việt
        if (msg.includes('USER_NOT_FOUND')) msg = '❌ Tài khoản không tồn tại';
        if (msg.includes('INVALID_CREDENTIALS') || msg.includes('Bad credentials')) msg = '❌ Sai tên đăng nhập hoặc mật khẩu';
        if (msg.includes('ACCOUNT_DISABLED') || msg.includes('disabled')) msg = '❌ Tài khoản đã bị vô hiệu hóa';
        if (msg.includes('NetworkError') || msg.includes('Failed to fetch')) msg = '❌ Không thể kết nối đến server. Backend có chạy không?';
        
        showMessage(msg, 'error');
        passwordElement.value = ''; 
    }
}

// ========================
// Utilities Helpers
// ========================

function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function checkExistingSession() {
    const userJson = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            showContinuePopup(user);
        } catch (e) {
            localStorage.removeItem('user');
        }
    }
}

function showContinuePopup(user) {
    const old = document.getElementById('auth-popup');
    if (old) old.remove();

    const div = document.createElement('div');
    div.id = 'auth-popup';
    div.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; 
        background: white; padding: 15px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999;
        border-left: 4px solid #4fd1c5; font-family: sans-serif;
    `;
    div.innerHTML = `
        <div style="margin-bottom: 10px; color: #333;">
            Đang đăng nhập: <strong>${user.username}</strong>
        </div>
        <div style="display: flex; gap: 8px;">
            <button id="popup-continue" style="padding: 5px 10px; background: #4fd1c5; color: white; border:none; border-radius:4px; cursor:pointer;">Vào trang chủ</button>
            <button id="popup-logout" style="padding: 5px 10px; background: #e53e3e; color: white; border:none; border-radius:4px; cursor:pointer;">Đăng xuất</button>
        </div>
    `;
    document.body.appendChild(div);

    const btnContinue = document.getElementById('popup-continue');
    const btnLogout = document.getElementById('popup-logout');
    
    if(btnContinue) btnContinue.onclick = () => window.location.href = 'index.html';
    if(btnLogout) btnLogout.onclick = logoutFromAuthPage;
}

function logoutFromAuthPage() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    const popup = document.getElementById('auth-popup');
    if (popup) popup.remove();
    showMessage('Đã đăng xuất', 'success');
}

function showMessage(msg, type) {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        padding: 12px 24px; border-radius: 6px; color: white;
        background-color: ${type === 'error' ? '#e53e3e' : '#48bb78'};
        z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        font-family: sans-serif; animation: slideDown 0.3s ease-out;
    `;
    alertDiv.textContent = msg;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

function setupSocialAuth() {
    const btns = document.querySelectorAll('.btn-social');
    btns.forEach(btn => {
        btn.addEventListener('click', () => showMessage('Tính năng đang phát triển', 'info'));
    });
}

window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const icon = input.parentElement.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        if(icon) icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        if(icon) icon.className = 'fas fa-eye';
    }
}