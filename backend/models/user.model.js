import { db } from "../utils/db.js";

export const UserModel = {
    findByUsernameOrEmail: (identifier) => {
        return db("users")
            .where("username", identifier)
            .orWhere("email", identifier)
            .first();
    },

    insert: async (userData, trx = db) => {
        return trx("users")
            .insert(userData)
            .returning("id");
    },

    existsByEmail: async (email) => {
        return db("users").where({ email }).first();
    },

    existsByUsername: async (username) => {
        return db("users").where({ username }).first();
    }
};

export default UserModel;
