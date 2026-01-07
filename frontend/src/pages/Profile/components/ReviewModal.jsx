import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaTimes } from 'react-icons/fa';
import { reviewService } from '../../../services/review';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';

const ReviewModal = ({ product, onClose, onSuccess }) => {
    const [rating, setRating] = useState(null); // 1 or -1
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) {
            setError('Vui lòng chọn đánh giá (Like hoặc Dislike).');
            return;
        }
        if (!comment.trim()) {
            setError('Vui lòng nhập nhận xét.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await reviewService.addReview({
                to_user_id: product.seller_id,
                product_id: product.id,
                score: rating === 1 ? '+1' : '-1',
                comment
            });
            onSuccess && onSuccess();
            onClose && onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi gửi đánh giá.');
        } finally {
            setLoading(false);
        }
    };

    // --- HAPPY HUES COLORS ---
    const colors = {
        dark: '#094067',
        primary: '#3da9fc',
        secondary: '#ef4565', // Red
        success: '#3da9fc',   // Green/Blueish for success in this palette context, or use a custom green
        white: '#fffffe',
        gray: '#5f6c7b',
        bgInput: '#f4f6f8'
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div 
                className="bg-[var(--color-white)] w-full max-w-lg rounded-xl relative animate-in zoom-in duration-200 overflow-hidden"
                style={{ 
                    border: `4px solid ${colors.dark}`,
                    boxShadow: `8px 8px 0px ${colors.dark}`
                }}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b-2 bg-gray-50" style={{ borderColor: colors.dark }}>
                    <h3 className="text-xl font-black uppercase tracking-tight" style={{ color: colors.dark }}>
                        Đánh giá người bán
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-2xl hover:scale-110 transition-transform p-1 rounded border-2 border-transparent hover:border-current"
                        style={{ color: colors.dark }}
                    >
                        <FaTimes />
                    </button>
                </div>
                
                <div className="p-6">
                    {/* Info Product */}
                    <div className="mb-6 p-4 rounded-lg border-2 border-dashed bg-[#f9f9f9]" style={{ borderColor: colors.dark }}>
                        <p className="text-sm mb-1" style={{ color: colors.gray }}>Sản phẩm:</p>
                        <p className="font-black text-lg mb-2" style={{ color: colors.primary }}>{product.name}</p>
                        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: colors.dark }}>
                            <span>Người bán:</span>
                            <span className="bg-[var(--color-light)] px-2 py-0.5 rounded border border-[var(--color-dark)]">{product.seller_name}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Rating Options */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                className={`flex-1 py-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                                    rating === 1 
                                    ? 'translate-y-[2px] translate-x-[2px] shadow-none' 
                                    : 'hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-dark)]'
                                }`}
                                onClick={() => setRating(1)}
                                style={{ 
                                    backgroundColor: rating === 1 ? '#00b894' : colors.white, // Green / White
                                    borderColor: colors.dark,
                                    color: rating === 1 ? colors.white : colors.dark,
                                    boxShadow: rating === 1 ? 'none' : `4px 4px 0px ${colors.dark}`
                                }}
                            >
                                <FaThumbsUp size={24} />
                                <span>Hài lòng (+1)</span>
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                                    rating === -1 
                                    ? 'translate-y-[2px] translate-x-[2px] shadow-none' 
                                    : 'hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-dark)]'
                                }`}
                                onClick={() => setRating(-1)}
                                style={{ 
                                    backgroundColor: rating === -1 ? colors.secondary : colors.white, // Red / White
                                    borderColor: colors.dark,
                                    color: rating === -1 ? colors.white : colors.dark,
                                    boxShadow: rating === -1 ? 'none' : `4px 4px 0px ${colors.dark}`
                                }}
                            >
                                <FaThumbsDown size={24} />
                                <span>Không hài lòng (-1)</span>
                            </button>
                        </div>

                        {/* Comment Input */}
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase" style={{ color: colors.dark }}>Nhận xét của bạn:</label>
                            <textarea
                                className="w-full p-4 rounded-xl font-medium outline-none transition-all text-sm min-h-[120px]"
                                placeholder="Chia sẻ trải nghiệm của bạn về người bán này..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                style={{ 
                                    border: `2px solid ${colors.dark}`,
                                    backgroundColor: colors.bgInput,
                                    color: colors.dark
                                }}
                                onFocus={(e) => {
                                    e.target.style.backgroundColor = colors.white;
                                    e.target.style.boxShadow = `4px 4px 0px #90b4ce`; // Accent color shadow
                                }}
                                onBlur={(e) => {
                                    e.target.style.backgroundColor = colors.bgInput;
                                    e.target.style.boxShadow = 'none';
                                }}
                            ></textarea>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 text-sm font-bold p-3 rounded-lg border-2 bg-red-50 text-red-600" style={{ borderColor: colors.secondary }}>
                                <BiErrorCircle size={20} />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl font-black text-white text-lg border-2 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                            style={{ 
                                backgroundColor: colors.primary,
                                borderColor: colors.dark,
                                boxShadow: `4px 4px 0px ${colors.dark}`
                            }}
                        >
                            {loading ? (
                                <>⏳ Đang gửi...</>
                            ) : (
                                <>Gửi đánh giá <BiCheckCircle /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
