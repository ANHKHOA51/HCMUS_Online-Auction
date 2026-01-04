import React, { useState, useEffect } from 'react';
import { formatPriceVN } from '../utils/formatCurrency';
import { getRelativeTime } from '../utils/timeUtil';
import { useBidHistory } from '../hooks/useBidHistory';
import './BidHistory.css';

const BidHistory = ({ productId }) => {
  const { bidHistory, isLoading, error } = useBidHistory(productId);
  // --- STATE CHO PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số lượt đấu giá trên mỗi trang


  const bids = bidHistory;

  const maskName = (name) => {
    if (!name) return 'Ẩn danh';
    if (name.length <= 3) return name;
    return name.substring(0, 3) + '****';
  };

  // --- LOGIC TÍNH TOÁN TRANG ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBids = bids.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bids.length / itemsPerPage);

  // Hàm chuyển trang
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
              // Tính thứ hạng thực tế (cộng dồn theo trang)
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
                  <div className="bid-amount">
                    {formatPriceVN(bid.amount)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- THANH PHÂN TRANG (PAGINATION) --- */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="page-btn prev"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>

              {/* Render số trang */}
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="page-btn next"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BidHistory;
