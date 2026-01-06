import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductsGrid from './ProductsGrid';
import Pagination from './Pagination';
import { useProducts } from '../hooks/useProduct';
// Đã xóa import './SearchResults.css';

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

    // Class chung cho background page
    const pageWrapperClass = "bg-[#f5f5f5] min-h-[100vh] pb-[50px]";

    if (loading) {
        return (
            <div className={pageWrapperClass}>
                <div className="flex flex-col items-center justify-center h-[80vh] text-[#666]">
                    <div className="w-[50px] h-[50px] border-[4px] border-solid border-[#e0e0e0] border-t-[4px] border-t-[#667eea] rounded-[50%] animate-[spin_1s_linear_infinite] mb-[20px]"></div>
                    <p>Đang tải sản phẩm...</p>
                </div>
                {/* Style cho keyframes spin nếu Tailwind chưa config sẵn (mặc dù animate-spin có sẵn, nhưng đây là để đảm bảo logic CSS gốc) */}
                <style>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className={pageWrapperClass}>

            {/* Error Message */}
            {error && (
                <div className="bg-[#f8d7da] border-[1px] border-solid border-[#f5c6cb] text-[#721c24] p-[12px_20px] m-[20px_auto] max-w-[1400px] rounded-[4px] flex justify-between items-center">
                    <span>{error}</span>
                </div>
            )}

            <div className="max-w-[1400px] mx-auto p-[20px_15px] max-[768px]:px-[10px] max-[480px]:my-[20px] max-[480px]:gap-[15px]">
                {/* Main Content */}
                <main className="min-h-[400px]">
                    <div className="mb-[30px]">
                        <h2 className="text-[28px] font-bold text-[#333] m-[0_0_8px] max-[768px]:text-[20px]">
                            {selectedCategory || searchQuery ? '📋 Kết quả' : '📦 Tất cả sản phẩm'}
                        </h2>
                        <p className="text-[#666] text-[14px] m-0">
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
