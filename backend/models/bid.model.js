import { db } from '../utils/db.js';

export default {
  async add(entity, trx) {
    return trx('bids').insert(entity);
  },

  // Lấy lịch sử bid của sản phẩm
  async getByProductId(productId) {
    return db('bids')
      .where({ product_id: productId })
      .join('users', 'bids.bidder_id', 'users.id')
      .select(
        'bids.id',
        'bids.bidder_id',
        'bids.product_id',
        'bids.bid_amount as amount',
        'bids.bid_time as time',
        'users.full_name',
        'users.username'
      )
      .orderBy('bids.bid_time', 'desc');
  }
};
