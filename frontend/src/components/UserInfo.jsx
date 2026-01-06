import React, { useState } from 'react';
// Đã xóa import './UserInfo.css';
import UserReviewsModal from './UserReviewsModal';

const UserInfo = ({ user, role, isHighestBidder = false }) => {
  const [showReviews, setShowReviews] = useState(false);

  if (!user) return null;

  const getRatingStars = (positive, negative) => {
    const total = positive + negative;
    if (total === 0) return 'Chưa có đánh giá';
    const percentage = (positive / total) * 100;
    return `${percentage.toFixed(0)}% (${positive}/${total})`;
  };

  return (
    <>
      <div className="bg-transparent border-none shadow-none p-0 w-full">
        <div className="flex gap-[15px] items-center min-w-0">
          <div className="shrink-0">
            <img 
              src={user.avatar || '/default-avatar.png'} 
              alt={'failed'} 
              className="w-[60px] h-[60px] rounded-[50%] object-cover border-[2px] border-solid border-[var(--pg-stroke,#094067)] bg-white block" 
            />
          </div>
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <h5 className="m-0 font-bold text-[18px] text-[var(--pg-headline,#094067)] whitespace-nowrap overflow-hidden text-ellipsis">
              {user.full_name || user.username}
            </h5>
            <p className="m-[2px_0_6px_0] text-[var(--pg-secondary,#90b4ce)] text-[13px] font-semibold uppercase tracking-[0.5px]">
              {role === 'seller' ? 'Người bán' : 'Người đặt giá cao nhất'}
            </p>
            <div>
              <span 
                className="inline-flex items-center bg-[var(--pg-warning,#ffd166)] text-[var(--pg-headline,#094067)] p-[4px_10px] rounded-[20px] text-[12px] font-bold border-[2px] border-solid border-[var(--pg-stroke,#094067)] shadow-[2px_2px_0_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-100 ease-linear cursor-pointer hover:-translate-y-[1px] hover:shadow-[2px_3px_0_rgba(0,0,0,0.15)] active:translate-y-[1px] active:shadow-[1px_1px_0_rgba(0,0,0,0.1)]" 
                onClick={() => setShowReviews(true)}
                title="Xem chi tiết đánh giá"
              >
                 {getRatingStars(user.rating_positive, user.rating_negative)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-[15px] pt-[15px] border-t-[2px] border-dashed border-[var(--pg-secondary,#90b4ce)] text-[14px] text-[var(--pg-paragraph,#5f6c7b)]">
          <p className="m-[5px_0] flex items-center gap-[8px] break-all">
            <strong className="text-[var(--pg-headline,#094067)] min-w-[70px]">Email:</strong> {user.email}
          </p>
          {user.phone && (
            <p className="m-[5px_0] flex items-center gap-[8px] break-all">
              <strong className="text-[var(--pg-headline,#094067)] min-w-[70px]">Điện thoại:</strong> {user.phone}
            </p>
          )}
        </div>
      </div>

      {showReviews && (
        <UserReviewsModal 
          userId={user.id} 
          userName={user.full_name || user.username}
          onClose={() => setShowReviews(false)} 
        />
      )}
    </>
  );
};

export default UserInfo;
