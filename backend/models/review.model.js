import { db } from '../utils/db.js';

export const ReviewModel = {
    // Thêm đánh giá mới
    add: async (review) => {
        // review object: { from_user_id, to_user_id, product_id, score, comment }
        return db('ratings').insert(review).returning('*');
    },

    // Lấy danh sách đánh giá của một user (người này được đánh giá)
    getByUserId: async (userId) => {
        return db('ratings')
            .join('users', 'ratings.from_user_id', 'users.id')
            .join('products', 'ratings.product_id', 'products.id')
            .where('ratings.to_user_id', userId)
            .select(
                'ratings.*',
                'users.full_name as reviewer_name',
                'users.username as reviewer_username',
                'products.name as product_name'
            )
            .orderBy('ratings.created_at', 'desc');
    },

    // Kiểm tra xem user đã đánh giá sản phẩm này chưa
    hasReviewed: async (userId, productId) => {
        const result = await db('ratings')
            .where({
                from_user_id: userId,
                product_id: productId
            })
            .first();
        return !!result;
    },

    // Lấy thống kê đánh giá (số like, dislike)
    getStats: async (userId) => {
        // Lưu ý: score trong DB đang là varchar, cần xử lý cẩn thận
        // Giả sử lưu "+1" và "-1"
        const result = await db('ratings')
            .where('to_user_id', userId)
            .select(
                db.raw('COUNT(*) as total'),
                db.raw("SUM(CASE WHEN score = '+1' OR score = '1' THEN 1 ELSE 0 END) as likes"),
                db.raw("SUM(CASE WHEN score = '-1' THEN 1 ELSE 0 END) as dislikes")
            )
            .first();
        return result;
    }
};
