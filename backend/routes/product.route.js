import express from 'express';
import productModel from '../models/product.model.js';
import  authMiddleware  from '../middlewares/auth.middleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
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

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const body = req.body;
        body.seller_id = req.user.id;
        console.log(body)
        const result = await productModel.addProduct(body);
        console.log(result)
        const dirpath = path.join('static', 'images', 'products', result[0].id.toString());
        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath, { recursive: true });
        }

        if (req.body.images) {
            req.body.images.forEach(function (item, idx) {
                const oldpath = path.join('static', 'temp', item);
                // let newfilename, thumbfilename;
                // if (idx === 0) {
                //     newfilename = 'main.jpg';
                //     thumbfilename = 'main_thumbs.jpg';
                // } else {
                //     newfilename = `${idx}.jpg`;
                //     thumbfilename = `${idx}_thumbs.jpg`;
                // }

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
    res.json({ success: true, files: req.files });
})

export default router;
