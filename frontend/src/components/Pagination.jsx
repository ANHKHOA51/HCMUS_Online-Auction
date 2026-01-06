import React from 'react';
// Đã xóa import './Pagination.css';

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

  // Class cơ bản dùng chung cho mọi nút (Base styles + Mobile responsive)
  const baseBtnClass = "w-[36px] h-[36px] rounded-[8px] border-[2px] border-solid border-[var(--ph-stroke,#094067)] font-bold text-[0.9rem] flex items-center justify-center transition-all duration-[200ms] ease-out cursor-pointer max-[480px]:w-[32px] max-[480px]:h-[32px] max-[480px]:text-[0.8rem]";

  // Class cho trạng thái bình thường (Normal State + Hover)
  const normalBtnClass = "bg-white text-[var(--ph-headline,#094067)] shadow-[2px_2px_0px_rgba(9,64,103,0.2)] hover:enabled:-translate-x-[2px] hover:enabled:-translate-y-[2px] hover:enabled:shadow-[4px_4px_0px_var(--ph-stroke,#094067)] hover:enabled:bg-[#f0f8ff]";

  // Class cho trạng thái Active (Đang chọn)
  const activeBtnClass = "bg-[var(--color-primary,#3da9fc)] text-[var(--ph-headline,#094067)] translate-x-[1px] translate-y-[1px] shadow-[1px_1px_0px_var(--ph-stroke,#094067)]";

  // Class cho trạng thái Disabled
  const disabledBtnClass = "disabled:bg-[#f0f0f0] disabled:text-[#ccc] disabled:border-[#ccc] disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none";

  return (
    <div className="flex justify-center gap-[8px] mt-[24px] pt-[16px] border-t-[2px] border-dashed border-[var(--ph-secondary,#90b4ce)]">
      <button 
        className={`${baseBtnClass} ${normalBtnClass} ${disabledBtnClass}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* Render số trang */}
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
            {page === '...' ? (
                <span className="flex items-end justify-center px-[4px] text-[var(--ph-paragraph,#5f6c7b)] font-bold h-[36px] leading-[36px]">...</span>
            ) : (
                <button
                  className={`${baseBtnClass} ${currentPage === page ? activeBtnClass : normalBtnClass}`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
            )}
        </React.Fragment>
      ))}

      <button 
        className={`${baseBtnClass} ${normalBtnClass} ${disabledBtnClass}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
