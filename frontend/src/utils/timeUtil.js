// Utility để tính toán và hiển thị thời gian tương đối
export const getRelativeTime = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diffMs = end - now;

  if (diffMs < 0) {
    return 'Đã kết thúc';
  }

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    if (days <= 3) {
      return `${days} ngày nữa`;
    }
    return end.toLocaleDateString('vi-VN');
  }

  if (hours > 0) {
    return `${hours} giờ nữa`;
  }

  if (minutes > 0) {
    return `${minutes} phút nữa`;
  }

  return `${seconds} giây nữa`;
};

export const shouldShowRelativeTime = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diffMs = end - now;
  const hours = Math.floor(diffMs / 1000 / 60 / 60);
  return hours < 72; // 3 ngày
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPrice = (price) => {
  if (!price) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};
