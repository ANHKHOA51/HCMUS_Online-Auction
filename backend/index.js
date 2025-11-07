import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.routes.js';
import pool from './src/config/db.js';
import { createUserTable } from './src/models/user.model.js';
import { createActivityLogTable } from './src/models/activityLog.model.js';
import { createBidTable } from './src/models/bid.model.js';
import { createCategoryTable } from './src/models/category.model.js';
import { createNotificationTable } from './src/models/notification.model.js';
import { createProductTable } from './src/models/product.model.js';
import { createRatingTable } from './src/models/rating.model.js';
import { createWatchlistTable } from './src/models/watchlist.model.js';




pool.query("SELECT NOW()")
  .then(res => console.log("✅ DB Connected:", res.rows[0].now))
  .catch(err => console.error("❌ DB ERROR:", err.message));


dotenv.config();
const app = express();
app.use(express.json());

// Khởi tạo bảng
createUserTable();
createActivityLogTable();
createBidTable();
createCategoryTable();
createNotificationTable();
createProductTable();
createRatingTable();
createWatchlistTable();

// Routes
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});
