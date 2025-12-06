import { BooksAPI } from './api.js';
import { formatNumber, formatRelativeTime, truncateText, handleImageError } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initHomePage();
    setupSearch();
    checkLoginStatus(); // <--- KIỂM TRA ĐĂNG NHẬP
});

// --- LOGIC AUTH (ĐĂNG NHẬP/ĐĂNG XUẤT) ---

function checkLoginStatus() {
    // Lấy thông tin user từ LocalStorage
    const userStr = localStorage.getItem('user');
    const guestActions = document.getElementById('guest-actions');
    const userActions = document.getElementById('user-actions');
    const userNameSpan = document.getElementById('header-username');
    const userAvatar = document.getElementById('header-avatar');
    const btnLogout = document.getElementById('btn-logout');

    if (userStr) {
        // ==> ĐÃ ĐĂNG NHẬP
        try {
            const user = JSON.parse(userStr);

            // 1. Chuyển đổi giao diện
            if (guestActions) guestActions.style.display = 'none';
            if (userActions) userActions.style.display = 'flex';

            // 2. Hiển thị tên (Ưu tiên fullName -> username -> email)
            const displayName = user.fullName || user.username || user.email || 'Bạn đọc';
            if (userNameSpan) userNameSpan.textContent = displayName;
            
            // 3. Hiển thị Avatar
            if (userAvatar) {
                if (user.avatar) {
                    userAvatar.src = user.avatar;
                } else {
                    // Tạo avatar tự động theo tên
                    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
                }
            }

            // 4. Gắn sự kiện đăng xuất
            if (btnLogout) {
                btnLogout.onclick = handleLogout;
            }
        } catch (e) {
            console.error("Lỗi parse user:", e);
            // Nếu data lỗi thì coi như chưa đăng nhập
            localStorage.removeItem('user');
        }

    } else {
        // ==> CHƯA ĐĂNG NHẬP (KHÁCH)
        if (guestActions) guestActions.style.display = 'flex'; // Dùng block hoặc flex tùy css
        if (userActions) userActions.style.display = 'none';
    }
}

function handleLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        window.location.reload(); // Tải lại trang để về trạng thái khách
    }
}

// --- LOGIC LOAD SÁCH (HOME) ---

async function initHomePage() {
    try {
        const [newestBooks, favoriteBooks] = await Promise.all([
            BooksAPI.getNewest(),
            BooksAPI.getMostFavorite()
        ]);

        console.log("🔥 Data Loaded:", { newestBooks, favoriteBooks });

        // 1. Render Slider
        if (favoriteBooks.length > 0) {
            renderHeroSlider(favoriteBooks.slice(0, 3));
        }

        // 2. Render Weekly Section
        if (favoriteBooks.length > 0) {
            renderWeeklyFeatured(favoriteBooks[0]);
            renderWeeklySideBooks(favoriteBooks.slice(1, 5));
        }

        // 3. Render các cột sách
        renderBookList('new-updates-list', newestBooks.slice(0, 5), 'new');
        renderBookList('hot-weekly-list', favoriteBooks.slice(0, 5), 'hot');
        
        const featuredData = favoriteBooks.length > 5 ? favoriteBooks.slice(5, 10) : newestBooks.slice(0, 5);
        renderBookList('featured-list', featuredData, 'featured');

    } catch (error) {
        console.error("❌ Lỗi tải trang chủ:", error);
    }
}

// --- RENDER FUNCTIONS ---

function renderHeroSlider(books) {
    const container = document.getElementById('hero-slider-container');
    if (!container) return;

    const slidesHtml = books.map((book, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : ''}" 
             style="background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(68, 12, 12, 0.8) 100%), url('${book.coverImage || book.image || ''}'); background-size: cover; background-position: center;">
            <div class="container">
                <div class="hero-slide-content">
                    <div class="hero-badge">HOT</div>
                    <h1 class="hero-slide-title">${book.title}</h1>
                    <p class="hero-slide-description">${truncateText(book.description, 150)}</p>
                    <div class="hero-slide-stats">
                        <span><i class="fas fa-eye"></i> ${formatNumber(book.viewCount)} lượt đọc</span>
                        <span><i class="fas fa-star"></i> ${book.averageRating || 5.0}</span>
                    </div>
                    <div class="hero-slide-actions">
                        <a href="book-detail.html?id=${book.id}" class="btn-hero-primary"><i class="fas fa-book-reader"></i> Đọc ngay</a>
                        <a href="book-detail.html?id=${book.id}" class="btn-hero-secondary"><i class="fas fa-info-circle"></i> Chi tiết</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    const controlsHtml = `
        <button class="slider-arrow prev" id="prevSlide"><i class="fas fa-chevron-left"></i></button>
        <button class="slider-arrow next" id="nextSlide"><i class="fas fa-chevron-right"></i></button>
        <div class="slider-indicators">
            ${books.map((_, idx) => `<span class="indicator ${idx === 0 ? 'active' : ''}" data-slide="${idx}"></span>`).join('')}
        </div>
    `;

    container.innerHTML = slidesHtml + controlsHtml;
    initSliderLogic();
}

function renderWeeklyFeatured(book) {
    const container = document.getElementById('weekly-featured-book');
    if (!container || !book) return;

    // Xử lý tên tác giả
    let authorDisplay = book.authorName || (typeof book.author === 'object' ? book.author?.name : book.author) || 'Tác giả';

    container.innerHTML = `
        <div class="featured-book-image">
            <img src="${book.coverImage || book.image || ''}" alt="${book.title}" onerror="handleImageError(this)">
            <div class="featured-badge-large"><i class="fas fa-crown"></i> TOP 1</div>
            <div class="book-rating-overlay"><i class="fas fa-star"></i> ${book.averageRating || 5.0}</div>
        </div>
        <div class="featured-book-content">
            <h3 class="featured-book-title">${book.title}</h3>
            <p class="featured-book-author"><i class="fas fa-user-edit"></i> ${authorDisplay}</p>
            <p class="featured-book-description">${truncateText(book.description, 180)}</p>
            <div class="featured-book-stats">
                <div class="stat-item-inline"><i class="fas fa-eye"></i> <span>${formatNumber(book.viewCount)}</span></div>
            </div>
            <div class="featured-book-actions">
                <a href="book-detail.html?id=${book.id}" class="btn-featured-read"><i class="fas fa-book-reader"></i> Đọc ngay</a>
                <a href="book-detail.html?id=${book.id}" class="btn-featured-detail"><i class="fas fa-info-circle"></i> Chi tiết</a>
            </div>
        </div>
    `;
}

function renderWeeklySideBooks(books) {
    const container = document.getElementById('weekly-side-books');
    if (!container) return;

    container.innerHTML = books.map((book, index) => {
        let authorDisplay = book.authorName || (typeof book.author === 'object' ? book.author?.name : book.author) || 'Unknown';
        return `
        <div class="side-book-item">
            <div class="side-book-rank top-${index + 2}">${index + 2}</div>
            <div class="side-book-cover">
                <img src="${book.coverImage || book.image || ''}" alt="${book.title}" onerror="handleImageError(this)">
            </div>
            <div class="side-book-info">
                <h4><a href="book-detail.html?id=${book.id}">${book.title}</a></h4>
                <p class="side-book-author">${authorDisplay}</p>
                <div class="side-book-meta">
                    <span><i class="fas fa-star"></i> ${book.averageRating || 5.0}</span>
                    <span><i class="fas fa-eye"></i> ${formatNumber(book.viewCount)}</span>
                </div>
            </div>
            <a href="book-detail.html?id=${book.id}" class="btn-side-book"><i class="fas fa-arrow-right"></i></a>
        </div>
    `}).join('');
}

function renderBookList(elementId, books, type) {
    const container = document.getElementById(elementId);
    if (!container) return;

    if (!books || books.length === 0) {
        container.innerHTML = '<p style="color:#888; font-size: 0.9rem;">Đang cập nhật...</p>';
        return;
    }

    container.innerHTML = books.map((book, index) => {
        let authorDisplay = book.authorName || (typeof book.author === 'object' ? book.author?.name : book.author) || 'Tác giả';
        return `
        <div class="story-item-compact ${type === 'hot' ? 'hot-item' : ''}">
            ${type === 'hot' ? `<div class="rank-badge ${index < 3 ? `top-${index + 1}` : ''}">${index + 1}</div>` : ''}
            
            <div class="story-thumb">
                <img src="${book.coverImage || book.image || ''}" alt="${book.title}" onerror="handleImageError(this)">
                ${type === 'featured' ? '<div class="featured-badge">HOT</div>' : ''}
            </div>
            
            <div class="story-details">
                <h4><a href="book-detail.html?id=${book.id}">${book.title}</a></h4>
                <p class="author">${authorDisplay}</p>
                
                ${type === 'new' ? `
                <div class="story-meta-mini">
                    <span class="chapter">Mới</span>
                    <span class="time">${formatRelativeTime(book.created_at || new Date())}</span>
                </div>` : ''}

                ${(type === 'hot' || type === 'featured') ? `
                <div class="story-stats-mini">
                    <span><i class="fas fa-eye"></i> ${formatNumber(book.viewCount)}</span>
                    <span><i class="fas fa-star"></i> ${book.averageRating || 5.0}</span>
                </div>` : ''}
            </div>
        </div>
    `}).join('');
}

// --- SLIDER & SEARCH LOGIC ---

function initSliderLogic() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let current = 0;

    if(slides.length === 0) return;

    const showSlide = (index) => {
        slides.forEach(s => s.classList.remove('active'));
        indicators.forEach(i => i.classList.remove('active'));
        
        current = (index + slides.length) % slides.length; 
        
        slides[current].classList.add('active');
        if(indicators[current]) indicators[current].classList.add('active');
    };

    if (prevBtn) prevBtn.addEventListener('click', () => showSlide(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showSlide(current + 1));
    
    // Auto play mỗi 5 giây
    setInterval(() => showSlide(current + 1), 5000);
}

function setupSearch() {
    const input = document.getElementById('heroSearchInput');
    const btn = document.getElementById('heroSearchBtn');

    const handleSearch = () => {
        const keyword = input.value.trim();
        if (keyword) {
            window.location.href = `book-list.html?keyword=${encodeURIComponent(keyword)}`;
        }
    };

    if (btn) btn.addEventListener('click', handleSearch);
    if (input) input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}