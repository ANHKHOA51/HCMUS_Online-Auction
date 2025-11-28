import express from 'express';
import categoryController from '../controllers/category.controller.js';
const router = express.Router();

// Route to get all categories
router.get('/all', categoryController.getAllCategories);

export default router;
