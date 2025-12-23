import { db } from "../utils/db.js";

export const UserModel = {

    findById: (id) => {
        return db("users").where({ id }).first();
    },
    
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
    },

    getRatingStats: async (userId) => {
        try {
            const rows = await db('ratings')
                .where({ to_user_id: userId })
                .select(
                    db.raw('COUNT(*) AS totalRatings'),
                    db.raw('AVG(score) AS averageRating')
                )
                .first();

            return {
                totalRatings: parseInt(rows?.totalRatings, 10) || 0,
                averageRating: parseFloat(rows?.averageRating) || 0,
                score: 0.8  // Default score
            };
        } catch (error) {
            console.warn(' getRatingStats error:', error.message);
            return {
                totalRatings: 0,
                averageRating: 0,
                score: 0.8  // Default score (allow bid)
            };
        }
    }
};

export default UserModel;
