-- Initialize Auction Database
-- Run all SQL files in order: 01_schema.sql, 02_indexes.sql, 03_functions.sql, 04_seed.sql

-- Option 1: Run in psql
-- \i 01_schema.sql
-- \i 02_indexes.sql
-- \i 03_functions.sql
-- \i 04_seed.sql

-- Option 2: From command line
-- psql -h HOST -U USER -d DATABASE -f 01_schema.sql
-- psql -h HOST -U USER -d DATABASE -f 02_indexes.sql
-- psql -h HOST -U USER -d DATABASE -f 03_functions.sql
-- psql -h HOST -U USER -d DATABASE -f 04_seed.sql

-- Option 3: For Supabase SQL Editor
-- Copy and run each file in order
