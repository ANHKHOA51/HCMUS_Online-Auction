import express from 'express';
import productController from '../controllers/product.controller.js';


const router = express.Router();

// Route order matters! Specific routes must come before /:id
router.get('/categories/all', productController.getAllCategories);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductDetail);
router.get('/:id/bids', productController.getProductBids);


export default router;
