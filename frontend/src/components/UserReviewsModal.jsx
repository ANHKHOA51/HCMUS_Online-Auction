import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { FaTimes } from 'react-icons/fa';
import '../pages/Profile/components/ReviewsTab.css'; // Reuse CSS
import './UserReviewsModal.css'; // Additional modal styles

const UserReviewsModal = ({ userId, userName, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ total: 0, likes: 0, dislikes: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get(`/users/${userId}/reviews`);
                setReviews(response.data.reviews);
                setStats(response.data.stats || { total: 0, likes: 0, dislikes: 0 });
            } catch (err) {
                console.error('Error fetching reviews:', err);
                setError('Không thể tải danh sách đánh giá.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchReviews();
        }
    }, [userId]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content reviews-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <FaTimes />
                </button>
                
                <h2 className="modal-title">
                    Đánh giá của {userName}
                </h2>

                {loading ? (
                    <div className="loading-spinner">Đang tải...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="reviews-tab"> {/* Reuse class for styling */}
                        {/* Stats Card */}
                        <div className="reviews-stats">
                            <div className="stat-item">
                                <div className="stat-label">Tổng cộng</div>
                                <div className="stat-value">{stats.total}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-label">Hài lòng</div>
                                <div className="stat-value success">
                                    {stats.likes}
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-label">Không hài lòng</div>
                                <div className="stat-value danger">
                                    {stats.dislikes}
                                </div>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="reviews-scroll-container">
                            {reviews.length === 0 ? (
                                <div className="empty-reviews">
                                    <p>Người dùng này chưa có đánh giá nào.</p>
                                </div>
                            ) : (
                                <div className="reviews-list">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="review-item">
                                            <div className="review-header">
                                                <div className="review-user-info">
                                                    {review.score === '+1' || review.score === '1' ? (
                                                        <span className="review-badge like">
                                                            Hài lòng (+1)
                                                        </span>
                                    ) : (
                                                        <span className="review-badge dislike">
                                                            Không hài lòng (-1)
                                                        </span>
                                    )}
                                                    <span className="review-author">
                                                        từ <strong>{review.reviewer_name || review.reviewer_username}</strong>
                                                    </span>
                                                </div>
                                                <small className="review-date">
                                                    {new Date(review.created_at).toLocaleDateString('vi-VN')}
                                                </small>
                                            </div>
                                            
                                            <div className="review-content">
                                                "{review.comment}"
                                            </div>
                                            
                                            <div className="review-footer">
                                                Sản phẩm: <span className="product-link">{review.product_name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserReviewsModal;
