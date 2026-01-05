import React, { useState, useEffect } from 'react';
import { reviewService } from '../../../services/review';
import { FaThumbsUp, FaThumbsDown, FaQuoteLeft } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';

const ReviewsTab = () => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ like_count: 0, dislike_count: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reviewsData, statsData] = await Promise.all([
                    reviewService.getUserReviews(),
                    reviewService.getUserStats()
                ]);
                setReviews(reviewsData || []);
                setStats(statsData || { like_count: 0, dislike_count: 0 });
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-[var(--color-gray)] font-bold">Đang tải đánh giá...</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* --- STATS CARD --- */}
            <div className="bg-[var(--color-white)] rounded-xl border-2 border-[var(--color-dark)] shadow-[6px_6px_0px_var(--color-dark)] p-6 flex justify-around items-center">
                <div className="text-center">
                    <div className="text-sm font-bold text-[var(--color-gray)] uppercase tracking-wider mb-1">Hài lòng</div>
                    <div className="text-4xl font-black text-[#00b894] flex items-center justify-center gap-2">
                        <FaThumbsUp /> {stats.like_count}
                    </div>
                </div>
                <div className="w-[2px] h-12 bg-[var(--color-dark)] opacity-10"></div>
                <div className="text-center">
                    <div className="text-sm font-bold text-[var(--color-gray)] uppercase tracking-wider mb-1">Không hài lòng</div>
                    <div className="text-4xl font-black text-[var(--color-secondary)] flex items-center justify-center gap-2">
                        <FaThumbsDown /> {stats.dislike_count}
                    </div>
                </div>
            </div>

            {/* --- REVIEWS LIST --- */}
            <div className="bg-[var(--color-white)] rounded-xl border-2 border-[var(--color-dark)] overflow-hidden">
                <div className="p-4 border-b-2 border-[var(--color-dark)] bg-gray-50">
                    <h3 className="font-black text-lg text-[var(--color-dark)] uppercase">
                        Lịch sử đánh giá ({reviews.length})
                    </h3>
                </div>
                
                {reviews.length === 0 ? (
                    <div className="p-8 text-center text-[var(--color-gray)]">Chưa có đánh giá nào.</div>
                ) : (
                    <div className="divide-y-2 divide-[var(--color-light)]">
                        {reviews.map((review) => (
                            <div key={review.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    {/* Avatar / Icon */}
                                    <div className="mt-1">
                                        {review.score === 1 ? (
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
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-[var(--color-dark)] text-sm">
                                                {review.reviewer_name || 'Người dùng ẩn danh'}
                                                <span className="font-normal text-[var(--color-gray)] ml-2">
                                                    đã đánh giá sản phẩm
                                                </span>
                                                <span className="font-bold text-[var(--color-primary)] ml-1">
                                                    {review.product_name}
                                                </span>
                                            </div>
                                            <div className="text-xs font-medium text-[var(--color-gray)] flex items-center gap-1 bg-[var(--color-light)] px-2 py-1 rounded">
                                                <BiTime />
                                                {new Date(review.created_at).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>

                                        <div className="relative bg-[var(--color-light)]/30 p-3 rounded-lg border border-[var(--color-light)]">
                                            <FaQuoteLeft className="absolute top-2 left-2 text-[var(--color-dark)] opacity-10 text-xl" />
                                            <p className="text-sm text-[var(--color-dark)] relative z-10 pl-4 italic">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsTab;
