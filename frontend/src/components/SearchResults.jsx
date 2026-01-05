import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductsGrid from './ProductsGrid';
import Pagination from './Pagination';
import { useProducts } from '../hooks/useProduct';
import './SearchResults.css';

const SearchResultsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Get URL params
    const searchQuery = searchParams.get('q') || '';
    const selectedCategory = searchParams.get('category') || '';
    const sortBy = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10; // Default limit 10

    // Build query params for API
    const queryParams = {
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { category_id: selectedCategory }),
        ...(sortBy && { sort: sortBy }),
        page: page,
        limit: limit
    };

    // Fetch products with filters from API (Server-side Pagination)
    const { products, pagination, loading, error } = useProducts(queryParams);

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', newPage);
        setSearchParams(newParams);
        window.scrollTo(0, 0);
    };

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
                {/* Main Content */}
                <main className="search-results-section">
                    <div className="results-info">
                        <h2>
                            {selectedCategory || searchQuery ? '📋 Kết quả' : '📦 Tất cả sản phẩm'}
                        </h2>
                        <p className="result-count">
                            Hiển thị {products.length} trên tổng số {pagination?.total || 0} sản phẩm
                        </p>
                    </div>

                    {/* Products Grid */}
                    <ProductsGrid
                        products={products}
                        searchQuery={searchQuery}
                        selectedCategory={selectedCategory}
                        onClearFilters={() => {
                            setSearchParams({});
                        }}
                    />

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 0 && (
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default SearchResultsPage;
