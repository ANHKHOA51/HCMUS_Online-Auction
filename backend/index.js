import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.routes.js';
import productRoutes from './src/routes/product.routes.js';

// Load environment variables FIRST
dotenv.config();

import pool from './src/config/db.js';


pool.query("SELECT NOW()")
  .then(res => console.log("✅ DB Connected:", res.rows[0].now))
  .catch(err => console.error("❌ DB ERROR:", err.message));


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});
