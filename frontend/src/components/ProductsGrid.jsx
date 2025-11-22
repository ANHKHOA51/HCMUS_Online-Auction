import React from 'react';
import ProductCard from './ProductCard';
import './ProductsGrid.css';

const ProductsGrid = ({ title, icon, products, loading }) => {
  if (loading) {
    return (
      <section className="top-products-section">
        <h2>{icon} {title}</h2>
        <div className="loading-spinner">Đang tải...</div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="top-products-section">
        <h2>{icon} {title}</h2>
        <div className="no-products-message">Chưa có sản phẩm</div>
      </section>
    );
  }

  return (
    <section className="top-products-section">
      <h2>{icon} {title}</h2>
      <div className="top-products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductsGrid;
