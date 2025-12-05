import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { getRelativeTime, shouldShowRelativeTime } from '../utils/timeUtil';
import { formatPriceVN } from '../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  if (!product) return null;

  const defaultSrc = '/default-product.png';

  let imageSrc = defaultSrc;

  if (product.images && product.images.length > 0) {
    const first = product.images[0];
    if (typeof first === 'string') {
      if (first.startsWith('https://') || first.startsWith('http://')) {
        imageSrc = first;
      } else {
        imageSrc = `http://localhost:3000/static/images/products/${product.id}/${first}`;
      }
    }
  }

  return (
    <div className="product-card-wrapper" onClick={handleClick}>
      {/* --- PHẦN ẢNH --- */}
      <div className="product-card-image">
        <img
          src={imageSrc}
          alt={product.name}
          className="product-img"
        />

        {/* Badge trạng thái + Badge số lượt bid */}
        <div className="card-badges">
          <span className={`status-badge ${product.bid_count > 0 ? 'hot' : 'new'}`}>
            {product.bid_count > 0 ? 'Hot' : 'Mới'}
          </span>
        </div>
      </div>

      {/* --- PHẦN NỘI DUNG --- */}
      <div className="product-card-body">
        {/* 1. Tên sản phẩm */}
        <h6 className="product-card-name" title={product.name}>{product.name}</h6>

        {/* 2. Thông tin Giá */}
        <div className="product-pricing">
          <div className="price-group main-price">
            <span className="label">Hiện tại</span>
            <span className="value highlight">
              {formatPriceVN(product.current_price || product.starting_price)}
            </span>
          </div>

          {product.buy_now_price && (
            <div className="price-group buy-now">
              <span className="label">Mua ngay</span>
              <span className="value secondary">
                {formatPriceVN(product.buy_now_price)}
              </span>
            </div>
          )}
        </div>

        {/* 3. Khu vực Thống kê (Box xám) */}
        <div className="product-stats-box">
          <div className="stat-row">
            <span className="icon">🔨</span>
            <span className="text">
              {product.bid_count > 0 ? <b>{product.bid_count} lượt đấu</b> : 'Chưa có lượt đấu'}
            </span>
          </div>
          <div className="stat-row">
            <span className="icon"></span>
            <span className="text winner">
              {product.winner_name ? (
                <>Top: <b>{product.winner_name}</b></>
              ) : (
                <span className="muted">Chưa có người thắng</span>
              )}
            </span>
          </div>
        </div>

        {/* 4. Footer: Thời gian */}
        <div className="product-footer-meta">
          {/* Ngày đăng */}
          <div className="meta-item" title="Ngày đăng">
            <small>Đăng: {new Date(product.created_at || Date.now()).toLocaleDateString('vi-VN')}</small>
          </div>

          {/* Thời gian còn lại */}
          <div className="meta-item time-left">
            {shouldShowRelativeTime(product.end_time) ? (
              <span className="tag-urgent">
                {getRelativeTime(product.end_time)}
              </span>
            ) : (
              <span className="tag-finished">
                Kết thúc: {new Date(product.end_time).toLocaleDateString('vi-VN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
