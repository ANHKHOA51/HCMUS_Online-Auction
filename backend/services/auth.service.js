import nodemailer from 'nodemailer'
import { hashSync } from 'bcrypt';
import crypto from 'crypto'

const captcha_url = process.env.CAPTCHA_API;
const captcha_secret_key = process.env.CAPTCHA_SECRET_KEY

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "anhkhoanguyen11012022@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

export async function checkCaptcha(captcha) {
    try {
        const params = new URLSearchParams();
        params.append('secret', captcha_secret_key || '');
        params.append('response', captcha || '');

        const response = await fetch(captcha_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        });

        const result = await response.json();

        if (result.success) {
            return undefined;
        }
        else if (!result.success) {
            return result['error-codes'];
        }

    } catch (error) {
        console.error("Lỗi kết nối:", error);
        return ['error-codes'];
    }
}

export async function checkExistedUser(user) {
    const isUserExisted = await db('users')
        .where({ username: user })
        .first()

    return !!isUserExisted
}

export async function checkExistedEmail(mail) {
    const isExistedEmail = await db('users')
        .where({ email: mail })
        .first()

    return !!isExistedEmail
}

export function generateOTP(length = 6) {
    const max = 10 ** length;
    const otp = crypto.randomInt(0, max).toString().padStart(length, '0');
    return otp;
}

const SALT_ROUNDS = 10
export function hashPassword(password) {
    return hashSync(password, SALT_ROUNDS)
}

export async function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

export async function add2Pending(firstname, lastname, username, email, password) {

}
export async function sendOtpMail(toEmail, otp) {
    await transporter.sendMail({
        to: toEmail,
        subject: "Mã OTP xác thực của bạn",
        text: `Mã OTP của bạn là ${otp}. Hết hạn trong 5 phút.`,
        html: `<p>Xin chào,</p>
         <p>Bạn vừa yêu cầu mã OTP để xác thực. Mã của bạn là:</p>
         <h2 style="color:#0d6efd;">${otp}</h2>
         <p>Mã sẽ hết hạn trong <strong>5 phút</strong>.</p>
         <p>Nếu bạn không yêu cầu mã này, có thể bỏ qua email này.</p>
         <p>Trân trọng,<br/>Đội ngũ hỗ trợ YourApp</p>`
    });
}
