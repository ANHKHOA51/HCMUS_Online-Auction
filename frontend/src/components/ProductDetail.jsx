import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import ProductGallery from './ProductGallery';
import UserInfo from './UserInfo';
import ProductTabs from './ProductTab'; // Import component mới
import { getRelativeTime, shouldShowRelativeTime, formatDate } from '../utils/timeUtil';
import { formatPriceVN } from '../utils/formatCurrency';
import { useProductDetail } from '../hooks/useProduct';
import { useBidding } from '../hooks/useBidding';
import ProductsGrid from './ProductsGrid';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { product, seller, highestBidder, faqs, relatedProducts, loading, error } = useProductDetail(id);

  const {
    bidAmount,
    setBidAmount,
    isPlacingBid,
    bidError,
    bidSuccess,
    handlePlaceBid,
    handleBuyNow,
  } = useBidding(product);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Sản phẩm không tồn tại</div>;

  const isEnded = new Date(product.end_time) < new Date();

  return (
    <div className="product-detail-page">
      <div className="detail-container">
        
        {/* --- LEFT COLUMN --- */}
        <div className="detail-left">
          
          {/* 1. Gallery (Đã được CSS chỉnh to ra) */}
          <ProductGallery images={product.images} />

          {/* 2. Tabs: Mô tả, Hỏi đáp, Vận chuyển */}
          <ProductTabs product={product} faqs={faqs} />

        </div>

        {/* --- RIGHT COLUMN (SIDEBAR - Cố định chiều cao, scrollable) --- */}
        <div className="detail-right">

                {/* 1. Basic Info */}
            <div className="card-box">
                <div className="product-header">
                    <h2 className="product-title">{product.name}</h2>
                    <span className="product-category">{product.category_name}</span>
            </div>



                <div className="card-box">
                    <h5 className="section-title" style={{fontSize:'16px', marginTop:0}}>
                        👤 Thông tin người bán
                    </h5>
                    <UserInfo user={seller} role="seller" />
                </div>

                {/* 2. Highest Bidder Info */}
                {highestBidder && (
                    <div className="card-box" style={{marginTop: '20px'}}>
                        <h5 className="section-title" style={{fontSize:'16px', marginTop:0}}>
                            🏆 Người giữ giá cao nhất
                        </h5>
                        <UserInfo user={highestBidder} role="bidder" isHighestBidder={true} />
                    </div>
                )}
            </div>
 
          {/* 2. Price & Actions */}
          <div className="price-section card-box">
            <div className="price-item current">
              <span className="price-label">Hiện tại:</span>
              <span className="price-value">{formatPriceVN(product.current_price || product.starting_price)}</span>
            </div>
            
            <div className="time-info card-box" style={{padding:'10px', marginTop:'10px', border:'2px solid var(--pg-stroke)', boxShadow:'none'}}>
                 <div className="time-item">
                    <span className="time-label">Kết thúc:</span>
                    <span className="time-value">
                        {shouldShowRelativeTime(product.end_time) ? (
                        <span className="relative-time-badge">{getRelativeTime(product.end_time)}</span>
                        ) : (
                        formatDate(product.end_time)
                        )}
                    </span>
                 </div>
                 {isEnded && <div className="ended-badge">ĐÃ KẾT THÚC</div>}
            </div>

            {!isEnded && (
              <div className="bidding-area" style={{marginTop: '20px'}}>
                {bidError && <div className="bid-error">⚠️ {bidError}</div>}
                {bidSuccess && <div className="bid-success">🎉 Đặt giá thành công!</div>}

                <div className="bid-input-group">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Tối thiểu: ${formatPriceVN(product.current_price + (product.step_price || 100000))}`}
                    className="bid-input"
                    disabled={isPlacingBid}
                  />
                </div>
                
                <button
                  className="btn-bid"
                  onClick={handlePlaceBid}
                  disabled={isPlacingBid}
                >
                  {isPlacingBid ? 'Đang xử lý...' : 'ĐẶT GIÁ NGAY'}
                </button>

                {product.buy_now_price && (
                  <button
                    className="btn-buy-now"
                    onClick={handleBuyNow}
                    disabled={isPlacingBid}
                  >
                    MUA NGAY: {formatPriceVN(product.buy_now_price)}
                  </button>
                )}
              </div>
            )}
             
             {isEnded && (
                <div className="auction-ended card-box" style={{backgroundColor: '#f0f0f0', textAlign: 'center', marginTop:'10px', boxShadow: 'none'}}>
                  <p>🏁 Phiên đấu giá đã kết thúc</p>
                  {highestBidder && (
                    <div style={{marginTop: '10px'}}>
                        <p className="winner" style={{color: 'var(--pg-success)', fontSize: '18px'}}>Người thắng: <strong>{highestBidder.full_name}</strong></p>
                        {/* Nếu bạn muốn hiển thị thêm thông tin người thắng dài dòng ở đây thì nó sẽ cuộn trong cột phải */}
                    </div>
                  )}
                </div>
              )}
          </div>

        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="detail-below">
        <ProductsGrid products={relatedProducts} title={"Sản phẩm tương tự"} />
      </div>
    </div>
  );
};

export default ProductDetail;
