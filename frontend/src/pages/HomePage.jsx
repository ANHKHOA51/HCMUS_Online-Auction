import React, { useMemo } from 'react';
import './HomePage.css';
import ProductsGrid from '../components/ProductsGrid';
import { useTopProductsEndingSoon, useTopProductsByBids, useTopProductsByPrice } from '../hooks/useTopProducts';
import useWatchlist from '../hooks/useWatchlist';

const HomePage = () => {
  const { products: endingSoonProducts, loading: loadingEndingSoon } = useTopProductsEndingSoon();
  const { products: mostBidProducts, loading: loadingBids } = useTopProductsByBids();
  const { products: premiumProducts, loading: loadingPrice } = useTopProductsByPrice();


  return (
    <div className="home-page">
      <div className="home-content">
        <ProductsGrid
          title="Top 5 Sản Phẩm Gần Kết Thúc"
          icon=""
          products={endingSoonProducts}
          loading={loadingEndingSoon}
        />

        <ProductsGrid
          title="Top 5 Sản Phẩm Có Nhiều Lượt Ra Giá"
          icon=""
          products={mostBidProducts}
          loading={loadingBids}
        />

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
