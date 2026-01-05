import { db } from '../utils/db.js';

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
            console.error('Error getting product detail:', error);
            throw error;
        }
    },

    // Lấy danh sách sản phẩm user đang tham gia đấu giá
    getBiddingProducts: async (userId) => {
        try {
            // Lấy các sản phẩm mà user đã bid VÀ sản phẩm đó chưa kết thúc (status = 'active')
            // DISTINCT để tránh trùng lặp nếu user bid nhiều lần vào 1 sản phẩm
            const query = createBaseQuery(userId)
                .join('bids as b', 'p.id', 'b.product_id')
                .where('b.bidder_id', userId)
                .where('p.status', 'active')
                .distinct('p.id'); // Quan trọng: Chỉ lấy mỗi sản phẩm 1 lần

            return await query;
        } catch (error) {
            console.error('Error getting bidding products:', error);
            throw error;
        }
    },

    // Lấy danh sách sản phẩm user đã thắng
    getWonProducts: async (userId) => {
        try {
            const query = createBaseQuery(userId)
                .where('p.winner_id', userId)
                .where('p.status', 'sold');

            return await query;
        } catch (error) {
            console.error('Error getting won products:', error);
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
    },

    findByIdLock: (id, trx) => {
        return trx('products').where('id', id).forUpdate().first();
    },

    findById: (id) => {
        return db('products').where('id', id).first();
    },

    updatePrice: (id, newPrice, trx) => {
        return trx('products').where('id', id).update({ current_price: newPrice });
    },


    addProduct: async (productData) => {
        try {
            return db('products').insert(productData).returning('id');
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            return await db.transaction(async (trx) => {
                await trx('bids').where('product_id', id).del();
                await trx('questions_answers').where('product_id', id).del();
                await trx('watch_lists').where('product_id', id).del();
                await trx('bidder_requests').where('product_id', id).del();
                await trx('notifications').where('related_product_id', id).del();
                return await trx('products').where('id', id).del();
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    findBySellerId: async (sellerId, status) => {
        let query = createBaseQuery().where('p.seller_id', sellerId);

        if (status === 'active') {
            // Đang đăng & còn hạn
            query = query.where('p.status', 'active').andWhere('p.end_time', '>', new Date());
        } else if (status === 'sold') {
            // Đã có người thắng (status = sold HOẶC hết hạn mà có winner)
            query = query.where(function() {
                this.where('p.status', 'sold')
                    .orWhere(function() {
                        this.where('p.end_time', '<=', new Date())
                            .andWhereNotNull('p.winner_id');
                    });
            });
        }

        return query.orderBy('p.created_at', 'desc');
    },

    cancelTransaction: async (productId, sellerId) => {
        return db.transaction(async (trx) => {
            // 1. Check product
            const product = await trx('products').where('id', productId).first();
            if (!product) throw new Error('Product not found');
            if (product.seller_id !== sellerId) throw new Error('Unauthorized');
            if (!product.winner_id) throw new Error('No winner to cancel');

            // 2. Update status
            await trx('products')
                .where('id', productId)
                .update({ status: 'cancelled' });

            // 3. Auto rate -1
            const review = {
                from_user_id: sellerId,
                to_user_id: product.winner_id,
                product_id: productId,
                score: '-1',
                comment: 'Người thắng không thanh toán'
            };

            await trx('ratings').insert(review);

            // 4. Update user stats
            await trx('users')
                .where('id', product.winner_id)
                .increment('rating_negative', 1);

            return true;
        });
    },

    appendDescription: async (id, newContent) => {
        try {
            // Append with a break
            return await db('products')
                .where('id', id)
                .update({
                    description: db.raw("COALESCE(description, '') || ?", [newContent])
                });
        } catch (error) {
            console.error('Error appending description:', error);
            throw error;
        }
    },
};


export default ProductModel;
