import { db } from './utils/db.js';

async function createMockOrder() {
    try {
        // 1. Find a product
        const product = await db('products')
            .join('users', 'products.seller_id', 'users.id')
            .select('products.id', 'products.name', 'products.current_price', 'products.seller_id', 'users.username as seller_username')
            .first();

        if (!product) {
            console.error('No products found. Please create a product first.');
            process.exit(1);
        }

        // 2. Find a buyer (who is not the seller)
        const buyer = await db('users')
            .whereNot('id', product.seller_id)
            .first();

        if (!buyer) {
            console.error('No suitable buyer found.');
            process.exit(1);
        }

        console.log(`Found Product: ${product.name} (ID: ${product.id}), Seller: ${product.seller_username} (ID: ${product.seller_id})`);
        console.log(`Found Buyer: ${buyer.username} (ID: ${buyer.id})`);

        // 3. Insert Order
        const [orderId] = await db('orders').insert({
            product_id: product.id,
            buyer_id: buyer.id,
            status: 'pending',
            payment_info: 'Bank Transfer: Transaction ID 123456789. Time: 10:00 AM',
            seller_note: ''
        }).returning('id');

        console.log(`✓ Mock Order created successfully. Order ID: ${orderId.id}`);
        console.log(`-> Please login as seller "${product.seller_username}" (ID: ${product.seller_id}) and navigate to /seller/orders to verify.`);

        process.exit(0);
    } catch (error) {
        console.error('Error creating mock order:', error);
        process.exit(1);
    }
}

createMockOrder();
