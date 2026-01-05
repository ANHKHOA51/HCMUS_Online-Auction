import { db } from '../utils/db.js';


const WatchlistModel = {
  // Kiểm tra xem user đã thích món này chưa?
  hasWatched: (userId, productId) => {
    return db('watch_lists')
      .where({ user_id: userId, product_id: productId })
      .first(); // Trả về object hoặc undefined
  },

  // Thêm vào danh sách
  add: (userId, productId) => {
    return db('watch_lists').insert({ user_id: userId, product_id: productId });
  },

  // Xóa khỏi danh sách
  remove: (userId, productId) => {
    return db('watch_lists')
      .where({ user_id: userId, product_id: productId })
      .del();
  },

  // Lấy danh sách ID sản phẩm trong watchlist của user
  getIdsByUser: async (userId) => {
    const list = await db('watch_lists')
      .where('user_id', userId)
      .select('product_id');

    return list.map(item => item.product_id);
  },

  // Lấy danh sách sản phẩm chi tiết (để hiển thị)
  getWatchlist: async (userId) => {
    return db('watch_lists as wl')
      .join('products as p', 'wl.product_id', 'p.id')
      .leftJoin('users as s', 'p.seller_id', 's.id') // Lấy tên người bán
      .select(
        'p.*',
        's.full_name as seller_name',
        db.raw('(SELECT COUNT(*) FROM bids WHERE bids.product_id = p.id) as bid_count'),
        db.raw('true as is_favorite') // Chắc chắn là true vì đang ở trong watchlist
      )
      .where('wl.user_id', userId)
      .orderBy('wl.created_at', 'desc');
  }
  
};

export default WatchlistModel;
