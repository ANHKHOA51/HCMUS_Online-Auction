import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import productRouter from './routes/product.route.js';
import categoryRouter from './routes/category.route.js';
import userRouter from './routes/user.route.js';

const app = express();
const PORT = 3000;

console.log('🚀 Starting server...');

// CORS trước mọi route, và enable preflight
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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

console.log('✓ Middleware configured');

// register routes AFTER cors/json
app.use('/auths', authRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/users', userRouter);


app.get('/', (req, res) => {
  console.log('✓ GET / called');
  res.json({ status: 'Working' });
});

app.get('/test', (req, res) => {
  console.log('✓ GET /test called');
  res.json({ message: 'Test endpoint working' });
});

console.log('✓ Routes configured');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server is running on http://localhost:${PORT}`);
});

