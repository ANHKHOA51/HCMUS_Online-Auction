-- Auction DB Schema
-- PostgreSQL (Supabase)

DROP TABLE IF EXISTS order_messages CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS auto_bids CASCADE;
DROP TABLE IF EXISTS watch_lists CASCADE;
DROP TABLE IF EXISTS questions_answers CASCADE;
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS bidder_requests CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS pending_registrations CASCADE;
DROP TABLE IF EXISTS upgrade_requests CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS knex_migrations CASCADE;
DROP TABLE IF EXISTS knex_migrations_lock CASCADE;

DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS categories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS products_id_seq CASCADE;
DROP SEQUENCE IF EXISTS bids_id_seq CASCADE;
DROP SEQUENCE IF EXISTS activity_logs_id_seq CASCADE;
DROP SEQUENCE IF EXISTS auto_bids_id_seq CASCADE;
DROP SEQUENCE IF EXISTS bidder_requests_id_seq CASCADE;
DROP SEQUENCE IF EXISTS notifications_id_seq CASCADE;
DROP SEQUENCE IF EXISTS order_messages_id_seq CASCADE;
DROP SEQUENCE IF EXISTS orders_id_seq CASCADE;
DROP SEQUENCE IF EXISTS pending_registrations_id_seq CASCADE;
DROP SEQUENCE IF EXISTS questions_answers_id_seq CASCADE;
DROP SEQUENCE IF EXISTS ratings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS refresh_tokens_id_seq CASCADE;
DROP SEQUENCE IF EXISTS upgrade_requests_id_seq CASCADE;
DROP SEQUENCE IF EXISTS watch_lists_id_seq CASCADE;
DROP SEQUENCE IF EXISTS knex_migrations_id_seq CASCADE;
DROP SEQUENCE IF EXISTS knex_migrations_lock_index_seq CASCADE;

-- Sequences
CREATE SEQUENCE users_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE categories_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE products_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE bids_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE activity_logs_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE auto_bids_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE bidder_requests_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE notifications_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE order_messages_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE orders_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE pending_registrations_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE questions_answers_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE ratings_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE refresh_tokens_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE upgrade_requests_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE watch_lists_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE knex_migrations_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE knex_migrations_lock_index_seq START WITH 1 INCREMENT BY 1;

-- Users
CREATE TABLE users (
    id INTEGER NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address TEXT,
    avatar_url TEXT,
    rating_positive INTEGER DEFAULT 0,
    rating_negative INTEGER DEFAULT 0,
    allow_unrated_bid BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    role SMALLINT NOT NULL DEFAULT 1 CHECK (role >= 0),
    expired_time TIMESTAMP WITH TIME ZONE,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Pending registrations
CREATE TABLE pending_registrations (
    id INTEGER NOT NULL DEFAULT nextval('pending_registrations_id_seq'::regclass),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    address TEXT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pending_registrations_pkey PRIMARY KEY (id)
);

-- Refresh tokens
CREATE TABLE refresh_tokens (
    id INTEGER NOT NULL DEFAULT nextval('refresh_tokens_id_seq'::regclass),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id)
);

-- Activity logs
CREATE TABLE activity_logs (
    id INTEGER NOT NULL DEFAULT nextval('activity_logs_id_seq'::regclass),
    user_id INTEGER,
    action VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    details JSONB,
    CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
    CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Upgrade requests
CREATE TABLE upgrade_requests (
    id INTEGER NOT NULL DEFAULT nextval('upgrade_requests_id_seq'::regclass),
    user_id INTEGER,
    reason VARCHAR(255),
    status VARCHAR(255) DEFAULT 'pending'::character varying,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT upgrade_requests_pkey PRIMARY KEY (id),
    CONSTRAINT upgrade_requests_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Categories
CREATE TABLE categories (
    id INTEGER NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_category_id INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT categories_pkey PRIMARY KEY (id),
    CONSTRAINT categories_parent_category_id_fkey FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Products
CREATE TABLE products (
    id INTEGER NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    seller_id INTEGER,
    category_id INTEGER,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    starting_price NUMERIC NOT NULL,
    current_price NUMERIC,
    buy_now_price NUMERIC,
    step_price NUMERIC DEFAULT 100000,
    images TEXT[],
    start_time TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    end_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'sold'::character varying, 'cancelled'::character varying, 'expired'::character varying]::text[])),
    winner_id INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    search_vector TSVECTOR,
    auto_extend BOOLEAN,
    allow_newbie BOOLEAN DEFAULT true,
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    CONSTRAINT products_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Bids
CREATE TABLE bids (
    id INTEGER NOT NULL DEFAULT nextval('bids_id_seq'::regclass),
    product_id INTEGER,
    bidder_id INTEGER,
    bid_amount NUMERIC NOT NULL,
    bid_time TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    status INTEGER DEFAULT 1,
    is_auto_bid BOOLEAN DEFAULT false,
    CONSTRAINT bids_pkey PRIMARY KEY (id),
    CONSTRAINT bids_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT bids_bidder_id_fkey FOREIGN KEY (bidder_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Auto bids (Proxy bidding)
CREATE TABLE auto_bids (
    id INTEGER NOT NULL DEFAULT nextval('auto_bids_id_seq'::regclass),
    product_id INTEGER NOT NULL,
    bidder_id INTEGER NOT NULL,
    max_auto_bid NUMERIC NOT NULL,
    current_bid_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'exhausted'::text, 'won'::text, 'lost'::text])),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT auto_bids_pkey PRIMARY KEY (id),
    CONSTRAINT auto_bids_product_id_foreign FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT auto_bids_bidder_id_foreign FOREIGN KEY (bidder_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_auto_bid UNIQUE (product_id, bidder_id)
);

-- Bidder requests
CREATE TABLE bidder_requests (
    id INTEGER NOT NULL DEFAULT nextval('bidder_requests_id_seq'::regclass),
    product_id INTEGER NOT NULL,
    bidder_id INTEGER NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'PENDING'::character varying CHECK (status::text = ANY (ARRAY['PENDING'::character varying, 'ACCEPTED'::character varying, 'DENIED'::character varying]::text[])),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT bidder_requests_pkey PRIMARY KEY (id),
    CONSTRAINT bidder_requests_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT bidder_requests_bidder_id_fkey FOREIGN KEY (bidder_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Questions & Answers
CREATE TABLE questions_answers (
    id INTEGER NOT NULL DEFAULT nextval('questions_answers_id_seq'::regclass),
    product_id INTEGER,
    user_id INTEGER,
    question TEXT NOT NULL,
    answer TEXT,
    answered_by INTEGER,
    answered_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT questions_answers_pkey PRIMARY KEY (id),
    CONSTRAINT questions_answers_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT questions_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT questions_answers_answered_by_fkey FOREIGN KEY (answered_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Ratings
CREATE TABLE ratings (
    id INTEGER NOT NULL DEFAULT nextval('ratings_id_seq'::regclass),
    from_user_id INTEGER,
    to_user_id INTEGER,
    product_id INTEGER,
    comment TEXT,
    score VARCHAR(10) CHECK (score::text = ANY (ARRAY['+1'::character varying, '-1'::character varying]::text[])),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT ratings_pkey PRIMARY KEY (id),
    CONSTRAINT ratings_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT ratings_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT ratings_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders
CREATE TABLE orders (
    id BIGINT DEFAULT nextval('orders_id_seq'::regclass),
    product_id INTEGER,
    buyer_id INTEGER,
    seller_id INTEGER,
    final_price NUMERIC(14, 2),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status VARCHAR(50) DEFAULT 'pending'::character varying,
    payment_proof TEXT,
    payment_info TEXT,
    payment_address TEXT,
    shipping_proof TEXT,
    seller_note TEXT,
    shipping_address TEXT,
    shipping_info TEXT,
    buyer_rating INTEGER,
    buyer_comment TEXT,
    seller_rating INTEGER,
    seller_comment TEXT,
    cancellation_reason TEXT,
    is_cancelled BOOLEAN DEFAULT false,
    seller_rated BOOLEAN DEFAULT false,
    buyer_rated BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT orders_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Order messages
CREATE TABLE order_messages (
    id INTEGER NOT NULL DEFAULT nextval('order_messages_id_seq'::regclass),
    order_id INTEGER,
    sender_id INTEGER,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT order_messages_pkey PRIMARY KEY (id),
    CONSTRAINT order_messages_order_id_foreign FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT order_messages_sender_id_foreign FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Watch lists
CREATE TABLE watch_lists (
    id INTEGER NOT NULL DEFAULT nextval('watch_lists_id_seq'::regclass),
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT watch_lists_pkey PRIMARY KEY (id),
    CONSTRAINT watch_lists_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT watch_lists_product_id_foreign FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE notifications (
    id INTEGER NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
    user_id INTEGER,
    type VARCHAR(255),
    title VARCHAR(255),
    content TEXT,
    related_product_id INTEGER,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT notifications_related_product_id_fkey FOREIGN KEY (related_product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Knex migrations
CREATE TABLE knex_migrations (
    id INTEGER NOT NULL DEFAULT nextval('knex_migrations_id_seq'::regclass),
    name VARCHAR(255),
    batch INTEGER,
    migration_time TIMESTAMP WITH TIME ZONE,
    CONSTRAINT knex_migrations_pkey PRIMARY KEY (id)
);

CREATE TABLE knex_migrations_lock (
    index INTEGER NOT NULL DEFAULT nextval('knex_migrations_lock_index_seq'::regclass),
    is_locked INTEGER,
    CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index)
);

ALTER TABLE products ADD CONSTRAINT check_price_range CHECK (starting_price > 0 AND current_price >= starting_price);
ALTER TABLE products ADD CONSTRAINT check_time_range CHECK (start_time < end_time);
ALTER TABLE bids ADD CONSTRAINT check_bid_amount CHECK (bid_amount > 0);
ALTER TABLE orders ADD CONSTRAINT check_final_price CHECK (final_price > 0 OR final_price IS NULL);
