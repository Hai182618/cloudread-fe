// Search functionality for BookReader
class SearchManager {
    constructor() {
        this.mockBooks = [
            {
                id: 1,
                title: "Đắc Nhân Tâm",
                author: "Dale Carnegie",
                category: "Phát triển bản thân",
                categorySlug: "phat-trien-ban-than",
                price: 49000,
                rating: 4.8,
                cover: "../assets/images/dac-nhan-tam.jpg",
                description: "Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử",
                isFree: false,
                publishDate: "2024-01-15",
                tags: ["tự phát triển", "kỹ năng", "giao tiếp"],
                isDownloaded: false,
                isFavorite: false,
                downloadCount: 1247
            },
            {
                id: 2,
                title: "Sapiens: Lược Sử Loài Người",
                author: "Yuval Noah Harari",
                category: "Lịch sử",
                categorySlug: "lich-su",
                price: 89000,
                rating: 4.9,
                cover: "../assets/images/sapiens.jpg",
                description: "Câu chuyện về sự tiến hóa của loài người",
                isFree: false,
                publishDate: "2024-02-20",
                tags: ["lịch sử", "khoa học", "tiến hóa"],
                isDownloaded: true,
                isFavorite: true,
                downloadCount: 2341
            },
            {
                id: 3,
                title: "Nhà Giả Kim",
                author: "Paulo Coelho",
                category: "Tiểu thuyết",
                categorySlug: "tieu-thuyet",
                price: 35000,
                rating: 4.6,
                cover: "../assets/images/nha-gia-kim.jpg",
                description: "Hành trình tìm kiếm kho báu và ý nghĩa cuộc sống",
                isFree: false,
                publishDate: "2024-01-10",
                tags: ["phiêu lưu", "triết lý", "tự khám phá"],
                isDownloaded: true,
                isFavorite: false,
                downloadCount: 1856
            },
            {
                id: 4,
                title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
                author: "Nguyễn Nhật Ánh",
                category: "Văn học Việt Nam",
                categorySlug: "van-hoc-viet-nam",
                price: 0,
                rating: 4.7,
                cover: "../assets/images/hoa-vang-co-xanh.jpg",
                description: "Kỷ niệm tuổi thơ đẹp đẽ ở miền quê Việt Nam",
                isFree: true,
                publishDate: "2024-03-01",
                tags: ["tuổi thơ", "quê hương", "gia đình"],
                isDownloaded: false,
                isFavorite: true,
                downloadCount: 3542
            },
            {
                id: 5,
                title: "Sherlock Holmes: Cuộc Phiêu Lưu",
                author: "Arthur Conan Doyle",
                category: "Trinh thám",
                categorySlug: "truyen-trinh-tham",
                price: 67000,
                rating: 4.5,
                cover: "../assets/images/sherlock.jpg",
                description: "Những vụ án bí ẩn được giải mã bởi thám tử Sherlock Holmes",
                isFree: false,
                publishDate: "2024-02-15",
                tags: ["trinh thám", "bí ẩn", "thám tử"],
                isDownloaded: true,
                isFavorite: false,
                downloadCount: 987
            },
            {
                id: 6,
                title: "Harry Potter và Hòn đá Phù thủy",
                author: "J.K. Rowling",
                category: "Huyền bí",
                categorySlug: "fantasy",
                price: 125000,
                rating: 4.9,
                cover: "../assets/images/harry-potter.jpg",
                description: "Cuộc phiêu lưu thần kỳ của cậu bé phù thủy",
                isFree: false,
                publishDate: "2024-01-05",
                tags: ["phù thủy", "phiêu lưu", "thần kỳ"],
                isDownloaded: false,
                isFavorite: true,
                downloadCount: 4521
            },
            {
                id: 7,
                title: "Conan: Thám Tử Lừng Danh",
                author: "Gosho Aoyama",
                category: "Truyện tranh",
                categorySlug: "truyen-tranh",
                price: 25000,
                rating: 4.4,
                cover: "../assets/images/conan.jpg",
                description: "Manga trinh thám nổi tiếng với những vụ án hấp dẫn",
                isFree: false,
                publishDate: "2024-01-20",
                tags: ["manga", "trinh thám", "anime"],
                isDownloaded: true,
                isFavorite: true,
                downloadCount: 2876
            },
            {
                id: 8,
                title: "Kiếm Hiệp Kim Dung",
                author: "Kim Dung",
                category: "Kiếm hiệp",
                categorySlug: "kiem-hiep",
                price: 0,
                rating: 4.8,
                cover: "../assets/images/kim-dung.jpg",
                description: "Thế giới võ lâm đầy màu sắc với những anh hùng hảo hán",
                isFree: true,
                publishDate: "2024-02-10",
                tags: ["võ thuật", "hiệp sĩ", "cổ trang"],
                isDownloaded: false,
                isFavorite: false,
                downloadCount: 5432
            },
            {
                id: 9,
                title: "One Piece: Kho Báu Hải Tặc",
                author: "Eiichiro Oda",
                category: "Truyện tranh",
                categorySlug: "truyen-tranh",
                price: 30000,
                rating: 4.9,
                cover: "../assets/images/one-piece.jpg",
                description: "Cuộc phiêu lưu tìm kiếm kho báu One Piece",
                isFree: false,
                publishDate: "2024-03-05",
                tags: ["hải tặc", "phiêu lưu", "shounen"],
                isDownloaded: true,
                isFavorite: false,
                downloadCount: 6785
            },
            {
                id: 10,
                title: "Sword Art Online",
                author: "Reki Kawahara",
                category: "Light Novel",
                categorySlug: "light-novel",
                price: 85000,
                rating: 4.3,
                cover: "../assets/images/sao.jpg",
                description: "Thế giới thực tế ảo với trò chơi sinh tử",
                isFree: false,
                publishDate: "2024-02-25",
                tags: ["thực tế ảo", "game", "khoa học viễn tưởng"],
                isDownloaded: false,
                isFavorite: true,
                downloadCount: 1654
            }
        ];
    }

    // Search books based on query and filters
    searchBooks(query = '', filters = {}) {
        let results = [...this.mockBooks];

        // Text search
        if (query && query.trim() !== '') {
            const searchTerm = query.toLowerCase();
            results = results.filter(book => 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.category.toLowerCase().includes(searchTerm) ||
                book.description.toLowerCase().includes(searchTerm) ||
                book.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Category filter
        if (filters.category && filters.category !== '') {
            results = results.filter(book => book.categorySlug === filters.category);
        }

        // Price filter
        if (filters.price) {
            switch (filters.price) {
                case 'free':
                    results = results.filter(book => book.isFree);
                    break;
                case '0-50000':
                    results = results.filter(book => book.price >= 0 && book.price <= 50000);
                    break;
                case '50000-100000':
                    results = results.filter(book => book.price > 50000 && book.price <= 100000);
                    break;
                case '100000+':
                    results = results.filter(book => book.price > 100000);
                    break;
            }
        }

        // Rating filter
        if (filters.rating) {
            const minRating = parseFloat(filters.rating);
            results = results.filter(book => book.rating >= minRating);
        }

        // Downloaded filter
        if (filters.downloaded) {
            if (filters.downloaded === 'downloaded') {
                results = results.filter(book => book.isDownloaded);
            } else if (filters.downloaded === 'not-downloaded') {
                results = results.filter(book => !book.isDownloaded);
            }
        }

        // Favorite filter
        if (filters.favorite) {
            if (filters.favorite === 'favorite') {
                results = results.filter(book => book.isFavorite);
            } else if (filters.favorite === 'not-favorite') {
                results = results.filter(book => !book.isFavorite);
            }
        }

        return results;
    }

    // Sort results
    sortResults(results, sortType = 'relevance') {
        const sortedResults = [...results];

        switch (sortType) {
            case 'newest':
                sortedResults.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
                break;
            case 'oldest':
                sortedResults.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
                break;
            case 'rating-high':
                sortedResults.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating-low':
                sortedResults.sort((a, b) => a.rating - b.rating);
                break;
            case 'price-low':
                sortedResults.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedResults.sort((a, b) => b.price - a.price);
                break;
            case 'download-high':
                sortedResults.sort((a, b) => b.downloadCount - a.downloadCount);
                break;
            case 'download-low':
                sortedResults.sort((a, b) => a.downloadCount - b.downloadCount);
                break;
            case 'author-az':
                sortedResults.sort((a, b) => a.author.localeCompare(b.author, 'vi'));
                break;
            case 'author-za':
                sortedResults.sort((a, b) => b.author.localeCompare(a.author, 'vi'));
                break;
            case 'title-az':
                sortedResults.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
                break;
            case 'title-za':
                sortedResults.sort((a, b) => b.title.localeCompare(a.title, 'vi'));
                break;
            case 'favorite-first':
                sortedResults.sort((a, b) => b.isFavorite - a.isFavorite);
                break;
            case 'downloaded-first':
                sortedResults.sort((a, b) => b.isDownloaded - a.isDownloaded);
                break;
            // Backward compatibility
            case 'rating':
                sortedResults.sort((a, b) => b.rating - a.rating);
                break;
            case 'title':
                sortedResults.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
                break;
            case 'author':
                sortedResults.sort((a, b) => a.author.localeCompare(b.author, 'vi'));
                break;
            default:
                // relevance - keep original order or implement scoring
                break;
        }

        return sortedResults;
    }

    // Get book by ID
    getBookById(id) {
        return this.mockBooks.find(book => book.id === parseInt(id));
    }

    // Get books by category
    getBooksByCategory(categorySlug, limit = null) {
        let results = this.mockBooks.filter(book => book.categorySlug === categorySlug);
        return limit ? results.slice(0, limit) : results;
    }

    // Get random books
    getRandomBooks(count = 6) {
        const shuffled = [...this.mockBooks].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Get popular books (high rating)
    getPopularBooks(limit = 8) {
        return this.mockBooks
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    // Get free books
    getFreeBooks(limit = null) {
        let results = this.mockBooks.filter(book => book.isFree);
        return limit ? results.slice(0, limit) : results;
    }

    // Get new releases
    getNewReleases(limit = 6) {
        return this.mockBooks
            .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
            .slice(0, limit);
    }

    // Get downloaded books
    getDownloadedBooks(limit = null) {
        let results = this.mockBooks.filter(book => book.isDownloaded);
        return limit ? results.slice(0, limit) : results;
    }

    // Get favorite books
    getFavoriteBooks(limit = null) {
        let results = this.mockBooks.filter(book => book.isFavorite);
        return limit ? results.slice(0, limit) : results;
    }

    // Get most downloaded books
    getMostDownloaded(limit = 8) {
        return this.mockBooks
            .sort((a, b) => b.downloadCount - a.downloadCount)
            .slice(0, limit);
    }

    // Get categories with book counts
    getCategories() {
        const categories = {};
        this.mockBooks.forEach(book => {
            if (!categories[book.categorySlug]) {
                categories[book.categorySlug] = {
                    name: book.category,
                    slug: book.categorySlug,
                    count: 0
                };
            }
            categories[book.categorySlug].count++;
        });
        return Object.values(categories);
    }

    // Search suggestions
    getSearchSuggestions(query, limit = 5) {
        if (!query || query.length < 2) return [];

        const searchTerm = query.toLowerCase();
        const suggestions = [];

        // Title suggestions
        this.mockBooks.forEach(book => {
            if (book.title.toLowerCase().includes(searchTerm)) {
                suggestions.push({
                    type: 'book',
                    text: book.title,
                    category: book.category
                });
            }
        });

        // Author suggestions
        const authors = [...new Set(this.mockBooks.map(book => book.author))];
        authors.forEach(author => {
            if (author.toLowerCase().includes(searchTerm)) {
                suggestions.push({
                    type: 'author',
                    text: author,
                    category: 'Tác giả'
                });
            }
        });

        // Category suggestions
        const categories = [...new Set(this.mockBooks.map(book => book.category))];
        categories.forEach(category => {
            if (category.toLowerCase().includes(searchTerm)) {
                suggestions.push({
                    type: 'category',
                    text: category,
                    category: 'Thể loại'
                });
            }
        });

        return suggestions.slice(0, limit);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchManager;
} else {
    window.SearchManager = SearchManager;
}