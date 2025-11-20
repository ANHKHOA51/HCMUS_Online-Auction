import { db as pool } from '../utils/db.js';

export const createWatchlistTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS watchlist (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      product_id INT REFERENCES products(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (user_id, product_id)
    );
  `;
  await pool.query(query);
  console.log('✅ watchlist table ready');
};

// ---------------- CRUD ----------------

export const WatchlistModel = {
  async add(userId, productId) {
    const query = `
      INSERT INTO watchlist (user_id, product_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, product_id) DO NOTHING
      RETURNING *;
    `;
    const res = await pool.query(query, [userId, productId]);
    return res.rows[0];
  },

  async remove(userId, productId) {
    const query = `DELETE FROM watchlist WHERE user_id = $1 AND product_id = $2;`;
    await pool.query(query, [userId, productId]);
  },

  async findByUser(userId) {
    const query = `
      SELECT w.*, p.name AS product_name, p.current_price, p.end_time
      FROM watchlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC;
    `;
    const res = await pool.query(query, [userId]);
    return res.rows;
  },

  async findByProduct(productId) {
    const query = `
      SELECT w.*, u.username AS watcher_name
      FROM watchlist w
      JOIN users u ON w.user_id = u.id
      WHERE w.product_id = $1;
    `;
    const res = await pool.query(query, [productId]);
    return res.rows;
  },
};
