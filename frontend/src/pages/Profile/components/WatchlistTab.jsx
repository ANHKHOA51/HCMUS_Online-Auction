import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../services/axiosInstance';
import CompactProductTable from '../../../components/CompactProductTable';
import useWatchlist from '../../../hooks/useWatchlist';
import { BiTrash, BiTime, BiHeart, BiShow } from 'react-icons/bi';

const ITEMS_PER_PAGE = 5;

const WatchlistTab = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const { toggleWatch } = useWatchlist();

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/watchlists');
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching watchlist:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWatchlist = async (productId) => {
        try {
            await toggleWatch(productId);
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (err) {
            console.error('Error removing from watchlist:', err);
            alert('Có lỗi xảy ra khi xóa khỏi danh sách yêu thích');
        }
    };

    const getImageUrl = (images) => {
        if (Array.isArray(images) && images.length > 0) return images[0];
        if (typeof images === 'string') return images; 
        return 'https://via.placeholder.com/100';
    };

    // --- CẤU HÌNH CỘT (HAPPY HUES STYLE) ---
    const columns = [
        {
            header: 'Sản phẩm',
            render: (product) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border-2 border-[var(--color-dark)] overflow-hidden flex-shrink-0 bg-white shadow-[2px_2px_0px_var(--color-dark)]">
                        <img 
                            src={getImageUrl(product.images)} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="min-w-0 max-w-[200px]">
                        <h4 
                            className="font-bold text-[var(--color-dark)] truncate cursor-pointer hover:underline text-sm mb-0.5"
                            onClick={() => navigate(`/products/${product.id}`)}
                            title={product.name}
                        >
                            {product.name}
                        </h4>
                        <div className="text-[11px] font-medium text-[var(--color-gray)] flex items-center gap-1">
                            <BiTime /> 
                            {`Kết thúc: ${new Date(product.end_time).toLocaleDateString('vi-VN')}`}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Giá hiện tại',
            render: (product) => (
                <div>
                    <div className="font-black text-[var(--color-primary)] text-sm">
                        {Number(product.current_price).toLocaleString()}đ
                    </div>
                    {product.bid_count > 0 && (
                        <span className="text-[10px] font-bold text-[var(--color-white)] bg-[var(--color-gray)] px-1.5 py-0.5 rounded border border-[var(--color-dark)] shadow-[1px_1px_0px_var(--color-dark)] inline-block mt-1">
                            {product.bid_count} bid
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Hành động',
            className: 'text-right',
            render: (product) => (
                <div className="flex items-center justify-end gap-2">
                    <button 
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="text-xs font-bold text-[var(--color-dark)] bg-[var(--color-white)] border-2 border-[var(--color-dark)] px-3 py-1.5 rounded-lg hover:bg-[var(--color-light)] transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-[2px_2px_0px_var(--color-dark)] active:shadow-none whitespace-nowrap flex items-center gap-1"
                        title="Xem chi tiết"
                    >
                        <BiShow size={14} /> Xem
                    </button>
                    <button 
                        onClick={() => handleRemoveFromWatchlist(product.id)}
                        className="p-1.5 text-[var(--color-white)] bg-[var(--color-secondary)] border-2 border-[var(--color-dark)] rounded-lg hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_var(--color-dark)] active:translate-y-0 active:shadow-none"
                        title="Xóa khỏi yêu thích"
                    >
                        <BiTrash size={16} />
                    </button>
                </div>
            )
        }
    ];

    // Pagination Logic
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const paginatedProducts = products.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="w-full bg-[var(--color-white)] rounded-xl border-2 border-[var(--color-dark)] shadow-[6px_6px_0px_var(--color-dark)] overflow-hidden">
             {/* Header Tab */}
             <div className="p-4 border-b-2 border-[var(--color-dark)] bg-gray-100">
                <h3 className="font-black text-lg text-[var(--color-dark)] uppercase flex items-center gap-2">
                    <BiHeart className="text-[var(--color-secondary)]" /> Sản phẩm yêu thích ({products.length})
                </h3>
            </div>
            
            {/* Table Content */}
            <div className="p-0">
                <CompactProductTable 
                    data={paginatedProducts}
                    loading={loading}
                    columns={columns}
                    emptyMessage="Danh sách yêu thích đang trống."
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: setCurrentPage
                    }}
                />
            </div>
        </div>
    );
};

export default WatchlistTab;
