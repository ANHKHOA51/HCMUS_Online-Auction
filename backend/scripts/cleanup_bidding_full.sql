-- cleanup_bidding_full.sql
-- Xóa toàn bộ dữ liệu bidding và reset trạng thái sản phẩm

-- Xóa lịch sử đấu giá
DELETE FROM bids;
DELETE FROM auto_bids;

-- Reset giá và người thắng cho tất cả sản phẩm
UPDATE products SET current_price = starting_price, winner_id = NULL;
