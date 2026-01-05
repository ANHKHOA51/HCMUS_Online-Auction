import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../services/axiosInstance';
import CompactProductTable from '../../../components/CompactProductTable';
import { BiStar, BiTime, BiTrophy, BiCheckDouble } from 'react-icons/bi';
import ReviewModal from './ReviewModal';

const ITEMS_PER_PAGE = 5;

const WonListTab = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchWonProducts();
    }, []);

    const fetchWonProducts = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/users/won');
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching won products:', err);
        } finally {
            setLoading(false);
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
            header: 'Giá thắng',
            render: (product) => (
                <div>
                    <div className="font-black text-[var(--color-primary)] text-sm">
                        {Number(product.current_price).toLocaleString()}đ
                    </div>
                    <div className="text-[10px] font-bold text-[var(--color-gray)] mt-0.5">
                        Seller: <span className="text-[var(--color-dark)]">{product.seller_name}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Trạng thái',
            render: () => (
                <span className="text-[10px] font-bold text-white bg-[#00b894] px-2 py-1 rounded-md border border-[var(--color-dark)] shadow-[1px_1px_0px_var(--color-dark)] whitespace-nowrap">
                    CHIẾN THẮNG
                </span>
            )
        },
        {
            header: 'Hành động',
            className: 'text-right',
            render: (product) => (
                <div className="flex items-center justify-end gap-2">
                    {product.is_reviewed ? (
                         <span className="text-[10px] font-bold text-[var(--color-gray)] flex items-center gap-1 border-2 border-[var(--color-gray-light)] px-2 py-1 rounded-lg bg-gray-50 opacity-70">
                            <BiCheckDouble size={14} /> Đã đánh giá
                        </span>
                    ) : (
                        <button 
                            onClick={() => setSelectedProduct(product)}
                            className="text-xs font-bold text-[var(--color-dark)] bg-[#ffd803] border-2 border-[var(--color-dark)] px-3 py-1.5 rounded-lg hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_var(--color-dark)] active:translate-y-0 active:shadow-none flex items-center gap-1"
                        >
                            <BiStar /> Đánh giá
                        </button>
                    )}
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
                    <BiTrophy className="text-[#ffd803]" /> Sản phẩm đã thắng ({products.length})
                </h3>
            </div>
            
            {/* Table */}
            <div className="p-0">
                <CompactProductTable 
                    data={paginatedProducts}
                    loading={loading}
                    columns={columns}
                    emptyMessage="Bạn chưa chiến thắng sản phẩm nào."
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: setCurrentPage
                    }}
                />
            </div>

            {/* Modal Đánh giá (Vẫn giữ logic cũ, UI modal nếu cần chỉnh sẽ ở file ReviewModal) */}
            {selectedProduct && (
                <ReviewModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)}
                    onSuccess={() => {
                        alert('Cảm ơn bạn đã đánh giá!');
                        fetchWonProducts();
                        setSelectedProduct(null);
                    }}
                />
            )}
        </div>
    );
};

export default WonListTab;
