import { db } from '../utils/db.js';
import productModel from '../models/product.model.js';
import bidModel from '../models/bid.model.js';

export const placeBid = async (userId, productId, amount) => {
  // Khởi tạo Transaction tại Service
  return await db.transaction(async (trx) => {
    
    // 1. Check User Rating
    const user = await trx('users').where('id', userId).first();
    if (!user) throw new Error('Người dùng không tồn tại');

    const totalRatings = (user.rating_positive || 0) + (user.rating_negative || 0);
    if (totalRatings > 0) {
        const ratingScore = (user.rating_positive || 0) / totalRatings;
        if (ratingScore < 0.8) {
            throw new Error(`Điểm đánh giá của bạn thấp (${(ratingScore * 100).toFixed(1)}%). Cần tối thiểu 80% để đấu giá.`);
        }
    }

    const product = await productModel.findByIdLock(productId, trx);


    if (!product || product.status !== 'active') {
      throw new Error('Sản phẩm không khả dụng hoặc đã kết thúc');
    }

    if (product.seller_id === userId) {
      throw new Error('Không được tự đấu giá');
    }

    const currentHighest = product.current_price || product.start_price;
    const minPrice = currentHighest + product.step_price;

    if (amount < minPrice) {
      throw new Error(`Giá thấp hơn quy định. Tối thiểu: ${minPrice}`);
    }

    await bidModel.add({
      bidder_id: userId,
      product_id: productId,
      bid_amount: amount,
      bid_time: new Date()
    }, trx);

    // Cập nhật giá hiện tại VÀ người thắng tạm thời (winner_id)
    await productModel.updatePrice(productId, amount, userId, trx);

    return true; // Commit tự động nếu không có lỗi
  });
};
