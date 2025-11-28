import { db } from "../configs/db.js";

export const PendingRegistrationModel = {
    insertOrUpdate: async(data) => {
        return await db("pending_registrations")
            .insert(data)
            .onConflict("email")
            .merge();
    },

    findValid: async (email, otp) => {
        return await db("pending_registrations")
            .where({ email, otp })
            .andWhere("expires_at", ">", new Date())
            .first();
    },

    findByEmail: async (email) => {
        return await db("pending_registrations")
            .where({ email })
            .first();
    },

    deleteByEmail: async (email, trx = db) => {
        return await trx("pending_registrations").where({ email }).del();
    }
};


export default PendingRegistrationModel;
