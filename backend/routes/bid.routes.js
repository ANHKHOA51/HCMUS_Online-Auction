import express from 'express';
import authMiddleware, { verifyBidderEligibility } from '../middlewares/auth.middleware.js';
const router = express.Router();
import * as bidService from '../services/bid.service.js';
import bidModel from '../models/bid.model.js';
import productModel from '../models/product.model.js';
import { db } from '../utils/db.js';

/**
 * GET lịch sử bid của sản phẩm
 * 
 * ⚠️ PROXY BIDDING: Tuyệt đối KHÔNG hiển thị max_auto_bid
 * Chỉ hiển thị bid_amount từ bảng bids (giá công khai)
 * 
 * Ví dụ:
 * - User A đặt Auto Bid max=5.000k
 * - Hệ thống lưu vào auto_bids (ẩn)
 * - Lịch sử hiển thị chỉ bid_amount (ví dụ 1.000k, 1.100k, 1.200k...)
 * - KHÔNG bao giờ lộ 5.000k
 */

router.get('/:productId/history', async (req, res) => {
    try {
        const { productId } = req.params;
        
        // Lấy lịch sử từ bảng bids (chỉ public bids)
        const bids = await bidModel.getByProductId(productId);

        if (!bids || bids.length === 0) {
            return res.json({ success: true, data: [] });
        }

        // Chỉ trả về thông tin công khai, KHÔNG hiển thị max_auto_bid
        const publicHistory = bids.map(bid => ({
            id: bid.id,
            bidder_id: bid.bidder_id,
            bidder_name: bid.full_name || bid.username,
            amount: bid.amount, // bid_amount từ bảng bids (công khai)
            time: bid.time,
            is_auto_bid: bid.is_auto_bid // Chỉ để người dùng biết bid này là auto hay manual
        }));

        res.json({ success: true, data: publicHistory });
    } catch (err) {
        console.error('History fetch error:', err);
        res.status(500).json({ error: 'Lỗi lấy lịch sử đấu giá' });
    }
});

router.post('/:id/bid', authMiddleware, verifyBidderEligibility, async (req, res) => {
    try {
        const { id } = req.params;
        const { price, isAutoBid } = req.body; // Receive isAutoBid flag
        const userId = req.user.id;

        // Call Service with proper parameters
        const result = await bidService.placeBid(userId, id, parseFloat(price), !!isAutoBid);

        res.json({ success: true, data: result });

    } catch (err) {
        console.error('Bid error:', err);
        const statusCode = err.message.includes('Sản phẩm') || err.message.includes('Giá') || err.message.includes('trần') ? 400 : 500;
        res.status(statusCode).json({ error: err.message });
    }
});

router.post('/reject/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const bid = await bidModel.findById(id);
        if (!bid) return res.status(404).json({ error: 'Bid not found' });

        const product = await productModel.findById(bid.product_id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        if (product.seller_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await bidModel.rejectBid(id, bid.product_id);

        // Fetch User Info for Email
        const { sendBidRejectedMail } = await import('../utils/mail.js'); // Dynamic import
        const db = (await import('../utils/db.js')).db;
        const rejectedUser = await db('users').where('id', bid.bidder_id).first();
        
        if (rejectedUser) {
            sendBidRejectedMail(rejectedUser.email, rejectedUser.full_name, product.name).catch(console.error);
        }

        res.json({ success: true, message: 'Rejected bidder successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
