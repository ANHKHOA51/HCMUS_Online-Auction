import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

// router.post("/register", authController.register);
// router.post("/register/otp", authController.postRegisterOTP);
// router.post("/login", authController.login);

router.post("/register", async (req, res) => {
    const { firstname, lastname, username, email, password, captcha_key } = req.body;

    if (!firstname || !lastname || !username || !email || !password) {
        return res.status(400).json({ message: "Not enough information" });
    }

    const errors = {}

    const [check_captcha, check_username, check_email] = await Promise.all([
        process.env.NODE_ENV === 'development' ? undefined : checkCaptcha(captcha_key),
        userModel.existsByUsername(username),
        userModel.existsByEmail(email),
    ]);

    if (check_captcha) errors.captcha = check_captcha;
    if (check_username) errors.username = "User đã tồn tại";
    if (check_email) errors.email = "Email đã tồn tại";

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }
    console.log('Registering user:', { firstname, lastname, username, email });

    try {
        const hashed_password = await hashPassword(password)
        await AuthService.add2Pending(req.body, hashed_password)

        return res.status(201).json({
            message: "Register successful",
            email: email
        });

    } catch (error) {
        console.error('Failed to send OTP email:', error);
        return res.status(500).json({ message: "Failed to send OTP email" });
    }
})

router.post("/register/otp", async (req, res) => {
    const { email, otp } = req.body
    try {
        const rs = await AuthService.verifyOtp(email, otp)
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
        const rs = await AuthService.signIn(identifier, password)
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
