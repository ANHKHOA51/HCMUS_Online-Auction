import { db } from '../utils/db.js';
import productModel from '../models/product.model.js';
import bidModel from '../models/bid.model.js';
import autoBidModel from '../models/autobid.model.js';

/**
 * HÀM ĐẶT GIÁ CHÍNH
 */
export const placeBid = async (userId, productId, amount, isAutoBid = false) => {
  return await db.transaction(async (trx) => {
    // 1. Kiểm tra User & Product (Lock hàng để tránh tranh chấp)
    const user = await trx('users').where({ id: userId }).first();
    if (!user) throw new Error('Người dùng không tồn tại');

    // Kiểm tra điểm đánh giá (Rating)
    const totalRatings = (user.rating_positive || 0) + (user.rating_negative || 0);
    if (totalRatings > 0) {
      const ratingScore = (user.rating_positive || 0) / totalRatings;
      if (ratingScore < 0.8) throw new Error('Điểm đánh giá thấp. Cần tối thiểu 80%.');
    }

    const product = await trx('products').where({ id: productId }).forUpdate().first();
    if (!product || product.status !== 'active') throw new Error('Sản phẩm không khả dụng');
    if (product.seller_id === userId) throw new Error('Không được tự đấu giá sản phẩm của mình');

    const stepPrice = parseFloat(product.step_price || 100);
    const currentPrice = parseFloat(product.current_price || product.starting_price);

    // 2. Xử lý Đấu giá thủ công (Manual Bid)
    if (!isAutoBid) {
      const minValidPrice = currentPrice + stepPrice;
      if (amount < minValidPrice) throw new Error(`Giá phải >= ${minValidPrice}`);

      // Ghi nhận Bid thủ công
      await bidModel.add({
        bidder_id: userId, product_id: productId, bid_amount: amount,
        bid_time: new Date(), status: 1, is_auto_bid: false
      }, trx);

      await trx('products').where({ id: productId }).update({
        current_price: amount, winner_id: userId, updated_at: new Date()
      });

      // Kích hoạt so găng với các Auto Bidders khác
      await triggerAutoBidEscalation(productId, amount, trx);

      return { success: true, type: 'manual', newPrice: amount };
    } 

    // 3. Xử lý Đấu giá tự động (Auto Bid)
    else {
      if (amount <= currentPrice) throw new Error(`Giá trần phải cao hơn giá hiện tại`);

      // Lấy bid cao nhất hiện tại
      const highestBid = await trx('bids')
        .where({ product_id: productId, status: 1 })
        .orderBy('bid_amount', 'desc')
        .first();

      let initialBidAmount;
      if (highestBid) {
        // Nếu đã có bid, đặt ở mức cao nhất + bước giá, nhưng không vượt quá max
        initialBidAmount = Math.min(
          parseFloat(highestBid.bid_amount) + stepPrice,
          amount
        );
      } else {
        // Nếu chưa có bid nào, đặt ở giá khởi điểm
        initialBidAmount = parseFloat(product.starting_price);
      }

      // Lưu/Cập nhật mức giá trần bí mật, luôn có current_bid_amount
      await autoBidModel.createOrUpdate({
        product_id: productId,
        bidder_id: userId,
        max_auto_bid: amount,
        current_bid_amount: initialBidAmount,
        status: 'active'
      }, trx);

      // Chạy so găng để tìm ra mức giá tối thiểu mới nhằm giành chiến thắng
      await triggerAutoBidEscalation(productId, currentPrice, trx);

      return { success: true, type: 'auto_activated', maxCeiling: amount };
    }
  });
};

/**
 * HÀM SO GĂNG TỰ ĐỘNG (ESCAlATION) - DÙNG LOGIC TOP 2
 */
async function triggerAutoBidEscalation(productId, basePrice, trx) {
  // Lấy 2 người có trần cao nhất đang Active hoặc đang Thắng
  const activeBidders = await trx('auto_bids')
    .where({ product_id: productId })
    .whereIn('status', ['active', 'won'])
    .orderBy('max_auto_bid', 'desc')
    .orderBy('id', 'asc') // Ai đặt trước thắng nếu trần bằng nhau
    .limit(2);

  if (activeBidders.length === 0) return;

  const product = await trx('products').where({ id: productId }).first();
  const stepPrice = parseFloat(product.step_price || 100);
  const basePriceNum = parseFloat(basePrice);

  let winner = activeBidders[0];
  let finalPrice;

  if (activeBidders.length === 1) {
    // Trường hợp 1: Chỉ có duy nhất 1 người dùng Auto Bid
    // Giá sẽ là Max(basePrice + step, starting_price) nhưng không quá trần của họ
    finalPrice = Math.max(basePriceNum + stepPrice, parseFloat(product.starting_price));
    finalPrice = Math.min(finalPrice, parseFloat(winner.max_auto_bid));
  } else {
    // Trường hợp 2: Có ít nhất 2 người cùng đấu Auto Bid
    const secondHighest = activeBidders[1];
    
    // Giá nhảy lên mức: Trần của người thứ hai + 1 bước giá
    finalPrice = parseFloat(secondHighest.max_auto_bid) + stepPrice;

    // Nếu giá này vượt quá trần của người cao nhất, lấy bằng trần người cao nhất
    if (finalPrice > parseFloat(winner.max_auto_bid)) {
      finalPrice = parseFloat(winner.max_auto_bid);
    }

    // Người thứ hai bị loại (exhausted)
    await autoBidModel.updateStatus(secondHighest.id, 'exhausted', trx);
  }

  // Nếu giá mới cao hơn giá hiện tại của sản phẩm, cập nhật lịch sử
  if (finalPrice > basePriceNum || product.winner_id !== winner.bidder_id) {
    await bidModel.add({
      bidder_id: winner.bidder_id,
      product_id: productId,
      bid_amount: finalPrice,
      bid_time: new Date(),
      status: 1,
      is_auto_bid: true
    }, trx);

    await trx('products').where({ id: productId }).update({
      current_price: finalPrice,
      winner_id: winner.bidder_id,
      updated_at: new Date()
    });

    await autoBidModel.updateStatus(winner.id, 'won', trx);
  }
}

/**
 * HÀM TỪ CHỐI NGƯỜI ĐẤU GIÁ
 */
export const rejectBidder = async (sellerId, productId, userIdToReject) => {
  return await db.transaction(async (trx) => {
    const product = await trx('products').where({ id: productId }).first();
    if (!product || product.seller_id !== sellerId) throw new Error('Không có quyền');

    // Hủy các lượt bid và autobid của người bị từ chối
    await trx('bids').where({ product_id: productId, bidder_id: userIdToReject }).update({ status: 0 });
    await trx('auto_bids').where({ product_id: productId, bidder_id: userIdToReject }).update({ status: 'exhausted' });

    // Tìm người có lượt bid hợp lệ cao nhất còn lại
    const nextBid = await trx('bids')
      .where({ product_id: productId, status: 1 })
      .orderBy('bid_amount', 'desc')
      .first();

    const newWinnerId = nextBid ? nextBid.bidder_id : null;
    const newPrice = nextBid ? nextBid.bid_amount : product.starting_price;

    await trx('products').where({ id: productId }).update({
      winner_id: newWinnerId,
      current_price: newPrice
    });

    // Sau khi người cao nhất bị đuổi, cho các máy Auto Bid còn lại đấu nhau tiếp
    await triggerAutoBidEscalation(productId, newPrice, trx);

    return true;
  });
};
