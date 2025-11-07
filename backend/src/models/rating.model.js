import pool from '../config/db.js';

export const createRatingTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      from_user_id INT REFERENCES users(id) ON DELETE CASCADE,
      to_user_id INT REFERENCES users(id) ON DELETE CASCADE,
      product_id INT REFERENCES products(id) ON DELETE CASCADE,
      comment TEXT,
      score VARCHAR(1) CHECK (score IN ('+', '-')),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log('✅ ratings table ready');
};

// ---------------- CRUD ----------------

export const RatingModel = {
  async create(data) {
    const query = `
      INSERT INTO ratings (from_user_id, to_user_id, product_id, comment, score)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      data.fromUserId,
      data.toUserId,
      data.productId,
      data.comment,
      data.score
    ];
    const res = await pool.query(query, values);
    return res.rows[0];
  },

  async findByUser(userId) {
    const query = `
      SELECT r.*, u.username AS from_username, p.name AS product_name
      FROM ratings r
      JOIN users u ON r.from_user_id = u.id
      JOIN products p ON r.product_id = p.id
      WHERE r.to_user_id = $1
      ORDER BY r.created_at DESC;
    `;
    const res = await pool.query(query, [userId]);
    return res.rows;
  },

  async findByProduct(productId) {
    const res = await pool.query(
      'SELECT * FROM ratings WHERE product_id = $1 ORDER BY created_at DESC;',
      [productId]
    );
    return res.rows;
  },

  async delete(id) {
    await pool.query('DELETE FROM ratings WHERE id = $1', [id]);
  },
};
