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
  
};

export default WatchlistModel;
