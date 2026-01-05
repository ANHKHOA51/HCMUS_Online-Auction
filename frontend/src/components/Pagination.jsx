import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // if (totalPages <= 1) return null; // Always show pagination

  // Logic để tính toán các trang cần hiển thị (có dấu ...)
  const getVisiblePages = () => {
    const pages = [];
    // Nếu tổng số trang ít (ví dụ <= 7), hiển thị hết
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }

    // Luôn hiển thị trang 1
    pages.push(1);

    // Nếu trang hiện tại > 3, thêm dấu ...
    if (currentPage > 3) {
        pages.push('...');
    }

    // Hiển thị trang hiện tại và 1 trang xung quanh
    // (Tránh lặp lại trang 1 hoặc trang cuối)
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    // Nếu trang hiện tại < tổng - 2, thêm dấu ...
    if (currentPage < totalPages - 2) {
        pages.push('...');
    }

    // Luôn hiển thị trang cuối
    pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination-container">
      <button 
        className="page-btn prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* Render số trang */}
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
            {page === '...' ? (
                <span className="pagination-dots">...</span>
            ) : (
                <button
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
            )}
        </React.Fragment>
      ))}

      <button 
        className="page-btn next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
