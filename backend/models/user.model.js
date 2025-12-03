import { db } from "../utils/db.js";

export const UserModel = {
    checkExistedUserEmail: async (username, email) => {
        const rows = await db('users')
            .where(function () { this.where('username', username).orWhere('email', email); })
            .select('username', 'email');
        return {
            username: rows.some(r => r.username === username),
            email: rows.some(r => r.email === email)
        };
    },
    
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
