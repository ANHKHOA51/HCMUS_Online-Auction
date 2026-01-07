import { db } from './utils/db.js';

/**
 * SEED TEST DATA FOR ORDER WIZARD FEATURE
 * 
 * This script creates realistic test orders for:
 * 1. Buyer flow: Complete checkout with payment
 * 2. Seller flow: Confirm payment + upload shipping code
 */

async function seedOrdersData() {
    try {
        console.log('🌱 Starting order data seeding...');

        // Step 1: Ensure products with sold status exist and have winners
        console.log('\n📦 Step 1: Create SOLD products with winners...');
        
        const soldProducts = [
            {
                id: 100,
                seller_id: 2,
                category_id: 4,
                name: 'iPhone 15 Pro (Test - Sold)',
                description: 'Sold product for testing checkout wizard',
                starting_price: 20000000,
                current_price: 21500000,
                buy_now_price: 30000000,
                step_price: 50000,
                status: 'sold',
                winner_id: 4, // John (bidder)
                allow_newbie: true,
                images: ['https://picsum.photos/400/400?random=sold1']
            },
            {
                id: 101,
                seller_id: 2,
                category_id: 4,
                name: 'Samsung S24 (Test - Sold)',
                description: 'Sold product for testing order completion',
                starting_price: 18000000,
                current_price: 18500000,
                buy_now_price: 27000000,
                step_price: 50000,
                status: 'sold',
                winner_id: 5, // Jane (bidder)
                allow_newbie: true,
                images: ['https://picsum.photos/400/400?random=sold2']
            }
        ];

        for (const product of soldProducts) {
            const existing = await db('products').where('id', product.id).first();
            if (!existing) {
                await db('products').insert({
                    ...product,
                    images: product.images,
                    start_time: db.raw('NOW() - INTERVAL \'5 days\''),
                    end_time: db.raw('NOW() - INTERVAL \'1 day\''),
                    created_at: db.raw('NOW()'),
                    updated_at: db.raw('NOW()')
                });
                console.log(`✅ Product ${product.id}: ${product.name} created`);
            } else {
                console.log(`⏭️  Product ${product.id} already exists`);
            }
        }

        // Step 2: Create PENDING orders (for buyer to complete payment)
        console.log('\n💳 Step 2: Create PENDING orders...');
        
        const pendingOrders = [
            {
                id: 1000,
                product_id: 100,
                buyer_id: 4, // John
                status: 'pending', // Not paid yet
                payment_info: null,
                shipping_info: null,
                seller_note: null,
                created_at: db.raw('NOW() - INTERVAL \'2 hours\'')
            },
            {
                id: 1001,
                product_id: 101,
                buyer_id: 5, // Jane
                status: 'pending', // Not paid yet
                payment_info: null,
                shipping_info: null,
                seller_note: null,
                created_at: db.raw('NOW() - INTERVAL \'1 hour\'')
            }
        ];

        for (const order of pendingOrders) {
            const existing = await db('orders').where('id', order.id).first();
            if (!existing) {
                await db('orders').insert(order);
                console.log(`✅ Order ${order.id}: PENDING (Buyer: ${order.buyer_id}, Product: ${order.product_id})`);
            } else {
                console.log(`⏭️  Order ${order.id} already exists`);
            }
        }

        // Step 3: Create PAID orders (for seller to upload shipping)
        console.log('\n📤 Step 3: Create PAID orders (waiting for seller to ship)...');
        
        const paidOrders = [
            {
                id: 1002,
                product_id: 100,
                buyer_id: 4,
                status: 'paid', // Buyer paid
                payment_info: {
                    method: 'banking',
                    bank: 'Vietcombank',
                    account: '****1234',
                    timestamp: new Date().toISOString()
                },
                shipping_info: null, // Seller hasn't shipped yet
                seller_note: null,
                created_at: db.raw('NOW() - INTERVAL \'30 minutes\'')
            }
        ];

        for (const order of paidOrders) {
            const existing = await db('orders').where('id', order.id).first();
            if (!existing) {
                await db('orders').insert(order);
                console.log(`✅ Order ${order.id}: PAID (waiting for seller to ship)`);
            } else {
                console.log(`⏭️  Order ${order.id} already exists`);
            }
        }

        // Step 4: Create SHIPPED orders (for buyer to confirm)
        console.log('\n📮 Step 4: Create SHIPPED orders...');
        
        const shippedOrders = [
            {
                id: 1003,
                product_id: 101,
                buyer_id: 5,
                status: 'shipped', // Seller uploaded shipping code
                payment_info: {
                    method: 'cod',
                    timestamp: new Date().toISOString()
                },
                shipping_info: {
                    address: '321 Buyer Blvd, HCMC',
                    method: 'GHN',
                    tracking: 'GHN-2024-999888-777'
                },
                seller_note: 'Gói hàng đã chuẩn bị gửi đi. Vui lòng kiểm tra trong 3-5 ngày.',
                created_at: db.raw('NOW() - INTERVAL \'20 minutes\'')
            }
        ];

        for (const order of shippedOrders) {
            const existing = await db('orders').where('id', order.id).first();
            if (!existing) {
                await db('orders').insert(order);
                console.log(`✅ Order ${order.id}: SHIPPED (tracking: GHN-2024-999888-777)`);
            } else {
                console.log(`⏭️  Order ${order.id} already exists`);
            }
        }

        // Step 5: Display test data summary
        console.log('\n📊 TEST DATA SUMMARY:');
        console.log('='.repeat(60));
        
        const allOrders = await db('orders').select('*');
        for (const order of allOrders) {
            const product = await db('products').where('id', order.product_id).first();
            const buyer = await db('users').where('id', order.buyer_id).first();
            console.log(`\nOrder #${order.id}:`);
            console.log(`  Product: ${product.name} (ID: ${product.id})`);
            console.log(`  Buyer: ${buyer.full_name} (ID: ${buyer.id})`);
            console.log(`  Status: ${order.status.toUpperCase()}`);
            console.log(`  Amount: ${product.current_price.toLocaleString('vi-VN')} VNĐ`);
            if (order.payment_info) console.log(`  Payment: ${order.payment_info}`);
            if (order.shipping_info) console.log(`  Shipping: ${order.shipping_info}`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ SEEDING COMPLETED!\n');
        
        console.log('🧪 TEST SCENARIOS:');
        console.log('1. BUYER FLOW (Order #1000): /checkout/1000');
        console.log('   - Step 1: Review order');
        console.log('   - Step 2: Enter shipping address');
        console.log('   - Step 3: Choose payment method (COD or Banking)');
        console.log('   - Step 4: Success page');
        console.log('');
        console.log('2. SELLER FLOW (Order #1002): SellerOrderList');
        console.log('   - Show order with status "paid"');
        console.log('   - Seller uploads shipping code');
        console.log('   - Order updates to "shipped"');
        console.log('');
        console.log('3. BUYER CONFIRMATION (Order #1003): WonListTab');
        console.log('   - Show order with status "shipped"');
        console.log('   - Display tracking info');
        console.log('   - Allow buyer to rate seller');

    } catch (error) {
        console.error('❌ Error seeding orders:', error);
        throw error;
    }
}

// Run the seeding
seedOrdersData()
    .then(() => {
        console.log('\n✨ All test data ready!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Failed:', err);
        process.exit(1);
    });
