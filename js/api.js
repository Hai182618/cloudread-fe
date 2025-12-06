// ===================================
// API CLIENT - HYBRID VERSION
// ===================================

const API_CONFIG = {
    BASE_URL: 'http://localhost:8080', // URL Backend của bạn
};

// ===================================
// Helper Functions
// ===================================

function getAuthToken() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
        return user?.token || user?.accessToken || null;
    } catch (e) {
        return null;
    }
}

function getHeaders(includeAuth = true, contentType = 'application/json') {
    const headers = {};
    if (contentType) {
        headers['Content-Type'] = contentType;
    }
    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
}

async function handleResponse(response) {
    // Xử lý lỗi HTTP
    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const error = await response.json();
            errorMessage = error.message || errorMessage;
        } catch (e) {
            errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
    }
    
    // Xử lý thành công: Kiểm tra nếu body rỗng (ví dụ DELETE trả về 204)
    try {
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (e) {
        return {};
    }
}

async function apiRequest(url, options = {}) {
    try {
        const fullUrl = `${API_CONFIG.BASE_URL}${url}`;
        const response = await fetch(fullUrl, {
            ...options,
            headers: {
                ...getHeaders(options.includeAuth !== false, options.contentType),
                ...(options.headers || {})
            }
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`API Request Error [${url}]:`, error);
        throw error;
    }
}

// ===================================
// Books API (Giữ nguyên logic Admin của bạn)
// ===================================

const BooksAPI = {
    async getAll() {
        try {
            const response = await apiRequest('/book');
            return response.data || [];
        } catch (error) {
            console.error('BooksAPI.getAll error:', error);
            // Trả về mảng rỗng để UI không crash
            return [];
        }
    },
    
    async getById(bookId) {
        try {
            const response = await apiRequest(`/book/${bookId}`);
            return response.data;
        } catch (error) {
            console.error('BooksAPI.getById error:', error);
            throw error;
        }
    },
    
    // ADMIN: Create
    async create(bookData, coverImage, bookFile) {
        try {
            const formData = new FormData();
            // Backend yêu cầu @RequestPart("data") là JSON
            formData.append('data', new Blob([JSON.stringify(bookData)], { type: 'application/json' }));
            
            if (coverImage) formData.append('image', coverImage);
            if (bookFile) formData.append('file', bookFile);
            
            const response = await apiRequest('/book', {
                method: 'POST',
                contentType: null, // Để browser tự set multipart boundary
                body: formData
            });
            return response.data;
        } catch (error) {
            console.error('BooksAPI.create error:', error);
            throw error;
        }
    },
    
    // ADMIN: Update
    async update(bookId, bookData, coverImage = null, bookFile = null) {
        try {
            const formData = new FormData();
            formData.append('data', new Blob([JSON.stringify(bookData)], { type: 'application/json' }));
            
            if (coverImage) formData.append('image', coverImage);
            if (bookFile) formData.append('file', bookFile);
            
            const response = await apiRequest(`/book/${bookId}/update`, {
                method: 'PUT',
                contentType: null,
                body: formData
            });
            return response.data;
        } catch (error) {
            console.error('BooksAPI.update error:', error);
            throw error;
        }
    },
    
    // ADMIN: Delete
    async delete(bookId) {
        try {
            return await apiRequest(`/book/${bookId}`, { method: 'DELETE' });
        } catch (error) {
            console.error('BooksAPI.delete error:', error);
            throw error;
        }
    },
    
    // ADMIN: Change Status
    async changeStatus(bookId) {
        try {
            return await apiRequest(`/book/${bookId}/change-status`, { method: 'PUT' });
        } catch (error) {
            console.error('BooksAPI.changeStatus error:', error);
            throw error;
        }
    },
    
    async getByCategory(categoryId) {
        try {
            const response = await apiRequest(`/book/category/${categoryId}/books`);
            return response.data || [];
        } catch (error) {
            console.error('BooksAPI.getByCategory error:', error);
            throw error;
        }
    },
    
    async getByAuthor(authorId) {
        try {
            const response = await apiRequest(`/book/author/${authorId}/books`);
            return response.data || [];
        } catch (error) {
            console.error('BooksAPI.getByAuthor error:', error);
            throw error;
        }
    },
    
    async search(keyword) {
        try {
            const response = await apiRequest(`/book/search?keyword=${encodeURIComponent(keyword)}`);
            return response.data || [];
        } catch (error) {
            console.error('BooksAPI.search error:', error);
            throw error;
        }
    },
    
    async getNewest() {
        try {
            const response = await apiRequest('/book/newest');
            return response.data || [];
        } catch (error) {
            console.error('BooksAPI.getNewest error:', error);
            throw error;
        }
    },
    
    async getMostFavorite() {
        try {
            const response = await apiRequest('/book/most-favorite');
            return response.data || [];
        } catch (error) {
            console.error('BooksAPI.getMostFavorite error:', error);
            throw error;
        }
    },
    
    async getMyFavorites() {
        try {
            const response = await apiRequest('/book/my-favorites');
            return response.data || [];
        } catch (error) {
            // Không throw error nếu chưa login
            return [];
        }
    },
    
    async toggleFavorite(bookId) {
        try {
            return await apiRequest(`/book/${bookId}/favorite`, { method: 'PUT' });
        } catch (error) {
            console.error('BooksAPI.toggleFavorite error:', error);
            throw error;
        }
    }
};

// ===================================
// Authors API
// ===================================

const AuthorsAPI = {
    async getAll() {
        try {
            const response = await apiRequest('/author', { includeAuth: true });
            return response.data || [];
        } catch (error) {
            // Fallback logic của bạn
            const fallbacks = ['/api/author', '/authors', '/api/authors'];
            for (const path of fallbacks) {
                try {
                    const res = await apiRequest(path, { includeAuth: true });
                    return res.data || [];
                } catch (e) {}
            }
            console.error('AuthorsAPI.getAll failed:', error);
            throw error;
        }
    },
    
    async getById(authorId) {
        const response = await apiRequest(`/author/${authorId}`, { includeAuth: true });
        return response.data;
    },

    // Giữ nguyên logic fetch thủ công của bạn cho create Author
    async create(authorData, imageFile = null) {
        try {
            const formData = new FormData();
            formData.append('data', new Blob([JSON.stringify(authorData)], { type: 'application/json' }));
            if (imageFile) formData.append('image', imageFile);

            const fullUrl = `${API_CONFIG.BASE_URL}/author`;
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: { ...getHeaders(true, null) },
                body: formData
            });
            
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || `HTTP ${response.status}`);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('AuthorsAPI.create error:', error);
            throw error;
        }
    }
};

// ===================================
// Categories API
// ===================================

const CategoriesAPI = {
    async getAll() {
        try {
            const response = await apiRequest('/category', { includeAuth: true });
            return response.data || [];
        } catch (error) {
            const fallbacks = ['/api/category', '/categories'];
            for (const path of fallbacks) {
                try {
                    const res = await apiRequest(path, { includeAuth: true });
                    return res.data || [];
                } catch (e) {}
            }
            return [];
        }
    },
    
    async getById(categoryId) {
        const response = await apiRequest(`/category/${categoryId}`, { includeAuth: true });
        return response.data;
    },

    async create(categoryData) {
        const response = await apiRequest('/category', {
            method: 'POST',
            body: JSON.stringify(categoryData),
            includeAuth: true,
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data || response;
    }
};

// ===================================
// QUAN TRỌNG: CẤU HÌNH ĐỂ CHẠY CẢ ADMIN VÀ HOME
// ===================================

// 1. Gán vào window để trang Admin (không dùng type="module") có thể gọi được
window.BooksAPI = BooksAPI;
window.AuthorsAPI = AuthorsAPI;
window.CategoriesAPI = CategoriesAPI;

// 2. Export để trang Home (dùng type="module") có thể import được
export { BooksAPI, AuthorsAPI, CategoriesAPI };