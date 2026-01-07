
import { db } from '../utils/db.js';

async function runMigration() {
    try {
        console.log('Running Order feature migration...');

        // 1. Create orders table
        const hasOrders = await db.schema.hasTable('orders');
        if (!hasOrders) {
            await db.schema.createTable('orders', function (table) {
                table.increments('id').primary();
                table.integer('product_id').references('id').inTable('products').onDelete('CASCADE');
                table.integer('seller_id').references('id').inTable('users');
                table.integer('buyer_id').references('id').inTable('users');
                table.decimal('final_price', 14, 2);
                table.string('status').defaultTo('pending'); // pending, paid, shipped, received, cancelled, completed
                table.text('payment_proof').nullable();
                table.text('payment_address').nullable(); // Buyer address
                table.text('shipping_proof').nullable();
                table.boolean('seller_rated').defaultTo(false);
                table.boolean('buyer_rated').defaultTo(false);
                table.timestamp('created_at').defaultTo(db.fn.now());
                table.timestamp('updated_at').defaultTo(db.fn.now());
            });
            console.log('✅ Created "orders" table.');
        }

        // 2. Create order_messages table (for chat)
        const hasMessages = await db.schema.hasTable('order_messages');
        if (!hasMessages) {
            await db.schema.createTable('order_messages', function (table) {
                table.increments('id').primary();
                table.integer('order_id').references('id').inTable('orders').onDelete('CASCADE');
                table.integer('sender_id').references('id').inTable('users');
                table.text('content');
                table.timestamp('created_at').defaultTo(db.fn.now());
            });
             console.log('✅ Created "order_messages" table.');
        }

        console.log('Migration completed.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
