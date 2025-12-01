import express from 'express';
import { checkCaptcha, checkExistedUserEmail, hashPassword, add2Pending, signIn } from '../services/auth.service.js'
import { verifyOtp } from '../services/auth.service.js';
import { db } from '../utils/db.js';

const router = express.Router();

router.post("/register", async (req, res) => {
    const { firstname, lastname, address, username, email, password, captcha_key } = req.body;
    console.log("here1")
    if (!firstname || !lastname || !username || !email || !password) {
        return res.status(400).json({ message: "Not enough information" });
    }
    console.log("here2")
    const errors = {}

    const [captchaResult, exists] = await Promise.all([
        checkCaptcha(captcha_key),
        checkExistedUserEmail(username, email)
    ]);

    console.log("here3")

    if (captchaResult) errors.captcha = captchaResult;
    if (exists.username) errors.username = "User đã tồn tại";
    if (exists.email) errors.email = "Email đã tồn tại";

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }
    console.log("here4")
    try {
        const hashed_password = await hashPassword(password)
        await add2Pending(firstname, lastname, address, username, email, hashed_password)

        console.log("here")
        return res.status(201).json({
            message: "Register successful",
            email: email
        });

    } catch (error) {
        console.error('Failed to send OTP email:', error);
        return res.status(500).json({ message: "Failed to send OTP email" });
    }
});

router.post("/register/otp", async (req, res) => {
    const { email, otp } = req.body
    try {
        const rs = await verifyOtp(email, otp)
        if (rs.ok) {
            return res.status(201).json({
                message: "Verify successful"
            })
        } else {
            return res.status(401).json({
                message: rs.reason
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Server error"
        })
    }
})

router.post("/login", async (req, res) => {
    const { identifier, password } = req.body
    try {
        const rs = await signIn(identifier, password)
        if (rs.ok) {
            return res.status(201).json({
                message: "Sign in successful"
            })
        } else {
            return res.status(401).json({
                message: "Invalid username/email or password"
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Server error"
        })
    }
})

export default router;
