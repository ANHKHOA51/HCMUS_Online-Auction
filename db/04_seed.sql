-- Seed Data

INSERT INTO users (id, username, password_hash, full_name, email, address, role, rating_positive, rating_negative) VALUES
(1, 'admin', '$2b$10$6BJnXkfnLxRNwi9vG.fM.uELfZRLKVSLmXZn5Y6K7xZ5R8Y.q2rui', 'System Admin', 'admin@auction.com', 'Admin HQ', 1, 0, 0),
(2, 'seller_tech', '$2b$10$6BJnXkfnLxRNwi9vG.fM.uELfZRLKVSLmXZn5Y6K7xZ5R8Y.q2rui', 'Tech Store', 'seller1@store.com', '123 Tech Street', 2, 100, 0),
(3, 'seller_fashion', '$2b$10$6BJnXkfnLxRNwi9vG.fM.uELfZRLKVSLmXZn5Y6K7xZ5R8Y.q2rui', 'Fashion Boutique', 'seller2@store.com', '456 Fashion Ave', 2, 50, 2),
(4, 'bidder_john', '$2b$10$6BJnXkfnLxRNwi9vG.fM.uELfZRLKVSLmXZn5Y6K7xZ5R8Y.q2rui', 'John Doe', 'john@gmail.com', '789 Bidder Lane', 0, 10, 0),
(5, 'bidder_jane', '$2b$10$6BJnXkfnLxRNwi9vG.fM.uELfZRLKVSLmXZn5Y6K7xZ5R8Y.q2rui', 'Jane Smith', 'jane@gmail.com', '321 Buyer Blvd', 0, 5, 0);

INSERT INTO categories (id, name, description, parent_category_id) VALUES
(1, 'Electronics', 'Gadgets and devices', NULL),
(2, 'Fashion', 'Clothing and accessories', NULL),
(3, 'Home & Garden', 'Furniture and decor', NULL),
(4, 'Phones', 'Mobile devices', 1),
(5, 'Laptops', 'Laptop computers', 1),
(6, 'Shoes', 'Footwear', 2),
(7, 'Shirts', 'Clothing', 2),
(8, 'Furniture', 'Home furniture', 3);

INSERT INTO products (id, seller_id, category_id, name, description, starting_price, current_price, buy_now_price, step_price, start_time, end_time, status, allow_newbie, images) VALUES
(1, 2, 4, 'iPhone 15 Pro', 'Description for iPhone 15 Pro. High quality item.', 20000000, 20000000, 30000000, 50000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '2 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=1','https://picsum.photos/400/400?random=2','https://picsum.photos/400/400?random=3']),
(2, 2, 4, 'Samsung S24', 'Description for Samsung S24. High quality item.', 18000000, 18000000, 27000000, 50000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '3 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=4','https://picsum.photos/400/400?random=5']),
(3, 2, 4, 'Pixel 8', 'Description for Pixel 8. High quality item.', 15000000, 15000000, 22500000, 50000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '1 day', 'active', true, ARRAY['https://picsum.photos/400/400?random=6']),
(4, 2, 5, 'MacBook Pro M3', 'Description for MacBook Pro M3. High quality item.', 40000000, 40000000, 60000000, 100000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '7 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=7']),
(5, 2, 5, 'Dell XPS 15', 'Description for Dell XPS 15. High quality item.', 35000000, 35000000, 52500000, 100000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '6 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=8']),
(6, 3, 6, 'Nike Air Max', 'Description for Nike Air Max. High quality item.', 2000000, 2000000, 3000000, 50000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '5 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=9']),
(7, 3, 6, 'Adidas Ultraboost', 'Description for Adidas Ultraboost. High quality item.', 2500000, 2500000, 3750000, 50000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '4 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=10']),
(8, 3, 7, 'Gucci T-Shirt', 'Description for Gucci T-Shirt. High quality item.', 5000000, 5000000, 7500000, 100000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '10 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=11']),
(9, 3, 7, 'Zara Shirt', 'Description for Zara Shirt. High quality item.', 500000, 500000, 750000, 50000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '1 day', 'active', true, ARRAY['https://picsum.photos/400/400?random=12']),
(10, 2, 8, 'Modern Sofa', 'Description for Modern Sofa. High quality item.', 5000000, 5000000, 7500000, 100000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '7 days', 'active', true, ARRAY['https://picsum.photos/400/400?random=13']),
(11, 4, 4, 'Vintage Camera (Sold)', 'A beautiful vintage camera. Sold to John.', 5000000, 6000000, 8000000, 100000, NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day', 'sold', true, ARRAY['https://picsum.photos/400/400?random=14']);

UPDATE products SET winner_id = 4 WHERE id = 11;

INSERT INTO bids (id, product_id, bidder_id, bid_amount, bid_time, status, is_auto_bid) VALUES
(1, 1, 4, 20500000, NOW() - INTERVAL '10 minutes', 1, false),
(2, 1, 5, 21000000, NOW() - INTERVAL '5 minutes', 1, false),
(3, 2, 4, 18500000, NOW() - INTERVAL '20 minutes', 1, false),
(4, 11, 4, 6000000, NOW() - INTERVAL '2 days', 1, false);

UPDATE products SET current_price = 21000000 WHERE id = 1;
UPDATE products SET current_price = 18500000 WHERE id = 2;

INSERT INTO auto_bids (id, product_id, bidder_id, max_auto_bid, current_bid_amount, status) VALUES
(1, 1, 5, 25000000, 21000000, 'active'),
(2, 2, 4, 20000000, 18500000, 'active');

INSERT INTO ratings (id, from_user_id, to_user_id, product_id, comment, score) VALUES
(1, 4, 2, 11, 'Great seller, fast delivery!', '+1'),
(2, 5, 3, 6, 'Good product quality', '+1');
