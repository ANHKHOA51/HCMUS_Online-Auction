import express from 'express';
import productModel from '../models/product.model.js';
import { optionalAuth } from '../middlewares/optionalAuth.middleware.js';
import auth from '../middlewares/auth.middleware.js';
import { ReviewModel } from '../models/review.model.js';

const router = express.Router();

router.get('/top/closing', optionalAuth, async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const rows = await productModel.findTopClosing(userId);
        res.json({ success: true, data: rows });;
    } catch (err) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

router.get('/top/bidding', optionalAuth, async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const rows = await productModel.findTopBidding(userId);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

router.get('/top/pricing', optionalAuth, async (req, res) => {
    try {

        const userId = req.user ? req.user.id : null;
        const rows = await productModel.findTopPricing(userId); 
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

router.get('/', optionalAuth, async (req, res) => {
    try {

        const userId = req.user ? req.user.id : null;
        const rows = await productModel.getAllProducts(req.query, userId);
        console.log('Found', rows.length, 'products');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const { id } = req.params;
        const data = await productModel.getProductDetail(id, userId);

        if (!data.product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.json({
            success: true,
            data: {
                product: data.product,
                highestBidder: data.highestBidder,
                faqs: data.faqs,
                relatedProducts: data.relatedProducts
            }
        });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id/bids', async (req, res) => {
    try {
        const { id } = req.params;
        const rows = await productModel.getProductBids(id);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching bids:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Đánh giá người bán (chỉ dành cho người thắng cuộc)
router.post('/:id/feedback', auth, async (req, res) => {
    try {
        const productId = req.params.id;
        const { score, comment } = req.body;
        const fromUserId = req.user.id;

        // 1. Kiểm tra sản phẩm có tồn tại và đã kết thúc chưa
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Sản phẩm không tồn tại' });
        }

        // 2. Kiểm tra người dùng có phải là người thắng cuộc không
        if (product.winner_id !== fromUserId) {
            return res.status(403).json({ success: false, error: 'Bạn không phải là người thắng cuộc của sản phẩm này' });
        }

        // 3. Kiểm tra xem đã đánh giá chưa
        const hasReviewed = await ReviewModel.hasReviewed(fromUserId, productId);
        if (hasReviewed) {
            return res.status(400).json({ success: false, error: 'Bạn đã đánh giá sản phẩm này rồi' });
        }

        // 4. Thêm đánh giá
        // Người được đánh giá là người bán (seller_id)
        const review = {
            from_user_id: fromUserId,
            to_user_id: product.seller_id,
            product_id: productId,
            score: score, // '+1' hoặc '-1'
            comment: comment
        };

        await ReviewModel.add(review);

        res.json({ success: true, message: 'Đánh giá thành công' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ success: false, error: 'Lỗi server' });
    }
});

export default router;
