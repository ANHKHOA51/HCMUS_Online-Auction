import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// ✅ Tạo pool kết nối
export const pool = new Pool({
  connectionString: process.env.PG_URL,
  ssl: {
    rejectUnauthorized: false, // Supabase yêu cầu SSL
  },
});

// ✅ Hàm kiểm tra kết nối DB
export const testDB = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Connected to PostgreSQL at:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
};


export default pool;
