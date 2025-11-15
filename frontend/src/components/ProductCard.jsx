import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { formatPrice, getRelativeTime, shouldShowRelativeTime } from '../utils/timeUtil';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  if (!product) return null;

  return (
    <div className="product-card-wrapper" onClick={handleClick}>
      <div className="product-card-image">
        <img
          src={product.images && product.images[0] ? product.images[0] : '/default-product.png'}
          alt={product.name}
          className="product-img"
        />
      </div>

      <div className="product-card-body">
        <h6 className="product-card-name">{product.name}</h6>

        <div className="product-card-prices">
          <div className="price-row">
            <span className="price-label">Giá hiện tại:</span>
            <span className="price-amount">
              {formatPrice(product.current_price || product.starting_price)}
            </span>
          </div>

          {product.buy_now_price && (
            <div className="price-row buy-now-row">
              <span className="price-label">Mua ngay:</span>
              <span className="price-amount">
                {formatPrice(product.buy_now_price)}
              </span>
            </div>
          )}
        </div>

        <div className="product-card-time">
          {shouldShowRelativeTime(product.end_time) ? (
            <span className="time-relative">
              {getRelativeTime(product.end_time)}
            </span>
          ) : (
            <span className="time-absolute">
              {new Date(product.end_time).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>

        <button className="btn-view-detail">Xem chi tiết →</button>
      </div>
    </div>
  );
};

export default ProductCard;
