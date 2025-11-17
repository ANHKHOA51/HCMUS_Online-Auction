import pool from '../config/db.js';


// Tạo bảng nếu chưa có
export const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name VARCHAR(200),
      email VARCHAR(200) UNIQUE NOT NULL,
      phone VARCHAR(20),
      role VARCHAR(20) DEFAULT 'bidder' CHECK (role IN ('bidder', 'seller', 'admin')),
      rating_positive INT DEFAULT 0,
      rating_negative INT DEFAULT 0,
      allow_unrated_bid BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log("✅ Table 'users' ready");
};

// Các hàm thao tác dữ liệu
export const UserModel = {
  // Tạo user mới
  async create({ username, passwordHash, fullName, email, phone, role = 'bidder', allowUnratedBid = false }) {
    const result = await pool.query(
      `INSERT INTO users (username, password_hash, full_name, email, phone, role, allow_unrated_bid)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, username, full_name, email, phone, role, rating_positive, rating_negative, allow_unrated_bid, created_at`,
      [username, passwordHash, fullName, email, phone, role, allowUnratedBid]
    );
    return result.rows[0];
  },

  // Tìm user theo email
  async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  // Tìm user theo username
  async findByUsername(username) {
    const result = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    return result.rows[0];
  },

  // Cập nhật rating
  async updateRating(userId, isPositive) {
    const column = isPositive ? 'rating_positive' : 'rating_negative';
    const result = await pool.query(
      `UPDATE users
       SET ${column} = ${column} + 1, updated_at = NOW()
       WHERE id = $1
       RETURNING rating_positive, rating_negative`,
      [userId]
    );
    return result.rows[0];
  },

  // Cập nhật quyền allowUnratedBid
  async setAllowUnratedBid(userId, allow) {
    const result = await pool.query(
      `UPDATE users
       SET allow_unrated_bid = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, username, allow_unrated_bid`,
      [allow, userId]
    );
    return result.rows[0];
  },

  // Lấy danh sách user (cho admin)
  async getAll() {
    const result = await pool.query(
      `SELECT id, username, full_name, email, phone, role, rating_positive, rating_negative, allow_unrated_bid, created_at
       FROM users
       ORDER BY id ASC`
    );
    return result.rows;
  },
};
