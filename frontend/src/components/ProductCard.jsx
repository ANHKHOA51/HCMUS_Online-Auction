import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRelativeTime, shouldShowRelativeTime } from '../utils/timeUtil';
import { formatPriceVN } from '../utils/formatCurrency';
import HeartButton from './HeartButton';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { cur_user } = useAuth();

  if (!product) return null;

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  const productImage = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x300?text=No+Image'; 

  const isNew = (new Date() - new Date(product.created_at)) < 60 * 60 * 1000;
  const isHot = product.bid_count > 0;
  const isHoldingPrice = cur_user && product.winner_id === cur_user.id;

  let badgeLabel = '';
  // Biến class cho background màu badge
  let badgeBgClass = '';

  if (isHoldingPrice) {
      badgeLabel = 'ĐANG GIỮ GIÁ';
      badgeBgClass = 'bg-[#27ae60]';
  } else if (isNew) {
      badgeLabel = 'NEW';
      badgeBgClass = 'bg-[#3da9fc]';
  } else if (isHot) {
      badgeLabel = 'HOT';
      badgeBgClass = 'bg-[#ef4565]';
  }

  return (
    <div 
      className="flex flex-col h-full relative overflow-hidden cursor-pointer bg-[#fffffe] border-2 border-[#094067] rounded-[12px] shadow-[4px_4px_0px_rgba(9,64,103,0.2)] transition-all duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#094067]"
      onClick={handleClick}
    >
      
      {/* --- ẢNH & BADGE --- */}
      <div className="w-full aspect-square bg-[#f4f6f8] relative overflow-hidden border-b-2 border-[#094067] group">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover block transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* card-badges */}
        <div className="absolute top-[12px] w-full px-[12px] flex gap-[6px] z-[2] justify-between items-start">
            {badgeLabel && (
                <span className={`px-[12px] py-[4px] rounded-[20px] text-[0.75rem] font-bold uppercase tracking-[0.5px] text-[#fffffe] border border-[#094067] shadow-[2px_2px_0px_rgba(9,64,103,0.2)] ${badgeBgClass}`}>
                    {badgeLabel}
                </span>
            )}
            
            {/* Heart Button Container */}
            <div onClick={(e) => e.stopPropagation()}>
              <HeartButton productId={product.id} initialState={product.is_favorite || false} />
            </div>
        </div>
      </div>

      {/* --- NỘI DUNG --- */}
      <div className="p-[16px] flex-1 flex flex-col gap-[12px] max-[480px]:p-[12px]">
        
        {/* Tên */}
        <h3 
          className="text-[1.1rem] font-bold text-[#094067] m-0 leading-[1.3] line-clamp-2 overflow-hidden max-[480px]:text-[1rem]"
          title={product.name}
        >
            {product.name}
        </h3>

        {/* Giá */}
        <div className="flex flex-col gap-[4px]">
          {/* Main Price */}
          <div className="flex justify-between items-center">
            <span className="text-[0.8rem] font-semibold text-[#5f6c7b]">Hiện tại</span>
            <span className="text-[0.7rem] font-extrabold bg-[#fcbcd5] text-[#ef4565] px-[8px] py-[2px] rounded-[4px] max-[480px]:text-[1rem]">
              {formatPriceVN(product.current_price || product.starting_price)}
            </span>
          </div>

          {/* Buy Now Price */}
          {product.buy_now_price && (
            <div className="flex justify-between items-center">
              <span className="text-[0.8rem] font-semibold text-[#5f6c7b]">Mua ngay</span>
              <span className="text-[0.7rem] font-bold text-[#094067] bg-[#d8eefe] px-[8px] py-[2px] rounded-[4px]">
                {formatPriceVN(product.buy_now_price)}
              </span>
            </div>
          )}
        </div>

        {/* Thống kê nhỏ */}
        <div className="mt-auto bg-[#f2f4f6] rounded-[6px] p-[8px] text-[0.8rem] text-[#5f6c7b] border border-dashed border-[#90b4ce]">
            <div className="flex items-center gap-[6px] mb-[2px] last:mb-0">
                <span>🔨 {product.bid_count || 0} lượt đấu giá</span>
            </div>
            {product.winner_name && (
                <div className="flex items-center gap-[6px] mb-[2px] last:mb-0">
                    <span className="text-[#094067]">👑 Top: <b>{product.winner_name}</b></span>
                </div>
            )}
        </div>

        {/* Footer: Thời gian */}
        <div className="pt-[8px] border-t border-[#e1e4e8] flex justify-between items-center text-[0.75rem]">
            <div>
                <small className="text-[#5f6c7b] font-medium text-[100%]">{new Date(product.created_at).toLocaleDateString('vi-VN')}</small>
            </div>
            
            <div>
                {shouldShowRelativeTime(product.end_time) ? (
                    <span className="text-[#ef4565] font-bold bg-[#ffe3e3] px-[6px] py-[2px] rounded-[4px]">
                        ⏳ {getRelativeTime(product.end_time)}
                    </span>
                ) : (
                    <span className="text-[#5f6c7b] italic">
                        Đã kết thúc
                    </span>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
