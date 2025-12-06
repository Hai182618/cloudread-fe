/**
 * main.js - Phiên bản Fix lỗi xung đột (Chạy sau cùng)
 */

// Thay vì dùng DOMContentLoaded, ta dùng window 'load' để đợi tất cả mọi thứ tải xong
window.addEventListener('load', function() {
    // Dùng setTimeout để hoãn lại 1 chút (0.1 giây) đảm bảo code này chạy SAU CÙNG
    setTimeout(() => {
        updateAuthHeader();
    }, 100);
});

// Sự kiện click cho logout
document.addEventListener('click', function(e) {
    // Dùng closest để bắt chính xác nút logout dù click vào icon bên trong
    if(e.target && e.target.closest('#btn-logout')) {
        handleLogout();
    }
});

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) { return null; }
}

function updateAuthHeader() {
    console.log("--> Đang cập nhật trạng thái Auth...");

    const rawUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    const rawToken = localStorage.getItem('token') || localStorage.getItem('accessToken');
    let displayUser = null;

    if (rawUser) {
        try { displayUser = JSON.parse(rawUser); } 
        catch (e) { 
            if (rawUser.startsWith('ey')) {
                const decoded = parseJwt(rawUser);
                if (decoded) displayUser = { username: decoded.sub || decoded.username, ...decoded };
            }
        }
    }
    if (!displayUser && rawToken) {
        const decoded = parseJwt(rawToken);
        if (decoded) displayUser = { username: decoded.sub || decoded.username || "User", avatarUrl: null };
    }

    // Lấy phần tử DOM
    const guestActions = document.getElementById('guest-actions');
    const userActions = document.getElementById('user-actions');
    const usernameDisplay = document.getElementById('header-username');
    const avatarDisplay = document.getElementById('header-avatar');

    if (displayUser) {
        // === ĐÃ ĐĂNG NHẬP ===
        console.log("Trạng thái: ĐÃ ĐĂNG NHẬP -> Ẩn nút khách");

        // Dùng setProperty với !important để không ai ghi đè được
        if (guestActions) {
            guestActions.style.setProperty('display', 'none', 'important');
        }

        if (userActions) {
            userActions.style.setProperty('display', 'flex', 'important');
            userActions.style.alignItems = 'center';
            userActions.style.gap = '15px';
        }

        if (usernameDisplay) usernameDisplay.textContent = displayUser.username || "Thành viên";
        if (avatarDisplay) {
            const name = displayUser.username || "U";
            avatarDisplay.src = displayUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
        }

    } else {
        // === CHƯA ĐĂNG NHẬP ===
        console.log("Trạng thái: KHÁCH -> Hiện nút khách");

        if (guestActions) {
            guestActions.style.setProperty('display', 'flex', 'important');
        }

        if (userActions) {
            userActions.style.setProperty('display', 'none', 'important');
        }
    }
}

function handleLogout() {
    if (confirm('Bạn muốn đăng xuất?')) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}