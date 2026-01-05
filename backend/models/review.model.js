import { db } from '../utils/db.js';

export const ReviewModel = {
    // Thêm đánh giá mới
    add: async (review) => {
        // Sử dụng transaction để đảm bảo tính nhất quán dữ liệu giữa bảng ratings và users
        return db.transaction(async (trx) => {
            // 1. Thêm rating vào bảng ratings
            const [newReview] = await trx('ratings').insert(review).returning('*');

            // 2. Cập nhật cache rating_positive/rating_negative trong bảng users
            // Xử lý cả trường hợp score là số hoặc chuỗi
            const score = String(review.score);
            
            if (score === '1' || score === '+1') {
                await trx('users')
                    .where('id', review.to_user_id)
                    .increment('rating_positive', 1);
            } else if (score === '-1') {
                await trx('users')
                    .where('id', review.to_user_id)
                    .increment('rating_negative', 1);
            }

            return newReview;
        });
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
        // Lấy từ cache trong bảng users để tối ưu hiệu năng
        // (Thay vì phải count lại từ bảng ratings mỗi lần gọi)
        const user = await db('users')
            .where('id', userId)
            .select('rating_positive', 'rating_negative')
            .first();
            
        if (!user) return { total: 0, likes: 0, dislikes: 0 };
        
        const likes = user.rating_positive || 0;
        const dislikes = user.rating_negative || 0;
        
        return {
            total: likes + dislikes,
            likes: likes,
            dislikes: dislikes
        };
    }
};
