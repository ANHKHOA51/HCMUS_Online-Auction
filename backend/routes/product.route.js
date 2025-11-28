import express from 'express';
import productController from '../controllers/product.controller.js';

const router = express.Router();


router.get('/top/closing', productController.topClosing);
router.get('/top/bidding', productController.topBidding);
router.get('/top/pricing', productController.topPricing);


// Product routes (specific routes FIRST)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductDetail);
router.get('/:id/bids', productController.getProductBids);

export default router;
