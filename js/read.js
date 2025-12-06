import { BooksAPI } from './api.js';
import { getUrlParam } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initReader();
});

let currentFontSize = 18; // Kích thước chữ mặc định

async function initReader() {
    const bookId = getUrlParam('bookId');
    const chapterId = getUrlParam('chapterId'); // Nếu có chia chương
    
    // Nếu không có ID, quay về trang chủ
    if (!bookId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // 1. Gọi API lấy thông tin sách
        // Giả sử API getById trả về thông tin sách chứa link file (fileUrl)
        const book = await BooksAPI.getById(bookId);
        
        if (!book) throw new Error('Không tìm thấy sách');

        // Hiển thị tên truyện lên header
        document.getElementById('book-title').textContent = book.title;

        // 2. Xác định file URL
        // Nếu sách có nhiều chương, bạn cần logic lấy fileUrl của chương cụ thể
        // Ở đây giả định sách là 1 file duy nhất (như trong admin của bạn)
        const fileUrl = book.fileUrl || book.file || ''; // Tên trường tùy theo API trả về

        if (!fileUrl) {
            showError('Truyện này chưa có nội dung file.');
            return;
        }

        console.log("File URL:", fileUrl);

        // 3. Kiểm tra định dạng file và hiển thị
        const extension = getFileExtension(fileUrl);

        if (extension === 'pdf') {
            renderPDF(fileUrl);
        } else {
            // Mặc định coi là text (.txt)
            renderText(fileUrl);
        }

    } catch (error) {
        console.error('Lỗi đọc truyện:', error);
        showError('Không thể tải nội dung truyện. Vui lòng thử lại sau.');
    }
}

// --- CÁC HÀM XỬ LÝ HIỂN THỊ ---

// 1. Hàm hiển thị PDF (Dùng iframe)
function renderPDF(url) {
    const container = document.getElementById('reader-area');
    
    // Cấu hình riêng cho PDF: Mở rộng container ra toàn màn hình
    container.style.maxWidth = '100%';
    container.style.padding = '0';
    container.style.background = 'transparent';
    container.style.boxShadow = 'none';

    // Nhúng iframe
    // Lưu ý: Một số trình duyệt chặn nhúng PDF từ domain khác (CORS). 
    // Nếu bị lỗi, cần dùng thư viện PDF.js (nhưng iframe là cách đơn giản nhất để bắt đầu)
    container.innerHTML = `
        <iframe id="pdf-viewer" src="${url}" title="Trình đọc PDF">
            Trình duyệt của bạn không hỗ trợ xem PDF trực tiếp. 
            <a href="${url}" target="_blank">Tải về xem tại đây</a>.
        </iframe>
    `;
}

// 2. Hàm hiển thị Text (Fetch nội dung về và hiển thị)
async function renderText(url) {
    const container = document.getElementById('reader-area');
    
    try {
        // Gọi fetch để lấy nội dung file text
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Không tải được file text');
        
        const textContent = await response.text();

        // Hiển thị ra thẻ div với id text-content
        container.innerHTML = `
            <div id="text-content">${textContent}</div>
            
            <div class="chapter-nav">
                <button class="nav-btn disabled">Chương trước</button>
                <button class="nav-btn disabled">Chương sau</button>
            </div>
        `;

    } catch (error) {
        console.error(error);
        showError('Lỗi khi tải nội dung văn bản. Có thể do chặn quyền truy cập (CORS).');
    }
}

// --- TIỆN ÍCH ---

function getFileExtension(url) {
    return url.split('.').pop().toLowerCase().split('?')[0]; // Lấy đuôi file, bỏ query param
}

function showError(msg) {
    document.getElementById('reader-area').innerHTML = `
        <div style="text-align: center; color: red; padding: 50px;">
            <i class="fas fa-exclamation-triangle fa-2x"></i><br><br>
            ${msg}
        </div>
    `;
}

// Hàm đổi cỡ chữ (Chỉ dùng cho Text)
window.changeFontSize = (amount) => {
    const textDiv = document.getElementById('text-content');
    if (textDiv) {
        currentFontSize += amount;
        textDiv.style.fontSize = `${currentFontSize}px`;
    }
};