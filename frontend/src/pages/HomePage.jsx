import React, { useMemo } from 'react';
import './HomePage.css';
import ProductsGrid from '../components/ProductsGrid';
import { useTopProductsEndingSoon, useTopProductsByBids, useTopProductsByPrice } from '../hooks/useTopProducts';
import useWatchlist from '../hooks/useWatchlist';

const HomePage = () => {
  const { products: endingSoonProducts, loading: loadingEndingSoon } = useTopProductsEndingSoon();
  const { products: mostBidProducts, loading: loadingBids } = useTopProductsByBids();
  const { products: premiumProducts, loading: loadingPrice } = useTopProductsByPrice();
  const { watchedIds, isWatched } = useWatchlist();

  // Thêm isWatched vào mỗi product
  const enrichProducts = (products) => {
    return products.map(product => ({
      ...product,
      isWatched: isWatched(product.id)
    }));
  };

  const enrichedEndingSoon = useMemo(() => enrichProducts(endingSoonProducts), [endingSoonProducts, watchedIds]);
  const enrichedMostBid = useMemo(() => enrichProducts(mostBidProducts), [mostBidProducts, watchedIds]);
  const enrichedPremium = useMemo(() => enrichProducts(premiumProducts), [premiumProducts, watchedIds]);

  return (
    <div className="home-page">
      <div className="home-content">
        <ProductsGrid
          title="Top 5 Sản Phẩm Gần Kết Thúc"
          icon=""
          products={enrichedEndingSoon}
          loading={loadingEndingSoon}
        />

        <ProductsGrid
          title="Top 5 Sản Phẩm Có Nhiều Lượt Ra Giá"
          icon=""
          products={enrichedMostBid}
          loading={loadingBids}
        />

        <ProductsGrid
          title="Top 5 Sản Phẩm Có Giá Cao Nhất"
          icon=""
          products={enrichedPremium}
          loading={loadingPrice}
        />
      </div>
    </div>
  );
};

export default HomePage;
