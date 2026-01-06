import React, { useState, useEffect } from 'react';
import { formatPriceVN } from '../utils/formatCurrency';
import { getRelativeTime } from '../utils/timeUtil';
import { useBidHistory } from '../hooks/useBidHistory';
import Pagination from './Pagination';
import { bidService } from '../services/bid';
import UserReviewsModal from './UserReviewsModal'; // Import Modal

const BidHistory = ({ productId, isSeller }) => {
  const { bidHistory, isLoading, error, refreshBidHistory } = useBidHistory(productId);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBidder, setSelectedBidder] = useState(null); // State for modal
  const itemsPerPage = 5;

  const bids = bidHistory;

  const maskName = (name) => {
    if (!name) return 'Ẩn danh';
    if (isSeller) return name; // Show full name if seller
    // Masking logic matching backend
    return name.split('').map((char, index) => index % 2 === 0 ? char : '*').join('');
  };

  const handleReject = async (bidId, bidderName) => {
    if (window.confirm(`Bạn có chắc muốn từ chối người ra giá "${bidderName}"?`)) {
      try {
        await bidService.rejectBid(bidId);
        refreshBidHistory();
      } catch (error) {
        alert(error.response?.data?.error || 'Lỗi khi từ chối');
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBids = bids.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bids.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <div className="text-center p-[20px] text-[var(--ph-paragraph)] italic"> Đang tải...</div>;
  if (error) return <div className="text-center p-[20px] text-[var(--ph-paragraph)] italic"> {error}</div>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[20px] pb-[10px] border-b-[2px] border-dashed border-[var(--ph-secondary)]">
        <h3 className="text-[1.1rem] font-bold text-[var(--ph-headline)] m-0"> Diễn biến ({bids.length})</h3>
      </div>

      {bids.length === 0 ? (
        <div className="text-center p-[30px] bg-[#f9f9f9] rounded-[8px] border-[2px] border-dashed border-[var(--ph-secondary)] text-[var(--ph-paragraph)]">Chưa có lượt đấu giá nào.</div>
      ) : (
        <>
          <div className="flex flex-col gap-[12px]">
            {currentBids.map((bid, index) => {
              const realRank = indexOfFirstItem + index + 1;
              const displayName = maskName(bid.full_name || bid.username);
              
              // Xử lý Rank Badge styles
              let rankBadgeClass = "bg-[#e0e0e0] text-[var(--ph-paragraph)] border-[var(--ph-stroke)]";
              if (realRank === 1) rankBadgeClass = "bg-[#ffd700] text-[#5a4a00] border-[#d4b106]";
              else if (realRank === 2) rankBadgeClass = "bg-[#c0c0c0] text-[#4a4a4a] border-[#a0a0a0]";
              else if (realRank === 3) rankBadgeClass = "bg-[#cd7f32] text-[#5a3a1a] border-[#a05a20]";

              // Xử lý Bid Item styles (Top 1)
              let bidItemClass = "bg-[#f8f9fa] border-[#e0e0e0]";
              let bidAmountClass = "text-[var(--ph-headline)] text-[1rem]";
              
              if (realRank === 1) {
                  bidItemClass = "bg-[#fff5f5] border-[2px] border-[var(--ph-tertiary)] shadow-[4px_4px_0px_rgba(239,69,101,0.15)] scale-[1.01]";
                  bidAmountClass = "text-[var(--ph-tertiary)] text-[1.1rem]";
              } else {
                  bidItemClass += " border";
              }

              return (
                <div key={bid.id} className={`flex justify-between items-center p-[12px] rounded-[8px] transition-transform duration-200 max-[480px]:p-[10px] ${bidItemClass}`}>
                  <div className="flex items-center gap-[12px]">
                    <div className={`w-[28px] h-[28px] rounded-full font-bold text-[0.85rem] flex items-center justify-center border ${rankBadgeClass}`}>
                      {realRank}
                    </div>
                    <div className="flex flex-col">
                      <span 
                        className={`font-bold text-[var(--ph-headline)] text-[0.95rem] max-[480px]:text-[0.85rem] ${isSeller ? 'cursor-pointer underline' : ''}`}
                        onClick={() => isSeller && setSelectedBidder({id: bid.bidder_id, name: bid.full_name || bid.username})}
                        title={isSeller ? "Xem đánh giá người này" : ""}
                      >
                        {displayName}
                        {realRank === 1 && <span className="ml-1"> 👑</span>}
                      </span>
                      <span className="text-[0.75rem] text-[var(--ph-paragraph)]">{new Date(bid.time).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <div className={`font-extrabold max-[480px]:text-[0.9rem] ${bidAmountClass}`}>
                      {formatPriceVN(bid.amount)}
                    </div>
                    {isSeller && realRank === 1 && (
                      <button
                        onClick={() => handleReject(bid.id, bid.full_name || bid.username)}
                        className="bg-[#ff4d4f] text-white border-none px-[8px] py-[4px] rounded-[4px] cursor-pointer text-[12px]"
                      >
                        Từ chối
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- THANH PHÂN TRANG (PAGINATION) --- */}
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={paginate} 
          />
        </>
      )}

      {/* Modal Review */}
      {selectedBidder && (
        <UserReviewsModal 
            userId={selectedBidder.id} 
            userName={selectedBidder.name}
            onClose={() => setSelectedBidder(null)} 
        />
      )}
    </div>
  );
};

export default BidHistory;
