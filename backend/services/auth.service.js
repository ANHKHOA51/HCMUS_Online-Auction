import { generateOTP } from '../utils/otp.js';
import { db } from '../utils/db.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { PendingRegistrationModel } from '../models/pending_registration.model.js';
import UserModel from '../models/user.model.js';
import RefreshTokenModel from '../models/refresh_tokens.model.js';
import { sendOtpMail } from '../utils/mail.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

export const AuthService = {
    checkExisted: async (username, email, captcha_key) => {
        const errors = {}

        const [check_captcha, exists] = await Promise.all([
            process.env.NODE_ENV === 'development' ? undefined : checkCaptcha(captcha_key),
            UserModel.checkExistedUserEmail(username, email)
        ]);

        if (check_captcha) errors.captcha = check_captcha;
        if (exists.username) errors.username = "User đã tồn tại";
        if (exists.email) errors.email = "Email đã tồn tại";

        return errors;
    },

    add2Pending: async (data) => {
        try {
            const hashed_password = await hashPassword(data.password)
            const otp = generateOTP()

            await PendingRegistrationModel.insertOrUpdate({
                firstname: data.firstname,
                lastname: data.lastname,
                address: data.address,
                username: data.username,
                email: data.email,
                password: hashed_password,
                otp: otp,
                expires_at: new Date(Date.now() + 10 * 60 * 1000)
            });

            // Send OTP email
            await sendOtpMail(data.email, otp)

            return { otp: process.env.NODE_ENV === 'development' ? otp : undefined };
        } catch (error) {
            throw error
        }
    },


    verifyOtp: async (email, otp) => {
        if (!email || !otp) {
            return { ok: false, reason: 'missing_email_or_otp' };
        }

        try {
            // tìm pending record hợp lệ (otp khớp và chưa hết hạn)
            const pending = await PendingRegistrationModel.findValid(email, otp);

            if (!pending) {
                // kiểm tra xem có record theo email nhưng expired hoặc không tồn tại
                const exists = await PendingRegistrationModel.findByEmail(email);
                if (!exists) return { ok: false, reason: 'not_found' };
                if (new Date(exists.expires_at) <= new Date()) {
                    // dọn dẹp record đã hết hạn
                    await PendingRegistrationModel.deleteByEmail(email);
                    return { ok: false, reason: 'expired' };
                }
                return { ok: false, reason: 'invalid' }; // otp không đúng
            }

            // tạo user và xóa pending trong transaction
            const insertedIds = await db.transaction(async (trx) => {
                console.log('📝 Creating user with data:', {
                    full_name: `${pending.firstname} ${pending.lastname}`,
                    username: pending.username,
                    email: pending.email,
                    password_hash: pending.password ? `[${pending.password.substring(0, 20)}...]` : 'UNDEFINED',
                    role: 0,
                    address: pending.address
                });

                const ids = await trx('users')
                    .insert({
                        full_name: `${pending.firstname} ${pending.lastname}`,
                        username: pending.username,
                        email: pending.email,
                        password_hash: pending.password,
                        role: 0,
                        address: pending.address
                    })
                    .returning('id'); // postgres trả mảng id
                console.log('✅ User created with id:', ids);
                await trx('pending_registrations').where({ email }).del();
                return ids;
            });

            return { ok: true, userId: Array.isArray(insertedIds) ? insertedIds[0] : insertedIds };
        } catch (error) {
            console.error('verifyOtp error:', error);
            throw error;
        }
    },

    signIn: async (identifier, password) => {
        try {
            const user = await UserModel.findByUsernameOrEmail(identifier);
            console.log('User found:', user);
            
            if (!user) {
                return { ok: false }
            } else {
                console.log('Password hash:', user.password_hash ? `[${user.password_hash.substring(0, 20)}...]` : 'NULL');
                console.log('Password input:', password);
                
                const rs = await comparePassword(password, user.password_hash)
                console.log('Password compare result:', rs);

                if (rs) {
                    const accessToken = generateAccessToken({
                        id: user.id,
                        role: user.role
                    })
                    const refreshToken = generateRefreshToken({
                        id: user.id,
                        role: user.role
                    })

                    await AuthService.addToken(user.id, refreshToken)

                    return {
                        ok: true,
                        user: user,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                } else {
                    return { ok: false }
                }
            }
        } catch (error) {
            throw error
        }
    },

    resendOtp: async (email) => {
        try {
            const pending = await PendingRegistrationModel.findByEmail(email);
            if (!pending) return { ok: false, reason: 'not_found' };
            if (new Date(pending.expires_at) <= new Date()) {
                await PendingRegistrationModel.deleteByEmail(email);
                return { ok: false, reason: 'expired' };
            }
            const otp = generateOTP();
            await PendingRegistrationModel.updateOtp(email, otp);
            await sendOtpMail(email, otp);
            return { ok: true };
        } catch (error) {
            console.error('resendOtp error:', error);
            throw error;
        }
    },

    addToken: async (userId, refreshToken) => {
        try {
            await RefreshTokenModel.insert({ user_id: userId, token: refreshToken });
            return { ok: true };
        } catch (error) {
            console.error('addToken error:', error);
            throw error;
        }
    },

    refreshToken: async (refreshToken) => {
        try {
            const token = await RefreshTokenModel.findByToken(refreshToken)
            if (!token) return { ok: false }

            const decoded = verifyRefreshToken(refreshToken)
            const user = await UserModel.findById(decoded.id)
            const newAccessToken = generateAccessToken({
                id: decoded.id,
                role: decoded.role
            })
            const newRefreshToken = generateRefreshToken({
                id: decoded.id,
                role: decoded.role
            })
            await AuthService.addToken(decoded.id, newRefreshToken)
            return {
                ok: true,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                user: user
            }
        } catch (error) {
            console.error('refreshToken error:', error);
            throw error;
        }
    },

    removeToken: async (refreshToken) => {
        try {
            await RefreshTokenModel.deleteToken(refreshToken);
            return { ok: true };
        } catch (error) {
            console.error('removeToken error:', error);
            throw error;
        }
    }
}

export default AuthService;

