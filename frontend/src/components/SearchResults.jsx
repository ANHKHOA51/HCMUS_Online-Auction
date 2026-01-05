import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductsGrid from './ProductsGrid';
import Pagination from './Pagination';
import { useProducts } from '../hooks/useProduct';
import { useSearchResults } from '../hooks/useSearchResults';
import useWatchlist from '../hooks/useWatchlist';
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

  // Handle pagination      

  const {
    currentPage,
    totalPages,
    paginatedProducts,
    startIndex,
    goToPage,
    resetPagination,
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
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={goToPage} 
          />
        </main>
      </div>
    </div>
  );
};

export default SearchResultsPage;
