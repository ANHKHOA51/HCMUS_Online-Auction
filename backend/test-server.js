import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = 3001;

console.log('Starting test server...');

app.get('/', (req, res) => {
  console.log('GET / request received');
  res.json({ status: 'Working' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});
