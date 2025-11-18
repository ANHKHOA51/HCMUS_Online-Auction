import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import { db } from '../utils/db.js';

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
    return bcrypt.hashSync(password, SALT_ROUNDS)
}

export async function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

export async function add2Pending(firstname, lastname, address, username, email, password) {
    try {
        const otp = generateOTP()
        const rs = await db('pending_registrations')
            .insert({
                firstname: firstname,
                lastname: lastname,
                address: address,
                username: username,
                email: email,
                password: password,
                otp: otp,
                expires_at: new Date(Date.now() + 10 * 60 * 1000)
            })
            .onConflict('email') // Nếu trùng 'email'
            .merge();

        await sendOtpMail(email, otp)
    } catch (error) {
        throw error
    }
}

export async function verifyOtp(email, otp) {
    if (!email || !otp) {
        return { ok: false, reason: 'missing_email_or_otp' };
    }

    try {
        // tìm pending record hợp lệ (otp khớp và chưa hết hạn)
        const pending = await db('pending_registrations')
            .where({ email, otp })
            .andWhere('expires_at', '>', new Date())
            .first();

        if (!pending) {
            // kiểm tra xem có record theo email nhưng expired hoặc không tồn tại
            const exists = await db('pending_registrations').where({ email }).first();
            if (!exists) return { ok: false, reason: 'not_found' };
            if (new Date(exists.expires_at) <= new Date()) {
                // dọn dẹp record đã hết hạn
                await db('pending_registrations').where({ email }).del();
                return { ok: false, reason: 'expired' };
            }
            return { ok: false, reason: 'invalid' }; // otp không đúng
        }

        // tạo user và xóa pending trong transaction
        const insertedIds = await db.transaction(async (trx) => {
            const ids = await trx('users')
                .insert({
                    full_name: `${pending.firstname} ${pending.lastname}`,
                    username: pending.username,
                    email: pending.email,
                    password_hash: pending.password,
                    role: 1,
                    address: pending.address
                })
                .returning('id'); // postgres trả mảng id
            await trx('pending_registrations').where({ email }).del();
            return ids;
        });

        return { ok: true, userId: Array.isArray(insertedIds) ? insertedIds[0] : insertedIds };
    } catch (error) {
        console.error('verifyOtp error:', error);
        throw error;
    }
}

export async function sendOtpMail(toEmail, otp) {
    try {
        await transporter.sendMail({
            from: "Online Auction",
            to: toEmail,
            subject: "Mã OTP xác thực của bạn",
            text: `Mã OTP của bạn là ${otp}. Hết hạn trong 5 phút.`,
            html: `<p>Xin chào,</p>
             <p>Bạn vừa yêu cầu mã OTP để xác thực. Mã của bạn là:</p>
             <h2 style="color:#0d6efd;">${otp}</h2>
             <p>Mã sẽ hết hạn trong <strong>5 phút</strong>.</p>
             <p>Nếu bạn không yêu cầu mã này, có thể bỏ qua email này.</p>
             <p>Trân trọng,<br/>Đội ngũ hỗ trợ Online Auction</p>`
        });

    } catch (error) {
        throw error
    }
}

export async function signIn(identifier, password) {
    try {
        const user = await db('users')
            .where('username', identifier)
            .orWhere('email', identifier)
            .first();
    
        if (!user) {
            return {ok: false}
        } else {
            const rs = await comparePassword(password, user.password_hash)
            return {ok: !!rs}
        }
    } catch(error) {
        throw error
    }

}
