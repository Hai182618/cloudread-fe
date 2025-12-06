// ===================================
// ADMIN BOOKS MANAGEMENT
// ===================================

// ========================
// IMMEDIATE AUTHENTICATION CHECK
// ========================
// This must run FIRST before any other code
(function() {
    'use strict';
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (!user) {
        // Not logged in - redirect immediately
        window.location.replace('login.html');
        return;
    }
    
    try {
        const userData = JSON.parse(user);
        // Check if role contains ADMIN (handles ROLE_ADMIN, admin, ADMIN, etc.)
        const isAdmin = userData.role && userData.role.toUpperCase().includes('ADMIN');
        if (!isAdmin) {
            // Not admin - redirect to home
            window.location.replace('index.html');
            return;
        }
    } catch (e) {
        // Invalid user data - redirect to login
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        window.location.replace('login.html');
        return;
    }
})();

const STORAGE_KEY = 'adminBooks'; // Giữ lại cho fallback

const defaultBooks = [
    {
        id: crypto.randomUUID(),
        title: 'Attack on Titan',
        author: 'Hajime Isayama',
        category: 'action',
        status: 'published',
        description: 'Eren và hành trình khám phá bí mật đằng sau các Titan.',
        cover: {
            dataUrl: '../assets/images/attack-on-titan.jpg',
            name: 'attack-on-titan.jpg'
        },
        bookFile: {
            name: 'attack-on-titan.txt',
            type: 'text/plain',
            size: 15200,
            lastModified: Date.now()
        },
        updatedAt: Date.now()
    },
    {
        id: crypto.randomUUID(),
        title: 'Demon Slayer',
        author: 'Koyoharu Gotouge',
        category: 'fantasy',
        status: 'draft',
        description: 'Thanh gươm diệt quỷ - Tanjiro chiến đấu để giải cứu em gái.',
        cover: {
            dataUrl: '../assets/images/demon-slayer.jpg',
            name: 'demon-slayer.jpg'
        },
        bookFile: {
            name: 'demon-slayer.docx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            size: 42000,
            lastModified: Date.now()
        },
        updatedAt: Date.now()
    }
];

const dom = {
    form: document.getElementById('bookForm'),
    bookId: document.getElementById('bookId'),
    title: document.getElementById('title'),
    author: document.getElementById('author'),
    category: document.getElementById('category'),
    description: document.getElementById('description'),
    bookFile: document.getElementById('bookFile'),
    coverFile: document.getElementById('coverFile'),
    bookFileInfo: document.getElementById('bookFileInfo'),
    coverFileInfo: document.getElementById('coverFileInfo'),
    submitBtn: document.getElementById('submitBtn'),
    booksTableBody: document.getElementById('booksTableBody'),
    searchInput: document.getElementById('searchInput'),
    // status removed
    filterCategory: document.getElementById('filterCategory'),
    metadataContent: document.getElementById('metadataContent'),
    toast: document.getElementById('toast'),
    resetFormBtn: document.getElementById('resetFormBtn'),
    previewBookFileBtn: document.getElementById('previewBookFileBtn'),
    previewCoverBtn: document.getElementById('previewCoverBtn'),
    clearPreviewBtn: document.getElementById('clearPreviewBtn'),
    exportBooksBtn: document.getElementById('exportBooksBtn'),
    rowTemplate: document.getElementById('bookRowTemplate')
};

let books = [];
let authors = [];
let categories = [];
let isLoading = false;

// ========================
// Load data from API
// ========================
async function loadAuthors() {
    try {
        console.log('🔄 Loading authors...');
        authors = await AuthorsAPI.getAll();
        console.log('✓ Authors loaded:', authors);
        populateAuthorDropdown();
    } catch (error) {
        console.error('❌ Load authors error:', error);
        console.error('Error details:', error.message, error.stack);
        // Fallback: use mock authors
        console.log('⚠️ Using fallback mock authors...');
        authors = [
            { id: 1, name: 'J.K. Rowling' },
            { id: 2, name: 'George R.R. Martin' },
            { id: 3, name: 'J.R.R. Tolkien' },
            { id: 4, name: 'Stephen King' },
            { id: 5, name: 'Agatha Christie' }
        ];
        populateAuthorDropdown();
    }
}

async function loadCategories() {
    try {
        console.log('🔄 Loading categories...');
        categories = await CategoriesAPI.getAll();
        console.log('✓ Categories loaded:', categories);
        populateCategoryDropdowns();
    } catch (error) {
        console.error('❌ Load categories error:', error);
        console.error('Error details:', error.message, error.stack);
        // Fallback: use mock categories
        console.log('⚠️ Using fallback mock categories...');
        categories = [
            { id: 1, name: 'Fantasy' },
            { id: 2, name: 'Science Fiction' },
            { id: 3, name: 'Mystery' },
            { id: 4, name: 'Romance' },
            { id: 5, name: 'Thriller' }
        ];
        populateCategoryDropdowns();
    }
}

function populateAuthorDropdown() {
    const dropdown = dom.author;
    if (!dropdown) return;
    
    // Clear except first option
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }
    
    // Add authors
    authors.forEach(author => {
        const option = document.createElement('option');
        option.value = author.id;
        option.textContent = author.name || `Author #${author.id}`;
        dropdown.appendChild(option);
    });
}

function populateCategoryDropdowns() {
    const mainSelect = dom.category;
    const filterSelect = dom.filterCategory;
    
    if (mainSelect) {
        while (mainSelect.options.length > 1) {
            mainSelect.remove(1);
        }
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name || `Category #${category.id}`;
            mainSelect.appendChild(option);
        });
    }
    
    if (filterSelect) {
        while (filterSelect.options.length > 1) {
            filterSelect.remove(1);
        }
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name || `Category #${category.id}`;
            filterSelect.appendChild(option);
        });
    }
}

// ========================
// Load books from API
// ========================
async function loadBooks() {
    if (isLoading) return;
    isLoading = true;
    
    try {
        showToast('Đang tải dữ liệu...', 'info');
        books = await BooksAPI.getAll();
        renderTable();
        showToast('✓ Tải dữ liệu thành công');
    } catch (error) {
        console.error('Load books error:', error);
        showToast(`⚠️ Lỗi tải dữ liệu: ${error.message}`, 'error');
        books = [];
    } finally {
        isLoading = false;
    }
}

// ========================
// Authentication Check (for runtime checks)
// ========================
function checkAdminAuth() {
    // Check if user is logged in
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (!user) {
        return false;
    }
    
    try {
        const userData = JSON.parse(user);
        return userData.role && userData.role.toUpperCase().includes('ADMIN');
    } catch (e) {
        console.error('Error parsing user data:', e);
        return false;
    }
}

// ========================
// Update User Display
// ========================
function updateUserDisplay() {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            const userInfo = document.querySelector('.admin-user__info');
            if (userInfo) {
                    const nameEl = userInfo.querySelector('strong');
                    const roleEl = userInfo.querySelector('span');
                    if (nameEl) nameEl.textContent = userData.name || 'Admin';
                    if (roleEl) roleEl.textContent = (userData.role && userData.role.toUpperCase().includes('ADMIN')) ? 'Superuser' : 'User';
                }
            
            // Update avatar initials
            const avatarEl = document.querySelector('.admin-user__avatar');
            if (avatarEl && userData.name) {
                const initials = userData.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);
                avatarEl.textContent = initials || 'AD';
            }
        } catch (e) {
            console.error('Error updating user display:', e);
        }
    }
}

// ========================
// Initialize
// ========================
// Wait for DOM to be ready before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        updateUserDisplay();
        Promise.all([
            loadAuthors(),
            loadCategories(),
            loadBooks()
        ]).catch(err => console.error('Initialization error:', err));
    });
} else {
    // DOM already ready
    updateUserDisplay();
    Promise.all([
        loadAuthors(),
        loadCategories(),
        loadBooks()
    ]).catch(err => console.error('Initialization error:', err));
}

// ========================
// Data helpers
// ========================
function showToast(message, type = 'success') {
    if (!dom.toast) return;
    dom.toast.textContent = message;
    dom.toast.style.background = type === 'success' ? '#111827' : '#b91c1c';
    dom.toast.classList.add('show');
    setTimeout(() => dom.toast.classList.remove('show'), 2500);
}

async function toBase64(file) {
    if (!file) return null;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function formatBytes(bytes = 0) {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function formatDate(timestamp) {
    if (!timestamp) return '--';
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN');
}

// ========================
// Rendering
// ========================
function getFilteredBooks() {
    const search = dom.searchInput?.value.toLowerCase().trim() || '';
    // status filter removed
    const status = '';
    const categoryFilter = dom.filterCategory?.value || '';

    return books.filter(book => {
        // Safe title search
        const title = String(book.title || '').toLowerCase();
        
        // Author name from backend (book.author is an object with id and name)
        const authorName = book.author?.name ? String(book.author.name).toLowerCase() : '';
        
        const matchesSearch = !search || title.includes(search) || authorName.includes(search);
        const matchesStatus = !status || book.status === status;

        // Filter by category - book.categories is an array of objects with id and name
        let matchesCategory = true;
        if (categoryFilter) {
            const categoryId = parseInt(categoryFilter);
            const bookCategoryIds = Array.isArray(book.categories) 
                ? book.categories.map(c => c.id) 
                : [];
            matchesCategory = bookCategoryIds.includes(categoryId);
        }

        return matchesSearch && matchesStatus && matchesCategory;
    });
}

function renderTable() {
    if (!dom.booksTableBody || !dom.rowTemplate) return;
    const filtered = getFilteredBooks();

    dom.booksTableBody.innerHTML = '';
    if (!filtered.length) {
        dom.booksTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>Không có sách nào phù hợp</p>
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(book => {
        const clone = dom.rowTemplate.content.cloneNode(true);
        clone.querySelector('tr').dataset.id = book.id;
        
        const coverEl = clone.querySelector('.book-cover');
        coverEl.src = book.coverUrl || '../assets/images/story-placeholder.jpg';
        coverEl.alt = book.title;

        clone.querySelector('.book-title').textContent = book.title;
        clone.querySelector('.book-description').textContent = book.description || 'Chưa có mô tả';
        
        // Author name - backend returns book.author as { id, name }
        const authorName = book.author?.name || 'N/A';
        clone.querySelector('.book-author').textContent = authorName;

        // Category names - backend returns book.categories as [{ id, name }, ...]
        const categoryChip = clone.querySelector('.category-chip');
        const categoryNames = Array.isArray(book.categories) && book.categories.length > 0
            ? book.categories.map(c => c.name).join(', ')
            : 'N/A';
        categoryChip.textContent = categoryNames;

        const statusChip = clone.querySelector('.status-chip');
        const status = book.active !== false ? 'published' : 'archived';
            // status removed from UI; we don't show it anymore
            statusChip && statusChip.remove && statusChip.remove();

        // File name - backend returns book.fileUrl
        const fileName = book.fileUrl ? book.fileUrl.split('/').pop() : '--';
        clone.querySelector('.book-file').textContent = fileName;
        
        const createdVal = book.createdAt || null;
        const updatedVal = book.updatedAt || null;
        clone.querySelector('.book-created').textContent = createdVal ? formatDate(new Date(createdVal).getTime()) : '--';
        clone.querySelector('.book-updated').textContent = updatedVal ? formatDate(new Date(updatedVal).getTime()) : '--';

        dom.booksTableBody.appendChild(clone);
    });
}

function populateForm(book) {
    dom.bookId.value = book.id;
    dom.title.value = book.title || '';
    
    // Author - backend returns book.author as { id, name }
    dom.author.value = book.author?.id || '';
    
    // Categories - backend returns book.categories as [{ id, name }, ...]
    const sel = dom.category;
    if (sel) {
        Array.from(sel.options).forEach(o => o.selected = false);
        if (Array.isArray(book.categories) && book.categories.length > 0) {
            book.categories.forEach(cat => {
                const opt = sel.querySelector(`option[value="${cat.id}"]`);
                if (opt) opt.selected = true;
            });
        }
    }
    
    dom.description.value = book.description || '';
    
    // File info display
    const hasBookFile = book.fileUrl;
    const hasCover = book.coverUrl;
    
    dom.bookFileInfo.textContent = hasBookFile ? '✓ File đã tải lên' : 'Chưa có file';
    dom.coverFileInfo.textContent = hasCover ? '✓ Ảnh đã tải lên' : 'Chưa có ảnh';
    
    dom.submitBtn.querySelector('span').textContent = 'Cập nhật';
    dom.submitBtn.querySelector('i').className = 'fas fa-save';
}

function resetForm() {
    dom.form.reset();
    dom.bookId.value = '';
    dom.bookFileInfo.textContent = 'Chưa có file';
    dom.coverFileInfo.textContent = 'Chưa có ảnh';
    dom.submitBtn.querySelector('span').textContent = 'Thêm mới';
    dom.submitBtn.querySelector('i').className = 'fas fa-plus-circle';
}

function getMetadataMarkup(book) {
    const coverImg = book.cover?.dataUrl
        ? `<img src="${book.cover.dataUrl}" class="metadata-cover" alt="${book.title}">`
        : '';

    const createdVal = book.createdAt || book.created_at || book.created || null;
    return `
        <div class="metadata-card">
            ${coverImg}
            <div class="metadata-section">
                <h4>Thông tin sách</h4>
                <ul class="metadata-list">
                    <li><span>Tiêu đề</span><strong>${book.title}</strong></li>
                    <li><span>Tác giả</span><strong>${book.author?.name || book.author || '--'}</strong></li>
                    <li><span>Thể loại</span><strong>${book.category}</strong></li>
                    <li><span>Trạng thái</span><strong>${book.status}</strong></li>
                    <li><span>Ngày tạo</span><strong>${createdVal ? formatDate(new Date(createdVal).getTime()) : '--'}</strong></li>
                    <li><span>Cập nhật</span><strong>${formatDate(book.updatedAt)}</strong></li>
                </ul>
            </div>
            <div class="metadata-section">
                <h4>File nội dung</h4>
                <ul class="metadata-list">
                    <li><span>Tên</span><strong>${book.bookFile?.name || '--'}</strong></li>
                    <li><span>Dung lượng</span><strong>${formatBytes(book.bookFile?.size)}</strong></li>
                    <li><span>Loại</span><strong>${book.bookFile?.type || '--'}</strong></li>
                </ul>
            </div>
        </div>
    `;
}

function showMetadata(book) {
    if (!dom.metadataContent) return;
    dom.metadataContent.innerHTML = getMetadataMarkup(book);
}

function showFilePreview(fileData, title) {
    if (!fileData) {
        showToast('Chưa có file để preview', 'error');
        return;
    }
    const book = {
        title: title || fileData.name,
        author: 'N/A',
        category: '--',
        status: '--',
        updatedAt: Date.now(),
        bookFile: fileData,
        cover: null
    };
    showMetadata(book);
}

// ========================
// Events
// ========================
dom.form?.addEventListener('submit', async event => {
    event.preventDefault();
    
    if (isLoading) return;
    
    const isEdit = Boolean(dom.bookId.value);
    const submitBtn = dom.submitBtn;
    const originalText = submitBtn.innerHTML;
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    
    try {
        // Prepare book data according to backend DTO
        // Backend expects authorId (integer) and categoryIds (array of integers)
        const selectedCategoryOptions = Array.from(dom.category.selectedOptions || []).filter(o => o.value && o.value !== '');
        const categoryIds = selectedCategoryOptions.map(o => parseInt(o.value));

            const bookData = {
                title: dom.title.value.trim(),
                description: dom.description.value.trim(),
                authorId: parseInt(dom.author.value) || 0,
                categoryIds: categoryIds
            };
        
        // Validate required fields
        if (!bookData.title || bookData.title.length === 0) {
            throw new Error('Vui lòng nhập tiêu đề sách');
        }
        if (bookData.authorId === 0 || !dom.author.value) {
            throw new Error('Vui lòng chọn/nhập tác giả');
        }
        if (bookData.categoryIds.length === 0) {
            throw new Error('Vui lòng chọn thể loại');
        }
        
        // Get files
        const coverImage = dom.coverFile.files[0] || null;
        const bookFile = dom.bookFile.files[0] || null;
        
        // For new books, both cover and book file are required
        if (!isEdit) {
            if (!coverImage) {
                throw new Error('Vui lòng chọn ảnh bìa sách');
            }
            if (!bookFile) {
                throw new Error('Vui lòng chọn file truyện');
            }
        }
        
        let result;
        if (isEdit) {
            // Update existing book (files are optional)
            const bookId = parseInt(dom.bookId.value);
            result = await BooksAPI.update(bookId, bookData, coverImage, bookFile);
            showToast('✓ Đã cập nhật sách thành công');
        } else {
            // Create new book (files are required)
            result = await BooksAPI.create(bookData, coverImage, bookFile);
            showToast('✓ Đã thêm sách mới thành công');
        }
        
        // Reload books list
        await loadBooks();
        resetForm();
        
    } catch (error) {
        console.error('Submit error:', error);
        showToast(`Lỗi: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});

dom.booksTableBody?.addEventListener('click', async event => {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;
    
    const row = btn.closest('tr');
    if (!row) return;
    
    const id = parseInt(row.dataset.id);
    const book = books.find(item => item.id === id);
    if (!book) {
        console.warn('Book not found for id:', id);
        return;
    }
    
    const action = btn.dataset.action;
    
    if (action === 'edit') {
        populateForm(book);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'delete') {
        const confirmed = confirm(`Bạn chắc muốn xóa sách "${book.title}"?\n\nHành động này không thể hoàn tác.`);
        if (!confirmed) return;
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        try {
            await BooksAPI.delete(id);
            showToast(`✓ Đã xóa sách "${book.title}" thành công`);
            await loadBooks();
            resetForm();
        } catch (error) {
            console.error('Delete error:', error);
            showToast(`✗ Lỗi xóa sách: ${error.message}`, 'error');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-trash"></i>';
        }
    } else if (action === 'preview') {
        showMetadata(book);
    }
});

dom.searchInput?.addEventListener('input', renderTable);
dom.filterCategory?.addEventListener('change', renderTable);

dom.bookFile?.addEventListener('change', () => {
    const file = dom.bookFile.files[0];
    dom.bookFileInfo.textContent = file ? `${file.name} • ${formatBytes(file.size)}` : 'Chưa có file';
});

dom.coverFile?.addEventListener('change', async () => {
    const file = dom.coverFile.files[0];
    if (!file) {
        dom.coverFileInfo.textContent = 'Chưa có ảnh';
        return;
    }
    dom.coverFileInfo.textContent = `${file.name} • ${formatBytes(file.size)}`;
    const coverData = {
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: await toBase64(file)
    };
    showMetadata({
        title: dom.title.value || 'Preview ảnh bìa',
        author: dom.author.value || '—',
        category: dom.category.value || '—',
        status: '—',
        updatedAt: Date.now(),
        bookFile: null,
        cover: coverData
    });
});

dom.resetFormBtn?.addEventListener('click', () => {
    resetForm();
    showToast('Đã làm mới form');
});

dom.previewBookFileBtn?.addEventListener('click', () => {
    if (dom.bookFile.files[0]) {
        const file = dom.bookFile.files[0];
        showFilePreview(
            {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            },
            dom.title.value || file.name
        );
    } else {
        showToast('Hãy chọn file truyện trước', 'error');
    }
});

dom.previewCoverBtn?.addEventListener('click', async () => {
    if (!dom.coverFile.files[0]) {
        showToast('Hãy chọn ảnh bìa trước', 'error');
        return;
    }
    const file = dom.coverFile.files[0];
    const coverData = {
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: await toBase64(file)
    };
    showMetadata({
        title: dom.title.value || 'Preview ảnh bìa',
        author: dom.author.value || '—',
        category: dom.category.value || '—',
        status: '—',
        updatedAt: Date.now(),
        bookFile: null,
        cover: coverData
    });
});

dom.clearPreviewBtn?.addEventListener('click', () => {
    dom.metadataContent.innerHTML = `
        <div class="metadata-empty">
            <i class="fas fa-magnifying-glass"></i>
            <p>Chọn sách hoặc file để xem metadata</p>
        </div>
    `;
});

dom.exportBooksBtn?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(books, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `books-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    link.remove();
    showToast('Đã export dữ liệu');
});

// --- New Author Inline Handlers ---
const btnShowNewAuthor = document.getElementById('btnShowNewAuthor');
const newAuthorForm = document.getElementById('newAuthorForm');
const createAuthorBtn = document.getElementById('createAuthorBtn');
const cancelCreateAuthor = document.getElementById('cancelCreateAuthor');

if (btnShowNewAuthor && newAuthorForm) {
    btnShowNewAuthor.addEventListener('click', () => {
        newAuthorForm.style.display = newAuthorForm.style.display === 'none' ? 'block' : 'none';
    });
}

if (cancelCreateAuthor && newAuthorForm) {
    cancelCreateAuthor.addEventListener('click', () => {
        newAuthorForm.style.display = 'none';
    });
}

if (createAuthorBtn) {
    createAuthorBtn.addEventListener('click', async () => {
        const nameEl = document.getElementById('newAuthorName');
        const descEl = document.getElementById('newAuthorDesc');
        const imgEl = document.getElementById('newAuthorImage');

        const name = nameEl?.value?.trim();
        if (!name) {
            showToast('Vui lòng nhập tên tác giả', 'error');
            return;
        }

        const authorData = {
            name: name,
            description: descEl?.value?.trim() || ''
        };
        const imageFile = imgEl?.files?.[0] || null;

        createAuthorBtn.disabled = true;
        createAuthorBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tạo...';

        try {
            const created = await AuthorsAPI.create(authorData, imageFile);
            showToast('✓ Tạo tác giả thành công');
            // reload authors and select the new one
            await loadAuthors();
            if (created && created.id) {
                dom.author.value = created.id;
            }
            // hide and reset form
            newAuthorForm.style.display = 'none';
            if (nameEl) nameEl.value = '';
            if (descEl) descEl.value = '';
            if (imgEl) imgEl.value = '';
        } catch (error) {
            console.error('Create author error:', error);
            showToast(`Lỗi tạo tác giả: ${error.message}`, 'error');
        } finally {
            createAuthorBtn.disabled = false;
            createAuthorBtn.innerHTML = 'Tạo tác giả';
        }
    });
}

// --- New Category Inline Handlers ---
const btnShowNewCategory = document.getElementById('btnShowNewCategory');
const newCategoryForm = document.getElementById('newCategoryForm');
const createCategoryBtn = document.getElementById('createCategoryBtn');
const cancelCreateCategory = document.getElementById('cancelCreateCategory');

if (btnShowNewCategory && newCategoryForm) {
    btnShowNewCategory.addEventListener('click', () => {
        newCategoryForm.style.display = newCategoryForm.style.display === 'none' ? 'block' : 'none';
    });
}

if (cancelCreateCategory && newCategoryForm) {
    cancelCreateCategory.addEventListener('click', () => {
        newCategoryForm.style.display = 'none';
    });
}

if (createCategoryBtn) {
    createCategoryBtn.addEventListener('click', async () => {
        const nameEl = document.getElementById('newCategoryName');

        const name = nameEl?.value?.trim();
        if (!name) {
            showToast('Vui lòng nhập tên thể loại', 'error');
            return;
        }

        const categoryData = {
            name: name
        };

        createCategoryBtn.disabled = true;
        createCategoryBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tạo...';

        try {
            const created = await CategoriesAPI.create(categoryData);
            showToast('✓ Tạo thể loại thành công');
            // reload categories and select the new one
            await loadCategories();
            if (created && created.id) {
                dom.category.value = created.id;
            }
            // hide and reset form
            newCategoryForm.style.display = 'none';
            if (nameEl) nameEl.value = '';
        } catch (error) {
            console.error('Create category error:', error);
            showToast(`Lỗi tạo thể loại: ${error.message}`, 'error');
        } finally {
            createCategoryBtn.disabled = false;
            createCategoryBtn.innerHTML = '<i class="fas fa-check"></i> Tạo thể loại';
        }
    });
}

// Logout handler
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const confirmed = confirm('Bạn có chắc muốn đăng xuất?');
    if (confirmed) {
        // Clear user session
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        
        // Show message
        showToast('Đã đăng xuất thành công', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
});

