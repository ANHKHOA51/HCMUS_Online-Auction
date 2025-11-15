import React from 'react';
import './UserInfo.css';

const UserInfo = ({ user, role, isHighestBidder = false }) => {
  if (!user) return null;

  const getRatingStars = (positive, negative) => {
    const total = positive + negative;
    if (total === 0) return 'Chưa có đánh giá';
    const percentage = (positive / total) * 100;
    return `${percentage.toFixed(0)}% (${positive}/${total})`;
  };

  return (
    <div className="user-info-card">
      <div className="user-header">
        <div className="user-avatar">
          <img src={user.avatar || '/default-avatar.png'} alt={user.full_name} />
        </div>
        <div className="user-details">
          <h5 className="user-name">{user.full_name || user.username}</h5>
          <p className="user-role">{role === 'seller' ? '👤 Người bán' : '🏆 Người đặt giá cao nhất'}</p>
          <div className="user-rating">
            <span className="rating-badge">
              ⭐ {getRatingStars(user.rating_positive, user.rating_negative)}
            </span>
          </div>
        </div>
      </div>
      <div className="user-contact">
        <p><strong>Email:</strong> {user.email}</p>
        {user.phone && <p><strong>Điện thoại:</strong> {user.phone}</p>}
      </div>
    </div>
  );
};

export default UserInfo;
