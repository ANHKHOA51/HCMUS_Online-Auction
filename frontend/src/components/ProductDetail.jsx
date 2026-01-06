import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGallery from './ProductGallery';
import UserInfo from './UserInfo';
import ProductTabs from './ProductTab'; // Import component mới
import { getRelativeTime, shouldShowRelativeTime, formatDate } from '../utils/timeUtil';
import { formatPriceVN } from '../utils/formatCurrency';
import { useProductDetail } from '../hooks/useProduct';
import { useBidding } from '../hooks/useBidding';
import useQuestions from '../hooks/useQuestions';
import { useAuth } from '../contexts/AuthContext';
import ProductsGrid from './ProductsGrid';
import HeartButton from './HeartButton';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { cur_user } = useAuth();
  const { 
    product, 
    seller, 
    highestBidder, 
    faqs, 
    relatedProducts, 
    loading, 
    error 
} = useProductDetail(id);

  let images = [];
  if (product?.images && Array.isArray(product.images)) {
    product.images.forEach((image) => {
      if (typeof image === 'string') {
        if (image.startsWith('https://') || image.startsWith('http://')) {
          images.push(image);
        } else {
          images.push(`http://localhost:3000/static/images/products/${product.id}/${image}`);
        }
      }
    });
  }
  const {
    bidAmount,
    setBidAmount,
    isPlacingBid,
    bidError,
    bidSuccess,
    handlePlaceBid,
    handleBuyNow,
  } = useBidding(product);

  // Use Q&A hook
  const {
    questions,
    isLoading: qaLoading,
    error: qaError,
    isAnswering,
    askQuestion,
    answerQuestion,
  } = useQuestions(id);

  if (loading) return <div className="text-center p-[20px] text-[var(--pg-paragraph)] italic">Đang tải...</div>;
  if (error) return <div className="text-center p-[20px] text-[#d32f2f] italic">{error}</div>;
  if (!product) return <div className="text-center p-[20px] text-[#d32f2f] italic">Sản phẩm không tồn tại</div>;

  const isEnded = new Date(product.end_time) < new Date();

  return (
    <div className="bg-[var(--pg-bg,#fffffe)] min-h-screen py-[40px] text-[var(--pg-headline,#094067)] font-sans">
      <div className="max-w-[1450px] mx-auto px-[20px] grid grid-cols-[1fr_450px] gap-[40px] items-start max-[1024px]:grid-cols-1">

        {/* --- LEFT COLUMN --- */}
        <div className="flex flex-col sticky top-[25px] max-[1024px]:static">

          {/* 1. Gallery (Đã được CSS chỉnh to ra) */}
          <ProductGallery images={product.images} />

          {/* 2. Tabs: Mô tả, Hỏi đáp, Vận chuyển */}
          <ProductTabs 
            product={product} 
            faqs={faqs}
            questions={questions}
            isAnswering={isAnswering}
            onAnswer={answerQuestion}
            onAskQuestion={askQuestion}
            isAskingQuestion={qaLoading}
            currentUserId={cur_user?.id}
            sellerId={product.seller_id}
          />

        </div>

        {/* --- RIGHT COLUMN (SIDEBAR - Cố định chiều cao, scrollable) --- */}
        <div className="flex flex-col gap-[25px] sticky top-[20px] max-[1024px]:static">

                {/* 1. Basic Info */}
            <div className="bg-[var(--pg-main,#fffffe)] border-[3px] border-solid border-[var(--pg-stroke,#094067)] rounded-[16px] p-[24px] shadow-[6px_6px_0px_rgba(9,64,103,0.15)] transition-transform duration-200 ease-out">
                <div className="border-b-[2px] border-dashed border-[var(--pg-secondary,#90b4ce)] pb-[20px] mb-[20px]">
    {/* Tạo một hàng ngang chứa Tên và Nút Tim */}
                    <div className="flex justify-between items-start gap-[20px] mb-[10px]">
                    <h2 className="m-0 text-[28px] font-extrabold text-[var(--pg-headline,#094067)] leading-[1.3] flex-1 max-[768px]:text-[24px]">{product.name}</h2>
                    
                    {/* Nút tim nằm ở đây */}
                    <div className="shrink-0 mt-[5px]">
                        <HeartButton productId={product.id} initialState={product.is_favorite || false} />
                    </div>
                </div>
                    <span className="inline-block bg-[#e0fbfc] text-[var(--pg-headline,#094067)] px-[12px] py-[6px] rounded-[20px] text-[14px] font-semibold border-[2px] border-solid border-[var(--pg-headline,#094067)]">{product.category_name}</span>
            </div>



                <div className="bg-[var(--pg-main,#fffffe)] border-[3px] border-solid border-[var(--pg-stroke,#094067)] rounded-[16px] p-[24px] shadow-[6px_6px_0px_rgba(9,64,103,0.15)] transition-transform duration-200 ease-out">
                    <h5 className="flex items-center gap-[10px] font-bold text-[var(--pg-headline,#094067)] mb-[15px] before:content-[''] before:block before:w-[8px] before:h-[24px] before:bg-[var(--pg-tertiary,#ef4565)] before:rounded-[4px] text-[16px] mt-0">
                        👤 Thông tin người bán
                    </h5>
                    <UserInfo user={seller} role="seller" />
                </div>

                {/* 2. Highest Bidder Info */}
                {highestBidder && (
                    <div className="bg-[var(--pg-main,#fffffe)] border-[3px] border-solid border-[var(--pg-stroke,#094067)] rounded-[16px] p-[24px] shadow-[6px_6px_0px_rgba(9,64,103,0.15)] transition-transform duration-200 ease-out mt-[20px]">
                        <h5 className="flex items-center gap-[10px] font-bold text-[var(--pg-headline,#094067)] mb-[15px] before:content-[''] before:block before:w-[8px] before:h-[24px] before:bg-[var(--pg-tertiary,#ef4565)] before:rounded-[4px] text-[16px] mt-0">
                            🏆 Người giữ giá cao nhất
                        </h5>
                        <UserInfo user={highestBidder} role="bidder" isHighestBidder={true} />
                    </div>
                )}
            </div>
 
          {/* 2. Price & Actions */}
          <div className="bg-[#fffffe] border-[3px] border-solid border-[var(--pg-stroke,#094067)] rounded-[16px] p-[24px] shadow-[6px_6px_0px_rgba(9,64,103,0.15)] transition-transform duration-200 ease-out flex flex-col gap-[15px]">
            <div className="flex justify-between items-baseline">
              <span className="text-[14px] text-[var(--pg-paragraph,#5f6c7b)] font-semibold">Hiện tại:</span>
              <span className="font-extrabold text-[var(--pg-tertiary,#ef4565)] text-[28px] max-[768px]:text-[24px]">{formatPriceVN(product.current_price || product.starting_price)}</span>
            </div>
            
            <div className="bg-[#d8eefe] border-[2px] border-solid border-[var(--pg-stroke,#094067)] rounded-[16px] p-[10px] mt-[10px] shadow-none transition-transform duration-200 ease-out">
                 <div className="flex justify-between items-center py-[8px] font-medium">
                    <span className="text-[14px] color-[var(--pg-paragraph,#5f6c7b)] font-semibold">Kết thúc:</span>
                    <span className="text-[20px] font-extrabold text-[var(--pg-headline,#094067)]">
                        {shouldShowRelativeTime(product.end_time) ? (
                        <span className="bg-[var(--pg-tertiary,#ef4565)] text-white px-[10px] py-[4px] rounded-[20px] text-[12px] font-bold border-[2px] border-solid border-[var(--pg-headline,#094067)]">{getRelativeTime(product.end_time)}</span>
                        ) : (
                        formatDate(product.end_time)
                        )}
                    </span>
                 </div>
                 {isEnded && <div className="bg-[var(--pg-paragraph,#5f6c7b)] text-white p-[8px] rounded-[8px] text-center font-bold mt-[10px] border-[2px] border-solid border-[var(--pg-headline,#094067)]">ĐÃ KẾT THÚC</div>}
            </div>

            {!isEnded && (
              <div className="mt-[20px]">
                {bidError && <div className="p-[12px] rounded-[8px] font-semibold mb-[15px] border-[2px] border-solid bg-[#ffd1d1] text-[#d32f2f] border-[#d32f2f] animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">⚠️ {bidError}</div>}
                {bidSuccess && <div className="p-[12px] rounded-[8px] font-semibold mb-[15px] border-[2px] border-solid bg-[#d1f7d6] text-[#1b5e20] border-[#1b5e20] animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">✅ Đặt giá thành công!</div>}

                <div className="bg-[var(--pg-main,#fffffe)]">
                  <input
                    type="text"
                    value={bidAmount}
                    onChange={setBidAmount}
                    placeholder="Nhập giá muốn đặt..."
                    className="w-full p-[12px] border-[2px] border-solid border-[var(--pg-stroke,#094067)] rounded-[8px] text-[16px] font-semibold text-[var(--pg-headline,#094067)] bg-[var(--pg-bg,#fffffe)] mb-[8px] transition-all duration-200 focus:outline-none focus:border-[var(--pg-highlight,#3da9fc)] focus:shadow-[0_0_0_3px_rgba(61,169,252,0.2)]"
                    disabled={isPlacingBid}
                  />
                  <div 
                    className="flex items-center gap-[8px] text-[0.85rem] text-[var(--pg-paragraph,#5f6c7b)] cursor-pointer p-[10px_12px] bg-[#f0f9ff] border-[1px] border-dashed border-[#bae6fd] rounded-[6px] transition-all duration-200 ease-out mb-[15px] hover:bg-[#e0f2fe] hover:border-[#7dd3fc] hover:-translate-y-[1px] group" 
                    onClick={() => {
                        const currentPrice = Number(product.current_price) || Number(product.starting_price);
                        const stepPrice = Number(product.step_price) || 100000;
                        const minBid = currentPrice + stepPrice;
                        setBidAmount({ target: { value: String(minBid) } });
                    }}
                  >
                    <span className="font-semibold">💡 Giá thấp nhất hợp lệ:</span> 
                    <strong className="text-[var(--pg-headline,#094067)] font-bold">
                        {formatPriceVN((Number(product.current_price) || Number(product.starting_price)) + (Number(product.step_price) || 100000))}
                    </strong>
                    <span className="ml-auto text-[0.7rem] text-[var(--pg-button,#3da9fc)] bg-white border-[1px] border-solid border-[var(--pg-button,#3da9fc)] px-[8px] py-[3px] rounded-[4px] font-bold uppercase transition-all duration-200 group-hover:bg-[var(--pg-button,#3da9fc)] group-hover:text-white group-hover:shadow-[2px_2px_0_rgba(9,64,103,0.1)]">Áp dụng</span>
                  </div>
                </div>

                <button
                  className="w-full p-[14px] border-[2px] border-solid border-[var(--pg-stroke,#094067)] rounded-[8px] text-[16px] font-bold cursor-pointer transition-transform duration-100 shadow-[4px_4px_0_rgba(9,64,103,0.2)] mb-[12px] bg-[var(--pg-button,#3da9fc)] text-[var(--pg-button-text,#fffffe)] hover:enabled:-translate-x-[2px] hover:enabled:-translate-y-[2px] hover:enabled:shadow-[6px_6px_0_rgba(9,64,103,0.2)] active:enabled:translate-x-0 active:enabled:translate-y-0 active:enabled:shadow-[2px_2px_0_rgba(9,64,103,0.2)] disabled:bg-[#ccc] disabled:border-[#999] disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handlePlaceBid}
                  disabled={isPlacingBid}
                >
                  {isPlacingBid ? 'Đang xử lý...' : 'ĐẶT GIÁ NGAY'}
                </button>

                {product.buy_now_price && (
                  <button
                    className="w-full p-[14px] border-[2px] border-solid border-[var(--pg-stroke,#094067)] rounded-[8px] text-[16px] font-bold cursor-pointer transition-transform duration-100 shadow-[4px_4px_0_rgba(9,64,103,0.2)] mb-[12px] bg-[var(--pg-success,#3ecf8e)] text-white hover:enabled:-translate-x-[2px] hover:enabled:-translate-y-[2px] hover:enabled:shadow-[6px_6px_0_rgba(9,64,103,0.2)] active:enabled:translate-x-0 active:enabled:translate-y-0 active:enabled:shadow-[2px_2px_0_rgba(9,64,103,0.2)] disabled:bg-[#ccc] disabled:border-[#999] disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleBuyNow}
                    disabled={isPlacingBid}
                  >
                    MUA NGAY: {formatPriceVN(product.buy_now_price)}
                  </button>
                )}
              </div>
            )}
             
             {isEnded && (
                <div className="bg-[#f0f0f0] border-[3px] border-solid border-[var(--pg-stroke,#094067)] rounded-[16px] p-[24px] shadow-none transition-transform duration-200 ease-out text-center mt-[10px]">
                  <p>🏁 Phiên đấu giá đã kết thúc</p>
                  {highestBidder && (
                    <div style={{marginTop: '10px'}}>
                        <p className="text-[var(--pg-success,#3ecf8e)] text-[18px]">Người thắng: <strong>{highestBidder.full_name}</strong></p>
                        {/* Nếu bạn muốn hiển thị thêm thông tin người thắng dài dòng ở đây thì nó sẽ cuộn trong cột phải */}
                    </div>
                  )}
                </div>
              )}
          </div>

        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="max-w-[1450px] mx-auto my-[60px] px-[20px] flex flex-col gap-[40px]">
        <ProductsGrid products={relatedProducts} title={"Sản phẩm tương tự"} />
      </div>
    </div>
  );
};

export default ProductDetail;
