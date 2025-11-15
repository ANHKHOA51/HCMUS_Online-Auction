import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// ============================================================================
// GET /api/products - Lấy danh sách tất cả sản phẩm
// ============================================================================
router.get('/', async (req, res) => {
  try {
    const { category_id, sort = 'newest', search } = req.query;

    let query = `
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.starting_price, 
        p.current_price, 
        p.buy_now_price, 
        p.images, 
        p.start_time, 
        p.end_time, 
        p.status,
        p.seller_id,
        u.full_name as seller_name
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.status = 'active'
    `;

    const params = [];

    if (category_id) {
      query += ` AND p.category_id = $${params.length + 1}`;
      params.push(category_id);
    }

    if (search) {
      query += ` AND p.name ILIKE $${params.length + 1}`;
      params.push(`%${search}%`);
    }

    if (sort === 'newest') {
      query += ` ORDER BY p.created_at DESC`;
    } else if (sort === 'ending') {
      query += ` ORDER BY p.end_time ASC`;
    } else if (sort === 'price_low') {
      query += ` ORDER BY p.current_price ASC`;
    } else if (sort === 'price_high') {
      query += ` ORDER BY p.current_price DESC`;
    }

    query += ` LIMIT 50`;

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// GET /api/products/:id - Lấy chi tiết một sản phẩm
// ============================================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const productQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        u.id as seller_id,
        u.full_name as seller_name,
        u.email as seller_email,
        u.phone as seller_phone,
        u.rating_positive,
        u.rating_negative,
        u.avatar_url as seller_avatar
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.id = $1
    `;

    const productResult = await pool.query(productQuery, [id]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const product = productResult.rows[0];

    // Lấy thông tin người đặt giá cao nhất
    let highestBidder = null;
    if (product.winner_id) {
      const bidderQuery = `
        SELECT id, full_name, email, phone, rating_positive, rating_negative, avatar_url
        FROM users
        WHERE id = $1
      `;
      const bidderResult = await pool.query(bidderQuery, [product.winner_id]);
      if (bidderResult.rows.length > 0) {
        highestBidder = bidderResult.rows[0];
      }
    }

    // Lấy lịch sử Q&A
    const qaQuery = `
      SELECT 
        qa.id,
        qa.question,
        qa.answer,
        qa.created_at,
        qa.answered_at,
        u1.full_name as user_name,
        u2.full_name as seller_name
      FROM questions_answers qa
      JOIN users u1 ON qa.user_id = u1.id
      LEFT JOIN users u2 ON qa.answered_by = u2.id
      WHERE qa.product_id = $1
      ORDER BY qa.created_at DESC
    `;
    const qaResult = await pool.query(qaQuery, [id]);

    // Lấy 5 sản phẩm cùng category
    const relatedQuery = `
      SELECT 
        id, 
        name, 
        current_price, 
        starting_price,
        buy_now_price,
        images, 
        end_time
      FROM products
      WHERE category_id = $1 AND id != $2 AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 5
    `;
    const relatedResult = await pool.query(relatedQuery, [product.category_id, id]);

    res.json({
      success: true,
      data: {
        product,
        highestBidder,
        faqs: qaResult.rows,
        relatedProducts: relatedResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// GET /api/products/:id/bids - Lấy lịch sử bid của sản phẩm
// ============================================================================
router.get('/:id/bids', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        b.id,
        b.bid_amount,
        b.bid_time,
        u.id as bidder_id,
        u.full_name as bidder_name,
        u.username
      FROM bids b
      JOIN users u ON b.bidder_id = u.id
      WHERE b.product_id = $1
      ORDER BY b.bid_time DESC
    `;

    const result = await pool.query(query, [id]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// GET /api/categories - Lấy danh sách categories
// ============================================================================
router.get('/categories/all', async (req, res) => {
  try {
    const query = `
      SELECT id, name, description
      FROM categories
      ORDER BY name
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
