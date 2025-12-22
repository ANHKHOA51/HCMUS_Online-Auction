import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { getRelativeTime, shouldShowRelativeTime } from '../utils/timeUtil';
import { formatPriceVN } from '../utils/formatCurrency';
import HeartButton from './HeartButton';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  if (!product) return null;

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  // Lấy ảnh đầu tiên hoặc ảnh placeholder
  const productImage = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x300?text=No+Image'; 

  return (
    <div className="product-card-wrapper" onClick={handleClick}>
      
      {/* --- ẢNH & BADGE --- */ }
      <div className="product-card-image">
        <img
          src={productImage}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />
        
        <div className="card-badges">
            {/* Logic hiển thị Badge: Nếu có bid thì là HOT, không thì là NEW */}
            <span className={`status-badge ${product.bid_count > 0 ? 'hot' : 'new'}`}>
                {product.bid_count > 0 ? 'HOT' : 'NEW'}
            </span>
            {/* Heart Button */}
            <div className="heart-button-container" onClick={(e) => e.stopPropagation()}>
              <HeartButton productId={product.id} initialState={product.is_favorite || false} />
            </div>
        </div>
      </div>

      {/* --- NỘI DUNG --- */}
      <div className="product-card-body">
        
        {/* Tên */}
        <h3 className="product-card-name" title={product.name}>
            {product.name}
        </h3>

        {/* Giá */}
        <div className="product-pricing">
          <div className="price-group main-price">
            <span className="label">Hiện tại</span>
            <span className="value">
              {formatPriceVN(product.current_price || product.starting_price)}
            </span>
          </div>

          {/* Chỉ hiện giá mua ngay nếu có */}
          {product.buy_now_price && (
            <div className="price-group buy-now">
              <span className="label">Mua ngay</span>
              <span className="value">
                {formatPriceVN(product.buy_now_price)}
              </span>
            </div>
          )}
        </div>

        {/* Thống kê nhỏ */}
        <div className="product-stats-box">
            <div className="stat-row">
                <span>🔨 {product.bid_count || 0} lượt đấu giá</span>
            </div>
            {product.winner_name && (
                <div className="stat-row">
                    <span className="winner">👑 Top: <b>{product.winner_name}</b></span>
                </div>
            )}
        </div>

        {/* Footer: Thời gian */}
        <div className="product-footer-meta">
            <div className="meta-item">
                <small>{new Date(product.created_at).toLocaleDateString('vi-VN')}</small>
            </div>
            
            <div className="meta-item">
                {shouldShowRelativeTime(product.end_time) ? (
                    <span className="tag-urgent">
                        ⏳ {getRelativeTime(product.end_time)}
                    </span>
                ) : (
                    <span className="tag-finished">
                        Đã kết thúc
                    </span>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
