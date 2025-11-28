import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register", authController.register);
router.post("/register/otp", authController.postRegisterOTP);
router.post("/login", authController.login);

export default router;
