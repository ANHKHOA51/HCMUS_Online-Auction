import cron from 'node-cron';
import ProductModel from '../models/product.model.js';
import { db } from '../utils/db.js';

const checkAuctions = async () => {
    try {
        console.log('Checking for expired auctions...');
        
        // 1. Lấy các sản phẩm đã hết hạn mà vẫn đang active
        const expiredProducts = await ProductModel.getExpiredActiveProducts();
        if (expiredProducts.length === 0) {
            // console.log('No expired auctions found.');
            return;
        }

        console.log(`Found ${expiredProducts.length} expired auctions. Processing...`);

        for (const product of expiredProducts) {
            // 2. Tìm người ra giá cao nhất
            const highestBid = await db('bids')
                .where('product_id', product.id)
                .orderBy('bid_amount', 'desc')
                .first();

            if (highestBid) {
                // 3a. Có người mua -> Cập nhật winner và status = 'sold'
                await ProductModel.closeAuction(product.id, highestBid.bidder_id, highestBid.bid_amount);
                console.log(`✅ Auction ${product.id} SOLD to user ${highestBid.bidder_id} for ${highestBid.bid_amount}`);
                
                // TODO: Gửi email thông báo cho winner và seller (nếu cần)
            } else {
                // 3b. Không có người mua -> Cập nhật status = 'expired' (hoặc giữ nguyên tùy logic, ở đây ta set expired)
                await ProductModel.expireAuction(product.id);
                console.log(`Auction ${product.id} EXPIRED with no bids.`);
            }
        }

    } catch (error) {
        console.error('Error in auction cron job:', error);
    }
};

// Chạy mỗi phút một lần
export const startAuctionCron = () => {
    // Schedule task to run every minute
    cron.schedule('* * * * *', () => {
        checkAuctions();
    });
    
    console.log('🚀 Auction Cron Job started (running every minute)');
};
