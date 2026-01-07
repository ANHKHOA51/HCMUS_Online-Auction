import { db } from '../utils/db.js';

export default {
  /**
   * Tạo hoặc cập nhật Auto Bid
   * @param {Object} entity - { product_id, bidder_id, max_auto_bid, current_bid_amount, status }
   * @param {Object} trx - Knex transaction
   */
  async createOrUpdate(entity, trx) {
    const existing = await trx('auto_bids')
      .where({ product_id: entity.product_id, bidder_id: entity.bidder_id })
      .first();

    if (existing) {
      return trx('auto_bids')
        .where({ id: existing.id })
        .update({
          max_auto_bid: entity.max_auto_bid,
          current_bid_amount: entity.current_bid_amount,
          status: entity.status || 'active',
          updated_at: new Date()
        });
    } else {
      return trx('auto_bids').insert(entity);
    }
  },

  /**
   * Lấy Auto Bid của người dùng cho sản phẩm
   */
  async getByProductAndUser(productId, userId, trx = null) {
    const query = (trx || db)('auto_bids')
      .where({ product_id: productId, bidder_id: userId })
      .first();
    return query;
  },

  /**
   * Lấy tất cả Active Auto Bids của sản phẩm (sắp xếp theo giá trần giảm dần)
   */
  async getActiveAutoBids(productId, trx) {
    if (!trx) {
      throw new Error('Transaction required for getActiveAutoBids');
    }
    return trx('auto_bids')
      .where({ product_id: productId, status: 'active' })
      .orderBy('max_auto_bid', 'desc');
  },

  /**
   * Cập nhật trạng thái Auto Bid
   */
  async updateStatus(autoBidId, status, trx) {
    return trx('auto_bids')
      .where({ id: autoBidId })
      .update({ status, updated_at: new Date() });
  },

  /**
   * Cập nhật current_bid_amount của Auto Bid
   */
  async updateCurrentBid(autoBidId, amount, trx) {
    return trx('auto_bids')
      .where({ id: autoBidId })
      .update({ current_bid_amount: amount, updated_at: new Date() });
  },

  /**
   * Cập nhật max_auto_bid (giá trần) của Auto Bid
   */
  async updateMaxBid(autoBidId, maxBidAmount, trx) {
    return trx('auto_bids')
      .where({ id: autoBidId })
      .update({ max_auto_bid: maxBidAmount, updated_at: new Date() });
  },

  /**
   * Lấy Auto Bid theo ID
   */
  async getById(autoBidId, trx = null) {
    return (trx || db)('auto_bids').where({ id: autoBidId }).first();
  }
};
