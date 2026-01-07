// src/utils/timeUtil.js

// 1. Hàm chuẩn hóa thời gian (Quan trọng nhất: Fix lỗi Safari/iPhone)
export const parseSafeDate = (timeString) => {
  if (!timeString) return null;
  // Chuyển về string và thay thế khoảng trắng bằng T
  const safeString = String(timeString).replace(' ', 'T');
  const date = new Date(safeString);
  return isNaN(date.getTime()) ? null : date;
};

// 2. Hàm kiểm tra đã kết thúc chưa
export const isAuctionEnded = (endTime) => {
  const end = parseSafeDate(endTime);
  const now = new Date();
  if (!end) return false; 
  return end < now;
};

// 3. Hàm hiển thị đếm ngược (x ngày y giờ...)
export const getRelativeTime = (endTime) => {
  const end = parseSafeDate(endTime);
  const now = new Date();

  if (!end) return 'Đang cập nhật...';

  const diffMs = end - now;

  if (diffMs <= 0) return 'Đã kết thúc';

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  if (days > 0) return `${days} ngày ${hours} giờ nữa`;
  if (hours > 0) return `${hours} giờ ${minutes} phút nữa`;
  if (minutes > 0) return `${minutes} phút ${seconds} giây nữa`;
  return `${seconds} giây nữa`;
};

// 4. Hàm kiểm tra có nên hiện đếm ngược không (ĐÃ SỬA)
export const shouldShowRelativeTime = (endTime) => {
  const end = parseSafeDate(endTime); // <-- Dùng hàm chuẩn
  if (!end) return false;

  const now = new Date();
  const diffMs = end - now;
  
  // Nếu đã kết thúc thì không show relative time nữa (để hiện ngày cụ thể hoặc chữ Đã kết thúc)
  if (diffMs < 0) return false;

  // Tính ra giờ
  const hours = diffMs / (1000 * 60 * 60);
  
  // Logic cũ của bạn: Chỉ hiện đếm ngược nếu còn dưới 3 ngày (72h)
  return hours < 72; 
};

// 5. Hàm format ngày tháng (ĐÃ SỬA)
export const formatDate = (date) => {
  const safeDate = parseSafeDate(date); // <-- Dùng hàm chuẩn
  
  if (!safeDate) return '';
  
  return safeDate.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
