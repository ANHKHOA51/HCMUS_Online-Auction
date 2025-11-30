import { generateOTP } from '../utils/otp.js';
import {db} from '../utils/db.js';
import { comparePassword } from '../utils/password.js';
import { PendingRegistrationModel } from '../models/pending_registration.model.js'; 
import UserModel from '../models/user.model.js';
import { sendOtpMail } from '../utils/mail.js';


export const AuthService = {
    add2Pending: async (data, hashed_password) => {
        try {
            const otp = generateOTP()
            
            await PendingRegistrationModel.insertOrUpdate({
                    firstname: data.firstname,
                    lastname: data.lastname,
                    address: data.address,
                    username: data.username,
                    email: data.email,
                    password: hashed_password,
                    otp,
                    expires_at: new Date(Date.now() + 10 * 60 * 1000)
            });

            // Skip email in development
            if (process.env.NODE_ENV !== 'development') {
                await sendOtpMail(data.email, otp)
            }
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
    },

    signIn: async (identifier, password) => {
        try {
            const user = await UserModel.findByUsernameOrEmail(identifier);

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
}

export default AuthService;

