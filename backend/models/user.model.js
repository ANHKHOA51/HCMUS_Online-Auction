import { db } from "../utils/db.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { generatePassword, hashPassword } from "../utils/password.js";

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

    findByToken: async (token) => {
        const decodedToken = verifyAccessToken(token);
        const user = await db("users")
            .where("id", decodedToken.id)
            .first();
        return user;
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
    },

    getAllUsers: async () => {
        return db("users").select("id", "username", "full_name as name", "email", "role");
    },

    getBidderRequests: async () => {
        return db("bidder_requests")
            .join("users", "users.id", "bidder_requests.bidder_id")
            .select("users.id", "users.full_name as name", "users.email", "users.role", "bidder_requests.created_at");
    },

    updateRole: async (id, role) => {
        return db("users").where({ id }).update({ role });
    },

    acceptUpgrade: async (id) => {
        // transaction
        return db.transaction(async (trx) => {
            await trx("bidder_requests").where("bidder_id", id).delete();
            await trx("users").where({ id }).update({ role: 2, expired_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) });
        });
    },

    rejectUpgrade: async (id) => {
        return db("bidder_requests").where("bidder_id", id).delete();
    },

    getUserById: async (id) => {
        return db("users").where({ id }).first();
    },

    resetPassword: async (id) => {
        const password = generatePassword();
        const password_hash = await hashPassword(password);
        const email = await db("users").where({ id }).update({ password_hash }).returning(["email"]);
        return { email: email[0].email, password };
    },

    deleteUser: async (id) => {
        return db.transaction(async (trx) => {
            // 1. Get products owned by user to delete related data first
            const userProducts = await trx("products").where("seller_id", id).select("id");
            const productIds = userProducts.map(p => p.id);

            if (productIds.length > 0) {
                // Delete data related to user's products
                await trx("bidder_requests").whereIn("product_id", productIds).delete();
                await trx("bids").whereIn("product_id", productIds).delete();
                await trx("questions_answers").whereIn("product_id", productIds).delete();
                await trx("ratings").whereIn("product_id", productIds).delete();
                await trx("watch_lists").whereIn("product_id", productIds).delete();
                await trx("notifications").whereIn("related_product_id", productIds).delete();

                // Finally delete the products
                await trx("products").whereIn("id", productIds).delete();
            }

            // 2. Clear references where user is winner (set to null)
            await trx("products").where("winner_id", id).update({ winner_id: null });

            // 3. Delete direct user data
            await trx("activity_logs").where("user_id", id).delete();
            await trx("bidder_requests").where("bidder_id", id).delete();
            await trx("bids").where("bidder_id", id).delete();
            await trx("notifications").where("user_id", id).delete();
            await trx("questions_answers").where("user_id", id).orWhere("answered_by", id).delete();
            await trx("ratings").where("from_user_id", id).orWhere("to_user_id", id).delete();
            await trx("refresh_tokens").where("user_id", id).delete();
            await trx("watch_lists").where("user_id", id).delete();

            // 4. Finally delete the user
            await trx("users").where({ id }).delete();
        });
    },

    update: async (id, data) => {
        return db('users')
            .where({ id })
            .update(data)
            .returning('*'); // Trả về user đã update
    },

    findByIdWithPassword: (id) => {
        return db('users').where({ id }).first();
    }

};

export default UserModel;
