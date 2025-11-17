import express from 'express'
import cors from 'cors'
import "dotenv/config";

import { checkCaptcha, checkExistedUser, checkExistedEmail, generateOTP, sendOtpMail, hashPassword, add2Pending } from './services/auth.service.js';

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

app.get('/', function (req, res) {
    res.json({ status: "Working" })
})

app.post("/register", async (req, res) => {
    const { firstname, lastname, username, email, password, captcha_key } = req.body;

    if (!firstname || !lastname || !username || !email || !password) {
        return res.status(400).json({ message: "Not enough information" });
    }

    const errors = {}

    const [check_captcha, check_username, check_email] = await Promise.all([
        checkCaptcha(captcha_key),
        checkExistedUser(username),
        checkExistedEmail(email)
    ]);

    if (check_captcha) errors.captcha = check_captcha;
    if (check_username) errors.username = check_username;
    if (check_email) errors.email = check_email;

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    // send email
    const otp = generateOTP()
    try {
        password = hashPassword(password)
        await sendOtpMail(email, otp)
        // add to pending db
        add2Pending(firstname, lastname, username, email, password)
        return res.status(201).json({
            message: "Register successful",
            email: email
        });
    } catch (error) {
        console.error('Failed to send OTP email:', error);
        return res.status(500).json({ message: "Failed to send OTP email" });
    }
});

app.post("/register/otp", async (req, res) => {

})

app.listen(PORT, function () {
    console.log(`Server is running on port http://localhost:${PORT}`)
})