import { db } from '../utils/db.js';
import productModel from '../models/product.model.js';
import bidModel from '../models/bid.model.js';

export const placeBid = async (userId, productId, amount) => {
  // Khởi tạo Transaction tại Service
  return await db.transaction(async (trx) => {
    

    const product = await productModel.findByIdLock(productId, trx);


    if (!product || product.status === 0) {
      throw new Error('Sản phẩm không khả dụng');
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

    await productModel.updatePrice(productId, amount, trx);

    return true; // Commit tự động nếu không có lỗi
  });
};
