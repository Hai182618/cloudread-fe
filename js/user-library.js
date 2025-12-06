// ===================================
// USER LIBRARY JAVASCRIPT
// ===================================

let currentTab = 'all';
let currentSort = 'latest';
let currentView = 'grid';
let libraryBooks = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeLibrary();
});

// Initialize Library
function initializeLibrary() {
    loadMockData();
    setupEventListeners();
    renderBooks();
    updateStats();
}

// Load Mock Data
function loadMockData() {
    libraryBooks = [
        { id: 1, title: 'Attack on Titan', author: 'Hajime Isayama', cover: '../assets/images/attack-on-titan.jpg', rating: 4.9, price: 150000, downloads: 2300000, favorites: 450000, status: 'reading', progress: 65, lastRead: '2 giờ trước', purchaseDate: '2024-10-20' },
        { id: 2, title: 'Demon Slayer', author: 'Koyoharu Gotouge', cover: '../assets/images/demon-slayer.jpg', rating: 4.8, price: 120000, downloads: 1900000, favorites: 380000, status: 'completed', progress: 100, lastRead: '1 ngày trước', purchaseDate: '2024-10-15' },
        { id: 3, title: 'Spy x Family', author: 'Tatsuya Endo', cover: '../assets/images/spy-family.jpg', rating: 4.9, price: 135000, downloads: 1700000, favorites: 420000, status: 'reading', progress: 42, lastRead: '5 giờ trước', purchaseDate: '2024-10-22' },
        { id: 4, title: 'Jujutsu Kaisen', author: 'Gege Akutami', cover: '../assets/images/jujutsu-kaisen.jpg', rating: 4.8, price: 140000, downloads: 2100000, favorites: 395000, status: 'reading', progress: 78, lastRead: '1 ngày trước', purchaseDate: '2024-10-18' },
        { id: 5, title: 'One Piece', author: 'Eiichiro Oda', cover: '../assets/images/one-piece.jpg', rating: 4.9, price: 200000, downloads: 4500000, favorites: 850000, status: 'completed', progress: 100, lastRead: '3 ngày trước', purchaseDate: '2024-09-25' },
        { id: 6, title: 'Tokyo Ghoul', author: 'Sui Ishida', cover: '../assets/images/tokyo-ghoul.jpg', rating: 4.7, price: 125000, downloads: 1400000, favorites: 320000, status: 'wishlist', progress: 0, lastRead: 'Chưa đọc', purchaseDate: null },
        { id: 7, title: 'Naruto', author: 'Masashi Kishimoto', cover: '../assets/images/naruto.jpg', rating: 4.9, price: 180000, downloads: 3200000, favorites: 620000, status: 'completed', progress: 100, lastRead: '1 tuần trước', purchaseDate: '2024-09-10' },
        { id: 8, title: 'Bleach', author: 'Tite Kubo', cover: '../assets/images/bleach.jpg', rating: 4.7, price: 160000, downloads: 2100000, favorites: 410000, status: 'reading', progress: 35, lastRead: '2 ngày trước', purchaseDate: '2024-10-25' },
        { id: 9, title: 'Conan - Thám Tử Lừng Danh', author: 'Gosho Aoyama', cover: '../assets/images/conan.jpg', rating: 4.8, price: 145000, downloads: 2500000, favorites: 480000, status: 'completed', progress: 100, lastRead: '5 ngày trước', purchaseDate: '2024-09-28' },
        { id: 10, title: 'Douluo Đại Lục', author: 'Đường Gia Tam Thiếu', cover: '../assets/images/douluo-dai-luc.jpg', rating: 4.6, price: 130000, downloads: 1800000, favorites: 340000, status: 'reading', progress: 55, lastRead: '4 giờ trước', purchaseDate: '2024-10-23' },
        { id: 11, title: 'Hunter x Hunter', author: 'Yoshihiro Togashi', cover: '../assets/images/hunter.jpg', rating: 4.9, price: 155000, downloads: 1900000, favorites: 390000, status: 'completed', progress: 100, lastRead: '1 tuần trước', purchaseDate: '2024-10-05' },
        { id: 12, title: 'My Hero Academia', author: 'Kohei Horikoshi', cover: '../assets/images/story-placeholder.jpg', rating: 4.8, price: 142000, downloads: 2400000, favorites: 460000, status: 'reading', progress: 28, lastRead: '3 giờ trước', purchaseDate: '2024-10-26' },
        { id: 13, title: 'Death Note', author: 'Tsugumi Ohba', cover: '../assets/images/story-placeholder.jpg', rating: 4.9, price: 148000, downloads: 3100000, favorites: 590000, status: 'completed', progress: 100, lastRead: '2 tuần trước', purchaseDate: '2024-09-15' },
        { id: 14, title: 'Fullmetal Alchemist', author: 'Hiromu Arakawa', cover: '../assets/images/story-placeholder.jpg', rating: 4.9, price: 165000, downloads: 2800000, favorites: 540000, status: 'completed', progress: 100, lastRead: '1 tuần trước', purchaseDate: '2024-09-20' },
        { id: 15, title: 'Your Name', author: 'Makoto Shinkai', cover: '../assets/images/story-placeholder.jpg', rating: 4.8, price: 138000, downloads: 2200000, favorites: 430000, status: 'reading', progress: 72, lastRead: '6 giờ trước', purchaseDate: '2024-10-21' },
        { id: 16, title: 'Sword Art Online', author: 'Reki Kawahara', cover: '../assets/images/story-placeholder.jpg', rating: 4.7, price: 152000, downloads: 2000000, favorites: 380000, status: 'wishlist', progress: 0, lastRead: 'Chưa đọc', purchaseDate: null }
    ];
}

// Setup Event Listeners
function setupEventListeners() {
    // Tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTab = this.dataset.tab;
            renderBooks();
        });
    });

    // Sort select
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            renderBooks();
        });
    }

    // View mode buttons
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            updateViewMode();
        });
    });
}

// Filter Books by Tab
function filterBooks() {
    let filtered = [...libraryBooks];

    switch(currentTab) {
        case 'reading':
            filtered = filtered.filter(book => book.status === 'reading');
            break;
        case 'completed':
            filtered = filtered.filter(book => book.status === 'completed');
            break;
        case 'wishlist':
            filtered = filtered.filter(book => book.status === 'wishlist');
            break;
        case 'all':
        default:
            filtered = filtered.filter(book => book.status !== 'wishlist');
            break;
    }

    return filtered;
}

// Sort Books
function sortBooks(books) {
    const sorted = [...books];

    switch(currentSort) {
        case 'latest':
            sorted.sort((a, b) => new Date(b.purchaseDate || 0) - new Date(a.purchaseDate || 0));
            break;
        case 'downloads-high':
            sorted.sort((a, b) => b.downloads - a.downloads);
            break;
        case 'downloads-low':
            sorted.sort((a, b) => a.downloads - b.downloads);
            break;
        case 'rating-high':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'rating-low':
            sorted.sort((a, b) => a.rating - b.rating);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'favorites-high':
            sorted.sort((a, b) => b.favorites - a.favorites);
            break;
        case 'favorites-low':
            sorted.sort((a, b) => a.favorites - b.favorites);
            break;
        case 'author-az':
            sorted.sort((a, b) => a.author.localeCompare(b.author, 'vi'));
            break;
        case 'author-za':
            sorted.sort((a, b) => b.author.localeCompare(a.author, 'vi'));
            break;
    }

    return sorted;
}

// Render Books
function renderBooks() {
    const booksGrid = document.getElementById('booksGrid');
    const emptyState = document.getElementById('emptyState');
    
    let filtered = filterBooks();
    let sorted = sortBooks(filtered);

    if (sorted.length === 0) {
        booksGrid.style.display = 'none';
        if (emptyState) {
            emptyState.classList.add('show');
            emptyState.style.display = 'block';
        }
        return;
    }

    booksGrid.style.display = 'grid';
    if (emptyState) {
        emptyState.classList.remove('show');
        emptyState.style.display = 'none';
    }

    booksGrid.innerHTML = sorted.map(book => createBookCard(book)).join('');
    
    // Add event listeners to action buttons
    setupActionListeners();
}

// Setup Action Listeners
function setupActionListeners() {
    const actionButtons = document.querySelectorAll('[data-action]');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.dataset.action;
            const bookId = parseInt(this.dataset.id);
            
            switch(action) {
                case 'read':
                    window.location.href = `reader.html?id=${bookId}`;
                    break;
                case 'detail':
                    window.location.href = `book-detail.html?id=${bookId}`;
                    break;
                case 'favorite':
                    toggleFavorite(bookId);
                    break;
                case 'remove':
                    removeFromWishlist(bookId);
                    break;
            }
        });
    });
    
    // Card click to go to detail
    const bookCards = document.querySelectorAll('.library-book-card');
    bookCards.forEach(card => {
        card.addEventListener('click', function() {
            const bookId = this.dataset.bookId;
            if (bookId) {
                window.location.href = `book-detail.html?id=${bookId}`;
            }
        });
    });
}

// Create Book Card
function createBookCard(book) {
    const badgeClass = book.status === 'reading' ? 'reading' : book.status === 'completed' ? 'completed' : 'wishlist';
    const badgeText = book.status === 'reading' ? 'Đang đọc' : book.status === 'completed' ? 'Hoàn thành' : 'Yêu thích';

    return `
        <div class="library-book-card" data-book-id="${book.id}">
            <div class="book-cover-container">
                <img src="${book.cover}" alt="${book.title}" 
                     onerror="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; this.innerHTML='<div style=color:white;padding:100px 20px;text-align:center;font-size:24px;>📖</div>'">
                <span class="book-badge ${badgeClass}">${badgeText}</span>
                ${book.progress > 0 ? `
                <div class="reading-progress">
                    <div class="progress-bar" style="width: ${book.progress}%"></div>
                </div>` : ''}
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">
                    <i class="fas fa-user-edit"></i> ${book.author}
                </p>
                <div class="book-meta">
                    <span class="book-rating">
                        <i class="fas fa-star"></i> ${book.rating}
                    </span>
                    <span class="book-price ${book.price === 0 ? 'free' : ''}">
                        ${book.price === 0 ? 'Miễn phí' : book.price.toLocaleString('vi-VN') + '₫'}
                    </span>
                </div>
                ${book.status !== 'wishlist' ? `
                <div class="book-progress-info">
                    <span class="progress-text">${book.progress}% đã đọc</span>
                    <span class="last-read">${book.lastRead}</span>
                </div>
                <div class="book-actions">
                    <button class="btn-continue" data-action="read" data-id="${book.id}">
                        <i class="fas fa-book-reader"></i> ${book.progress === 100 ? 'Đọc lại' : 'Tiếp tục'}
                    </button>
                    <button class="btn-bookmark" data-action="favorite" data-id="${book.id}" title="Yêu thích">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>` : `
                <div class="book-actions">
                    <button class="btn-read" data-action="detail" data-id="${book.id}">
                        <i class="fas fa-eye"></i> Xem chi tiết
                    </button>
                    <button class="btn-remove" data-action="remove" data-id="${book.id}" title="Xóa khỏi danh sách">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`}
            </div>
        </div>
    `;
}

// Update View Mode
function updateViewMode() {
    const booksGrid = document.getElementById('booksGrid');
    if (currentView === 'list') {
        booksGrid.style.gridTemplateColumns = '1fr';
    } else {
        booksGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    }
}

// Update Stats
function updateStats() {
    const totalPurchased = libraryBooks.filter(b => b.purchaseDate).length;
    const currentlyReading = libraryBooks.filter(b => b.status === 'reading').length;
    const completed = libraryBooks.filter(b => b.status === 'completed').length;
    const wishlist = libraryBooks.filter(b => b.status === 'wishlist').length;

    document.getElementById('totalPurchased').textContent = totalPurchased;
    document.getElementById('currentlyReading').textContent = currentlyReading;
    document.getElementById('completed').textContent = completed;
    document.getElementById('wishlistCount').textContent = wishlist;
}

// Toggle Favorite
function toggleFavorite(bookId) {
    const book = libraryBooks.find(b => b.id === bookId);
    if (book) {
        alert(`Đã thêm "${book.title}" vào danh sách yêu thích!`);
    }
}

// Remove from Wishlist
function removeFromWishlist(bookId) {
    if (confirm('Bạn có chắc muốn xóa sách này khỏi danh sách yêu thích?')) {
        const index = libraryBooks.findIndex(b => b.id === bookId);
        if (index !== -1) {
            libraryBooks.splice(index, 1);
            renderBooks();
            updateStats();
            alert('Đã xóa khỏi danh sách yêu thích!');
        }
    }
}