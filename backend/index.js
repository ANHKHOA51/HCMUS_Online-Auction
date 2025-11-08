import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

app.get('/', function (req, res) {
    res.json({ status: "Working" })
})

app.post("/api/register", async (req, res) => {
    const { firstname, lastname, address, username, email, password, captcha } = req.body;

    if (!firstname || !lastname || !username || !email || !password) {
        return res.status(400).json({ message: "Not enough information" });
    }

    const status = {}

    try {
        // Google reCAPTCHA expects application/x-www-form-urlencoded
        const params = new URLSearchParams();
        params.append('secret', process.env.CAPTCHA_SECRET_KEY || '');
        params.append('response', captcha || '');

        const response = await fetch(process.env.CAPTCHA_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        });

        const result = await response.json();
        if (!result.success) {
            // Google returns an array under 'error-codes'
            status.captcha = result['error-codes'] || ['captcha verification failed'];
        }
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        status.captcha = ['captcha verification error'];
    }

    const existingUser = true
    const existingEmail = true


    if (existingUser) {
        status.username = "Existed user"

    }

    if (existingEmail) {
        status.email = "Existed email"
    }

    if (Object.keys(status).length > 0) {
        return res.status(400).json(status);
    }

    // Tạo user mới


    // Trả về phản hồi
    return res.status(201).json({ message: "Register successful" });
});

app.listen(PORT, function () {
    console.log(`Server is running on port http://localhost:${PORT}`)
})