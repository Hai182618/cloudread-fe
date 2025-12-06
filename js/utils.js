/**
 * utils.js - Các tiện ích dùng chung
 */

export const formatNumber = (num) => {
    if (!num || isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
};

export const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
};

export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

export const getUrlParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

// Hàm xử lý ảnh lỗi
export const handleImageError = (img) => {
    if (!img) return;
    img.onerror = null; 
    img.src = '../assets/images/placeholder.jpg'; // Đảm bảo bạn có file này
};

// Gán vào window để dùng được trong thẻ HTML (onerror="handleImageError(this)")
window.handleImageError = handleImageError;