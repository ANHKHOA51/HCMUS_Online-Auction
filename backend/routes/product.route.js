import express from 'express';
import productModel from '../models/product.model.js';
import { optionalAuth } from '../middlewares/optionalAuth.middleware.js';

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

export default router;
