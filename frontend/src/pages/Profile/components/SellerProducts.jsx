import React, { useState, useEffect } from 'react';
import { productService } from '../../../services/product';
import { reviewService } from '../../../services/review';
import './SellerProducts.css';

const SellerProducts = () => {
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'sold'
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Modal State
    const [showRateModal, setShowRateModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [ratingScore, setRatingScore] = useState(1);
    const [ratingComment, setRatingComment] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [activeTab]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let data;
            if (activeTab === 'active') {
                data = await productService.getSellerActiveProducts();
            } else {
                data = await productService.getSellerSoldProducts();
            }
            setProducts(data.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelTransaction = async (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn huỷ giao dịch? Người thắng sẽ bị đánh giá -1.')) {
            try {
                await productService.cancelTransaction(productId);
                alert('Đã huỷ giao dịch thành công');
                fetchProducts(); // Refresh list
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
            // Optionally refresh or mark as rated locally
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    // Helper to get image URL safely
    const getImageUrl = (images) => {
        if (Array.isArray(images) && images.length > 0) return images[0];
        if (typeof images === 'string') return images; // In case it's a single string
        return 'https://via.placeholder.com/80';
    };

    return (
        <div className="seller-products-container">
            <div className="seller-tabs">
                <button 
                    className={`seller-tab ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Đang đăng & Còn hạn
                </button>
                <button 
                    className={`seller-tab ${activeTab === 'sold' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sold')}
                >
                    Đã có người thắng
                </button>
            </div>

            {loading ? (
                <div>Đang tải...</div>
            ) : (
                <div className="seller-product-list">
                    {products.length === 0 && <div>Không có sản phẩm nào.</div>}
                    {products.map(product => (
                        <div key={product.id} className="seller-product-item">
                            <div className="product-info">
                                <img 
                                    src={getImageUrl(product.images)} 
                                    alt={product.name} 
                                    className="product-thumb" 
                                />
                                <div className="product-details">
                                    <h4>{product.name}</h4>
                                    <div className="product-meta">
                                        Giá hiện tại: {Number(product.current_price).toLocaleString()} đ
                                        <br/>
                                        {activeTab === 'sold' && (
                                            <span>Người thắng: <strong>{product.winner_name}</strong></span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="product-actions">
                                {activeTab === 'sold' && (
                                    <>
                                        <button 
                                            className="btn-action btn-rate"
                                            onClick={() => openRateModal(product)}
                                        >
                                            Đánh giá người thắng
                                        </button>
                                        <button 
                                            className="btn-action btn-cancel"
                                            onClick={() => handleCancelTransaction(product.id)}
                                        >
                                            Huỷ giao dịch
                                        </button>
                                    </>
                                )}
                                {activeTab === 'active' && (
                                    <div className="product-meta">
                                        Kết thúc: {new Date(product.end_time).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showRateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Đánh giá người thắng</h3>
                            <button onClick={() => setShowRateModal(false)}>X</button>
                        </div>
                        <div className="modal-body">
                            <div className="rating-options">
                                <button 
                                    className={`rating-btn ${ratingScore === 1 ? 'selected' : ''}`}
                                    onClick={() => setRatingScore(1)}
                                >
                                    +1 (Like)
                                </button>
                                <button 
                                    className={`rating-btn ${ratingScore === -1 ? 'selected' : ''}`}
                                    onClick={() => setRatingScore(-1)}
                                >
                                    -1 (Dislike)
                                </button>
                            </div>
                            <textarea 
                                placeholder="Nhập nhận xét của bạn..."
                                rows="4"
                                value={ratingComment}
                                onChange={(e) => setRatingComment(e.target.value)}
                                style={{ padding: '10px', border: '2px solid #000' }}
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="btn-action" onClick={() => setShowRateModal(false)}>Huỷ</button>
                            <button className="btn-action btn-rate" onClick={handleSubmitRating}>Gửi đánh giá</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProducts;
