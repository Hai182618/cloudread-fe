// ===================================
// BOOK LIST PAGE JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Sample Books Data
    const booksData = [
        { id: 1, title: 'Attack on Titan', author: 'Hajime Isayama', cover: '../assets/images/attack-on-titan.jpg', rating: 4.9, views: '2.3M', badge: 'hot', category: 'action' },
        { id: 2, title: 'Demon Slayer', author: 'Koyoharu Gotouge', cover: '../assets/images/demon-slayer.jpg', rating: 4.8, views: '1.9M', badge: 'new', category: 'action' },
        { id: 3, title: 'Spy x Family', author: 'Tatsuya Endo', cover: '../assets/images/spy-family.jpg', rating: 4.9, views: '1.7M', badge: 'hot', category: 'comedy' },
        { id: 4, title: 'Jujutsu Kaisen', author: 'Gege Akutami', cover: '../assets/images/jujutsu-kaisen.jpg', rating: 4.8, views: '2.1M', badge: 'new', category: 'action' },
        { id: 5, title: 'One Piece', author: 'Eiichiro Oda', cover: '../assets/images/one-piece.jpg', rating: 4.9, views: '4.5M', badge: 'hot', category: 'action' },
        { id: 6, title: 'Tokyo Ghoul', author: 'Sui Ishida', cover: '../assets/images/tokyo-ghoul.jpg', rating: 4.7, views: '1.4M', badge: '', category: 'horror' },
        { id: 7, title: 'Naruto', author: 'Masashi Kishimoto', cover: '../assets/images/naruto.jpg', rating: 4.9, views: '3.2M', badge: '', category: 'action' },
        { id: 8, title: 'Bleach', author: 'Tite Kubo', cover: '../assets/images/bleach.jpg', rating: 4.7, views: '2.1M', badge: '', category: 'action' },
        { id: 9, title: 'Conan - Thám Tử Lừng Danh', author: 'Gosho Aoyama', cover: '../assets/images/conan.jpg', rating: 4.8, views: '2.5M', badge: 'hot', category: 'mystery' },
        { id: 10, title: 'Douluo Đại Lục', author: 'Đường Gia Tam Thiếu', cover: '../assets/images/douluo-dai-luc.jpg', rating: 4.6, views: '1.8M', badge: '', category: 'fantasy' },
        { id: 11, title: 'Hunter x Hunter', author: 'Yoshihiro Togashi', cover: '../assets/images/hunter.jpg', rating: 4.9, views: '1.9M', badge: '', category: 'action' },
        { id: 12, title: 'My Hero Academia', author: 'Kohei Horikoshi', cover: '../assets/images/story-placeholder.jpg', rating: 4.8, views: '2.4M', badge: 'new', category: 'action' },
        { id: 13, title: 'Death Note', author: 'Tsugumi Ohba', cover: '../assets/images/story-placeholder.jpg', rating: 4.9, views: '3.1M', badge: '', category: 'mystery' },
        { id: 14, title: 'Fullmetal Alchemist', author: 'Hiromu Arakawa', cover: '../assets/images/story-placeholder.jpg', rating: 4.9, views: '2.8M', badge: '', category: 'fantasy' },
        { id: 15, title: 'Your Name', author: 'Makoto Shinkai', cover: '../assets/images/story-placeholder.jpg', rating: 4.8, views: '2.2M', badge: 'new', category: 'romance' },
        { id: 16, title: 'Sword Art Online', author: 'Reki Kawahara', cover: '../assets/images/story-placeholder.jpg', rating: 4.7, views: '2.0M', badge: '', category: 'scifi' },
        { id: 17, title: 'Steins;Gate', author: 'Nitroplus', cover: '../assets/images/story-placeholder.jpg', rating: 4.9, views: '1.5M', badge: '', category: 'scifi' },
        { id: 18, title: 'Re:Zero', author: 'Tappei Nagatsuki', cover: '../assets/images/story-placeholder.jpg', rating: 4.8, views: '1.8M', badge: 'hot', category: 'fantasy' },
        { id: 19, title: 'Kaguya-sama', author: 'Aka Akasaka', cover: '../assets/images/story-placeholder.jpg', rating: 4.8, views: '1.6M', badge: '', category: 'romance' },
        { id: 20, title: 'Chainsaw Man', author: 'Tatsuki Fujimoto', cover: '../assets/images/story-placeholder.jpg', rating: 4.7, views: '1.9M', badge: 'new', category: 'horror' },
        { id: 21, title: 'Mob Psycho 100', author: 'ONE', cover: '../assets/images/story-placeholder.jpg', rating: 4.8, views: '1.4M', badge: '', category: 'action' },
        { id: 22, title: 'Violet Evergarden', author: 'Kana Akatsuki', cover: '../assets/images/story-placeholder.jpg', rating: 4.9, views: '1.3M', badge: '', category: 'drama' },
        { id: 23, title: 'Gintama', author: 'Hideaki Sorachi', cover: '../assets/images/story-placeholder.jpg', rating: 4.9, views: '2.1M', badge: '', category: 'comedy' },
        { id: 24, title: 'Made in Abyss', author: 'Akihito Tsukushi', cover: '../assets/images/story-placeholder.jpg', rating: 4.8, views: '1.2M', badge: '', category: 'fantasy' }
    ];

    let currentBooks = [...booksData];
    const booksPerPage = 12;
    let currentPage = 1;

    // Get DOM elements
    const booksGrid = document.getElementById('booksGrid');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const totalResultsEl = document.getElementById('totalResults');
    const viewBtns = document.querySelectorAll('.view-btn');

    // Render books function
    function renderBooks(books) {
        if (!booksGrid) return;

        if (books.length === 0) {
            booksGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-search" style="font-size: 4rem; color: #cbd5e0; margin-bottom: 20px;"></i>
                    <h3 style="color: #4a5568; margin-bottom: 10px;">Không tìm thấy truyện</h3>
                    <p style="color: #718096;">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
            `;
            return;
        }

        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        const paginatedBooks = books.slice(startIndex, endIndex);

        booksGrid.innerHTML = paginatedBooks.map(book => `
            <div class="book-card" onclick="window.location.href='book-detail.html?id=${book.id}'">
                <div class="book-card-image">
                    <img src="${book.cover}" alt="${book.title}" 
                         onerror="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; this.innerHTML='<div style=color:white;padding:100px 20px;text-align:center;font-size:24px;>📖</div>'">
                    ${book.badge ? `<span class="book-badge ${book.badge}">${book.badge === 'hot' ? 'Hot' : 'Mới'}</span>` : ''}
                </div>
                <div class="book-card-content">
                    <h3>${book.title}</h3>
                    <p class="book-card-author">
                        <i class="fas fa-user-edit"></i> ${book.author}
                    </p>
                    <div class="book-card-meta">
                        <span class="book-card-rating">
                            <i class="fas fa-star"></i> ${book.rating}
                        </span>
                        <span class="book-card-views">
                            <i class="fas fa-eye"></i> ${book.views}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        // Update total results
        if (totalResultsEl) {
            totalResultsEl.textContent = books.length;
        }
    }

    // Filter and sort functions
    function filterBooks() {
        let filtered = [...booksData];

        // Category filter
        const category = categoryFilter?.value;
        if (category) {
            filtered = filtered.filter(book => book.category === category);
        }

        // Sort
        const sortBy = sortFilter?.value;
        if (sortBy === 'popular') {
            filtered.sort((a, b) => parseFloat(b.views) - parseFloat(a.views));
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'views') {
            filtered.sort((a, b) => parseFloat(b.views) - parseFloat(a.views));
        }

        currentBooks = filtered;
        currentPage = 1;
        renderBooks(currentBooks);
    }

    // Event listeners for filters
    if (categoryFilter) categoryFilter.addEventListener('change', filterBooks);
    if (statusFilter) statusFilter.addEventListener('change', filterBooks);
    if (sortFilter) sortFilter.addEventListener('change', filterBooks);

    // Reset filters
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            if (categoryFilter) categoryFilter.value = '';
            if (statusFilter) statusFilter.value = '';
            if (sortFilter) sortFilter.value = 'latest';
            currentBooks = [...booksData];
            currentPage = 1;
            renderBooks(currentBooks);
        });
    }

    // View mode toggle
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const viewMode = this.dataset.view;
            if (viewMode === 'list') {
                booksGrid.style.gridTemplateColumns = '1fr';
            } else {
                booksGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
            }
        });
    });

    // Initial render
    renderBooks(currentBooks);
});