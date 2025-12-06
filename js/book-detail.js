import { BooksAPI } from './api.js';
import { formatNumber, formatRelativeTime, getUrlParam, handleImageError } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initBookDetail();
});

async function initBookDetail() {
    const bookId = getUrlParam('id');
    if (!bookId) {
        alert('Không tìm thấy ID truyện!');
        window.location.href = 'index.html';
        return;
    }

    try {
        const book = await BooksAPI.getById(bookId);
        if (!book) {
            document.getElementById('book-detail-container').innerHTML = '<h2>Không tìm thấy sách.</h2>';
            return;
        }

        // Lấy link file gốc (nếu có)
        const mainFileUrl = book.fileUrl || book.file || book.filePath; 

        renderBookInfo(book, mainFileUrl);
        
        const chapters = book.chapters || book.chapterList || [];
        renderChapters(chapters, book.id, mainFileUrl);

    } catch (error) {
        console.error('Error:', error);
    }
}

function renderBookInfo(book, mainFileUrl) {
    const container = document.getElementById('book-detail-container');
    if (!container) return;
    
    // Xử lý tên tác giả
    let authorDisplay = 'Tác giả ẩn danh';
    if (book.authorName) authorDisplay = book.authorName;
    else if (book.author) authorDisplay = (typeof book.author === 'object') ? book.author.name : book.author;

    // Logic nút Đọc Ngay
    const chapters = book.chapters || [];
    let readLink = '#';
    let btnClass = 'btn-read-now';
    
    if (chapters.length > 0) {
        readLink = `read.html?bookId=${book.id}&chapterId=${chapters[0].id}`;
    } else if (mainFileUrl) {
        readLink = `read.html?bookId=${book.id}`;
    } else {
        btnClass += ' disabled'; // CSS cần style .disabled { background: gray; pointer-events: none; }
    }

    container.innerHTML = `
        <div class="book-cover-large">
            <img src="${book.coverImage || book.image || ''}" alt="${book.title}" onerror="handleImageError(this)">
        </div>
        <div class="book-meta-info">
            <h1>${book.title}</h1>
            <div class="meta-row">
                <span><i class="fas fa-user-edit"></i> ${authorDisplay}</span>
                <span><i class="fas fa-eye"></i> ${formatNumber(book.viewCount)} lượt xem</span>
            </div>
            <div class="book-description">
                <h3>Giới thiệu</h3>
                <p>${book.description ? book.description.replace(/\n/g, '<br>') : 'Chưa có mô tả.'}</p>
            </div>
            <div class="action-buttons">
                <a href="${readLink}" class="${btnClass}"><i class="fas fa-book-open"></i> Đọc Ngay</a>
            </div>
        </div>
    `;
}

function renderChapters(chapters, bookId, hasMainFile) {
    const container = document.getElementById('chapter-list');
    if (!container) return;

    if (chapters && chapters.length > 0) {
        container.innerHTML = chapters.map((chap, index) => `
            <a href="read.html?bookId=${bookId}&chapterId=${chap.id}" class="chapter-item">
                <div class="chapter-name">Chương ${chap.chapterNumber || (index + 1)}: ${chap.title || ''}</div>
                <div style="font-size: 0.8rem; color: #888;">${formatRelativeTime(chap.updatedAt)}</div>
            </a>
        `).join('');
    } else if (hasMainFile) {
        container.innerHTML = `<p style="color:blue">Truyện này đọc trực tiếp (PDF/Text). Nhấn "Đọc Ngay" ở trên.</p>`;
    } else {
        container.innerHTML = '<p>Chưa có nội dung.</p>';
    }
}