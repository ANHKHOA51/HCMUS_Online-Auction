import { db } from '../utils/db.js';
import productModel from '../models/product.model.js';
import bidModel from '../models/bid.model.js';
import autoBidModel from '../models/autobid.model.js';
import { sendBidSuccessMail, sendNewBidNotificationToSeller, sendOutbidNotification } from '../utils/mail.js';

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * PROXY BIDDING SYSTEM - placeBid() Implementation
 * 
 * Nguyên tắc: "Chỉ đặt giá vừa đủ để thắng" (Second-Price Auction)
 * 
 * Kịch bản:
 * 1. Manual Bid: Giá nhảy vọt tới giá đặt (nếu thắng)
 * 2. Auto Bid (lần đầu): Chỉ bid ở starting_price
 * 3. Auto Bid (người khác bid): Hệ thống tự động escalate (tối đa tới trần)
 * ════════════════════════════════════════════════════════════════════════════════
 */
export const placeBid = async (userId, productId, amount, isAutoBid = false) => {
  return await db.transaction(async (trx) => {
    // ═══════════════════════════════════════════════════════════
    // STEP 1: Validate User & Product (with row-level lock)
    // ═══════════════════════════════════════════════════════════
    const user = await trx('users').where({ id: userId }).first();
    if (!user) throw new Error('Người dùng không tồn tại');

    // Check rating score
    const totalRatings = (user.rating_positive || 0) + (user.rating_negative || 0);
    if (totalRatings > 0) {
      const ratingScore = (user.rating_positive || 0) / totalRatings;
      if (ratingScore < 0.8) {
        throw new Error(`Điểm đánh giá thấp (${(ratingScore * 100).toFixed(1)}%). Cần tối thiểu 80%.`);
      }
    }

    // Fetch product with row-level lock
    const product = await trx('products')
      .where({ id: productId })
      .forUpdate()
      .first();

    if (!product || product.status !== 'active') {
      throw new Error('Sản phẩm không khả dụng hoặc đã kết thúc');
    }

    if (product.seller_id === userId) {
      throw new Error('Không được tự đấu giá sản phẩm của mình');
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 2: Determine step_price
    // ═══════════════════════════════════════════════════════════
    const stepPrice = product.step_price || 100;
    const currentPrice = product.current_price || product.starting_price;

    // ═══════════════════════════════════════════════════════════
    // STEP 3: Handle Manual Bid vs Auto Bid
    // ═══════════════════════════════════════════════════════════
    if (isAutoBid === false) {
      // ────────────────────────────────────────────────────────
      // MANUAL BID: Người dùng đặt giá cụ thể
      // ────────────────────────────────────────────────────────
      const minValidPrice = currentPrice + stepPrice;

      if (amount < minValidPrice) {
        throw new Error(`Giá phải >= ${minValidPrice}. Giá hiện tại: ${currentPrice}`);
      }

      // Tạo bản ghi Bid
      await bidModel.add({
        bidder_id: userId,
        product_id: productId,
        bid_amount: amount,
        bid_time: new Date(),
        status: 1,
        is_auto_bid: false
      }, trx);

      // Update product.current_price (Manual bid jumps directly)
      await trx('products')
        .where({ id: productId })
        .update({
          current_price: amount,
          winner_id: userId,
          updated_at: new Date()
        });

      // ────────────────────────────────────────────────────────
      // TRIGGER: Check if Auto Bidders need to escalate
      // ────────────────────────────────────────────────────────
      await triggerAutoBidEscalation(productId, amount, trx);

      return {
        success: true,
        type: 'manual',
        newPrice: amount,
        winnerId: userId,
        message: 'Đặt giá thành công'
      };

    } else {
      // ────────────────────────────────────────────────────────
      // AUTO BID: Người dùng đặt giá trần (max_auto_bid)
      // ────────────────────────────────────────────────────────
      if (amount <= currentPrice) {
        throw new Error(`Giá trần phải > giá hiện tại (${currentPrice})`);
      }

      // Check if user already has an auto bid for this product
      const existingAutoBid = await autoBidModel.getByProductAndUser(productId, userId, trx);

      if (existingAutoBid) {
        // ✅ Update existing auto bid with NEW ceiling
        await autoBidModel.updateStatus(existingAutoBid.id, 'active', trx);
        await autoBidModel.updateMaxBid(existingAutoBid.id, amount, trx); // ← Update max_auto_bid

        // Re-trigger escalation with updated ceiling
        await triggerAutoBidEscalation(productId, currentPrice, trx);

        return {
          success: true,
          type: 'auto_update',
          newMaxBid: amount,
          message: 'Cập nhật giá trần tự động thành công'
        };

      } else {
        // Create NEW auto bid
        // Determine initial bid amount
        let initialBidAmount = product.starting_price;
        const highestBid = await trx('bids')
          .where({ product_id: productId, status: 1 })
          .orderBy('bid_amount', 'desc')
          .first();

        if (highestBid) {
          // If there are existing bids, start at highest + step (but not exceeding our max)
          initialBidAmount = Math.min(
            parseFloat(highestBid.bid_amount) + stepPrice,
            amount
          );
        }

        // Create Auto Bid record (HIDDEN max_auto_bid)
        await autoBidModel.createOrUpdate({
          product_id: productId,
          bidder_id: userId,
          max_auto_bid: amount,
          current_bid_amount: initialBidAmount,
          status: 'active'
        }, trx);

        // Create Bid record (only with initial amount, NOT the ceiling)
        await bidModel.add({
          bidder_id: userId,
          product_id: productId,
          bid_amount: initialBidAmount,
          bid_time: new Date(),
          status: 1,
          is_auto_bid: true
        }, trx);

        // Update product current_price
        await trx('products')
          .where({ id: productId })
          .update({
            current_price: initialBidAmount,
            winner_id: userId,
            updated_at: new Date()
          });

        // ────────────────────────────────────────────────────────
        // TRIGGER: Check if other Auto Bidders need to escalate
        // ────────────────────────────────────────────────────────
        await triggerAutoBidEscalation(productId, initialBidAmount, trx);

        return {
          success: true,
          type: 'auto_new',
          initialBid: initialBidAmount,
          maxCeiling: amount,
          message: 'Đặt giá tự động thành công'
        };
      }
    }
  });
};



async function triggerAutoBidEscalation(productId, currentPrice, trx) {
  // 1. Lấy người có giá trần cao nhất hiện tại (phải ở trạng thái 'won' hoặc 'active' cũ)
  // Lưu ý: Tôi lấy cả 'won' vì người đó cần bảo vệ vị trí khi có manual bid mới vào
  const topAutoBidder = await trx('auto_bids')
    .where({ product_id: productId })
    .whereIn('status', ['won', 'active']) 
    .orderBy('max_auto_bid', 'desc')
    .orderBy('id', 'asc')
    .first();

  if (!topAutoBidder) return;

  const product = await trx('products').where({ id: productId }).first();
  const stepPrice = parseFloat(product.step_price || 100);
  const currentPriceNum = parseFloat(currentPrice);
  const maxAutoBidNum = parseFloat(topAutoBidder.max_auto_bid);

  // 2. KIỂM TRA: Nếu người đang thắng hiện tại KHÔNG PHẢI là người này
  // (Ví dụ: Một người vừa đặt Manual Bid đã chiếm chỗ của Auto Bidder)
  if (product.winner_id !== topAutoBidder.bidder_id) {
    
    // Nếu trần (6tr) >= Giá vừa đặt (5.3tr) + bước giá (100k)
    if (maxAutoBidNum >= currentPriceNum + stepPrice) {
      const nextPrice = currentPriceNum + stepPrice;

      // Ghi nhận lịch sử Bid mới cho Người A
      await bidModel.add({
        bidder_id: topAutoBidder.bidder_id,
        product_id: productId,
        bid_amount: nextPrice,
        bid_time: new Date(),
        status: 1,
        is_auto_bid: true
      }, trx);

      // Cập nhật Product: Người A giành lại vị trí 'Winner' với giá mới
      await trx('products').where({ id: productId }).update({
        current_price: nextPrice,
        winner_id: topAutoBidder.bidder_id,
        updated_at: new Date()
      });

      // Cập nhật trạng thái AutoBid của người này là 'won'
      await autoBidModel.updateStatus(topAutoBidder.id, 'won', trx);

      console.log(`[AUTO] Người A (${topAutoBidder.bidder_id}) tự động đè giá lên ${nextPrice}`);

      // 3. Đệ quy: Gọi lại chính nó để kiểm tra xem có Auto Bidder NÀO KHÁC 
      // có trần cao hơn mức 5.4tr này không để tiếp tục đấu.
      return triggerAutoBidEscalation(productId, nextPrice, trx);

    } else {
      // Nếu giá manual đã vượt quá trần của họ -> Chuyển thành 'exhausted'
      await autoBidModel.updateStatus(topAutoBidder.id, 'exhausted', trx);
      
      // Tìm người có trần cao nhất còn lại và thử đấu tiếp nếu cần
      return triggerAutoBidEscalation(productId, currentPrice, trx);
    }
  } else {
    // Nếu họ ĐANG là winner rồi, đảm bảo status là 'won'
    await autoBidModel.updateStatus(topAutoBidder.id, 'won', trx);
  }
}
/**
 * Reject a bidder and recalculate winner
 */
export const rejectBidder = async (sellerId, productId, userIdToReject) => {
  return await db.transaction(async (trx) => {
    const product = await trx('products').where({ id: productId }).first();
    if (!product) throw new Error('Sản phẩm không tồn tại');
    if (product.seller_id !== sellerId) throw new Error('Bạn không có quyền');

    // Mark bids as rejected
    await trx('bids')
      .where({ product_id: productId, bidder_id: userIdToReject })
      .update({ status: 0 });

    // Mark auto bids as lost
    await trx('auto_bids')
      .where({ product_id: productId, bidder_id: userIdToReject })
      .update({ status: 'lost' });

    // Recalculate winner
    const nextBid = await trx('bids')
      .where({ product_id: productId, status: 1 })
      .orderBy('bid_amount', 'desc')
      .first();

    let newWinnerId = null;
    let newPrice = product.starting_price;

    if (nextBid) {
      newWinnerId = nextBid.bidder_id;
      newPrice = nextBid.bid_amount;
    }

    await trx('products')
      .where({ id: productId })
      .update({
        winner_id: newWinnerId,
        current_price: newPrice
      });

    return true;
  });
};


