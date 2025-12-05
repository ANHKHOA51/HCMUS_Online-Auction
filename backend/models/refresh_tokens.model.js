import { db } from "../utils/db.js";

export const RefreshTokenModel = {
    findByToken: (token) => {
        return db("refresh_tokens")
            .where("token", token)
            .first();
    },

    insert: async (userData) => {
        return db("refresh_tokens")
            .insert(userData)
            .returning("id");
    },

    deleteToken: (token) => {
        return db("refresh_tokens")
            .where("token", token)
            .del();
    }
};

export default RefreshTokenModel;