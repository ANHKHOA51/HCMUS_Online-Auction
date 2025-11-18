import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRouter from './routes/auth.routes.js';

const app = express();
const PORT = 3000;

// CORS trước mọi route, và enable preflight
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

// register routes AFTER cors/json
app.use('/', authRouter);

app.get('/', (req, res) => res.json({ status: 'Working' }));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});