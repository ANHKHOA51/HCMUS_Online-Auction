import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import Components
import ProductGallery from './ProductGallery';
import UserInfo from './UserInfo';
import ProductTabs from './ProductTab';
import ProductsGrid from './ProductsGrid';
import HeartButton from './HeartButton';
import ConfirmModal from './ConfirmModal'; // Component Modal mới

// Import Utils & Hooks
import { getRelativeTime, shouldShowRelativeTime, formatDate, isAuctionEnded } from '../utils/timeUtil';
import { formatPriceVN } from '../utils/formatCurrency';
import { useProductDetail } from '../hooks/useProduct';
import { useBidding } from '../hooks/useBidding';
import useQuestions from '../hooks/useQuestions';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { cur_user } = useAuth();
  
  // 1. Lấy dữ liệu chi tiết sản phẩm
    const { 
        product, 
        seller, 
        highestBidder, 
        faqs, 
        relatedProducts, 
        loading, 
        error, 
        refreshProductDetail 
    } = useProductDetail(id);

  // 2. Hook xử lý đấu giá (đã bao gồm logic Modal)
  const bidHistoryRef = React.useRef(null);
    const {
        bidAmount,
        setBidAmount,
        isPlacingBid,
        bidError,
        bidSuccess,
        handlePlaceBid,
        handleBuyNow,
        confirmModal,      // State modal
        closeConfirmModal  // Hàm đóng modal
    } = useBidding(product, () => {
        bidHistoryRef.current?.refreshBidHistory?.();
        refreshProductDetail();
    });

  const [bidType, setBidType] = React.useState('manual');

  // 3. Hook xử lý câu hỏi
  const {
    questions,
    isLoading: qaLoading,
    error: qaError,
    isAnswering,
    askQuestion,
    answerQuestion,
  } = useQuestions(id);

  // 4. Xử lý ảnh (Local vs Remote)
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

  // 5. Render Loading/Error
  if (loading) return <div className="text-center p-[20px] text-[var(--pg-paragraph)] italic">Đang tải...</div>;
  if (error) return <div className="text-center p-[20px] text-[#d32f2f] italic">{error}</div>;
  if (!product) return <div className="text-center p-[20px] text-[#d32f2f] italic">Sản phẩm không tồn tại</div>;

  // 6. Logic kiểm tra kết thúc (Dùng hàm utility chuẩn để tránh lỗi múi giờ)
  const isEnded = isAuctionEnded(product.end_time);

  return (
    <div className="bg-[var(--pg-bg,#fffffe)] min-h-screen py-[40px] text-[var(--pg-headline,#094067)] font-sans">
      <div className="max-w-[1450px] mx-auto px-[20px] grid grid-cols-[1fr_450px] gap-[40px] items-start max-[1024px]:grid-cols-1">

        {/* ================= LEFT COLUMN ================= */}
        <div className="flex flex-col sticky top-[25px] max-[1024px]:static">

          {/* Gallery */}
          <ProductGallery images={images} />

          {/* Tabs: Mô tả, Hỏi đáp, Lịch sử */}
          <ProductTabs 
            ref={bidHistoryRef}
            product={product} 
            faqs={faqs}
            questions={questions}
            isAnswering={isAnswering}
            onAnswer={answerQuestion}
            onAskQuestion={askQuestion}
            isAskingQuestion={qaLoading}
            currentUserId={cur_user?.id}
            sellerId={product.seller_id}
            onBidSuccess={() => {
              setTimeout(() => bidHistoryRef.current?.refreshBidHistory?.(), 100);
            }}
          />

        </div>

        {/* ================= RIGHT COLUMN (SIDEBAR) ================= */}
        <div className="flex flex-col gap-[25px] sticky top-[20px] max-[1024px]:static">

            {/* BLOCK 1: Basic Info & Seller */}
            <div className="bg-[var(--pg-main,#fffffe)] border-[3px] border-solid border-[var(--pg-stroke,#094067)] rounded-[16px] p-[24px] shadow-[6px_6px_0px_rgba(9,64,103,0.15)] transition-transform duration-200 ease-out">
                {/* Header: Name & Heart */}
                <div className="border-b-[2px] border-dashed border-[var(--pg-secondary,#90b4ce)] pb-[20px] mb-[20px]">
                    <div className="flex justify-between items-start gap-[20px] mb-[10px]">
                        <h2 className="m-0 text-[28px] font-extrabold text-[var(--pg-headline,#094067)] leading-[1.3] flex-1 max-[768px]:text-[24px]">
                            {product.name}
                        </h2>
                        <div className="shrink-0 mt-[5px]">
                            <HeartButton productId={product.id} initialState={product.is_favorite || false} />
                        </div>
                    </div>
                    <span className="inline-block bg-[#e0fbfc] text-[var(--pg-headline,#094067)] px-[12px] py-[6px] rounded-[20px] text-[14px] font-semibold border-[2px] border-solid border-[var(--pg-headline,#094067)]">
                        {product.category_name}
                    </span>
                </div>

                {/* Seller Info */}
                <div className="bg-[var(--pg-main,#fffffe)] border-[3px] border-solid border-[var(--pg-stroke,#094067)] rounded-[16px] p-[24px] shadow-[6px_6px_0px_rgba(9,64,103,0.15)] transition-transform duration-200 ease-out">
                    <h5 className="flex items-center gap-[10px] font-bold text-[var(--pg-headline,#094067)] mb-[15px] before:content-[''] before:block before:w-[8px] before:h-[24px] before:bg-[var(--pg-tertiary,#ef4565)] before:rounded-[4px] text-[16px] mt-0">
                        Thông tin người bán
                    </h5>
                    <UserInfo user={seller} role="seller" />
                </div>

                {/* Highest Bidder Info */}
                {highestBidder && (
                    <div className="bg-[var(--pg-main,#fffffe)] border-[3px] border-solid border-[var(--pg-stroke,#094067)] rounded-[16px] p-[24px] shadow-[6px_6px_0px_rgba(9,64,103,0.15)] transition-transform duration-200 ease-out mt-[20px]">
                        <h5 className="flex items-center gap-[10px] font-bold text-[var(--pg-headline,#094067)] mb-[15px] before:content-[''] before:block before:w-[8px] before:h-[24px] before:bg-[var(--pg-tertiary,#ef4565)] before:rounded-[4px] text-[16px] mt-0">
                             Người giữ giá cao nhất
                        </h5>
                        <UserInfo user={highestBidder} role="bidder" isHighestBidder={true} />
                    </div>
                )}
            </div>
 
            {/* BLOCK 2: Price & Actions */}
            <div className="bg-[#fffffe] border-[3px] border-solid border-[var(--pg-stroke,#094067)] rounded-[16px] p-[24px] shadow-[6px_6px_0px_rgba(9,64,103,0.15)] transition-transform duration-200 ease-out flex flex-col gap-[15px]">
                
                {/* Price Display */}
                <div className="flex justify-between items-baseline">
                    <span className="text-[14px] text-[var(--pg-paragraph,#5f6c7b)] font-semibold">Hiện tại:</span>
                    <span className="font-extrabold text-[var(--pg-tertiary,#ef4565)] text-[28px] max-[768px]:text-[24px]">
                        {formatPriceVN(product.current_price || product.starting_price)}
                    </span>
                </div>
                
                {/* Time Display */}
                <div className="bg-[#d8eefe] border-[2px] border-solid border-[var(--pg-stroke,#094067)] rounded-[16px] p-[10px] mt-[10px] shadow-none transition-transform duration-200 ease-out">
                    <div className="flex justify-between items-center py-[8px] font-medium">
                        <span className="text-[14px] color-[var(--pg-paragraph,#5f6c7b)] font-semibold">Kết thúc:</span>
                        <span className="text-[20px] font-extrabold text-[var(--pg-headline,#094067)]">
                            {isEnded ? (
                                <span className="text-[var(--pg-paragraph,#5f6c7b)] italic font-bold text-[16px]">Đã kết thúc</span>
                            ) : shouldShowRelativeTime(product.end_time) ? (
                                <span className="bg-[var(--pg-tertiary,#ef4565)] text-white px-[10px] py-[4px] rounded-[20px] text-[12px] font-bold border-[2px] border-solid border-[var(--pg-headline,#094067)]">
                                    {getRelativeTime(product.end_time)}
                                </span>
                            ) : (
                                formatDate(product.end_time)
                            )}
                        </span>
                    </div>
                </div>

                {/* Action Area */}
                {!isEnded && (
                    <div className="mt-[20px]">
                        {/* Messages */}
                        {bidError && <div className="p-[12px] rounded-[8px] font-semibold mb-[15px] border-[2px] border-solid bg-[#ffd1d1] text-[#d32f2f] border-[#d32f2f] animate-[popIn_0.3s_ease]">⚠️ {bidError}</div>}
                        {bidSuccess && <div className="p-[12px] rounded-[8px] font-semibold mb-[15px] border-[2px] border-solid bg-[#d1f7d6] text-[#1b5e20] border-[#1b5e20] animate-[popIn_0.3s_ease]">✅ Đặt giá thành công!</div>}

                        {/* Bid Type Tabs */}
                        <div className="flex gap-[12px] mb-[16px]">
                            <button
                                className={`flex-1 py-[10px] text-[14px] font-bold rounded-[8px] border-[2px] border-solid transition-all duration-200 cursor-pointer ${
                                    bidType === 'manual' 
                                    ? 'bg-[var(--pg-headline,#094067)] text-white border-[var(--pg-headline,#094067)] shadow-[2px_2px_0_rgba(9,64,103,0.3)] translate-y-[1px]' 
                                    : 'bg-white text-[var(--pg-paragraph,#5f6c7b)] border-[var(--pg-stroke,#094067)] hover:bg-[#f0f9ff]'
                                }`}
                                onClick={() => setBidType('manual')}
                            >
                                Đặt giá thường
                            </button>
                            <button
                                className={`flex-1 py-[10px] text-[14px] font-bold rounded-[8px] border-[2px] border-solid transition-all duration-200 cursor-pointer ${
                                    bidType === 'auto' 
                                    ? 'bg-[var(--pg-headline,#094067)] text-white border-[var(--pg-headline,#094067)] shadow-[2px_2px_0_rgba(9,64,103,0.3)] translate-y-[1px]' 
                                    : 'bg-white text-[var(--pg-paragraph,#5f6c7b)] border-[var(--pg-stroke,#094067)] hover:bg-[#f0f9ff]'
                                }`}
                                onClick={() => setBidType('auto')}
                            >
                                Tự động (Max Bid)
                            </button>
                        </div>

                        {/* Input Area */}
                        <div className="bg-[var(--pg-main,#fffffe)]">
                            {bidType === 'auto' && (
                                <div className="mb-[12px] p-[12px] bg-[#f8f9fa] border-[2px] border-dashed border-[var(--pg-secondary,#90b4ce)] rounded-[8px] text-[13px] text-[var(--pg-paragraph,#5f6c7b)] leading-[1.5]">
                                    <strong className="text-[var(--pg-headline,#094067)]">Cơ chế tự động:</strong> Nhập mức giá tối đa bạn chấp nhận trả. Hệ thống sẽ tự động đặt giá từng bước nhỏ nhất đủ để bạn dẫn đầu, cho đến khi chạm mức tối đa này.
                                </div>
                            )}
                            {bidType === 'manual' && (
                                <div className="mb-[12px] p-[12px] bg-[#f8f9fa] border-[2px] border-dashed border-[var(--pg-secondary,#90b4ce)] rounded-[8px] text-[13px] text-[var(--pg-paragraph,#5f6c7b)] leading-[1.5]">
                                    <strong className="text-[var(--pg-headline,#094067)]">Cơ chế truyền thống:</strong> Nhập giá bạn muốn đặt. Hệ thống sẽ ghi nhận ngay mức giá này là giá hiện tại nếu hợp lệ.
                                </div>
                            )}

                            <input
                                type="text"
                                value={bidAmount}
                                onChange={setBidAmount}
                                placeholder={bidType === 'auto' ? "Nhập giá trần tối đa..." : "Nhập giá muốn đặt..."}
                                className="w-full p-[14px] border-[2px] border-solid border-[var(--pg-stroke,#094067)] rounded-[8px] text-[16px] font-bold text-[var(--pg-headline,#094067)] bg-[var(--pg-bg,#fffffe)] mb-[8px] transition-all duration-200 focus:outline-none focus:border-[var(--pg-highlight,#3da9fc)] focus:shadow-[0_0_0_3px_rgba(61,169,252,0.2)] placeholder:font-normal"
                                disabled={isPlacingBid}
                            />
                            
                            {/* Suggested Price Helper */}
                            <div 
                                className="flex items-center gap-[8px] text-[0.85rem] text-[var(--pg-paragraph,#5f6c7b)] cursor-pointer p-[10px_12px] bg-[#f0f9ff] border-[1px] border-dashed border-[#bae6fd] rounded-[6px] transition-all duration-200 ease-out mb-[15px] hover:bg-[#e0f2fe] hover:border-[#7dd3fc] hover:-translate-y-[1px] group" 
                                onClick={() => {
                                    const currentPrice = Number(product.current_price) || Number(product.starting_price);
                                    const stepPrice = Number(product.step_price) || 100000;
                                    const minBid = currentPrice + stepPrice;
                                    setBidAmount({ target: { value: String(minBid) } });
                                }}
                            >
                                <span className="font-semibold">Đề xuất tối thiểu:</span> 
                                <strong className="text-[var(--pg-headline,#094067)] font-bold">
                                    {formatPriceVN((Number(product.current_price) || Number(product.starting_price)) + (Number(product.step_price) || 100000))}
                                </strong>
                                <span className="ml-auto text-[0.7rem] text-[var(--pg-button,#3da9fc)] bg-white border-[1px] border-solid border-[var(--pg-button,#3da9fc)] px-[8px] py-[3px] rounded-[4px] font-bold uppercase transition-all duration-200 group-hover:bg-[var(--pg-button,#3da9fc)] group-hover:text-white group-hover:shadow-[2px_2px_0_rgba(9,64,103,0.1)]">
                                    Áp dụng
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            className={`w-full p-[14px] border-[2px] border-solid border-[var(--pg-stroke,#094067)] rounded-[8px] text-[16px] font-bold cursor-pointer transition-transform duration-100 shadow-[4px_4px_0_rgba(9,64,103,0.2)] mb-[12px] text-white
                            ${bidType === 'auto' 
                                ? 'bg-[var(--pg-tertiary,#ef4565)]' // Auto = Đỏ/Hồng
                                : 'bg-[var(--pg-button,#3da9fc)]'   // Manual = Xanh
                            }
                            hover:enabled:-translate-x-[2px] hover:enabled:-translate-y-[2px] hover:enabled:shadow-[6px_6px_0_rgba(9,64,103,0.2)] active:enabled:translate-x-0 active:enabled:translate-y-0 active:enabled:shadow-[2px_2px_0_rgba(9,64,103,0.2)] disabled:bg-[#ccc] disabled:border-[#999] disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none`}
                            onClick={() => handlePlaceBid(bidType === 'auto')}
                            disabled={isPlacingBid}
                        >
                            {isPlacingBid ? 'Đang xử lý...' : (bidType === 'auto' ? 'ĐẶT GIÁ TỰ ĐỘNG' : 'ĐẶT GIÁ NGAY')}
                        </button>

                        {/* Buy Now Button */}
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
                
                {/* Ended State Box */}
                {isEnded && (
                    <div className="bg-[#f0f0f0] border-[3px] border-solid border-[var(--pg-stroke,#094067)] rounded-[16px] p-[24px] shadow-none transition-transform duration-200 ease-out text-center mt-[10px]">
                        <p className="m-0 font-bold text-[var(--pg-headline,#094067)]">Phiên đấu giá đã kết thúc</p>
                        {highestBidder && (
                            <div className="mt-[10px]">
                                <p className="text-[var(--pg-success,#3ecf8e)] text-[18px] m-0">Người thắng: <strong className="text-[var(--pg-headline,#094067)]">{highestBidder.full_name}</strong></p>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
      </div>

      {/* ================= BOTTOM SECTION (RELATED) ================= */}
      <div className="max-w-[1450px] mx-auto my-[60px] px-[20px] flex flex-col gap-[40px]">
        <ProductsGrid products={relatedProducts} title={"Sản phẩm tương tự"} />
      </div>

      {/* ================= CONFIRMATION MODAL ================= */}
      <ConfirmModal 
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={closeConfirmModal}
          isDanger={confirmModal.isDanger}
      />
    </div>
  );
};

export default ProductDetail;
