import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';
import ProductGallery from '../components/ProductGallery';
import UserInfo from '../components/UserInfo';
import QAHistory from '../components/QAHistory';
import RelatedProducts from '../components/RelatedProducts';
import { formatPrice, getRelativeTime, shouldShowRelativeTime, formatDate } from '../utils/timeUtil';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [highestBidder, setHighestBidder] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch từ backend API
      const response = await fetch(`http://localhost:3000/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error('Không thể tải sản phẩm');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Lỗi không xác định');
      }

      const { product, highestBidder, faqs, relatedProducts } = result.data;

      // Chuẩn bị seller info từ product data
      const sellerInfo = {
        id: product.seller_id,
        full_name: product.seller_name,
        email: product.seller_email,
        phone: product.seller_phone,
        avatar: product.seller_avatar,
        rating_positive: product.rating_positive,
        rating_negative: product.rating_negative,
      };

      setProduct(product);
      setSeller(sellerInfo);
      setHighestBidder(highestBidder);
      setFaqs(faqs || []);
      setRelatedProducts(relatedProducts || []);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError(err.message || 'Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (parseFloat(bidAmount) <= product.current_price) {
      alert(`Giá đặt phải cao hơn giá hiện tại: ${formatPrice(product.current_price)}`);
      return;
    }

    try {
      setIsPlacingBid(true);
      // Mock API call
      console.log('Placing bid:', bidAmount);
      alert('Đặt giá thành công!');
      setBidAmount('');
      // Refresh product data
      fetchProductDetails();
    } catch (err) {
      alert('Lỗi khi đặt giá');
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      // Mock API call
      console.log('Buying now');
      alert('Mua ngay thành công!');
      // Redirect to order page or show confirmation
    } catch (err) {
      alert('Lỗi khi mua ngay');
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div className="error">Sản phẩm không tồn tại</div>;
  }

  const isEnded = new Date(product.end_time) < new Date();

  return (
    <div className="product-detail-page">
      <div className="detail-container">
        {/* Left Section: Images and Description */}
        <div className="detail-left">
          <ProductGallery images={product.images} />

          {/* Product Description */}
          <div className="product-description">
            <h4 className="section-title">📋 Mô tả chi tiết sản phẩm</h4>
            <div className="description-content">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Q&A Section */}
          <QAHistory faqs={faqs} />

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} onProductClick={(id) => console.log('Navigate to product', id)} />
        </div>

        {/* Right Section: Product Info and Bidding */}
        <div className="detail-right">
          {/* Product Title */}
          <div className="product-header">
            <h2 className="product-title">{product.name}</h2>
            <p className="product-category">📦 Điện thoại di động</p>
          </div>

          {/* Time Information */}
          <div className="time-info">
            <div className="time-item">
              <span className="time-label">📅 Thời điểm đăng:</span>
              <span className="time-value">{formatDate(product.start_time)}</span>
            </div>
            <div className="time-item">
              <span className="time-label">⏰ Thời điểm kết thúc:</span>
              <span className="time-value">
                {shouldShowRelativeTime(product.end_time) ? (
                  <span className="relative-time-badge">{getRelativeTime(product.end_time)}</span>
                ) : (
                  formatDate(product.end_time)
                )}
              </span>
            </div>
            {isEnded && <div className="ended-badge">Đã kết thúc</div>}
          </div>

          {/* Price Section */}
          <div className="price-section">
            <div className="price-item current">
              <span className="price-label">Giá hiện tại:</span>
              <span className="price-value">{formatPrice(product.current_price || product.starting_price)}</span>
            </div>
            {product.buy_now_price && (
              <div className="price-item buy-now">
                <span className="price-label">Giá mua ngay:</span>
                <span className="price-value">{formatPrice(product.buy_now_price)}</span>
              </div>
            )}
            {product.starting_price && (
              <div className="price-item starting">
                <span className="price-label">Giá khởi điểm:</span>
                <span className="price-value">{formatPrice(product.starting_price)}</span>
              </div>
            )}
          </div>

          {/* Bidding Form */}
          {!isEnded && (
            <div className="bidding-form">
              <h5>🏆 Đặt giá</h5>
              <div className="bid-input-group">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Tối thiểu: ${formatPrice(product.current_price + (product.step_price || 100000))}`}
                  className="bid-input"
                  disabled={isPlacingBid}
                />
              </div>
              <button
                className="btn-bid"
                onClick={handlePlaceBid}
                disabled={isPlacingBid}
              >
                {isPlacingBid ? 'Đang xử lý...' : 'Đặt giá'}
              </button>

              {product.buy_now_price && (
                <button
                  className="btn-buy-now"
                  onClick={handleBuyNow}
                  disabled={isPlacingBid}
                >
                  💳 Mua ngay
                </button>
              )}
            </div>
          )}

          {isEnded && (
            <div className="auction-ended">
              <p>🏁 Đấu giá đã kết thúc</p>
              {highestBidder && (
                <p className="winner">Người thắng: {highestBidder.full_name}</p>
              )}
            </div>
          )}

          {/* Seller Information */}
          <div className="seller-section">
            <h5>👤 Thông tin người bán</h5>
            <UserInfo user={seller} role="seller" />
          </div>

          {/* Highest Bidder Information */}
          {highestBidder && (
            <div className="bidder-section">
              <h5>🏆 Người đặt giá cao nhất</h5>
              <UserInfo user={highestBidder} role="bidder" isHighestBidder={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
