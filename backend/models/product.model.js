import { db } from '../utils/db.js';

// 1. Helper Function: Tạo query cơ bản để tái sử dụng
// Giúp code gọn gàng, sửa 1 chỗ cập nhật mọi chỗ
const createBaseQuery = (userId = null) => {
    let query = db('products as p')
        .select(
            'p.id',
            'p.name',
            'p.description',
            'p.starting_price',
            'p.current_price',
            'p.buy_now_price',
            'p.images',
            'p.start_time',
            'p.end_time',
            'p.status',
            'p.category_id',
            'p.created_at',
            'p.seller_id',
            db.raw('u.full_name as seller_name'),
            db.raw('w.full_name as winner_name'),
            db.raw('(SELECT COUNT(*) FROM bids WHERE bids.product_id = p.id) as bid_count')
        )
        .join('users as u', 'p.seller_id', 'u.id')
        .leftJoin('users as w', 'p.winner_id', 'w.id');

    // 2. Logic Check Watchlist (Yêu cầu mới của bạn)
    if (userId) {
        // Nếu có userId, kiểm tra trong bảng watch_lists
        query.select(
            db.raw(
                'EXISTS(SELECT 1 FROM watch_lists wl WHERE wl.product_id = p.id AND wl.user_id = ?) as is_favorite',
                [userId]
            )
        );
    } else {
        // Nếu không có userId, mặc định là false
        query.select(db.raw('false as is_favorite'));
    }

    return query;
};

export const ProductModel = {
    // Thêm tham số userId vào đây (mặc định null nếu khách vãng lai)
    getAllProducts: async (queryParams, userId = null) => {
        try {
            const { category_id, sort = 'newest', search } = queryParams || {};

            // Sử dụng Base Query đã tạo ở trên
            let query = createBaseQuery(userId).where('p.status', 'active');

            if (category_id) {
                query = query.where('p.category_id', category_id);
            }

            let hasSearch = false;
            if (search) {
                query = query
                    .whereRaw(`p.search_vector @@ plainto_tsquery('simple', ?)`, [search])
                    .select(
                        db.raw(`ts_rank(p.search_vector, plainto_tsquery('simple', ?)) as relevance`, [search])
                    );
                hasSearch = true;
            }

            // Xử lý Sort
            switch (sort) {
                case 'ending':
                    query = query.orderBy('p.end_time', 'asc');
                    break;
                case 'price_low':
                    query = query.orderBy('p.current_price', 'asc');
                    break;
                case 'price_high':
                    query = query.orderBy('p.current_price', 'desc');
                    break;
                default: // newest
                     // Nếu có search mà không sort cụ thể, ưu tiên độ liên quan (relevance)
                    if (hasSearch && sort === 'newest') {
                         query = query.orderBy('relevance', 'desc');
                    } else {
                         query = query.orderBy('p.created_at', 'desc');
                    }
            }

            query = query.limit(50).timeout(5000);

            const result = await query;
            console.log('📝 Query result sample:', result[0] ? Object.keys(result[0]) : 'empty');
            return result;
        } catch (error) {
            console.error('Model error:', error.message);
            throw error;
        }
    },

    getProductDetail: async (id, userId = null) => {
        try {
            // Tận dụng createBaseQuery để lấy thông tin cơ bản + is_favorite
            const product = await createBaseQuery(userId)
                .select(
                    'c.name as category_name',
                    'u.email as seller_email',
                    'u.rating_positive',
                    'u.rating_negative',
                    'u.avatar_url as seller_avatar'
                )
                .join('categories as c', 'p.category_id', 'c.id')
                .where('p.id', id)
                .first();

            if (!product) {
                return { product: null };
            }

            // (Giữ nguyên logic lấy bidder, faqs, related...)
            let highestBidder = null;
            if (product.winner_id) {
                highestBidder = await db('users').where('id', product.winner_id).first();
            }

            const faqs = await db('questions_answers as qa')
                .select('qa.*', 'u1.full_name as user_name', 'u2.full_name as seller_name')
                .join('users as u1', 'qa.user_id', 'u1.id')
                .leftJoin('users as u2', 'qa.answered_by', 'u2.id')
                .where('qa.product_id', id)
                .orderBy('qa.created_at', 'desc');

            // Related products cũng nên check is_favorite nếu được (tùy chọn)
            const relatedProducts = await createBaseQuery(userId)
                .where('p.category_id', product.category_id)
                .whereNot('p.id', id)
                .where('p.status', 'active')
                .orderBy('p.created_at', 'desc')
                .limit(5);

            return { product, highestBidder, faqs, relatedProducts };
        } catch (error) {
            console.error('Error in getProductDetail:', error);
            throw error;
        }
    },

    getProductBids: async (id) => {
        // Hàm này đơn giản, giữ nguyên
        return db('bids as b')
            .select('b.id', 'b.bid_amount', 'b.bid_time', 'u.id as bidder_id', 'u.full_name as bidder_name', 'u.username')
            .join('users as u', 'b.bidder_id', 'u.id')
            .where('b.product_id', id)
            .orderBy('b.bid_time', 'desc');
    },

    // Refactor 3 hàm Top thành gọn hơn, có hỗ trợ userId
    findTopClosing: (userId = null) => {
        return createBaseQuery(userId)
            //.where('status', 'active') // Uncomment nếu cần
            .orderBy('p.end_time', 'asc')
            .limit(5);
    },

    findTopBidding: (userId = null) => {
        return createBaseQuery(userId)
            .orderBy('bid_count', 'desc')
            .limit(5);
    },

    findTopPricing: (userId = null) => {
        return createBaseQuery(userId)
            .orderBy('p.current_price', 'desc')
            .limit(5);
    }
};

export default ProductModel;
