import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaTimes } from 'react-icons/fa';
import axiosInstance from '../../../services/axiosInstance';
import './ReviewModal.css';

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
            await axiosInstance.post(`/products/${product.id}/feedback`, {
                score: rating === 1 ? '+1' : '-1',
                comment
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}><FaTimes /></button>
                
                <h3>Đánh giá người bán</h3>
                <p className="product-name">Sản phẩm: <strong>{product.name}</strong></p>
                <p className="seller-name">Người bán: {product.seller_name}</p>

                <form onSubmit={handleSubmit}>
                    <div className="rating-options">
                        <button
                            type="button"
                            className={`rating-btn like ${rating === 1 ? 'active' : ''}`}
                            onClick={() => setRating(1)}
                        >
                            <FaThumbsUp /> Hài lòng (+1)
                        </button>
                        <button
                            type="button"
                            className={`rating-btn dislike ${rating === -1 ? 'active' : ''}`}
                            onClick={() => setRating(-1)}
                        >
                            <FaThumbsDown /> Không hài lòng (-1)
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Nhận xét của bạn:</label>
                        <textarea
                            className="review-textarea"
                            rows="4"
                            placeholder="Chia sẻ trải nghiệm của bạn về người bán này..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="submit-review-btn" disabled={loading}>
                        {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
