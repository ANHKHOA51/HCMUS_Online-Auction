import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { FaTimes, FaThumbsUp, FaThumbsDown, FaQuoteLeft } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';

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

    // --- HAPPY HUES COLORS ---
    const colors = {
        bg: 'var(--color-white)',
        text: 'var(--color-dark)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        border: 'var(--color-dark)',
        light: 'var(--color-light)',
        gray: 'var(--color-gray)',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn" onClick={onClose}>
            <div 
                className="w-full max-w-3xl max-h-[90vh] bg-white rounded-xl border-2 border-[var(--color-dark)] shadow-[8px_8px_0px_var(--color-dark)] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="p-4 border-b-2 border-[var(--color-dark)] flex justify-between items-center bg-gray-50">
                    <h2 className="font-black text-xl text-[var(--color-dark)] uppercase flex items-center gap-2">
                        Đánh giá của <span className="text-[var(--color-primary)]">{userName}</span>
                    </h2>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-[var(--color-dark)] hover:bg-[var(--color-secondary)] hover:text-white transition-colors cursor-pointer"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center py-10 font-bold text-[var(--color-gray)]">Đang tải...</div>
                    ) : error ? (
                        <div className="text-center py-10 font-bold text-[var(--color-secondary)]">{error}</div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {/* STATS */}
                            <div className="bg-[var(--color-white)] rounded-xl border-2 border-[var(--color-dark)] p-4 flex justify-around items-center shadow-sm">
                                <div className="text-center">
                                    <div className="text-xs font-bold text-[var(--color-gray)] uppercase tracking-wider mb-1">Hài lòng</div>
                                    <div className="text-3xl font-black text-[#00b894] flex items-center justify-center gap-2">
                                        <FaThumbsUp /> {stats.likes}
                                    </div>
                                </div>
                                <div className="w-[2px] h-10 bg-[var(--color-dark)] opacity-10"></div>
                                <div className="text-center">
                                    <div className="text-xs font-bold text-[var(--color-gray)] uppercase tracking-wider mb-1">Không hài lòng</div>
                                    <div className="text-3xl font-black text-[var(--color-secondary)] flex items-center justify-center gap-2">
                                        <FaThumbsDown /> {stats.dislikes}
                                    </div>
                                </div>
                            </div>

                            {/* LIST */}
                            <div className="space-y-4">
                                {reviews.length === 0 ? (
                                    <div className="text-center py-8 text-[var(--color-gray)] italic border-2 border-dashed border-[var(--color-dark)] rounded-xl">
                                        Chưa có đánh giá nào.
                                    </div>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.id} className="bg-white border-2 border-[var(--color-dark)] rounded-lg p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_var(--color-dark)] transition-all">
                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div className="mt-1 flex-shrink-0">
                                                    {review.score === 1 || review.score === '+1' ? (
                                                        <div className="w-10 h-10 rounded-full bg-[#00b894]/10 text-[#00b894] flex items-center justify-center border-2 border-[#00b894]">
                                                            <FaThumbsUp />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex items-center justify-center border-2 border-[var(--color-secondary)]">
                                                            <FaThumbsDown />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="text-sm">
                                                            <span className="font-bold text-[var(--color-dark)]">
                                                                {review.reviewer_name || review.reviewer_username || 'Người dùng ẩn danh'}
                                                            </span>
                                                            <span className="text-[var(--color-gray)] mx-1">đã đánh giá</span>
                                                        </div>
                                                        <div className="text-xs font-medium text-[var(--color-gray)] flex items-center gap-1 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                                                            <BiTime />
                                                            {new Date(review.created_at).toLocaleDateString('vi-VN')}
                                                        </div>
                                                    </div>

                                                    <div className="relative bg-gray-50 p-3 rounded-lg border border-gray-200 mb-2">
                                                        <FaQuoteLeft className="absolute top-2 left-2 text-gray-300 text-xl" />
                                                        <p className="text-sm text-[var(--color-dark)] relative z-10 pl-5 italic break-words">
                                                            "{review.comment}"
                                                        </p>
                                                    </div>

                                                    <div className="text-xs text-[var(--color-gray)] truncate">
                                                        Sản phẩm: <span className="font-bold text-[var(--color-primary)]">{review.product_name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserReviewsModal;
