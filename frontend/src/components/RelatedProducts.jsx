import React from 'react';
import './RelatedProducts.css';
import { formatPrice, getRelativeTime, shouldShowRelativeTime } from '../utils/timeUtil';

const RelatedProducts = ({ products = [], onProductClick }) => {
    
  return (
    <div className="related-products">
      <h4 className="section-title">📦 5 sản phẩm khác trong chuyên mục</h4>
      
      {products && products.length > 0 ? (
        <div className="products-grid">
          {products.slice(0, 5).map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => onProductClick && onProductClick(product.id)}
            >
              <div className="product-image">
                <img
                  src={product.images && product.images[0] ? product.images[0] : '/default-product.png'}
                  alt={product.name}
                />
              </div>

              <div className="product-info">
                <h6 className="product-name">{product.name}</h6>

                <div className="product-price">
                  <span className="current-price">
                    {formatPrice(product.current_price || product.starting_price)}
                  </span>
                </div>

                <div className="product-time">
                  {shouldShowRelativeTime(product.end_time) ? (
                    <span className="relative-time">
                      {getRelativeTime(product.end_time)}
                    </span>
                  ) : (
                    <span className="absolute-time">
                      Kết thúc {new Date(product.end_time).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="products-empty">
          <p>Không có sản phẩm khác trong chuyên mục</p>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
