-- Indexes for Performance

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_end_time ON products(end_time);
CREATE INDEX idx_products_winner_id ON products(winner_id);
CREATE INDEX idx_products_search_vector ON products USING GIN(search_vector);

CREATE INDEX idx_bids_product_id ON bids(product_id);
CREATE INDEX idx_bids_bidder_id ON bids(bidder_id);
CREATE INDEX idx_bids_bid_time ON bids(bid_time);

CREATE INDEX idx_auto_bid_product_status ON auto_bids(product_id, status);
CREATE INDEX idx_auto_bid_bidder_product ON auto_bids(bidder_id, product_id);

CREATE INDEX idx_questions_product_id ON questions_answers(product_id);
CREATE INDEX idx_questions_user_id ON questions_answers(user_id);

CREATE INDEX idx_ratings_from_user ON ratings(from_user_id);
CREATE INDEX idx_ratings_to_user ON ratings(to_user_id);
CREATE INDEX idx_ratings_product ON ratings(product_id);

CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE INDEX idx_order_messages_order_id ON order_messages(order_id);

CREATE UNIQUE INDEX idx_watch_lists_user_product ON watch_lists(user_id, product_id);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
