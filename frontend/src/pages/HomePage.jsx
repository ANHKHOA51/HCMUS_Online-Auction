import React from 'react';
// import './HomePage.css'; // Có thể bỏ nếu không dùng custom CSS khác
import ProductsGrid from '../components/ProductsGrid';
import { useTopProductsEndingSoon, useTopProductsByBids, useTopProductsByPrice } from '../hooks/useTopProducts';

const HomePage = () => {
  const { products: endingSoonProducts, loading: loadingEndingSoon } = useTopProductsEndingSoon();
  const { products: mostBidProducts, loading: loadingBids } = useTopProductsByBids();
  const { products: premiumProducts, loading: loadingPrice } = useTopProductsByPrice();

  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid py-5 mx-auto" style={{ maxWidth: '1400px' }}>
        
        <div className="mb-5">
          <ProductsGrid
            title="Top 5 Sản Phẩm Gần Kết Thúc"
            icon=""
            products={endingSoonProducts}
            loading={loadingEndingSoon}
          />
        </div>

        <div className="mb-5">
          <ProductsGrid
            title="Top 5 Sản Phẩm Có Nhiều Lượt Ra Giá"
            icon=""
            products={mostBidProducts}
            loading={loadingBids}
          />
        </div>

        <div className="mb-5">
          <ProductsGrid
            title="Top 5 Sản Phẩm Có Giá Cao Nhất"
            icon=""
            products={premiumProducts}
            loading={loadingPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
