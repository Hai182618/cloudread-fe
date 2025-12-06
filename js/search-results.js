// Search Results Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeSearchResults();
});

// Global variables
let currentPage = 1;
let totalPages = 1;
let allResults = [];
let filteredResults = [];
const resultsPerPage = 12;
let searchManager;

function initializeSearchResults() {
    // Initialize search manager
    searchManager = new SearchManager();

    // Get search parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || '';
    const category = urlParams.get('category') || '';

    // Display search keyword
    document.getElementById('searchKeyword').textContent = searchQuery || 'Tất cả sách';

    // Set filters from URL parameters
    if (category) {
        document.getElementById('categoryFilter').value = category;
    }

    // Initialize filters and sorting
    setupFilters();
    setupSorting();
    setupPagination();

    // Perform initial search
    performSearch(searchQuery, category);
}

function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const downloadFilter = document.getElementById('downloadFilter');
    const favoriteFilter = document.getElementById('favoriteFilter');

    [categoryFilter, priceFilter, ratingFilter, downloadFilter, favoriteFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
}

function setupSorting() {
    const sortSelect = document.getElementById('sortSelect');
    const sortDirectionBtn = document.getElementById('sortDirection');

    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applySorting();
        });
    }

    if (sortDirectionBtn) {
        sortDirectionBtn.addEventListener('click', function() {
            // Toggle direction
            const currentDirection = this.getAttribute('data-direction');
            const newDirection = currentDirection === 'desc' ? 'asc' : 'desc';
            
            this.setAttribute('data-direction', newDirection);
            
            // Update icon and title
            const icon = this.querySelector('i');
            if (newDirection === 'asc') {
                icon.className = 'fas fa-sort-amount-up';
                this.title = 'Thấp lên cao';
            } else {
                icon.className = 'fas fa-sort-amount-down';
                this.title = 'Cao xuống thấp';
            }
            
            applySorting();
        });
    }

    // Backward compatibility with old sort buttons
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sortButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const sortType = this.getAttribute('data-sort');
            applySorting(sortType);
        });
    });
}

function setupPagination() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayResults();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayResults();
        }
    });
}

function performSearch(query, category) {
    showLoading(true);

    // Simulate API call with delay
    setTimeout(() => {
        const filters = {
            category: category || ''
        };
        
        allResults = searchManager.searchBooks(query, filters);
        filteredResults = [...allResults];
        
        // Apply initial sorting
        applySorting('relevance');
        
        showLoading(false);
        displayResults();
    }, 800);
}

function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const ratingFilter = document.getElementById('ratingFilter').value;
    const downloadFilter = document.getElementById('downloadFilter').value;
    const favoriteFilter = document.getElementById('favoriteFilter').value;

    const filters = {
        category: categoryFilter,
        price: priceFilter,
        rating: ratingFilter,
        downloaded: downloadFilter,
        favorite: favoriteFilter
    };

    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || '';

    // Re-search with new filters
    filteredResults = searchManager.searchBooks(searchQuery, filters);

    currentPage = 1; // Reset to first page
    applySorting(); // Apply current sorting
}

function applySorting(legacySortType = null) {
    let sortType = legacySortType;
    
    if (!legacySortType) {
        // Use new sort system
        const sortSelect = document.getElementById('sortSelect');
        const sortDirectionBtn = document.getElementById('sortDirection');
        
        if (sortSelect && sortDirectionBtn) {
            const baseSortType = sortSelect.value;
            const direction = sortDirectionBtn.getAttribute('data-direction');
            
            // Map to full sort type
            switch (baseSortType) {
                case 'newest':
                    sortType = direction === 'desc' ? 'newest' : 'oldest';
                    break;
                case 'rating':
                    sortType = direction === 'desc' ? 'rating-high' : 'rating-low';
                    break;
                case 'price':
                    sortType = direction === 'desc' ? 'price-high' : 'price-low';
                    break;
                case 'download':
                    sortType = direction === 'desc' ? 'download-high' : 'download-low';
                    break;
                case 'author':
                    sortType = direction === 'desc' ? 'author-za' : 'author-az';
                    break;
                case 'favorite':
                    sortType = direction === 'desc' ? 'favorite-first' : 'downloaded-first';
                    break;
                default:
                    sortType = baseSortType;
            }
        }
    }
    
    filteredResults = searchManager.sortResults(filteredResults, sortType || 'relevance');
    displayResults();
}

function displayResults() {
    const resultsGrid = document.getElementById('searchResultsGrid');
    const noResults = document.getElementById('noResults');
    const pagination = document.getElementById('pagination');
    const resultsCount = document.getElementById('resultsCount');

    if (filteredResults.length === 0) {
        resultsGrid.style.display = 'none';
        pagination.style.display = 'none';
        noResults.style.display = 'block';
        resultsCount.textContent = 'Không có kết quả nào';
        return;
    }

    noResults.style.display = 'none';
    resultsGrid.style.display = 'grid';

    // Calculate pagination
    totalPages = Math.ceil(filteredResults.length / resultsPerPage);
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const pageResults = filteredResults.slice(startIndex, endIndex);

    // Update results count
    resultsCount.textContent = `Tìm thấy ${filteredResults.length} kết quả`;

    // Display results
    resultsGrid.innerHTML = pageResults.map(book => `
        <div class="result-card" onclick="goToBookDetail(${book.id})">
            <div class="book-cover">
                <img src="${book.cover}" alt="${book.title}" 
                     onerror="this.style.background='linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)'; this.style.border='2px dashed #cbd5e0'; this.innerHTML='📚'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.fontSize='3rem';">
                ${book.isFree ? '<div class="book-badge">Miễn phí</div>' : ''}
                ${book.isDownloaded ? '<div class="download-badge"><i class="fas fa-download"></i></div>' : ''}
                ${book.isFavorite ? '<div class="favorite-badge"><i class="fas fa-heart"></i></div>' : ''}
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">Tác giả: ${book.author}</p>
                <span class="book-category">${book.category}</span>
                <div class="book-stats">
                    <div class="book-rating">
                        <span class="stars">${generateStars(book.rating)}</span>
                        <span class="rating-value">${book.rating}</span>
                    </div>
                    <div class="book-downloads">
                        <i class="fas fa-download download-count-icon"></i>
                        <span class="download-count-text">${formatNumber(book.downloadCount)}</span>
                    </div>
                    <div class="book-price">
                        ${book.isFree ? 'Miễn phí' : formatPrice(book.price)}
                    </div>
                </div>
                <div class="book-actions">
                    <button class="btn-read" onclick="event.stopPropagation(); readBook(${book.id})">
                        <i class="fas fa-book-open"></i> Đọc ngay
                    </button>
                    <button class="btn-favorite" onclick="event.stopPropagation(); toggleFavorite(${book.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Update pagination
    updatePagination();
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' VNĐ';
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageNumbers = document.getElementById('pageNumbers');

    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }

    pagination.style.display = 'flex';

    // Update prev/next buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Generate page numbers
    let pagesHTML = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pagesHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="goToPage(${i})">${i}</button>
        `;
    }

    pageNumbers.innerHTML = pagesHTML;
}

function goToPage(page) {
    currentPage = page;
    displayResults();
}

function showLoading(show) {
    const loadingState = document.getElementById('loadingState');
    const resultsGrid = document.getElementById('searchResultsGrid');
    const pagination = document.getElementById('pagination');

    if (show) {
        loadingState.style.display = 'flex';
        resultsGrid.style.display = 'none';
        pagination.style.display = 'none';
    } else {
        loadingState.style.display = 'none';
    }
}

// Book interaction functions
function goToBookDetail(bookId) {
    window.location.href = `book-detail.html?id=${bookId}`;
}

function readBook(bookId) {
    window.location.href = `reader.html?id=${bookId}`;
}

function toggleFavorite(bookId) {
    // Toggle favorite functionality
    const btn = event.target.closest('.btn-favorite');
    const icon = btn.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.style.background = '#667eea';
        btn.style.color = 'white';
        showMessage('Đã thêm vào yêu thích!', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.style.background = 'white';
        btn.style.color = '#667eea';
        showMessage('Đã xóa khỏi yêu thích!', 'info');
    }
}