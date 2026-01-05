import React, { useState, useEffect } from 'react';
import { formatPriceVN } from '../utils/formatCurrency';
import { getRelativeTime } from '../utils/timeUtil';
import { useBidHistory } from '../hooks/useBidHistory';
import Pagination from './Pagination';
import { bidService } from '../services/bid';
import './BidHistory.css';

const BidHistory = ({ productId, isSeller }) => {
  const { bidHistory, isLoading, error, refreshBidHistory } = useBidHistory(productId);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const bids = bidHistory;

  const maskName = (name) => {
    if (!name) return 'Ẩn danh';
    if (name.length <= 3) return name;
    return name.substring(0, 3) + '****';
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

  if (isLoading) return <div className="bid-loading"> Đang tải...</div>;
  if (error) return <div className="bid-error"> {error}</div>;

  return (
    <div className="bid-history-container">
      <div className="bid-header">
        <h3 className="section-title"> Diễn biến ({bids.length})</h3>
      </div>

      {bids.length === 0 ? (
        <div className="no-bids">Chưa có lượt đấu giá nào.</div>
      ) : (
        <>
          <div className="bid-list">
            {currentBids.map((bid, index) => {
              const realRank = indexOfFirstItem + index + 1;

              return (
                <div key={bid.id} className={`bid-item ${realRank === 1 ? 'top-1' : ''}`}>
                  <div className="bid-user-info">
                    <div className={`rank-badge ${realRank <= 3 ? `rank-${realRank}` : ''}`}>
                      {realRank}
                    </div>
                    <div className="bidder-details">
                      <span className="bidder-name">
                        {maskName(bid.full_name || bid.username)}
                        {realRank === 1 && <span className="crown-icon"> 👑</span>}
                      </span>
                      <span className="bid-time">{new Date(bid.time).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                  <div className="bid-amount-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="bid-amount">
                      {formatPriceVN(bid.amount)}
                    </div>
                    {isSeller && realRank === 1 && (
                      <button
                        onClick={() => handleReject(bid.id, bid.full_name || bid.username)}
                        style={{
                          backgroundColor: '#ff4d4f', color: 'white', border: 'none',
                          padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                        }}
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
    </div>
  );
};

export default BidHistory;
