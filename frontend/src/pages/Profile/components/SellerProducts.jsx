import React, { useState, useEffect } from 'react';
import { productService } from '../../../services/product';
import { getSellerOrders } from '../../../services/order';
import { reviewService } from '../../../services/review';
import { BiTrash, BiStar, BiCheckCircle, BiX, BiTime, BiShoppingBag, BiPackage } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import CompactProductTable from '../../../components/CompactProductTable';

const ITEMS_PER_PAGE = 5;

const SellerProducts = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Modal State
    const [showRateModal, setShowRateModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [ratingScore, setRatingScore] = useState(1);
    const [ratingComment, setRatingComment] = useState('');

    useEffect(() => {
        setProducts([]); 
        setCurrentPage(1); // Reset về trang 1 khi đổi tab
        fetchProducts();
    }, [activeTab]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let data;
            if (activeTab === 'active') {
                data = await productService.getSellerActiveProducts();
            } else {
                // Tab "orders" - fetch seller orders instead
                data = await getSellerOrders();
            }
            // Đảm bảo dữ liệu là mảng và không trùng lặp ID
            const uniqueProducts = data.data ? Array.from(new Map(data.data.map(item => [item.id, item])).values()) : [];
            setProducts(uniqueProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelTransaction = async (productId) => {
        if (window.confirm('Bạn có chắc muốn huỷ? Người thắng sẽ bị đánh giá -1.')) {
            try {
                await productService.cancelTransaction(productId);
                alert('Đã huỷ thành công');
                fetchProducts(); 
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const openRateModal = (product) => {
        setSelectedProduct(product);
        setRatingScore(1);
        setRatingComment('');
        setShowRateModal(true);
    };

    const handleSubmitRating = async () => {
        if (!ratingComment.trim()) {
            alert('Vui lòng nhập nhận xét');
            return;
        }
        try {
            await reviewService.addReview({
                to_user_id: selectedProduct.winner_id,
                product_id: selectedProduct.id,
                score: ratingScore === 1 ? '+1' : '-1',
                comment: ratingComment
            });
            alert('Đánh giá thành công');
            setShowRateModal(false);
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const getImageUrl = (images) => {
        if (Array.isArray(images) && images.length > 0) return images[0];
        if (typeof images === 'string') return images; 
        return 'https://via.placeholder.com/100';
    };

    // --- CẤU HÌNH CỘT CHO BẢNG ---
    const columns = [
        {
            header: 'Sản phẩm',
            render: (product) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded border border-[var(--color-dark)] overflow-hidden flex-shrink-0 bg-white shadow-[2px_2px_0px_var(--color-dark)]">
                        <img 
                            src={getImageUrl(product.images)} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="min-w-0 max-w-[180px]">
                        <h4 
                            className="font-bold text-[var(--color-dark)] truncate cursor-pointer hover:underline transition-colors text-sm"
                            onClick={() => navigate(`/products/${product.id}`)}
                            title={product.name}
                        >
                            {product.name}
                        </h4>
                        <div className="text-[10px] text-[var(--color-gray)] flex items-center gap-1 font-medium">
                            <BiTime size={10} /> 
                            {activeTab === 'active' 
                                ? `Kết thúc: ${new Date(product.end_time).toLocaleDateString('vi-VN')}`
                                : `Đăng: ${new Date(product.created_at).toLocaleDateString('vi-VN')}`
                            }
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Giá',
            render: (product) => (
                <div>
                    <div className="font-black text-[var(--color-primary)] text-sm">
                        {Number(product.current_price).toLocaleString()}đ
                    </div>
                    {product.bid_count > 0 && (
                        <div className="text-[10px] font-bold text-[var(--color-gray)] bg-gray-100 px-1 rounded border border-[var(--color-dark)] inline-block mt-0.5">
                            {product.bid_count} bid
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Trạng thái',
            render: (product) => activeTab === 'orders' ? (
                <div className="flex flex-col gap-1 text-[10px]">
                    <span className={`font-bold text-white px-2 py-0.5 rounded border border-[var(--color-dark)] shadow-[1px_1px_0px_var(--color-dark)] ${
                        product.status === 'pending' ? 'bg-yellow-500' :
                        product.status === 'paid' ? 'bg-blue-500' :
                        product.status === 'shipped' ? 'bg-purple-500' :
                        product.status === 'completed' ? 'bg-green-500' :
                        'bg-gray-500'
                    }`}>
                        {
                            product.status === 'pending' ? '⏳ Chờ thanh toán' :
                            product.status === 'paid' ? '💳 Chờ gửi hàng' :
                            product.status === 'shipped' ? '📦 Chờ nhận hàng' :
                            product.status === 'completed' ? '✅ Hoàn tất' :
                            '❓ ' + product.status?.toUpperCase()
                        }
                    </span>
                    {product.buyer_name && (
                        <span className="text-[var(--color-gray)] font-medium">👤 {product.buyer_name}</span>
                    )}
                </div>
            ) : (
                <span className="text-[10px] font-bold text-[var(--color-dark)] bg-[#a3ffac] px-2 py-0.5 rounded border border-[var(--color-dark)] shadow-[1px_1px_0px_var(--color-dark)]">
                    ACTIVE
                </span>
            )
        },
        {
            header: 'Hành động',
            className: 'text-right',
            render: (product) => activeTab === 'orders' ? (
                <div className="flex items-center justify-end gap-2">
                    {product.status === 'pending' ? (
                        <button 
                            onClick={() => navigate(`/checkout/${product.id}`)}
                            className="text-[10px] font-bold text-white bg-orange-500 border-2 border-[var(--color-dark)] px-3 py-1 rounded hover:bg-opacity-90 transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_var(--color-dark)] active:shadow-none active:translate-y-0"
                            title="Cung cấp thông tin thanh toán"
                        >
                            💳 Cung cấp TT
                        </button>
                    ) : (
                        <button 
                            onClick={() => navigate(`/checkout/${product.id}`)}
                            className="text-[10px] font-bold text-white bg-[var(--color-primary)] border-2 border-[var(--color-dark)] px-3 py-1 rounded hover:bg-opacity-90 transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_var(--color-dark)] active:shadow-none active:translate-y-0"
                        >
                            Xử lý
                        </button>
                    )}
                    <button 
                        onClick={() => openRateModal(product)}
                        className="p-1.5 text-[var(--color-dark)] bg-[#ffd803] border-2 border-[var(--color-dark)] rounded hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_var(--color-dark)]"
                        title="Đánh giá người mua"
                    >
                        <BiStar size={14} />
                    </button>
                    <button 
                        onClick={() => {
                            if (window.confirm('Huỷ đơn hàng này? Người mua sẽ bị đánh giá -1.')) {
                                handleCancelTransaction(product.id);
                            }
                        }}
                        className="p-1.5 text-white bg-[#ff6b9d] border-2 border-[var(--color-dark)] rounded hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_var(--color-dark)]"
                        title="Huỷ đơn"
                    >
                        <BiX size={14} />
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="text-[10px] font-bold text-[var(--color-dark)] bg-white border-2 border-[var(--color-dark)] px-3 py-1 rounded hover:bg-gray-50 transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_var(--color-dark)] active:shadow-none active:translate-y-0"
                >
                    Chi tiết
                </button>
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
            
            {/* --- TABS (Happy Hues Style) --- */}
            <div className="flex border-b-2 border-[var(--color-dark)] bg-gray-50">
                <button 
                    onClick={() => setActiveTab('active')}
                    className={`flex-1 py-3 text-sm font-black uppercase tracking-wide transition-all ${
                        activeTab === 'active' 
                        ? 'bg-[var(--color-primary)] text-white border-r-2 border-[var(--color-dark)]' 
                        : 'text-[var(--color-dark)] hover:bg-gray-200 border-r-2 border-[var(--color-dark)]'
                    }`}
                >
                    🔥 Đang bán ({activeTab === 'active' ? products.length : '...'})
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 py-3 text-sm font-black uppercase tracking-wide transition-all ${
                        activeTab === 'orders' 
                        ? 'bg-[var(--color-primary)] text-white' 
                        : 'text-[var(--color-dark)] hover:bg-gray-200'
                    }`}
                >
                    <BiShoppingBag size={14} className="inline mr-1" /> Orders ({activeTab === 'orders' ? products.length : '...'})
                </button>
            </div>

            {/* --- CONTENT TABLE --- */}
            {/* Không cần padding ở đây vì CompactProductTable đã xử lý layout bên trong */}
            <CompactProductTable 
                data={paginatedProducts}
                loading={loading}
                columns={columns}
                emptyMessage={activeTab === 'active' ? "Bạn chưa có sản phẩm nào đang bán." : "Chưa có sản phẩm nào đã bán."}
                pagination={{
                    currentPage,
                    totalPages,
                    onPageChange: setCurrentPage
                }}
            />

            {/* --- MODAL (Happy Hues Style) --- */}
            {showRateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-[var(--color-white)] rounded-xl border-4 border-[var(--color-dark)] shadow-[8px_8px_0px_var(--color-dark)] w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        {/* Header Modal */}
                        <div className="p-4 border-b-2 border-[var(--color-dark)] flex justify-between items-center bg-gray-100">
                            <h3 className="font-black text-lg text-[var(--color-dark)] flex items-center gap-2">
                                <BiStar className="text-yellow-500" /> ĐÁNH GIÁ {activeTab === 'orders' ? 'NGƯỜI MUA' : 'NGƯỜI BÁN'}
                            </h3>
                            <button 
                                onClick={() => setShowRateModal(false)} 
                                className="text-[var(--color-dark)] hover:scale-110 transition-transform font-bold border-2 border-transparent hover:border-[var(--color-dark)] rounded p-1"
                            >
                                <BiX size={24} />
                            </button>
                        </div>
                        
                        {/* Body Modal */}
                        <div className="p-6 bg-[var(--color-white)]">
                            <div className="mb-6 text-center p-3 rounded-lg border-2 border-dashed border-[var(--color-dark)] bg-gray-50">
                                <p className="text-xs font-bold text-[var(--color-gray)] uppercase mb-1">Người thắng cuộc</p>
                                <p className="font-black text-xl text-[var(--color-primary)]">{selectedProduct?.winner_name}</p>
                            </div>

                            <div className="flex justify-center gap-4 mb-6">
                                <button 
                                    onClick={() => setRatingScore(1)}
                                    className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                        ratingScore === 1 
                                        ? 'border-[var(--color-dark)] bg-[#00b894] text-white shadow-none translate-y-[2px] translate-x-[2px]' 
                                        : 'border-[var(--color-dark)] bg-white text-[var(--color-dark)] hover:bg-gray-50 shadow-[4px_4px_0px_var(--color-dark)] hover:-translate-y-1'
                                    }`}
                                >
                                    <BiCheckCircle size={24} />
                                    <span>Hài lòng (+1)</span>
                                </button>
                                <button 
                                    onClick={() => setRatingScore(-1)}
                                    className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                        ratingScore === -1 
                                        ? 'border-[var(--color-dark)] bg-[var(--color-secondary)] text-white shadow-none translate-y-[2px] translate-x-[2px]' 
                                        : 'border-[var(--color-dark)] bg-white text-[var(--color-dark)] hover:bg-gray-50 shadow-[4px_4px_0px_var(--color-dark)] hover:-translate-y-1'
                                    }`}
                                >
                                    <BiX size={24} />
                                    <span>Tệ (-1)</span>
                                </button>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-[var(--color-dark)] mb-2 uppercase">Nhận xét chi tiết</label>
                                <textarea 
                                    className="w-full p-3 border-2 border-[var(--color-dark)] rounded-lg outline-none text-sm bg-gray-50 text-[var(--color-dark)] font-medium transition-all focus:bg-white focus:shadow-[4px_4px_0px_var(--color-accent)]"
                                    rows="3"
                                    placeholder="Nhập trải nghiệm giao dịch của bạn..."
                                    value={ratingComment}
                                    onChange={(e) => setRatingComment(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowRateModal(false)}
                                    className="flex-1 py-3 bg-transparent border-2 border-[var(--color-dark)] text-[var(--color-dark)] rounded-xl font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    Huỷ bỏ
                                </button>
                                <button 
                                    onClick={handleSubmitRating}
                                    className="flex-[2] py-3 bg-[var(--color-primary)] border-2 border-[var(--color-dark)] text-[var(--color-white)] rounded-xl font-bold hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_var(--color-dark)] active:translate-y-0 active:shadow-none cursor-pointer"
                                >
                                    Gửi đánh giá
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProducts;
