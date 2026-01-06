import { db } from '../utils/db.js';

export default {
  async add(entity, trx) {
    return trx('bids').insert(entity);
  },

  findById: (id) => db('bids').where('bids.id', id).join('users', 'bids.bidder_id', 'users.id').first(),

  // Lấy lịch sử bid của sản phẩm
  async getByProductId(productId) {
    return db('bids')
      .where({ product_id: productId, status: 1 }) // Only active bids
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
  },

  async rejectBid(bidId, productId) {
    return db.transaction(async (trx) => {
      // 1. Mark bid as rejected
      await trx('bids').where({ id: bidId }).update({ status: 0 });

      // 2. Find next highest valid bid
      const nextBid = await trx('bids')
        .where({ product_id: productId, status: 1 })
        .orderBy('bid_amount', 'desc')
        .first();

      // 3. Update product
      if (nextBid) {
        await trx('products').where({ id: productId }).update({
          current_price: nextBid.bid_amount,
          winner_id: nextBid.bidder_id
        });
      } else {
        // No valid bids left, reset to starting price
        const product = await trx('products').where({ id: productId }).select('starting_price').first();
        await trx('products').where({ id: productId }).update({
          current_price: product.starting_price,
          winner_id: null
        });
      }
    });
  }
};
