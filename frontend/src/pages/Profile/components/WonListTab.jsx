import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../services/axiosInstance';
import { formatPriceVN } from '../../../utils/formatCurrency';
import { FaTrophy, FaStar } from 'react-icons/fa';
import ReviewModal from './ReviewModal';
import './WonListTab.css';

const WonListTab = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm đang được chọn để đánh giá

    const fetchWonProducts = async () => {
        try {
            const response = await axiosInstance.get('/users/won');
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching won products:', err);
            setError('Không thể tải danh sách sản phẩm đã thắng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWonProducts();
    }, []);

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="message error">{error}</div>;

    return (
        <div className="won-list-container">
            {products.length === 0 ? (
                <div className="no-products">Bạn chưa thắng sản phẩm nào.</div>
            ) : (
                <div className="won-list">
                    {products.map(product => (
                        <div key={product.id} className="won-item">
                            <div className="won-image">
                                <img 
                                    src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                                    alt={product.name} 
                                />
                            </div>
                            <div className="won-info">
                                <h4>{product.name}</h4>
                                <p className="won-price">Giá thắng: {formatPriceVN(product.current_price)}</p>
                                <p className="won-seller">Người bán: {product.seller_name}</p>
                                <p className="won-date">Kết thúc: {new Date(product.end_time).toLocaleDateString('vi-VN')}</p>
                            </div>
                            <div className="won-actions">
                                <button 
                                    className="review-btn"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    <FaStar /> Đánh giá người bán
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Đánh giá */}
            {selectedProduct && (
                <ReviewModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)}
                    onSuccess={() => {
                        alert('Cảm ơn bạn đã đánh giá!');
                        // Có thể reload lại list nếu cần cập nhật trạng thái "Đã đánh giá"
                    }}
                />
            )}
        </div>
    );
};

export default WonListTab;
