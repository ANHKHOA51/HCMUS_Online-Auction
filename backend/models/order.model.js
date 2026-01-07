import { db } from '../utils/db.js';

export const OrderModel = {
    // Tìm đơn hàng của người bán (thông qua product_id -> seller_id)
    findBySeller: async (sellerId) => {
        return db('orders as o')
            .select(
                'o.*',
                'p.name as product_name',
                'p.current_price as amount',
                'p.images as product_images',
                'b.full_name as buyer_name',
                'b.email as buyer_email'
            )
            .join('products as p', 'o.product_id', 'p.id')
            .join('users as b', 'o.buyer_id', 'b.id')
            .where('p.seller_id', sellerId)
            .orderBy('o.created_at', 'desc');
    },

    cancelOrder: async (id, reason) => {
        return db('orders').where({ id }).update({
            status: 'cancelled',
            is_cancelled: true,
            cancellation_reason: reason,
            buyer_rating: -1,
            buyer_comment: 'Auto-negative: Order cancelled'
        });
    },
    // Tìm đơn hàng của người mua
    findByBuyer: async (buyerId) => {
        return db('orders as o')
            .select(
                'o.*',
                'p.name as product_name',
                'p.current_price as amount',
                'p.images as product_images',
                's.full_name as seller_name'
            )
            .join('products as p', 'o.product_id', 'p.id')
            .join('users as s', 'p.seller_id', 's.id')
            .where('o.buyer_id', buyerId)
            .orderBy('o.created_at', 'desc');
    },

    findById: async (id) => {
        return db('orders').where({ id }).first();
    },

    // Cập nhật trạng thái và ghi chú (nếu có)
    updateStatus: async (id, status, seller_note = null, shipping_info = null) => {
        const updateData = { status };
        if (seller_note !== null) {
            updateData.seller_note = seller_note;
        }
        if (shipping_info !== null) {
            updateData.shipping_info = shipping_info;
        }
        return db('orders').where({ id }).update(updateData);
    },

    // Tạo đơn hàng (dùng cho testing hoặc flow mua hàng sau này)
    create: async ({ product_id, buyer_id, status, payment_info }) => {
        return db('orders').insert({
            product_id,
            buyer_id,
            status,
            payment_info
        }).returning('id');
    },

    // Cập nhật thông tin order (generic update)
    update: async (id, data) => {
        return db('orders').where({ id }).update(data);
    }
};

export default OrderModel;
