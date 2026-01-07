import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import productRouter from './routes/product.route.js';
import categoryRouter from './routes/category.route.js';
//import bidRouter from './routes/bid.route.js';
import watchlistRouter from './routes/watchlist.route.js';
import bidRouter from './routes/bid.routes.js';
import questionRouter from './routes/question.route.js';
import userRouter from './routes/user.route.js';
import orderRouter from './routes/order.route.js';
import reviewRouter from './routes/review.route.js';
import { startAuctionCron } from './cron/auction.cron.js';

const app = express();
const PORT = 3000;

// Start Cron Job
startAuctionCron();

// CORS trước mọi route, và enable preflight
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());

app.use('/static', express.static('static'));

// Log all requests
app.use((req, res, next) => {
  console.log(`\x1b[33m[${new Date().toLocaleString('vi-VN')}] 📨 \x1b[32m${req.method} \x1b[36m${req.path}\x1b[0m`);
  next();
});

app.use(express.json());

// register routes AFTER cors/json
app.use('/auths', authRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
//app.use('/bids', bidRouter);
app.use('/watchlists', watchlistRouter);
app.use('/bids', bidRouter);
app.use('/questions', questionRouter);
app.use('/users', userRouter);
app.use('/orders', orderRouter);
app.use('/reviews', reviewRouter);


app.get('/', (req, res) => {
  console.log('✓ GET / called');
  res.json({ status: 'Working' });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT}`);
});

