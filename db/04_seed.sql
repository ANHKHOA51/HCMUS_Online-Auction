-- Seed Data

INSERT INTO users
    (id, username, password_hash, full_name, email, address, role, rating_positive, rating_negative)
VALUES
    (1, 'admin', '$2b$10$6BJnXkfnLxRNwi9vG.fM.uELfZRLKVSLmXZn5Y6K7xZ5R8Y.q2rui', 'System Admin', 'admin@auction.com', 'Admin HQ', 1, 0, 0),
    (2, 'seller_tech', '$2b$10$6BJnXkfnLxRNwi9vG.fM.uELfZRLKVSLmXZn5Y6K7xZ5R8Y.q2rui', 'Tech Store', 'seller1@store.com', '123 Tech Street', 2, 100, 0),
    (3, 'seller_fashion', '$2b$10$6BJnXkfnLxRNwi9vG.fM.uELfZRLKVSLmXZn5Y6K7xZ5R8Y.q2rui', 'Fashion Boutique', 'seller2@store.com', '456 Fashion Ave', 2, 50, 2),
    (4, 'bidder_john', '$2b$10$6BJnXkfnLxRNwi9vG.fM.uELfZRLKVSLmXZn5Y6K7xZ5R8Y.q2rui', 'John Doe', 'john@gmail.com', '789 Bidder Lane', 0, 10, 0),
    (5, 'bidder_jane', '$2b$10$6BJnXkfnLxRNwi9vG.fM.uELfZRLKVSLmXZn5Y6K7xZ5R8Y.q2rui', 'Jane Smith', 'jane@gmail.com', '321 Buyer Blvd', 0, 5, 0);

INSERT INTO categories
    (id, name, description, parent_category_id)
VALUES
    (1, 'Electronics', 'Gadgets and devices', NULL),
    (2, 'Fashion', 'Clothing and accessories', NULL),
    (3, 'Home & Garden', 'Furniture and decor', NULL),
    (4, 'Phones', 'Mobile devices', 1),
    (5, 'Laptops', 'Laptop computers', 1),
    (6, 'Shoes', 'Footwear', 2),
    (7, 'Shirts', 'Clothing', 2),
    (8, 'Furniture', 'Home furniture', 3);

INSERT INTO products
    (id, seller_id, category_id, name, description, starting_price, current_price, buy_now_price, step_price, start_time, end_time, status, allow_newbie, images)
VALUES
    (1, 2, 4, 'iPhone 15 Pro', 'Description for iPhone 15 Pro. High quality item.', 20000000, 20000000, 30000000, 50000, NOW() - INTERVAL
'1 day', NOW
() + INTERVAL '20 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=1','https://picsum.photos/400/400?random=2','https://picsum.photos/400/400?random=3']),
(2, 2, 4, 'Samsung S24', 'Description for Samsung S24. High quality item.', 18000000, 18000000, 27000000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '21 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=4','https://picsum.photos/400/400?random=5','https://picsum.photos/400/400?random=15']),
(3, 2, 4, 'Pixel 8', 'Description for Pixel 8. High quality item.', 15000000, 15000000, 22500000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '19 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=6','https://picsum.photos/400/400?random=16','https://picsum.photos/400/400?random=17']),
(4, 2, 5, 'MacBook Pro M3', 'Description for MacBook Pro M3. High quality item.', 40000000, 40000000, 60000000, 100000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '25 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=7']),
(5, 2, 5, 'Dell XPS 15', 'Description for Dell XPS 15. High quality item.', 35000000, 35000000, 52500000, 100000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '24 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=8']),
(6, 3, 6, 'Nike Air Max', 'Description for Nike Air Max. High quality item.', 2000000, 2000000, 3000000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '23 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=9']),
(7, 3, 6, 'Adidas Ultraboost', 'Description for Adidas Ultraboost. High quality item.', 2500000, 2500000, 3750000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '22 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=10']),
(8, 3, 7, 'Gucci T-Shirt', 'Description for Gucci T-Shirt. High quality item.', 5000000, 5000000, 7500000, 100000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '28 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=11']),
(9, 3, 7, 'Zara Shirt', 'Description for Zara Shirt. High quality item.', 500000, 500000, 750000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '19 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=12']),
(10, 2, 8, 'Modern Sofa', 'Description for Modern Sofa. High quality item.', 5000000, 5000000, 7500000, 100000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '25 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=13','https://picsum.photos/400/400?random=18','https://picsum.photos/400/400?random=19']),
(11, 4, 4, 'Vintage Camera (Sold)', 'A beautiful vintage camera. Sold to John.', 5000000, 6000000, 8000000, 100000, NOW
() - INTERVAL '7 days', NOW
() - INTERVAL '1 day', 'sold', true, ARRAY['https://picsum.photos/400/400?random=14','https://picsum.photos/400/400?random=20','https://picsum.photos/400/400?random=21']);

(12, 2, 4, 'Oppo Find X7', 'Flagship Oppo smartphone.', 14000000, 14000000, 21000000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '18 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=22','https://picsum.photos/400/400?random=23','https://picsum.photos/400/400?random=24']),
(13, 2, 4, 'Xiaomi 14', 'Latest Xiaomi phone.', 12000000, 12000000, 18000000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '17 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=25','https://picsum.photos/400/400?random=26','https://picsum.photos/400/400?random=27']),
(14, 2, 5, 'ThinkPad X1', 'Premium Lenovo laptop.', 30000000, 30000000, 45000000, 100000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '23 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=28','https://picsum.photos/400/400?random=29','https://picsum.photos/400/400?random=30']),
(15, 2, 5, 'Asus ROG', 'Gaming laptop.', 25000000, 25000000, 37500000, 100000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '22 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=31','https://picsum.photos/400/400?random=32','https://picsum.photos/400/400?random=33']),
(16, 2, 5, 'HP Spectre', 'Ultrabook HP.', 28000000, 28000000, 42000000, 100000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '21 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=34','https://picsum.photos/400/400?random=35','https://picsum.photos/400/400?random=36']),
(17, 3, 6, 'Puma Suede', 'Classic Puma shoes.', 1500000, 1500000, 2250000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '20 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=37','https://picsum.photos/400/400?random=38','https://picsum.photos/400/400?random=39']),
(18, 3, 6, 'Converse All Star', 'Iconic Converse sneakers.', 1000000, 1000000, 1500000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '19 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=40','https://picsum.photos/400/400?random=41','https://picsum.photos/400/400?random=42']),
(19, 3, 6, 'Vans Old Skool', 'Popular Vans shoes.', 1200000, 1200000, 1800000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '18 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=43','https://picsum.photos/400/400?random=44','https://picsum.photos/400/400?random=45']),
(20, 3, 7, 'Uniqlo Tee', 'Comfortable Uniqlo t-shirt.', 300000, 300000, 450000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '17 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=46','https://picsum.photos/400/400?random=47','https://picsum.photos/400/400?random=48']),
(21, 3, 7, 'H&M Hoodie', 'Trendy H&M hoodie.', 600000, 600000, 900000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '16 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=49','https://picsum.photos/400/400?random=50','https://picsum.photos/400/400?random=51']),
(22, 3, 7, 'Levis Denim Shirt', 'Stylish Levis shirt.', 1500000, 1500000, 2250000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '15 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=52','https://picsum.photos/400/400?random=53','https://picsum.photos/400/400?random=54']),
(23, 2, 8, 'Office Chair', 'Ergonomic office chair.', 2000000, 2000000, 3000000, 100000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '14 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=55','https://picsum.photos/400/400?random=56','https://picsum.photos/400/400?random=57']),
(24, 2, 8, 'Wooden Desk', 'Solid wood desk.', 3500000, 3500000, 5250000, 100000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '13 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=58','https://picsum.photos/400/400?random=59','https://picsum.photos/400/400?random=60']),
(25, 2, 8, 'Bookshelf', 'Spacious bookshelf.', 2500000, 2500000, 3750000, 100000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '12 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=61','https://picsum.photos/400/400?random=62','https://picsum.photos/400/400?random=63']),
(26, 2, 8, 'Table Lamp', 'Modern table lamp.', 500000, 500000, 750000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '11 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=64','https://picsum.photos/400/400?random=65','https://picsum.photos/400/400?random=66']),
(27, 2, 8, 'Wall Clock', 'Decorative wall clock.', 400000, 400000, 600000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '10 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=67','https://picsum.photos/400/400?random=68','https://picsum.photos/400/400?random=69']),
(28, 2, 8, 'Floor Mat', 'Soft floor mat.', 300000, 300000, 450000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '9 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=70','https://picsum.photos/400/400?random=71','https://picsum.photos/400/400?random=72']),
(29, 2, 8, 'Curtains', 'Elegant curtains.', 800000, 800000, 1200000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '8 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=73','https://picsum.photos/400/400?random=74','https://picsum.photos/400/400?random=75']),
(30, 2, 8, 'Ceiling Fan', 'Energy-saving ceiling fan.', 1200000, 1200000, 1800000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '7 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=76','https://picsum.photos/400/400?random=77','https://picsum.photos/400/400?random=78']),
(31, 3, 6, 'Reebok Classic', 'Classic Reebok shoes.', 1700000, 1700000, 2550000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '6 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=79','https://picsum.photos/400/400?random=80','https://picsum.photos/400/400?random=81']),
(32, 3, 6, 'Fila Disruptor', 'Trendy Fila shoes.', 1600000, 1600000, 2400000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '5 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=82','https://picsum.photos/400/400?random=83','https://picsum.photos/400/400?random=84']),
(33, 3, 7, 'Lacoste Polo', 'Premium Lacoste polo.', 2000000, 2000000, 3000000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '4 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=85','https://picsum.photos/400/400?random=86','https://picsum.photos/400/400?random=87']),
(34, 3, 7, 'Gap Sweater', 'Warm Gap sweater.', 900000, 900000, 1350000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '3 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=88','https://picsum.photos/400/400?random=89','https://picsum.photos/400/400?random=90']),
(35, 3, 7, 'Tommy Hilfiger Shirt', 'Designer Tommy shirt.', 2500000, 2500000, 3750000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '2 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=91','https://picsum.photos/400/400?random=92','https://picsum.photos/400/400?random=93']),
(36, 2, 4, 'Realme GT', 'Affordable Realme phone.', 9000000, 9000000, 13500000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '15 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=94','https://picsum.photos/400/400?random=95','https://picsum.photos/400/400?random=96']),
(37, 2, 4, 'Vivo V30', 'Vivo smartphone.', 11000000, 11000000, 16500000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '14 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=97','https://picsum.photos/400/400?random=98','https://picsum.photos/400/400?random=99']),
(38, 2, 5, 'MSI Stealth', 'MSI gaming laptop.', 32000000, 32000000, 48000000, 100000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '13 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=100','https://picsum.photos/400/400?random=101','https://picsum.photos/400/400?random=102']),
(39, 2, 5, 'Acer Swift', 'Lightweight Acer laptop.', 22000000, 22000000, 33000000, 100000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '12 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=103','https://picsum.photos/400/400?random=104','https://picsum.photos/400/400?random=105']),
(40, 2, 8, 'Bean Bag', 'Comfortable bean bag.', 700000, 700000, 1050000, 50000, NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '11 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=106','https://picsum.photos/400/400?random=107','https://picsum.photos/400/400?random=108']);

UPDATE products SET winner_id = 4 WHERE id = 11;

INSERT INTO bids
    (id, product_id, bidder_id, bid_amount, bid_time, status, is_auto_bid)
VALUES
    (1, 1, 4, 20500000, NOW() - INTERVAL
'10 minutes', 1, false),
(2, 1, 5, 21000000, NOW
() - INTERVAL '5 minutes', 1, false),
(3, 2, 4, 18500000, NOW
() - INTERVAL '20 minutes', 1, false),
(4, 11, 4, 6000000, NOW
() - INTERVAL '2 days', 1, false);

UPDATE products SET current_price = 21000000 WHERE id = 1;
UPDATE products SET current_price = 18500000 WHERE id = 2;

INSERT INTO auto_bids
    (id, product_id, bidder_id, max_auto_bid, current_bid_amount, status)
VALUES
    (1, 1, 5, 25000000, 21000000, 'active'),
    (2, 2, 4, 20000000, 18500000, 'active');

INSERT INTO ratings
    (id, from_user_id, to_user_id, product_id, comment, score)
VALUES
    (1, 4, 2, 11, 'Great seller, fast delivery!', '+1'),
    (2, 5, 3, 6, 'Good product quality', '+1');
