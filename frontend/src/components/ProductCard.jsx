import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ProductCard.css';
import { getRelativeTime, shouldShowRelativeTime } from '../utils/timeUtil';
import { formatPriceVN } from '../utils/formatCurrency';
import HeartButton from './HeartButton';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { cur_user } = useAuth();

  if (!product) return null;

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  // Lấy ảnh đầu tiên hoặc ảnh placeholder
  const productImage = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x300?text=No+Image'; 

  // Logic hiển thị Badge
  const isNew = (new Date() - new Date(product.created_at)) < 60 * 60 * 1000; // < 60 minutes
  const isHot = product.bid_count > 0;
  const isHoldingPrice = cur_user && product.winner_id === cur_user.id;

  let badgeLabel = '';
  let badgeClass = '';

  if (isHoldingPrice) {
      badgeLabel = 'ĐANG GIỮ GIÁ';
      badgeClass = 'holding';
  } else if (isNew) {
      badgeLabel = 'NEW';
      badgeClass = 'new';
  } else if (isHot) {
      badgeLabel = 'HOT';
      badgeClass = 'hot';
  }

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
            {badgeLabel && (
                <span className={`status-badge ${badgeClass}`}>
                    {badgeLabel}
                </span>
            )}
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
