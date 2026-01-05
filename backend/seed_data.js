import { db } from './utils/db.js';
import { hashPassword } from './utils/password.js';

const ROLE_BIDDER = 0;
const ROLE_ADMIN = 1; // Assuming 1 is Admin based on elimination, or could be 3.
const ROLE_SELLER = 2; // Confirmed by Header.jsx

async function seed() {
    console.log('🌱 Starting seed...');

    try {
        // 1. Clean up
        console.log('🧹 Cleaning tables...');
        // Child tables first
        await db('orders').del();
        await db('notifications').del();
        await db('bidder_requests').del();
        await db('activity_logs').del();
        await db('refresh_tokens').del();
        await db('pending_registrations').del();
        
        await db('bids').del();
        await db('watch_lists').del();
        await db('questions_answers').del();
        await db('ratings').del();
        
        // Parent tables
        await db('products').del();
        await db('categories').del();
        await db('users').del();
        
        // Reset sequences (Postgres specific)
        await db.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
        await db.raw('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
        await db.raw('ALTER SEQUENCE products_id_seq RESTART WITH 1');
        await db.raw('ALTER SEQUENCE bids_id_seq RESTART WITH 1');

        // 2. Insert Users
        console.log('👤 Inserting users...');
        const passwordHash = await hashPassword('123456');
        
        const users = [
            {
                username: 'admin',
                password_hash: passwordHash,
                full_name: 'System Admin',
                email: 'admin@auction.com',
                role: ROLE_ADMIN,
                address: 'Admin HQ'
            },
            {
                username: 'seller_tech',
                password_hash: passwordHash,
                full_name: 'Tech Store',
                email: 'seller1@store.com',
                role: ROLE_SELLER,
                address: '123 Tech Street',
                rating_positive: 100,
                rating_negative: 0
            },
            {
                username: 'seller_fashion',
                password_hash: passwordHash,
                full_name: 'Fashion Boutique',
                email: 'seller2@store.com',
                role: ROLE_SELLER,
                address: '456 Fashion Ave',
                rating_positive: 50,
                rating_negative: 2
            },
            {
                username: 'bidder_john',
                password_hash: passwordHash,
                full_name: 'John Doe',
                email: 'john@gmail.com',
                role: ROLE_BIDDER,
                address: '789 Bidder Lane',
                rating_positive: 10,
                rating_negative: 0
            },
            {
                username: 'bidder_jane',
                password_hash: passwordHash,
                full_name: 'Jane Smith',
                email: 'jane@gmail.com',
                role: ROLE_BIDDER,
                address: '321 Buyer Blvd',
                rating_positive: 5,
                rating_negative: 0
            }
        ];

        const userIds = await db('users').insert(users).returning('id');
        // Map usernames to IDs for reference
        const userMap = {};
        users.forEach((u, i) => userMap[u.username] = userIds[i].id);

        // 3. Insert Categories
        console.log('📂 Inserting categories...');
        
        // Parent Categories
        const electronics = await db('categories').insert({ name: 'Electronics', description: 'Gadgets and devices' }).returning('id');
        const fashion = await db('categories').insert({ name: 'Fashion', description: 'Clothing and accessories' }).returning('id');
        const home = await db('categories').insert({ name: 'Home & Garden', description: 'Furniture and decor' }).returning('id');

        const elecId = electronics[0].id;
        const fashId = fashion[0].id;
        const homeId = home[0].id;

        // Child Categories
        const phones = await db('categories').insert({ name: 'Phones', parent_category_id: elecId }).returning('id');
        const laptops = await db('categories').insert({ name: 'Laptops', parent_category_id: elecId }).returning('id');
        const shoes = await db('categories').insert({ name: 'Shoes', parent_category_id: fashId }).returning('id');
        const shirts = await db('categories').insert({ name: 'Shirts', parent_category_id: fashId }).returning('id');
        const furniture = await db('categories').insert({ name: 'Furniture', parent_category_id: homeId }).returning('id');

        const catMap = {
            phones: phones[0].id,
            laptops: laptops[0].id,
            shoes: shoes[0].id,
            shirts: shirts[0].id,
            furniture: furniture[0].id
        };

        // 4. Insert Products
        console.log('📦 Inserting products...');
        const products = [];
        const now = new Date();
        
        // Helper to create product
        const createProduct = (name, catId, seller, price, daysEnd) => {
            const endTime = new Date(now.getTime() + daysEnd * 24 * 60 * 60 * 1000);
            return {
                name,
                category_id: catId,
                seller_id: userMap[seller],
                starting_price: price,
                current_price: price,
                buy_now_price: price * 1.5,
                step_price: 50000,
                start_time: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Started yesterday
                end_time: endTime,
                status: 'active',
                description: `Description for ${name}. High quality item.`,
                images: [
                    `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 10000)}`,
                    `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 10000)}`,
                    `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 10000)}`
                ],
                allow_newbie: true
            };
        };

        // 20+ Products
        // Phones
        products.push(createProduct('iPhone 15 Pro', catMap.phones, 'seller_tech', 20000000, 2));
        products.push(createProduct('Samsung S24', catMap.phones, 'seller_tech', 18000000, 3));
        products.push(createProduct('Pixel 8', catMap.phones, 'seller_tech', 15000000, 1));
        products.push(createProduct('Xiaomi 14', catMap.phones, 'seller_tech', 12000000, 5));
        products.push(createProduct('Oppo Find X7', catMap.phones, 'seller_tech', 14000000, 4));
        
        // Laptops
        products.push(createProduct('MacBook Pro M3', catMap.laptops, 'seller_tech', 40000000, 7));
        products.push(createProduct('Dell XPS 15', catMap.laptops, 'seller_tech', 35000000, 6));
        products.push(createProduct('ThinkPad X1', catMap.laptops, 'seller_tech', 30000000, 2));
        products.push(createProduct('Asus ROG', catMap.laptops, 'seller_tech', 25000000, 1));
        products.push(createProduct('HP Spectre', catMap.laptops, 'seller_tech', 28000000, 3));

        // Shoes
        products.push(createProduct('Nike Air Max', catMap.shoes, 'seller_fashion', 2000000, 5));
        products.push(createProduct('Adidas Ultraboost', catMap.shoes, 'seller_fashion', 2500000, 4));
        products.push(createProduct('Puma Suede', catMap.shoes, 'seller_fashion', 1500000, 3));
        products.push(createProduct('Converse All Star', catMap.shoes, 'seller_fashion', 1000000, 2));
        products.push(createProduct('Vans Old Skool', catMap.shoes, 'seller_fashion', 1200000, 6));

        // Shirts
        products.push(createProduct('Gucci T-Shirt', catMap.shirts, 'seller_fashion', 5000000, 10));
        products.push(createProduct('Zara Shirt', catMap.shirts, 'seller_fashion', 500000, 1));
        products.push(createProduct('Uniqlo Tee', catMap.shirts, 'seller_fashion', 300000, 2));
        products.push(createProduct('H&M Hoodie', catMap.shirts, 'seller_fashion', 600000, 3));
        products.push(createProduct('Levis Denim Shirt', catMap.shirts, 'seller_fashion', 1500000, 4));

        // Furniture
        products.push(createProduct('Modern Sofa', catMap.furniture, 'seller_tech', 5000000, 7)); // Tech seller selling furniture? Why not.
        products.push(createProduct('Office Chair', catMap.furniture, 'seller_tech', 2000000, 2));

        // --- ADDED: Won Product for bidder_john ---
        const wonProduct = {
            name: 'Vintage Camera (Sold)',
            category_id: catMap.phones, // Using phones category as placeholder
            seller_id: userMap['seller_tech'],
            starting_price: 5000000,
            current_price: 6000000,
            buy_now_price: 8000000,
            step_price: 100000,
            start_time: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // Started 7 days ago
            end_time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),   // Ended 1 day ago
            status: 'sold',
            description: 'A beautiful vintage camera. Sold to John.',
            images: [
                `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 10000)}`
            ],
            allow_newbie: true,
            winner_id: userMap['bidder_john']
        };
        products.push(wonProduct);
        // ------------------------------------------

        const insertedProducts = await db('products').insert(products).returning('*');

        // 5. Insert Bids (Sample Data)
        console.log('🔨 Inserting sample bids...');
        const productWithBids = insertedProducts[0]; // iPhone 15 Pro
        const bidderId = userMap['bidder_john'];
        const bidAmount = productWithBids.starting_price + 500000;

        await db('bids').insert({
            product_id: productWithBids.id,
            bidder_id: bidderId,
            bid_amount: bidAmount,
            bid_time: new Date()
        });

        // Update product with winner and new price
        await db('products').where('id', productWithBids.id).update({
            current_price: bidAmount,
            winner_id: bidderId
        });

        console.log('✅ Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
