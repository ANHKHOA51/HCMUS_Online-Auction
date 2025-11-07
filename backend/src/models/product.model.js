import pool from '../config/db.js';

export const createProductTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      seller_id INT REFERENCES users(id) ON DELETE CASCADE,
      category_id INT REFERENCES categories(id) ON DELETE SET NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      starting_price NUMERIC(10,2) NOT NULL,
      current_price NUMERIC(10,2),
      buy_now_price NUMERIC(10,2),
      step_price NUMERIC(10,2) DEFAULT 0,
      images TEXT[],                                -- mảng đường dẫn ảnh
      start_time TIMESTAMP DEFAULT NOW(),
      end_time TIMESTAMP,
      status VARCHAR(20) DEFAULT 'active',
      winner_id INT REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log('✅ products table ready');
};

// ---------------- CRUD ----------------

export const ProductModel = {
  async create(data) {
    const query = `
      INSERT INTO products (
        seller_id, category_id, name, description,
        starting_price, current_price, buy_now_price, step_price,
        images, start_time, end_time, status, winner_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *;
    `;
    const values = [
      data.sellerId,
      data.categoryId,
      data.name,
      data.description,
      data.startingPrice,
      data.currentPrice,
      data.buyNowPrice,
      data.stepPrice,
      data.images,
      data.startTime,
      data.endTime,
      data.status || 'active',
      data.winnerId || null,
    ];
    const res = await pool.query(query, values);
    return res.rows[0];
  },

  async findAll() {
    const res = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return res.rows;
  },

  async findById(id) {
    const res = await pool.query('SELECT * FROM products WHERE id=$1', [id]);
    return res.rows[0];
  },

  async update(id, data) {
    const query = `
      UPDATE products SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        current_price = COALESCE($3, current_price),
        buy_now_price = COALESCE($4, buy_now_price),
        step_price = COALESCE($5, step_price),
        images = COALESCE($6, images),
        status = COALESCE($7, status),
        winner_id = COALESCE($8, winner_id),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *;
    `;
    const values = [
      data.name,
      data.description,
      data.currentPrice,
      data.buyNowPrice,
      data.stepPrice,
      data.images,
      data.status,
      data.winnerId,
      id,
    ];
    const res = await pool.query(query, values);
    return res.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
  },
};
