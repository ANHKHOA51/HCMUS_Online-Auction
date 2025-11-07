import pool from '../config/db.js';

export const createNotificationTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log('✅ notifications table ready');
};

// ---------------- CRUD ----------------

export const NotificationModel = {
  async create(data) {
    const query = `
      INSERT INTO notifications (user_id, title, message)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [data.userId, data.title, data.message];
    const res = await pool.query(query, values);
    return res.rows[0];
  },

  async findByUser(userId) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const res = await pool.query(query, [userId]);
    return res.rows;
  },

  async markAsRead(id) {
    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = $1
      RETURNING *;
    `;
    const res = await pool.query(query, [id]);
    return res.rows[0];
  },

  async markAllAsRead(userId) {
    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = $1;
    `;
    await pool.query(query, [userId]);
  },

  async delete(id) {
    const query = `DELETE FROM notifications WHERE id = $1;`;
    await pool.query(query, [id]);
  },
};
