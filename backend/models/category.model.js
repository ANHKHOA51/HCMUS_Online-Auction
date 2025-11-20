import { db as pool } from '../utils/db.js';

export const createCategoryTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        parent_category_id INT REFERENCES categories(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log('✅ categories table ready');
};

// ---------------- CRUD ----------------

export const CategoryModel = {
  async create(data) {
    const query = `
      INSERT INTO categories (name, description, parent_category_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [data.name, data.description, data.parentCategoryId || null];
    const res = await pool.query(query, values);
    return res.rows[0];
  },

  async findAll() {
    const query = `
      SELECT c.*, p.name AS parent_name
      FROM categories c
      LEFT JOIN categories p ON c.parent_category_id = p.id
      ORDER BY c.id ASC;
    `;
    const res = await pool.query(query);
    return res.rows;
  },

  async findById(id) {
    const res = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return res.rows[0];
  },

  async update(id, data) {
    const query = `
      UPDATE categories
      SET name = $1,
          description = $2,
          parent_category_id = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [data.name, data.description, data.parentCategoryId || null, id];
    const res = await pool.query(query, values);
    return res.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM categories WHERE id=$1', [id]);
  },
};
