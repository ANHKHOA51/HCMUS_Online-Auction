import { db } from '../configs/db.js';

export const ProductModel = {
    getAllProducts: async (queryParams) => {
        try {
            console.log('getAllProducts model called');
            const { category_id, sort = 'newest', search } = queryParams || {};

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
                'p.seller_id',
                'p.winner_id',
                'p.created_at',
                db.raw('u.full_name as seller_name'),
                db.raw('w.full_name as winner_name'),
                db.raw('(SELECT COUNT(*) FROM bids WHERE bids.product_id = p.id) as bid_count'),
            )
            .join('users as u', 'p.seller_id', 'u.id')
            .leftJoin('users as w', 'p.winner_id', 'w.id')
            .where('p.status', 'active');

            if (category_id) {
            query = query.where('p.category_id', category_id);
            }

            if (search) {
            query = query.where('p.name', 'ilike', `%${search}%`);
            }

            if (sort === 'newest') {
            query = query.orderBy('p.created_at', 'desc');
            } else if (sort === 'ending') {
            query = query.orderBy('p.end_time', 'asc');
            } else if (sort === 'price_low') {
            query = query.orderBy('p.current_price', 'asc');
            } else if (sort === 'price_high') {
            query = query.orderBy('p.current_price', 'desc');
            }

            query = query.limit(50).timeout(5000);

            console.log('📝 Query:', query.toString());
            console.log('⏳ Executing query...');
            const result = await query;
            console.log('✓ Query result:', result.length, 'rows');
            return result;
        } catch (error) {
            console.error('Model error:', error.message);
            throw error;
        }
    },

    getProductDetail: async (id) => {
        try {
            const product = await db('products as p')
            .select('p.*', 'c.name as category_name', 'u.id as seller_id', 'u.full_name as seller_name', 'u.email as seller_email', 'u.rating_positive', 'u.rating_negative', 'u.avatar_url as seller_avatar')
            .join('categories as c', 'p.category_id', 'c.id')
            .join('users as u', 'p.seller_id', 'u.id')
            .where('p.id', id)
            .first();

            if (!product) {
            return { product: null };
            }

            // Get highest bidder
            let highestBidder = null;
            if (product.winner_id) {
            highestBidder = await db('users').where('id', product.winner_id).first();
            }

            // Get Q&A
            const faqs = await db('questions_answers as qa')
            .select('qa.id', 'qa.question', 'qa.answer', 'qa.created_at', 'qa.answered_at', 'u1.full_name as user_name', 'u2.full_name as seller_name')
            .join('users as u1', 'qa.user_id', 'u1.id')
            .leftJoin('users as u2', 'qa.answered_by', 'u2.id')
            .where('qa.product_id', id)
            .orderBy('qa.created_at', 'desc');

            // Get related products
            const relatedProducts = await db('products')
            .select('id', 'name', 'current_price', 'starting_price', 'buy_now_price', 'images', 'end_time')
            .where('category_id', product.category_id)
            .whereNot('id', id)
            .where('status', 'active')
            .orderBy('created_at', 'desc')
            .limit(5);

            return {
            product,
            highestBidder,
            faqs,
            relatedProducts
            };
        } catch (error) {
            console.error('Error in getProductDetail:', error);
            throw error;
        }
    },

    getProductBids: async (id) => {
        const bids = await db('bids as b')
            .select('b.id', 'b.bid_amount', 'b.bid_time', 'u.id as bidder_id', 'u.full_name as bidder_name', 'u.username')
            .join('users as u', 'b.bidder_id', 'u.id')
            .where('b.product_id', id)
            .orderBy('b.bid_time', 'desc');

        return bids;
    },

    findTopClosing: () => {
        return db('products')
        //.where('status', 0)
        //.where('end_time', '>', db.fn.now()) // Chưa hết hạn
        .orderBy('end_time', 'asc') // Thời gian kết thúc tăng dần (gần nhất lên đầu)
        .limit(5);
    },

    findTopBidding: () => {
    /* SQL Tương đương:
       SELECT p.*, COUNT(b.id) as bid_count 
       FROM products p 
       LEFT JOIN bids b ON p.id = b.product_id
       GROUP BY p.id
       ORDER BY bid_count DESC
       LIMIT 5
    */
        return db('products')
        .leftJoin('bids', 'products.id', 'bids.product_id')
        .select('products.*')
        .count('bids.id as bid_count')
        .groupBy('products.id')
        .orderBy('bid_count', 'desc')
        .limit(5);
    },

    findTopPricing: () => {
        return db('products')
        //.where('status', 'active')
        .orderBy('current_price', 'desc')
        .limit(5);
    }

};

export default ProductModel;
