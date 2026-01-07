import { db } from '../utils/db.js';
import productModel from '../models/product.model.js';
import bidModel from '../models/bid.model.js';
import autoBidModel from '../models/autobid.model.js';
import { UserModel } from '../models/user.model.js';
import { sendOutbidNotification } from '../utils/mail.js';

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * HÀM ĐẶT GIÁ CHÍNH (Xử lý Manual & Auto Bid)
 * ════════════════════════════════════════════════════════════════════════════════
 */
export const placeBid = async (userId, productId, amount, isAutoBid = false) => {
  return await db.transaction(async (trx) => {
    // 1. Kiểm tra User & Product (Sử dụng row-level lock với forUpdate)
    const user = await trx('users').where({ id: userId }).first();
    if (!user) throw new Error('Người dùng không tồn tại');

    // Kiểm tra uy tín người dùng (Rating >= 80%)
    const totalRatings = (user.rating_positive || 0) + (user.rating_negative || 0);
    if (totalRatings > 0) {
      const ratingScore = (user.rating_positive || 0) / totalRatings;
      if (ratingScore < 0.8) throw new Error('Điểm đánh giá thấp (dưới 80%). Không thể đấu giá.');
    }

    const product = await trx('products').where({ id: productId }).forUpdate().first();
    if (!product || product.status !== 'active') throw new Error('Sản phẩm không khả dụng hoặc đã kết thúc');
    if (product.seller_id === userId) throw new Error('Không được tự đấu giá sản phẩm của mình');

    const stepPrice = parseFloat(product.step_price || 100);
    const currentPrice = parseFloat(product.current_price || product.starting_price);

    // 2. Xử lý Đấu giá thủ công (Manual Bid)
    if (!isAutoBid) {
      const minValidPrice = currentPrice + stepPrice;
      if (amount < minValidPrice) throw new Error(`Giá đặt phải ít nhất là ${minValidPrice}`);

      await bidModel.add({
        bidder_id: userId, product_id: productId, bid_amount: amount,
        bid_time: new Date(), status: 1, is_auto_bid: false
      }, trx);

      await trx('products').where({ id: productId }).update({
        current_price: amount, winner_id: userId, updated_at: new Date()
      });

      // Gửi mail xác nhận đặt giá thành công (manual)
      const [user, productInfo] = await Promise.all([
        trx('users').where({ id: userId }).first(),
        trx('products').where({ id: productId }).first()
      ]);
      if (user && user.email && productInfo) {
        const { sendBidSuccessMail } = await import('../utils/mail.js');
        await sendBidSuccessMail(user.email, user.full_name || user.username || 'Bạn', productInfo.name, amount);
      }

      // Kích hoạt so găng tự động sau khi đặt giá tay thành công
      await triggerAutoBidEscalation(productId, amount, trx);

      return { success: true, type: 'manual', newPrice: amount };
    } 

    // 3. Xử lý Đấu giá tự động (Auto Bid / Proxy Bidding)
    else {
      // Chỉ chặn nếu đặt thấp hơn cả giá khởi điểm
      if (amount < parseFloat(product.starting_price)) {
        throw new Error(`Giá trần tối thiểu phải là ${product.starting_price}`);
      }

      // Tính giá bid khởi điểm để tránh lỗi NOT NULL trong DB
      let initialBid = product.current_price 
        ? parseFloat(product.current_price) + stepPrice 
        : parseFloat(product.starting_price);

      // Đảm bảo giá khởi điểm không vượt quá giá trần người dùng đặt
      initialBid = Math.min(initialBid, amount);

      // Lưu/Cập nhật mức giá trần bí mật
      await autoBidModel.createOrUpdate({
        product_id: productId,
        bidder_id: userId,
        max_auto_bid: amount,
        current_bid_amount: initialBid,
        status: 'active' 
      }, trx);

      // Gửi mail xác nhận đặt giá tự động thành công
      const [user, productInfo] = await Promise.all([
        trx('users').where({ id: userId }).first(),
        trx('products').where({ id: productId }).first()
      ]);
      if (user && user.email && productInfo) {
        const { sendBidSuccessMail } = await import('../utils/mail.js');
        await sendBidSuccessMail(user.email, user.full_name || user.username || 'Bạn', productInfo.name, initialBid);
      }

      // Chạy so găng. Nếu trần thấp hơn đối thủ, status sẽ thành 'exhausted'.
      await triggerAutoBidEscalation(productId, currentPrice, trx);

      return { 
        success: true, 
        type: 'auto_activated', 
        message: 'Đã ghi nhận mức giá trần của bạn.' 
      };
    }
  });
};

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * HÀM SO GĂNG TỰ ĐỘNG (ESCAlATION) - DÙNG LOGIC TOP 2
 * ════════════════════════════════════════════════════════════════════════════════
 */
async function triggerAutoBidEscalation(productId, basePrice, trx) {
  // Lấy danh sách 2 người có trần cao nhất đang Active hoặc đang Thắng (won)
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

  // Trường hợp 1: Chỉ có duy nhất 1 người dùng cài Auto Bid
  if (activeBidders.length === 1) {
    finalPrice = Math.max(basePriceNum + stepPrice, parseFloat(product.starting_price));
    finalPrice = Math.min(finalPrice, parseFloat(winner.max_auto_bid));

    // Nếu trần thấp hơn giá hiện tại (thua ngay lập tức do Manual Bid mới)
    if (parseFloat(winner.max_auto_bid) < basePriceNum + (product.winner_id === winner.bidder_id ? 0 : stepPrice)) {
       await autoBidModel.updateStatus(winner.id, 'exhausted', trx);
       return;
    }
  } 
  // Trường hợp 2: Có ít nhất 2 người cùng đấu Auto Bid
  else {
    const secondHighest = activeBidders[1];
    
    // --- LƯU VẾT NGƯỜI THUA (SECOND) VÀO BẢNG BIDS ĐỂ HIỂN THỊ TRANG CÁ NHÂN ---
    await bidModel.add({
      bidder_id: secondHighest.bidder_id,
      product_id: productId,
      bid_amount: parseFloat(secondHighest.max_auto_bid),
      bid_time: new Date(),
      status: 0, // 0: Đã bị vượt qua
      is_auto_bid: true
    }, trx);

    // Giá chốt = Trần người thứ hai + 1 bước giá
    finalPrice = parseFloat(secondHighest.max_auto_bid) + stepPrice;

    // Nếu giá này vượt quá trần người cao nhất, lấy bằng trần người cao nhất
    if (finalPrice > parseFloat(winner.max_auto_bid)) {
      finalPrice = parseFloat(winner.max_auto_bid);
    }

    // Đánh dấu người thấp hơn là 'exhausted'
    await autoBidModel.updateStatus(secondHighest.id, 'exhausted', trx);
  }

  // Cập nhật giá sản phẩm và tạo bản ghi Bid nếu có thay đổi Winner hoặc Giá
  if (finalPrice > basePriceNum || product.winner_id !== winner.bidder_id) {
    const previousWinnerId = product.winner_id;

    await bidModel.add({
      bidder_id: winner.bidder_id,
      product_id: productId,
      bid_amount: finalPrice,
      bid_time: new Date(),
      status: 1, // 1: Đang thắng
      is_auto_bid: true
    }, trx);

    await trx('products').where({ id: productId }).update({
      current_price: finalPrice,
      winner_id: winner.bidder_id,
      updated_at: new Date()
    });

    await autoBidModel.updateStatus(winner.id, 'won', trx);

    // Gửi mail thông báo
    if (previousWinnerId && previousWinnerId !== winner.bidder_id) {
      const prevUser = await UserModel.getUserById(previousWinnerId);
      if (prevUser && prevUser.email) {
        await sendOutbidNotification(
          prevUser.email,
          prevUser.full_name || prevUser.username || 'Bạn',
          product.name,
          finalPrice,
          productId
        );
      }
    }
  }
}

/**
 * HÀM TỪ CHỐI NGƯỜI ĐẤU GIÁ
 */
export const rejectBidder = async (sellerId, productId, userIdToReject) => {
  return await db.transaction(async (trx) => {
    const product = await trx('products').where({ id: productId }).first();
    if (!product || product.seller_id !== sellerId) throw new Error('Không có quyền từ chối');

    await trx('bids').where({ product_id: productId, bidder_id: userIdToReject }).update({ status: 0 });
    await trx('auto_bids').where({ product_id: productId, bidder_id: userIdToReject }).update({ status: 'exhausted' });

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

    await triggerAutoBidEscalation(productId, newPrice, trx);

    return true;
  });
};
