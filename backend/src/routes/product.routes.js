import express from 'express';
import productController from '../controllers/product.controller.js';


const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductDetail);
router.get('/:id/bids', productController.getProductBids);
router.get('/categories/all', productController.getAllCategories);


export default router;
