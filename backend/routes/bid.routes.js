import express from 'express';
import authMiddleware, { verifyBidderEligibility } from '../middlewares/auth.middleware.js';
const router = express.Router();
import * as bidService from '../services/bid.service.js';
import bidModel from '../models/bid.model.js';


// GET lịch sử bid của sản phẩm
router.get('/:productId/history', async (req, res) => {
    try {
        const { productId } = req.params;
        const bids = await bidModel.getByProductId(productId);
        res.json({ success: true, data: bids });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi lấy lịch sử' });
    }
});

router.post('/:id/bid', authMiddleware, verifyBidderEligibility, async (req, res) => {
    try {
        const { id } = req.params;
        const { price } = req.body;
        const userId = req.user.id;

        // Gọi Service
        await bidService.placeBid(userId, id, parseInt(price));

        res.json({ success: true, message: 'Ra giá thành công!' });

    } catch (err) {
        // Xử lý lỗi từ Service ném ra
        console.error(err);
        const statusCode = err.message.includes('Sản phẩm') || err.message.includes('Giá') ? 400 : 500;
        res.status(statusCode).json({ error: err.message });
    }
});

export default router;
