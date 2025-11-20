import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import TopProductsSection from '../components/TopProductsSection';
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
      {/* Hero Banner */}
      <div className="home-hero">
        <div className="hero-content">
          <h1>🏆 Sàn Đấu Giá Trực Tuyến</h1>
          <p>Tìm kiếm và đấu giá những sản phẩm yêu thích</p>
          <button className="hero-search-btn" onClick={handleSearchClick}>
            🔍 Tìm kiếm sản phẩm
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="home-content">
        {/* Top Products Ending Soon */}
        <TopProductsSection
          title="Top 5 Sản Phẩm Gần Kết Thúc"
          icon="⏰"
          products={endingSoonProducts}
          loading={loadingEndingSoon}
        />

        {/* Top Products By Bids */}
        <TopProductsSection
          title="Top 5 Sản Phẩm Có Nhiều Lượt Ra Giá"
          icon="🔥"
          products={mostBidProducts}
          loading={loadingBids}
        />

        {/* Premium Products */}
        <TopProductsSection
          title="Top 5 Sản Phẩm Có Giá Cao Nhất"
          icon="💎"
          products={premiumProducts}
          loading={loadingPrice}
        />
      </div>
    </div>
  );
};

export default HomePage;
