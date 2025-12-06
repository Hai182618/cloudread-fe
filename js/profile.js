const API_BASE_URL = 'http://localhost:8080';

// Tiện ích: Lấy Token đăng nhập chính
function getAuthToken() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    return user.token || user.accessToken;
}

// Tiện ích: Lấy ID User
function getUserId() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    return user.id; // Đảm bảo khi login backend trả về id
}

// Tiện ích: Fetch API Wrapper
async function fetchApi(endpoint, method = 'GET', body = null, customHeaders = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
        ...customHeaders
    };

    const options = {
        method,
        headers
    };

    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Có lỗi xảy ra');
        return data;
    } catch (error) {
        alert(`Lỗi: ${error.message}`);
        throw error;
    }
}

// ==========================================
// 1. QUẢN LÝ TAB & LOAD DATA BAN ĐẦU
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Check login
    if (!getAuthToken()) {
        window.location.href = 'login.html';
        return;
    }

    // Xử lý chuyển tab
    const menuItems = document.querySelectorAll('.profile-menu li');
    const sections = document.querySelectorAll('.tab-content');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Active menu
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Show section
            const tabId = item.getAttribute('data-tab');
            sections.forEach(sec => sec.classList.remove('active'));
            document.getElementById(`tab-${tabId}`).classList.add('active');
            
            // Nếu click tab Password hoặc Email, khởi tạo flow
            if(tabId === 'password') PasswordFlow.init();
            if(tabId === 'email') EmailFlow.init();
        });
    });

    // Load User Info
    await loadUserProfile();

    // Sự kiện update info
    document.getElementById('form-update-info').addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateUserProfile();
    });

    // Sự kiện logout
    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });
});

async function loadUserProfile() {
    try {
        const userId = getUserId(); 
        // Gọi API: GET /users/{id}
        const res = await fetchApi(`/users/${userId}`);
        const user = res.data;

        // Fill data vào Sidebar
        document.getElementById('sidebar-name').textContent = user.fullName || user.username;
        document.getElementById('sidebar-role').textContent = user.roles ? user.roles[0].name : 'Member';
        
        // Fill data vào Form General
        document.getElementById('inp-username').value = user.username;
        document.getElementById('inp-fullname').value = user.fullName || '';
        document.getElementById('inp-dob').value = user.dob || ''; // Format yyyy-MM-dd
        
        // Avatar
        const avatarUrl = user.img || `https://ui-avatars.com/api/?name=${user.username}`;
        document.getElementById('sidebar-avatar').src = avatarUrl;
        
    } catch (e) {
        console.error(e);
    }
}

async function updateUserProfile() {
    const fullName = document.getElementById('inp-fullname').value;
    const dob = document.getElementById('inp-dob').value;
    
    // Body request cho UserUpdateRequest
    const body = {
        fullName: fullName,
        dob: dob
        // thêm các trường khác nếu backend yêu cầu
    };

    try {
        await fetchApi('/users', 'PUT', body);
        alert('Cập nhật thông tin thành công!');
        loadUserProfile(); // Reload lại
    } catch (e) {}
}

// ==========================================
// 2. FLOW ĐỔI MẬT KHẨU (PasswordFlow)
// ==========================================
const PasswordFlow = {
    flowToken: null,

    async init() {
        try {
            console.log("--- BẮT ĐẦU FLOW ĐỔI MẬT KHẨU ---");
            
            // 1. Gọi API lấy token
            // Backend trả về: ApiResponse có chứa data
            const res = await fetchApi('/users/change-password/request', 'POST');
            
            console.log("Server trả về:", res); // Hãy xem dòng này ở Console!

            // 2. Trích xuất Token an toàn
            if (res && res.data) {
                if (typeof res.data === 'string') {
                    // Trường hợp data là chuỗi token trực tiếp: "eyJ..."
                    this.flowToken = res.data;
                } else if (typeof res.data === 'object' && res.data.token) {
                    // Trường hợp data là object: { token: "eyJ..." }
                    this.flowToken = res.data.token;
                }
            }

            // 3. Kiểm tra kết quả
            if (!this.flowToken || this.flowToken === "undefined") {
                console.error("LỖI: Không lấy được token!", res);
                alert("Lỗi hệ thống: Server không trả về Token bảo mật. Vui lòng thử lại sau.");
                return;
            }

            console.log("✅ Token quy trình đã lưu:", this.flowToken);
            
            // 4. Reset giao diện
            this.showStep(1);
            document.getElementById('inp-pwd-current').value = '';

        } catch (e) { 
            console.error("Lỗi khởi tạo PasswordFlow:", e);
        }
    },

    async verifyCurrent() {
        const password = document.getElementById('inp-pwd-current').value;
        
        // Validate Client
        if (!password) return alert("Vui lòng nhập mật khẩu");
        if (password.length < 8) return alert("Mật khẩu quá ngắn (phải >= 8 ký tự)");

        // KIỂM TRA TOKEN TRƯỚC KHI GỬI
        if (!this.flowToken) {
            alert("Lỗi: Token phiên làm việc đã hết hạn hoặc không tồn tại. Vui lòng tải lại trang và thử lại.");
            // Thử init lại tự động
            this.init(); 
            return;
        }

        try {
            console.log("Đang gửi verify với Token:", this.flowToken);
            
            const body = { password: password }; 
            const res = await fetchApi('/users/verify-password', 'POST', body, {
                'Access-Token': this.flowToken // Header này bắt buộc phải có giá trị đúng
            });
            
            console.log("Xác thực thành công!");
            this.showStep(2);
        } catch (e) {
            console.error(e);
        }
    },

    async verifyOtp() {
        const otp = document.getElementById('inp-pwd-otp').value;
        if (!otp) return alert("Vui lòng nhập OTP");

        try {
            const body = { otp: otp };
            await fetchApi('/users/verify-email-otp', 'POST', body, {
                'Access-Token': this.flowToken
            });
            this.showStep(3);
        } catch (e) {}
    },

    async submitChange() {
        const newPass = document.getElementById('inp-pwd-new').value;
        const confirmPass = document.getElementById('inp-pwd-confirm').value;

        if (newPass.length < 8) return alert("Mật khẩu mới phải >= 8 ký tự");
        if (newPass !== confirmPass) return alert("Mật khẩu xác nhận không khớp!");

        try {
            const body = { password: newPass };
            await fetchApi('/users/change-password', 'PUT', body, {
                'Access-Token': this.flowToken
            });

            alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            localStorage.clear();
            window.location.href = 'login.html';
        } catch (e) {}
    },

    showStep(step) {
        [1, 2, 3].forEach(i => {
            const el = document.getElementById(`pwd-step-${i}`);
            if(el) el.style.display = 'none';
        });
        const activeEl = document.getElementById(`pwd-step-${step}`);
        if(activeEl) activeEl.style.display = 'block';
    }
};

// ==========================================
// 3. FLOW ĐỔI EMAIL (EmailFlow)
// ==========================================
const EmailFlow = {
    flowToken: null,

    async init() {
        try {
            console.log("--- BẮT ĐẦU FLOW ĐỔI MẬT KHẨU ---");
            
            // 1. Gọi API lấy token request
            const res = await fetchApi('/users/change-password/request', 'POST');
            console.log("API Response:", res); // Xem server trả về cái gì

            // 2. Xử lý lấy Token (CỰC KỲ QUAN TRỌNG)
            // Backend của bạn trả về ApiResponse<Object>. 
            // Nếu data là chuỗi token: res.data = "eyJ..."
            // Nếu data là object: res.data = { token: "eyJ..." }
            
            if (res.data && typeof res.data === 'object' && res.data.token) {
                this.flowToken = res.data.token;
            } else if (typeof res.data === 'string') {
                this.flowToken = res.data;
            } else {
                // Trường hợp dự phòng nếu API trả về cấu trúc lạ
                console.error("Cấu trúc data không xác định:", res.data);
                alert("Lỗi hệ thống: Không lấy được token xác thực.");
                return;
            }

            // 3. Kiểm tra kỹ Token trước khi lưu
            if (!this.flowToken || this.flowToken === "undefined" || !this.flowToken.includes(".")) {
                console.error("Token không hợp lệ:", this.flowToken);
                alert("Lỗi: Server trả về token không đúng định dạng JWT.");
                return;
            }
            
            console.log("=> Flow Token đã lưu:", this.flowToken);

            // 4. Reset giao diện
            this.showStep(1);
            document.getElementById('inp-pwd-current').value = '';
        } catch (e) { 
            console.error("Lỗi init:", e); 
        }
    },

    async verifyCurrentPwd() {
        const password = document.getElementById('inp-email-pwd').value;
        try {
            // Bước 1: Verify Password
            const body = { password: password };
            await fetchApi('/users/verify-password', 'POST', body, {
                'Access-Token': this.flowToken
            });
            alert("Đã xác thực. Kiểm tra Email CŨ để lấy OTP.");
            this.showStep(2);
        } catch (e) {}
    },

    async verifyOldEmailOtp() {
        const otp = document.getElementById('inp-email-otp-old').value;
        try {
            // Bước 2: Verify OTP (Email cũ)
            const body = { otp: otp };
            await fetchApi('/users/verify-email-otp', 'POST', body, {
                'Access-Token': this.flowToken
            });
            this.showStep(3);
        } catch (e) {}
    },

    async verifyNewEmail() {
        const newEmail = document.getElementById('inp-email-new').value;
        try {
            // Bước 3: Verify New Email (Check exist & send OTP)
            // POST /users/change-email/verify-new-email
            const body = { email: newEmail }; // EmailRequest
            await fetchApi('/users/change-email/verify-new-email', 'POST', body, {
                'Access-Token': this.flowToken
            });
            alert(`Mã OTP đã được gửi tới ${newEmail}`);
            this.showStep(4);
        } catch (e) {}
    },

    async submitChange() {
        const otp = document.getElementById('inp-email-otp-new').value;
        try {
            // Bước 4.1: Verify OTP New Email
            // POST /users/change-email/verify-new-email/otp
            const bodyOtp = { otp: otp };
            await fetchApi('/users/change-email/verify-new-email/otp', 'POST', bodyOtp, {
                'Access-Token': this.flowToken
            });

            // Bước 4.2: Finalize Change Email
            // PUT /users/change-email
            await fetchApi('/users/change-email', 'PUT', null, {
                'Access-Token': this.flowToken
            });

            alert("Đổi Email thành công! Vui lòng đăng nhập lại.");
            localStorage.clear();
            window.location.href = 'login.html';
        } catch (e) {}
    },

    showStep(step) {
        [1, 2, 3, 4].forEach(i => document.getElementById(`email-step-${i}`).style.display = 'none');
        document.getElementById(`email-step-${step}`).style.display = 'block';
    }
};