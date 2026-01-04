import { db } from '../utils/db.js';

export const CategoryModel = {
    // Lấy tất cả
    all: async () => {
        const categories = await db('categories').select('id', 'name', 'description').orderBy('name');
        return categories;
    },
    // Tìm theo ID
    findById: async (id) => {
        const category = await db('categories').select('id', 'name', 'description', 'parent_category_id').where({ id }).first();
        return category;
    },

    // Tạo mới
    create: async ({ name, description, parent_category_id }) => {
        const insertData = { name, description };
        if (parent_category_id) {
            insertData.parent_category_id = parent_category_id;
        }
        return db('categories').insert(insertData).returning('id');
    },
    // Cập nhật
    update: async (id, { name, description, parent_category_id }) => {
        const updateData = { name, description };
        if (parent_category_id) {
            updateData.parent_category_id = parent_category_id;
        } else {
            updateData.parent_category_id = null; // Xóa parent nếu không cung cấp
        }
        const updatedRows = await db('categories').where({ id }).update(updateData);
        return updatedRows;
    },

    delete: async (id) => {
        const deletedRows = await db('categories').where({ id }).del();
        return deletedRows;
    },

    hasProducts: async (id) => {
        const product = await db('products').where({ category_id: id }).first();
        return !!product;
    }
};

export default CategoryModel;
