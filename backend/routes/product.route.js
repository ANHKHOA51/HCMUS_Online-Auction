import express from 'express';
import productModel from '../models/product.model.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
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
        const result = await productModel.getAllProducts(req.query, userId);
        console.log('Found', result.data.length, 'products');
        res.json({ success: true, ...result }); // { success: true, data: [...], pagination: {...} }
    } catch (error) {
        console.error('Error fetching products:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- Seller Routes ---

// Lấy danh sách sản phẩm đang đăng bán (Active)
router.get('/seller/active', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const products = await productModel.findBySellerId(userId, 'active');
        res.json({ success: true, data: products });
    } catch (error) {
        console.error('Error fetching active products:', error);
        res.status(500).json({ success: false, error: 'Lỗi server' });
    }
});

// Lấy danh sách sản phẩm đã có người thắng (Sold)
router.get('/seller/sold', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const products = await productModel.findBySellerId(userId, 'sold');
        res.json({ success: true, data: products });
    } catch (error) {
        console.error('Error fetching sold products:', error);
        res.status(500).json({ success: false, error: 'Lỗi server' });
    }
});

// Huỷ giao dịch (Cancel Transaction)
router.post('/:id/cancel', auth, async (req, res) => {
    try {
        const productId = req.params.id;
        const sellerId = req.user.id;
        
        await productModel.cancelTransaction(productId, sellerId);
        
        res.json({ success: true, message: 'Đã huỷ giao dịch thành công' });
    } catch (error) {
        console.error('Error cancelling transaction:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- End Seller Routes ---

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

router.post('/add', authMiddleware, async (req, res) => {
    try {
        req.body.seller_id = req.user.id;
        const result = await productModel.addProduct(req.body);
        const dirpath = path.join('static', 'images', 'products', result[0].id.toString());
        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath, { recursive: true });
        }

        if (req.body.images) {
            req.body.images.forEach(function (item, idx) {
                const oldpath = path.join('static', 'temp', item);

                const newpath = path.join(dirpath, item);
                fs.copyFileSync(oldpath, newpath);
                fs.unlinkSync(oldpath);
            });
        }
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, error: error.message });
    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/temp/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', authMiddleware, upload.array('photos', 12), async (req, res) => {
    try {
        res.status(200).json({ success: true, files: req.files });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ success: false, error: error.message });
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await productModel.delete(id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, error: error.message });
    }
})

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

router.patch('/:id/description', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const userId = req.user.id;

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        if (product.seller_id !== userId) {
            return res.status(403).json({ success: false, error: 'Unauthorized: Only seller can edit product' });
        }

        await productModel.appendDescription(id, description);
        // await sendDescriptionMail(product.email, product.name);
        res.json({ success: true, message: 'Description updated successfully' });
    } catch (error) {
        console.error('Error appending description:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
export default router;
