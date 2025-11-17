import pool from '../config/db.js';

export const createBidTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS bids (
      id SERIAL PRIMARY KEY,
      product_id INT REFERENCES products(id) ON DELETE CASCADE,
      bidder_id INT REFERENCES users(id) ON DELETE CASCADE,
      bid_amount NUMERIC(10,2) NOT NULL,
      bid_time TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log(' bids table ready');
};

// ---------------- CRUD ----------------

export const BidModel = {
  async create(data) {
    const query = `
      INSERT INTO bids (product_id, bidder_id, bid_amount, bid_time)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [
      data.productId,
      data.bidderId,
      data.bidAmount,
      data.bidTime || new Date(),
    ];
    const res = await pool.query(query, values);
    return res.rows[0];
  },

  async findAllByProduct(productId) {
    const query = `
      SELECT b.*, u.username AS bidder_name
      FROM bids b
      JOIN users u ON u.id = b.bidder_id
      WHERE b.product_id = $1
      ORDER BY b.bid_time DESC;
    `;
    const res = await pool.query(query, [productId]);
    return res.rows;
  },

  async findLatestByProduct(productId) {
    const query = `
      SELECT * FROM bids
      WHERE product_id = $1
      ORDER BY bid_time DESC
      LIMIT 1;
    `;
    const res = await pool.query(query, [productId]);
    return res.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM bids WHERE id=$1', [id]);
  },
};
