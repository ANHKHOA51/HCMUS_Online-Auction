import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProductsGrid from '../components/ProductsGrid';
import { useProducts, useFilters } from '../hooks/useProduct';
import { useSearchResults } from '../hooks/useSearchResults';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, loading, error } = useProducts();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filteredProducts,
    handleClearFilters,
  } = useFilters(products);

  const {
    currentPage,
    totalPages,
    paginatedProducts,
    startIndex,
    goToPage,
    resetPagination,
    visiblePages,
    initialSearch,
    initialCategory,
  } = useSearchResults(filteredProducts, searchParams, setSearchParams);

  // Initialize filters from URL
  useEffect(() => {
    if (initialSearch) setSearchQuery(initialSearch);
    if (initialCategory) setSelectedCategory(initialCategory);
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
    resetPagination();
  }, [searchQuery, selectedCategory]);

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
      {/* Header */}
      <div className="search-header">
        <div className="header-content">
          <h1>🔍 Kết Quả Tìm Kiếm</h1>
          <p>Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
        </div>
      )}

      <div className="search-container">
        {/* Sidebar */}
        <Sidebar
          categories={categories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onClearFilters={handleClearFilters}
        />

        {/* Main Content */}
        <main className="search-results-section">
          <div className="results-info">
            <h2>
              {selectedCategory || searchQuery ? '📋 Kết quả' : '📦 Tất cả sản phẩm'}
            </h2>
            <p className="result-count">
              Hiển thị {paginatedProducts.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + 12, filteredProducts.length)} trên {filteredProducts.length} sản phẩm
            </p>
          </div>

          {/* Products Grid */}
          <ProductsGrid
            products={paginatedProducts}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onClearFilters={handleClearFilters}
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
