import pool from '../config/db.js';

export const createActivityLogTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS activity_logs (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      action VARCHAR(255) NOT NULL,
      timestamp TIMESTAMP DEFAULT NOW(),
      details JSONB
    );
  `;
  await pool.query(query);
  console.log('✅ activity_logs table ready');
};

// ---------------- CRUD ----------------

export const ActivityLogModel = {
  async create(data) {
    const query = `
      INSERT INTO activity_logs (user_id, action, details)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [data.userId, data.action, data.details || {}];
    const res = await pool.query(query, values);
    return res.rows[0];
  },

  async findAll() {
    const query = `
      SELECT al.*, u.username
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.timestamp DESC;
    `;
    const res = await pool.query(query);
    return res.rows;
  },

  async findByUser(userId) {
    const query = `
      SELECT * FROM activity_logs
      WHERE user_id = $1
      ORDER BY timestamp DESC;
    `;
    const res = await pool.query(query, [userId]);
    return res.rows;
  },

  async delete(id) {
    await pool.query('DELETE FROM activity_logs WHERE id = $1', [id]);
  },
};
