import { ReviewModel } from '../models/review.model.js';
import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Thêm đánh giá mới (cần auth)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { to_user_id, product_id, score, comment } = req.body;
        const from_user_id = req.user.id;

        // Kiểm tra xem user đã đánh giá sản phẩm này chưa
        const hasReviewed = await ReviewModel.hasReviewed(from_user_id, product_id);
        if (hasReviewed) {
            return res.status(400).json({ ok: false, message: 'You have already reviewed this product.' });
        }

        const review = {
            from_user_id,
            to_user_id,
            product_id,
            score,
            comment
        };

        const insertedReviews = await ReviewModel.add(review);
        res.json({ ok: true, data: insertedReviews[0] });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ ok: false, message: 'Error adding review' });
    }
});

// Lấy danh sách đánh giá của một user
router.get('/user/reviews', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await ReviewModel.getByUserId(userId);
        res.json({ ok: true, data: reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ ok: false, message: 'Error fetching reviews' });
    }
});

// Lấy thống kê đánh giá của một user
router.get('/user/stats', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await ReviewModel.getStats(userId);
        res.json({ ok: true, data: stats });
    } catch (error) {
        console.error('Error fetching review stats:', error);
        res.status(500).json({ ok: false, message: 'Error fetching review stats' });
    }
});

export default router;
