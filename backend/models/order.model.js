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

    findById: async (id) => {
        return db('orders').where({ id }).first();
    },

    // Cập nhật trạng thái và ghi chú (nếu có)
    updateStatus: async (id, status, seller_note = null) => {
        const updateData = { status };
        if (seller_note !== null) {
            updateData.seller_note = seller_note;
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
    }
};

export default OrderModel;
