import categoryModel from '../models/category.model.js';

export const CategoryController = {
  getAllCategories: async (req, res) => {
    try {
      const rows = await categoryModel.all();
      res.json({ success: true, data: rows });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

export default CategoryController;
