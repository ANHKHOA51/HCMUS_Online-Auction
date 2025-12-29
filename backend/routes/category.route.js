import express from 'express';
import categoryModel from '../models/category.model.js';
const router = express.Router();

// Route to get all categories
router.get('/all', async (req, res) => {
    try {
          const rows = await categoryModel.all();
          res.json({ success: true, data: rows });
        } catch (error) {
          console.error('Error fetching categories:', error);
          res.status(500).json({ success: false, error: error.message });
        }
});

// Route to get a category by ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const category = await categoryModel.findById(id);
        if (category) {
            res.json({ success: true, data: category });
        } else {
            res.status(404).json({ success: false, message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/add', async (req, res) => {
    const { name, description, parent_category_id } = req.body;
    console.log("Received category data:", req.body);
    try {
        const [id] = await categoryModel.create({ name, description, parent_category_id });
        res.json({ success: true, data: { id, name, description, parent_category_id } });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const { name, description, parent_category_id } = req.body;
    try {
        const updatedRows = await categoryModel.update(id, { name, description, parent_category_id });
        if (updatedRows) {
            res.json({ success: true, data: { id, name, description, parent_category_id } });
        } else {
            res.status(404).json({ success: false, message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
