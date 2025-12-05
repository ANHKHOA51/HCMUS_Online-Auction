import express from 'express';
import productModel from '../models/product.model.js';

const router = express.Router();

router.get('/top/closing', async (req, res) => {
    try {
        const rows = await productModel.findTopClosing();
        res.json({ success: true, data: rows });;
    } catch (err) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

router.get('/top/bidding', async (req, res) => {
    try {
        const rows = await productModel.findTopBidding();
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

router.get('/top/pricing', async (req, res) => {
    try {
        const rows = await productModel.findTopPricing();
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

router.get('/', async (req, res) => {
    try {
        console.log('getAllProducts called with query:', req.query);
        // truyền nguyên req.query vào service để giữ nguyên behavior
        const rows = await productModel.getAllProducts(req.query);
        console.log('Found', rows.length, 'products');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await productModel.getProductDetail(id);

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

router.post('/:id/watchlist', async (req, res) => {
    try {
      const userId = req.user.id; // Lấy từ token (auth middleware)
      const productId = req.params.id;

      // 1. Kiểm tra xem đã thích chưa
      const existing = await watchListModel.hasWatched(userId, productId);

      if (existing) {
        // 2a. Có rồi -> Xóa (Unlike)
        await watchListModel.remove(userId, productId);
        return res.json({ message: 'Đã xóa khỏi yêu thích', isWatched: false });
      } else {
        // 2b. Chưa có -> Thêm (Like)
        await watchListModel.add(userId, productId);
        return res.json({ message: 'Đã thêm vào yêu thích', isWatched: true });
      }

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Lỗi server' });
    }
  });

export default router;
