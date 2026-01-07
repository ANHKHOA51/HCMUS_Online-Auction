import cron from 'node-cron';
import ProductModel from '../models/product.model.js';
import { db } from '../utils/db.js';
import { sendAuctionEndWinnerMail, sendAuctionEndSellerMail } from '../utils/mail.js';

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
            // 2. Tìm người ra giá cao nhất (hợp lệ)
            // Cần lọc bỏ các bid bị rejected (status=0) nếu chưa lọc ở db query
            const highestBid = await db('bids')
                .where('product_id', product.id)
                .where('status', 1) 
                .orderBy('bid_amount', 'desc')
                .first();

            // Fetch seller info
            const seller = await db('users').where('id', product.seller_id).first();

            if (highestBid) {
                // 3a. Có người mua -> Cập nhật winner và status = 'sold'
                await ProductModel.closeAuction(product.id, highestBid.bidder_id, highestBid.bid_amount);
                console.log(`✅ Auction ${product.id} SOLD to user ${highestBid.bidder_id} for ${highestBid.bid_amount}`);

                // Tạo order cho người thắng
                await db('orders').insert({
                    product_id: product.id,
                    buyer_id: highestBid.bidder_id,
                    status: 'pending',
                    created_at: new Date(),
                    final_price: highestBid.bid_amount,
                    product_name: product.name,
                    product_images: JSON.stringify(product.images)
                });

                // Gửi email
                const winner = await db('users').where('id', highestBid.bidder_id).first();
                if (winner) {
                     sendAuctionEndWinnerMail(winner.email, winner.full_name, product.name, highestBid.bid_amount).catch(console.error);
                }
                if (seller) {
                     sendAuctionEndSellerMail(seller.email, seller.full_name, product.name, winner ? winner.full_name : 'Winner', highestBid.bid_amount).catch(console.error);
                }
            } else {
                // 3b. Không có người mua
                await ProductModel.expireAuction(product.id);
                console.log(`Auction ${product.id} EXPIRED with no bids.`);
                 if (seller) {
                     sendAuctionEndSellerMail(seller.email, seller.full_name, product.name, null, 0).catch(console.error);
                }
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
