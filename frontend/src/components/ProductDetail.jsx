import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import ProductGallery from './ProductGallery';
import UserInfo from './UserInfo';
import QAHistory from './QAHistory';
import { getRelativeTime, shouldShowRelativeTime, formatDate } from '../utils/timeUtil';
import { formatPriceVN } from '../utils/formatCurrency';
import { useProductDetail } from '../hooks/useProduct';
import { useBidding } from '../hooks/useBidding';
import ProductsGrid from './ProductsGrid';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { product, seller, highestBidder, faqs, relatedProducts, loading, error } = useProductDetail(id);

  const {
    bidAmount,
    setBidAmount,
    isPlacingBid,
    bidError,
    bidSuccess,
    handlePlaceBid,
    handleBuyNow,
  } = useBidding(product);

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


        </div>

        {/* Right Section: Product Info and Bidding */}
        <div className="detail-right">

          <div className="product-header">
            <h2 className="product-title">{product.name}</h2>
            <p className="product-category">{product.category_name}</p>
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
              <span className="price-value">{formatPriceVN(product.current_price || product.starting_price)}</span>
            </div>
            {product.buy_now_price && (
              <div className="price-item buy-now">
                <span className="price-label">Giá mua ngay:</span>
                <span className="price-value">{formatPriceVN(product.buy_now_price)}</span>
              </div>
            )}
            {product.starting_price && (
              <div className="price-item starting">
                <span className="price-label">Giá khởi điểm:</span>
                <span className="price-value">{formatPriceVN(product.starting_price)}</span>
              </div>
            )}
          </div>

          {/* Bidding Form */}
          {!isEnded && (
            <div className="bidding-form">
              <h5>🏆 Đặt giá</h5>

              {bidError && <div className="bid-error">⚠️ {bidError}</div>}
              {bidSuccess && <div className="bid-success">✓ Thành công!</div>}

              <div className="bid-input-group">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Tối thiểu: ${formatPriceVN(product.current_price + (product.step_price || 100000))}`}
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
      <div className="detail-below">

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
        <ProductsGrid products={relatedProducts} title={"Sản phẩm liên quan"} />
      </div>
    </div>
  );
};

export default ProductDetail;