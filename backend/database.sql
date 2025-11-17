-- ============================================================================
-- HCMUS Online Auction Database Schema & Sample Data
-- ============================================================================

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
CREATE TABLE
IF NOT EXISTS users
(
  id SERIAL PRIMARY KEY,
  username VARCHAR
(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR
(200),
  email VARCHAR
(200) UNIQUE NOT NULL,
  phone VARCHAR
(20),
  role VARCHAR
(20) DEFAULT 'bidder' CHECK
(role IN
('bidder', 'seller', 'admin')),
  rating_positive INT DEFAULT 0,
  rating_negative INT DEFAULT 0,
  allow_unrated_bid BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW
(),
  updated_at TIMESTAMP DEFAULT NOW
()
);

-- ============================================================================
-- 2. CATEGORIES TABLE
-- ============================================================================
CREATE TABLE
IF NOT EXISTS categories
(
  id SERIAL PRIMARY KEY,
  name VARCHAR
(100) NOT NULL,
  description TEXT,
  parent_category_id INT REFERENCES categories
(id) ON
DELETE
SET NULL
,
  created_at TIMESTAMP DEFAULT NOW
()
);

-- ============================================================================
-- 3. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE
IF NOT EXISTS products
(
  id SERIAL PRIMARY KEY,
  seller_id INT REFERENCES users
(id) ON
DELETE CASCADE,
  category_id INT
REFERENCES categories
(id) ON
DELETE
SET NULL
,
  name VARCHAR
(255) NOT NULL,
  description TEXT,
  starting_price NUMERIC
(12,2) NOT NULL,
  current_price NUMERIC
(12,2),
  buy_now_price NUMERIC
(12,2),
  step_price NUMERIC
(10,2) DEFAULT 100000,
  images TEXT[],
  start_time TIMESTAMP DEFAULT NOW
(),
  end_time TIMESTAMP NOT NULL,
  status VARCHAR
(20) DEFAULT 'active' CHECK
(status IN
('active', 'ended', 'cancelled')),
  winner_id INT REFERENCES users
(id) ON
DELETE
SET NULL
,
  created_at TIMESTAMP DEFAULT NOW
(),
  updated_at TIMESTAMP DEFAULT NOW
()
);

-- ============================================================================
-- 4. BIDS TABLE
-- ============================================================================
CREATE TABLE
IF NOT EXISTS bids
(
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products
(id) ON
DELETE CASCADE,
  bidder_id INT
REFERENCES users
(id) ON
DELETE CASCADE,
  bid_amount NUMERIC(12,2)
NOT NULL,
  bid_time TIMESTAMP DEFAULT NOW
()
);

-- ============================================================================
-- 5. RATINGS TABLE
-- ============================================================================
CREATE TABLE
IF NOT EXISTS ratings
(
  id SERIAL PRIMARY KEY,
  from_user_id INT REFERENCES users
(id) ON
DELETE CASCADE,
  to_user_id INT
REFERENCES users
(id) ON
DELETE CASCADE,
  product_id INT
REFERENCES products
(id) ON
DELETE CASCADE,
  comment TEXT,
  score VARCHAR
(1) CHECK
(score IN
('+', '-')),
  created_at TIMESTAMP DEFAULT NOW
()
);

-- ============================================================================
-- 6. QUESTIONS & ANSWERS TABLE
-- ============================================================================
CREATE TABLE
IF NOT EXISTS questions_answers
(
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products
(id) ON
DELETE CASCADE,
  user_id INT
REFERENCES users
(id) ON
DELETE CASCADE,
  question TEXT
NOT NULL,
  answer TEXT,
  answered_by INT REFERENCES users
(id) ON
DELETE
SET NULL
,
  answered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW
(),
  updated_at TIMESTAMP DEFAULT NOW
()
);

-- ============================================================================
-- 7. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE
IF NOT EXISTS notifications
(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users
(id) ON
DELETE CASCADE,
  type VARCHAR(50),
  title VARCHAR
(255),
  content TEXT,
  related_product_id INT REFERENCES products
(id) ON
DELETE
SET NULL
,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW
()
);

-- ============================================================================
-- 8. ACTIVITY LOGS TABLE
-- ============================================================================
CREATE TABLE
IF NOT EXISTS activity_logs
(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users
(id) ON
DELETE
SET NULL
,
  action VARCHAR
(100),
  details TEXT,
  ip_address VARCHAR
(45),
  created_at TIMESTAMP DEFAULT NOW
()
);

-- ============================================================================
-- 9. WATCHLIST TABLE
-- ============================================================================
CREATE TABLE
IF NOT EXISTS watchlist
(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users
(id) ON
DELETE CASCADE,
  product_id INT
REFERENCES products
(id) ON
DELETE CASCADE,
  created_at TIMESTAMP
DEFAULT NOW
(),
  UNIQUE
(user_id, product_id)
);

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert Users
INSERT INTO users
    (username, password_hash, full_name, email, phone, role, rating_positive, rating_negative, avatar_url)
VALUES
    ('shop_di_dong', '$2b$10$nOQvOP4Yp7H7R5X7Y2Z8e', 'Cửa hàng Di Động Online', 'shop@didong.com', '0912345678', 'seller', 156, 3, 'https://picsum.photos/150/150?random=15'),
    ('buyer_a', '$2b$10$nOQvOP4Yp7H7R5X7Y2Z8e', 'Nguyễn Văn A', 'buyera@example.com', '0987654321', 'bidder', 45, 2, 'https://picsum.photos/150/150?random=16'),
    ('buyer_b', '$2b$10$nOQvOP4Yp7H7R5X7Y2Z8e', 'Trần Thị B', 'buyerb@example.com', '0976543210', 'bidder', 32, 1, 'https://picsum.photos/150/150?random=22'),
    ('seller_c', '$2b$10$nOQvOP4Yp7H7R5X7Y2Z8e', 'Cửa hàng Công Nghệ C', 'shop_c@example.com', '0934567890', 'seller', 89, 5, 'https://picsum.photos/150/150?random=23'),
    ('admin_user', '$2b$10$nOQvOP4Yp7H7R5X7Y2Z8e', 'Admin System', 'admin@auction.com', '0900000000', 'admin', 0, 0, 'https://picsum.photos/150/150?random=24');

-- Insert Categories
INSERT INTO categories
    (name, description)
VALUES
    ('Điện thoại di động', 'Các loại điện thoại thông minh từ các hãng nổi tiếng'),
    ('Laptop & Máy tính', 'Laptop, desktop, máy tính bảng'),
    ('Đồ gia dụng', 'Các thiết bị gia dụng hiện đại'),
    ('Quần áo & Thời trang', 'Quần áo, giày dép, phụ kiện thời trang'),
    ('Sách & Giáo dục', 'Sách, tài liệu học tập');

-- Insert Products
INSERT INTO products
    (seller_id, category_id, name, description, starting_price, current_price, buy_now_price, step_price, images, start_time, end_time, status, winner_id)
VALUES
    (1, 1, 'iPhone 15 Pro Max - Quốc tế, Fullbox',
        'Điện thoại iPhone 15 Pro Max nguyên seal, quốc tế chính hãng, fullbox, đầy đủ phụ kiện. Màu titanium blue, dung lượng 256GB. Kính Gorilla Glass Armor, camera 48MP. Đã bảo vệ màn hình bằng kính cường lực.',
        20000000, 25000000, 28000000, 500000,
        ARRAY
['https://picsum.photos/600/600?random=11', 'https://picsum.photos/600/600?random=12', 'https://picsum.photos/600/600?random=13', 'https://picsum.photos/600/600?random=14'],
 NOW
() - INTERVAL '3 days', NOW
() + INTERVAL '2 days 5 hours', 'active', 2),

(1, 1, 'Samsung Galaxy S24 Ultra - Chính hãng',
 'Điện thoại Samsung Galaxy S24 Ultra hàng chính hãng. Màu đen, 256GB. Camera Ultra Nightography, pin siêu bền. Hỗ trợ Galaxy AI.',
 22000000, 24000000, 26000000, 500000,
 ARRAY['https://picsum.photos/400/400?random=5', 'https://picsum.photos/400/400?random=6', 'https://picsum.photos/400/400?random=7'],
 NOW
() - INTERVAL '5 days', NOW
() + INTERVAL '5 days', 'active', 3),

(4, 2, 'MacBook Pro 14" M3 Max - Hàng mới',
 'MacBook Pro 14 inch với chip M3 Max, 18GB RAM, 512GB SSD. Màn hình Liquid Retina XDR, pin kéo dài cả ngày.',
 35000000, 38000000, 40000000, 1000000,
 ARRAY['https://picsum.photos/400/400?random=8', 'https://picsum.photos/400/400?random=9', 'https://picsum.photos/400/400?random=10'],
 NOW
() - INTERVAL '1 day', NOW
() + INTERVAL '10 minutes', 'active', NULL),

(1, 1, 'iPhone 15 Pro',
 'iPhone 15 Pro 128GB, màu silver, bản quốc tế. Điều kiện như mới.',
 18000000, 22000000, 24000000, 300000,
 ARRAY['https://picsum.photos/400/400?random=17'],
 NOW
() - INTERVAL '2 days', NOW
() + INTERVAL '5 days', 'active', NULL),

(4, 1, 'iPhone 14 Pro Max',
 'iPhone 14 Pro Max 256GB, màu deep purple. Fullbox, bảo hành đầy đủ.',
 16000000, 18000000, 20000000, 300000,
 ARRAY['https://picsum.photos/400/400?random=18'],
 NOW
() - INTERVAL '1 week', NOW
() + INTERVAL '1 day', 'active', NULL),

(1, 1, 'iPhone 15',
 'iPhone 15 64GB, màu xanh. Mới 99%, fullbox.',
 15000000, 19000000, 21000000, 300000,
 ARRAY['https://picsum.photos/400/400?random=19'],
 NOW
() - INTERVAL '3 days', NOW
() + INTERVAL '3 days', 'active', NULL),

(4, 1, 'iPhone 14 Pro',
 'iPhone 14 Pro 128GB, màu gold. Bảo hành chính hãng.',
 14000000, 16000000, 18000000, 300000,
 ARRAY['https://picsum.photos/400/400?random=20'],
 NOW
() - INTERVAL '4 days', NOW
() + INTERVAL '2 days', 'active', NULL),

(1, 1, 'iPhone 13 Pro Max',
 'iPhone 13 Pro Max 256GB, màu sierra blue. Tình trạng tốt.',
 12000000, 14000000, 16000000, 300000,
 ARRAY['https://picsum.photos/400/400?random=21'],
 NOW
() - INTERVAL '2 weeks', NOW
() + INTERVAL '4 days', 'active', NULL);

-- Insert Bids
INSERT INTO bids
    (product_id, bidder_id, bid_amount, bid_time)
VALUES
    (1, 2, 23000000, NOW() - INTERVAL
'2 days'),
(1, 3, 23500000, NOW
() - INTERVAL '1 day 12 hours'),
(1, 2, 24000000, NOW
() - INTERVAL '1 day'),
(1, 3, 24500000, NOW
() - INTERVAL '12 hours'),
(1, 2, 25000000, NOW
() - INTERVAL '1 hour'),

(2, 3, 23500000, NOW
() - INTERVAL '3 days'),
(2, 2, 24000000, NOW
() - INTERVAL '2 days'),
(2, 3, 24000000, NOW
() - INTERVAL '1 day'),

(4, 3, 20000000, NOW
() - INTERVAL '1 day'),
(4, 2, 20500000, NOW
() - INTERVAL '12 hours'),
(4, 3, 21000000, NOW
() - INTERVAL '6 hours'),
(4, 2, 22000000, NOW
() - INTERVAL '2 hours');

-- Insert Questions & Answers
INSERT INTO questions_answers
    (product_id, user_id, question, answer, answered_by, answered_at)
VALUES
    (1, 2, 'Hàng có bảo hành được không?', 'Có, sản phẩm được bảo hành 12 tháng theo chính sách của Apple.', 1, NOW() - INTERVAL
'2 days'),
(1, 3, 'Hàng có phải là hàng chính hãng không?', 'Có, hàng 100% chính hãng Apple, fullbox đầy đủ phụ kiện.', 1, NOW
() - INTERVAL '1 day'),
(1, 2, 'Có hỗ trợ trả góp không?', 'Chúng tôi không hỗ trợ trả góp, chỉ giao dịch thanh toán toàn bộ.', 1, NOW
() - INTERVAL '12 hours'),
(1, 3, 'Khi nào có thể giao hàng?', 'Sau khi đấu giá kết thúc, chúng tôi sẽ giao hàng trong vòng 2-3 ngày làm việc.', 1, NOW
() - INTERVAL '8 hours'),

(2, 3, 'Điều kiện pin như thế nào?', 'Pin vẫn ở tình trạng tốt, khả năng sử dụng 1 ngày đầy đủ.', 4, NOW
() - INTERVAL '3 days'),
(2, 2, 'Có tặng kèm gì không?', 'Fullbox bao gồm sạc, cáp USB-C, tài liệu hướng dẫn.', 4, NOW
() - INTERVAL '2 days'),

(4, 2, 'Có vết xước nào không?', 'Mới 99%, không có vết xước đáng kể. Vẫn còn phim bảo vệ.', 1, NOW
() - INTERVAL '1 day'),
(4, 3, 'Giá bao nhiêu nếu mua ngay?', 'Giá mua ngay là 24 triệu đồng.', 1, NOW
() - INTERVAL '12 hours');

-- Insert Ratings
INSERT INTO ratings
    (from_user_id, to_user_id, product_id, comment, score)
VALUES
    (2, 1, 1, 'Hàng đúng như mô tả, giao hàng nhanh chóng', '+'),
    (3, 1, 1, 'Seller uy tín, hàng chính hãng 100%', '+'),
    (2, 1, 4, 'Tốt, nhưng giao hàng hơi chậm', '+'),
    (3, 4, 2, 'Hàng tốt, đúng như mô tả', '+'),
    (2, 4, 4, 'Sản phẩm khá tốt', '+');

-- Insert Notifications
INSERT INTO notifications
    (user_id, type, title, content, related_product_id, is_read)
VALUES
    (2, 'BID_OUTBID', 'Bạn bị vượt giá', 'Ai đó vừa đặt giá cao hơn giá đặt của bạn cho sản phẩm iPhone 15 Pro Max', 1, FALSE),
    (2, 'AUCTION_ENDING', 'Sắp kết thúc', 'Sản phẩm iPhone 15 Pro Max sẽ kết thúc trong 2 giờ', 1, FALSE),
    (1, 'NEW_BID', 'Có người đặt giá', 'Nguyễn Văn A vừa đặt giá 25 triệu cho iPhone 15 Pro Max', 1, TRUE),
    (3, 'AUCTION_WON', 'Bạn thắng giá', 'Xin chúc mừng! Bạn đã thắng giá Samsung Galaxy S24 Ultra', 2, TRUE);

-- Create Indexes for better performance
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_end_time ON products(end_time);
CREATE INDEX idx_bids_product ON bids(product_id);
CREATE INDEX idx_bids_bidder ON bids(bidder_id);
CREATE INDEX idx_qa_product ON questions_answers(product_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_watchlist_user ON watchlist(user_id);
