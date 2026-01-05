import { db } from '../utils/db.js';
import { CategoryModel } from './category.model.js';

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
            'p.winner_id',
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
                // Lấy danh sách category con (nếu có) để filter luôn
                try {
                    const categoryIds = await CategoryModel.getChildrenIds(category_id);
                    console.log(`Filtering products for category ${category_id}. Including children:`, categoryIds);
                    query = query.whereIn('p.category_id', categoryIds);
                } catch (err) {
                    console.error('Error getting category children:', err);
                    // Fallback to just the category itself if error
                    query = query.where('p.category_id', category_id);
                }
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

            // --- Pagination ---
            const page = parseInt(queryParams.page) || 1;
            const limit = parseInt(queryParams.limit) || 10;
            const offset = (page - 1) * limit;

            // Clone query to get total count (without limit/offset)
            const countQuery = query.clone().clearSelect().clearOrder().count('* as total').first();
            
            // Apply pagination
            query = query.limit(limit).offset(offset);

            // Execute both
            const [rows, countResult] = await Promise.all([query, countQuery]);
            const total = parseInt(countResult?.total || 0);

            // --- Post-processing (Masking) ---
            const maskName = (name) => {
                if (!name) return null;
                return name.split('').map((char, index) => index % 2 === 0 ? char : '*').join('');
            };

            const data = rows.map(row => ({
                ...row,
                winner_name: maskName(row.winner_name)
            }));

            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Model error:', error.message);
            throw error;
        }
    },

    getProductDetail: async (id, userId = null) => {
        try {
            // Helper masking
            const maskName = (name) => {
                if (!name) return null;
                return name.split('').map((char, index) => index % 2 === 0 ? char : '*').join('');
            };

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
            
            const isSeller = userId && String(userId) === String(product.seller_id);

            // Mask winner name in product object IF NOT SELLER
            if (product.winner_name && !isSeller) {
                product.winner_name = maskName(product.winner_name);
            }

            // (Giữ nguyên logic lấy bidder, faqs, related...)
            let highestBidder = null;
            if (product.winner_id) {
                highestBidder = await db('users').where('id', product.winner_id).first();
                
                // Mask highest bidder name too if returned AND NOT SELLER
                if (highestBidder && highestBidder.full_name && !isSeller) {
                    highestBidder.full_name = maskName(highestBidder.full_name);
                    // Hide sensitive info if masked
                    delete highestBidder.email;
                    delete highestBidder.phone;
                    delete highestBidder.address;
                }
            }

            const faqs = await db('questions_answers as qa')
                .select('qa.*', 'u1.full_name as user_name', 'u2.full_name as seller_name')
                .join('users as u1', 'qa.user_id', 'u1.id')
                .leftJoin('users as u2', 'qa.answered_by', 'u2.id')
                .where('qa.product_id', id)
                .orderBy('qa.created_at', 'desc');

            // Related products cũng nên check is_favorite nếu được (tùy chọn)
            const relatedProductsRaw = await createBaseQuery(userId)
                .where('p.category_id', product.category_id)
                .whereNot('p.id', id)
                .where('p.status', 'active')
                .orderBy('p.created_at', 'desc')
                .limit(5);
            
            const relatedProducts = relatedProductsRaw.map(p => ({
                ...p,
                winner_name: maskName(p.winner_name)
            }));

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
            const query = createBaseQuery(userId)
                .whereIn('p.id', function() {
                    this.select('product_id')
                        .from('bids')
                        .where('bidder_id', userId);
                })
                .where('p.status', 'active');

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
                .where('p.status', 'sold')
                .select(
                    db.raw(
                        'EXISTS(SELECT 1 FROM ratings r WHERE r.product_id = p.id AND r.from_user_id = ?) as is_reviewed',
                        [userId]
                    )
                );

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

    // [Done] Top sản phẩm kết thúc sớm, nhiều lượt bid, giá cao
    findTopClosing: async (userId = null) => {
        const rows = await createBaseQuery(userId)
            .where('p.status', 'active')
            .where('p.end_time', '>', new Date())
            .orderBy('p.end_time', 'asc')
            .limit(5);
        
        return rows.map(row => ({
            ...row,
            winner_name: row.winner_name ? row.winner_name.split('').map((c, i) => i % 2 === 0 ? c : '*').join('') : null
        }));
    },

    findTopBidding: async (userId = null) => {
        const rows = await createBaseQuery(userId)
            .where('p.status', 'active')
            .where('p.end_time', '>', new Date())
            .orderBy('bid_count', 'desc')
            .limit(5);

        return rows.map(row => ({
            ...row,
            winner_name: row.winner_name ? row.winner_name.split('').map((c, i) => i % 2 === 0 ? c : '*').join('') : null
        }));
    },

    findTopPricing: async (userId = null) => {
        const rows = await createBaseQuery(userId)
            .where('p.status', 'active')
            .where('p.end_time', '>', new Date())
            .orderBy('p.current_price', 'desc')
            .limit(5);

        return rows.map(row => ({
            ...row,
            winner_name: row.winner_name ? row.winner_name.split('').map((c, i) => i % 2 === 0 ? c : '*').join('') : null
        }));
    },

    findByIdLock: (id, trx) => {
        return trx('products').where('id', id).forUpdate().first();
    },

    findById: (id) => {
        return db('products').where('id', id).first();
    },

    updatePrice: (id, newPrice, winnerId, trx) => {
        return trx('products').where('id', id).update({ 
            current_price: newPrice,
            winner_id: winnerId
        });
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

    // --- CRON JOB METHODS ---
    getExpiredActiveProducts: async () => {
        return db('products')
            .where('status', 'active')
            .where('end_time', '<=', new Date())
            .select('id', 'current_price', 'starting_price');
    },

    closeAuction: async (id, winnerId, finalPrice) => {
        return db('products')
            .where('id', id)
            .update({
                status: 'sold',
                winner_id: winnerId,
                current_price: finalPrice
            });
    },

    expireAuction: async (id) => {
        return db('products')
            .where('id', id)
            .update({
                status: 'expired'
            });
    },
};


export default ProductModel;
