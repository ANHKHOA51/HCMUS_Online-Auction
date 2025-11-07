import { UserModel } from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

export const AuthController = {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const hashed = await hashPassword(password);
      const user = await UserModel.create({ username, email, password: hashed });
      res.status(201).json({ message: 'Register success', user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findByEmail(email);
      if (!user) return res.status(400).json({ error: 'User not found' });

      const match = await comparePassword(password, user.password);
      if (!match) return res.status(400).json({ error: 'Wrong password' });

      const token = generateToken(user);
      res.json({ message: 'Login success', token });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
