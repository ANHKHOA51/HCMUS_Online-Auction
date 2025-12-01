import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import ProductsGrid from '../components/ProductsGrid';
import { useTopProductsEndingSoon, useTopProductsByBids, useTopProductsByPrice } from '../hooks/useTopProducts';

const HomePage = () => {
  const navigate = useNavigate();
  const { products: endingSoonProducts, loading: loadingEndingSoon } = useTopProductsEndingSoon();
  const { products: mostBidProducts, loading: loadingBids } = useTopProductsByBids();
  const { products: premiumProducts, loading: loadingPrice } = useTopProductsByPrice();

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <div className="home-page">

      {/* Main Content */}
      <div className="home-content">
        {/* Top Products Ending Soon */}
        <ProductsGrid
          title="Top 5 Sản Phẩm Gần Kết Thúc"
          icon=""
          products={endingSoonProducts}
          loading={loadingEndingSoon}
        />

        {/* Top Products By Bids */}
        <ProductsGrid
          title="Top 5 Sản Phẩm Có Nhiều Lượt Ra Giá"
          icon=""
          products={mostBidProducts}
          loading={loadingBids}
        />

        {/* Premium Products */}
        <ProductsGrid
          title="Top 5 Sản Phẩm Có Giá Cao Nhất"
          icon=""
          products={premiumProducts}
          loading={loadingPrice}
        />
      </div>
    </div>
  );
};

export default HomePage;
