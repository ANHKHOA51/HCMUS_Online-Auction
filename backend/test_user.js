import 'dotenv/config';
import { db } from './utils/db.js';
import { hashPassword } from './utils/password.js';

const hashed = await hashPassword('password123');
const result = await db('users').insert({
    full_name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password_hash: hashed,
    role: 1,
    address: 'Test Address'
}).returning('*');

console.log('User created:', result);
process.exit(0);
