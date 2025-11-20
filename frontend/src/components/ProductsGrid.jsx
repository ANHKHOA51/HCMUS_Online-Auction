import React from 'react';
import ProductCard from './ProductCard';
import './ProductsGrid.css';

const ProductsGrid = ({ products, searchQuery, selectedCategory, onClearFilters }) => {
  if (products.length === 0) {
    return (
      <div className="no-products">
        <div className="no-products-icon">📭</div>
        <h3>Không tìm thấy sản phẩm</h3>
        <p>
          {searchQuery || selectedCategory
            ? 'Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
            : 'Không có sản phẩm nào có sẵn'}
        </p>
        {(searchQuery || selectedCategory) && (
          <button className="reset-btn" onClick={onClearFilters}>
            ↻ Xóa bộ lọc
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
