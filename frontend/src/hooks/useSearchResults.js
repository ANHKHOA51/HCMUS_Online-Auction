import { useState, useEffect } from 'react';

const ITEMS_PER_PAGE = 12;

export const useSearchResults = (filteredProducts, searchParams, setSearchParams) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Get initial filter values from URL
  const initialSearch = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle page navigation
  const goToPage = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  const resetPagination = () => {
    setCurrentPage(1);
  };

  // Get visible page numbers for pagination
  const getVisiblePages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      const showPage =
        i <= 3 ||
        i > totalPages - 3 ||
        Math.abs(i - currentPage) <= 1;

      if (showPage) {
        pages.push(i);
      } else if (i === 4 || i === totalPages - 3) {
        pages.push('...');
      }
    }
    return pages.filter((p, i, arr) => i === 0 || p !== arr[i - 1]);
  };

  return {
    currentPage,
    totalPages,
    paginatedProducts,
    startIndex,
    goToPage,
    resetPagination,
    visiblePages: getVisiblePages(),
    initialSearch,
    initialCategory,
  };
};
