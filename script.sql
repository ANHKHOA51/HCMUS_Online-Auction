-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activity_logs (
  id integer NOT NULL DEFAULT nextval('activity_logs_id_seq'::regclass),
  user_id integer,
  action character varying NOT NULL,
  timestamp timestamp without time zone DEFAULT now(),
  details jsonb,
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.bidder_requests (
  id integer NOT NULL DEFAULT nextval('bidder_requests_id_seq'::regclass),
  product_id integer NOT NULL,
  bidder_id integer NOT NULL,
  message text,
  status character varying DEFAULT 'PENDING'::character varying CHECK (status::text = ANY (ARRAY['PENDING'::character varying, 'ACCEPTED'::character varying, 'DENIED'::character varying]::text[])),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT bidder_requests_pkey PRIMARY KEY (id),
  CONSTRAINT bidder_requests_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT bidder_requests_bidder_id_fkey FOREIGN KEY (bidder_id) REFERENCES public.users(id)
);
CREATE TABLE public.bids (
  id integer NOT NULL DEFAULT nextval('bids_id_seq'::regclass),
  product_id integer,
  bidder_id integer,
  bid_amount numeric NOT NULL,
  bid_time timestamp without time zone DEFAULT now(),
  CONSTRAINT bids_pkey PRIMARY KEY (id),
  CONSTRAINT bids_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT bids_bidder_id_fkey FOREIGN KEY (bidder_id) REFERENCES public.users(id)
);
CREATE TABLE public.categories (
  id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  name character varying NOT NULL,
  description text,
  parent_category_id integer,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_parent_category_id_fkey FOREIGN KEY (parent_category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.knex_migrations (
  id integer NOT NULL DEFAULT nextval('knex_migrations_id_seq'::regclass),
  name character varying,
  batch integer,
  migration_time timestamp with time zone,
  CONSTRAINT knex_migrations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.knex_migrations_lock (
  index integer NOT NULL DEFAULT nextval('knex_migrations_lock_index_seq'::regclass),
  is_locked integer,
  CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index)
);
CREATE TABLE public.notifications (
  id integer NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
  user_id integer,
  type character varying,
  title character varying,
  content text,
  related_product_id integer,
  is_read boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT notifications_related_product_id_fkey FOREIGN KEY (related_product_id) REFERENCES public.products(id)
);
CREATE TABLE public.orders (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  product_id integer,
  buyer_id integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  status character varying,
  payment_info text,
  seller_note text,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id),
  CONSTRAINT orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.pending_registrations (
  id integer NOT NULL DEFAULT nextval('pending_registrations_id_seq'::regclass),
  firstname character varying,
  lastname character varying,
  address text,
  username character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password character varying NOT NULL,
  otp character varying NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pending_registrations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.products (
  id integer NOT NULL DEFAULT nextval('products_id_seq'::regclass),
  seller_id integer,
  category_id integer,
  name character varying NOT NULL,
  description text,
  starting_price numeric NOT NULL,
  current_price numeric,
  buy_now_price numeric,
  step_price numeric DEFAULT 100000,
  images ARRAY,
  start_time timestamp without time zone DEFAULT now(),
  end_time timestamp without time zone NOT NULL,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'ended'::character varying, 'cancelled'::character varying]::text[])),
  winner_id integer,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  search_vector tsvector,
  auto_extend boolean,
  allow_newbie boolean DEFAULT true,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT products_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.users(id)
);
CREATE TABLE public.questions_answers (
  id integer NOT NULL DEFAULT nextval('questions_answers_id_seq'::regclass),
  product_id integer,
  user_id integer,
  question text NOT NULL,
  answer text,
  answered_by integer,
  answered_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT questions_answers_pkey PRIMARY KEY (id),
  CONSTRAINT questions_answers_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT questions_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT questions_answers_answered_by_fkey FOREIGN KEY (answered_by) REFERENCES public.users(id)
);
CREATE TABLE public.ratings (
  id integer NOT NULL DEFAULT nextval('ratings_id_seq'::regclass),
  from_user_id integer,
  to_user_id integer,
  product_id integer,
  comment text,
  score character varying CHECK (score::text = ANY (ARRAY['+'::character varying, '-'::character varying]::text[])),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT ratings_pkey PRIMARY KEY (id),
  CONSTRAINT ratings_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES public.users(id),
  CONSTRAINT ratings_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES public.users(id),
  CONSTRAINT ratings_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.refresh_tokens (
  id integer NOT NULL DEFAULT nextval('refresh_tokens_id_seq'::regclass),
  user_id integer NOT NULL,
  token text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  username character varying NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  address text,
  rating_positive integer DEFAULT 0,
  rating_negative integer DEFAULT 0,
  allow_unrated_bid boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  avatar_url text,
  role smallint NOT NULL DEFAULT '1'::smallint CHECK (role >= 0),
  expired_time timestamp with time zone,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.watch_lists (
  id integer NOT NULL DEFAULT nextval('watch_lists_id_seq'::regclass),
  user_id integer NOT NULL,
  product_id integer NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT watch_lists_pkey PRIMARY KEY (id),
  CONSTRAINT watch_lists_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT watch_lists_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.products(id)
);