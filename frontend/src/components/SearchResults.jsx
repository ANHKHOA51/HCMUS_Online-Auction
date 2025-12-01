import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductsGrid from './ProductsGrid';
import { useProducts } from '../hooks/useProduct';
import { useSearchResults } from '../hooks/useSearchResults';
import './SearchResults.css';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get URL params
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  // Build query params for API
  const queryParams = {
    ...(searchQuery && { search: searchQuery }),
    ...(selectedCategory && { category_id: selectedCategory }),
    ...(sortBy && { sort: sortBy }),
  };

  // Fetch products with filters from API
  const { products: allProducts, loading, error } = useProducts(queryParams);

  const {
    currentPage,
    totalPages,
    paginatedProducts,
    startIndex,
    goToPage,
    resetPagination,
    visiblePages,
  } = useSearchResults(allProducts, searchParams, setSearchParams);

  if (loading) {
    return (
      <div className="search-results-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
        </div>
      )}

      <div className="search-container">
        {/* Main Content - No Sidebar, all filters in Header */}
        <main className="search-results-section">
          <div className="results-info">
            <h2>
              {selectedCategory || searchQuery ? '📋 Kết quả' : '📦 Tất cả sản phẩm'}
            </h2>
            <p className="result-count">
              Hiển thị {paginatedProducts.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + 12, allProducts.length)} trên {allProducts.length} sản phẩm
            </p>
          </div>

          {/* Products Grid */}
          <ProductsGrid
            products={paginatedProducts}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onClearFilters={() => {
              setSearchParams({});
              resetPagination();
            }}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Trước
              </button>

              <div className="pagination-numbers">
                {visiblePages.map((page, idx) => {
                  if (page === '...') {
                    return <span key={`dots-${idx}`} className="pagination-dots">...</span>;
                  }
                  return (
                    <button
                      key={page}
                      className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                className="pagination-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResultsPage;
