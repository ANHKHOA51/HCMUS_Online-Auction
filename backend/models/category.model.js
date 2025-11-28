import { db } from '../configs/db.js';

export const CategoryModel = {
    // Lấy tất cả
    all: async () =>
    {
        const categories = await db('categories').select('id', 'name', 'description').orderBy('name');
        return categories;
    },
};

export default CategoryModel;
