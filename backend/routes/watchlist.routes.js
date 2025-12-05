
import express from 'express';
import watchListModel from '../models/watchlist.model';
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware.js');


router.post('/:id', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id; // Lấy từ token (auth middleware)
      const productId = req.params.id;

      // 1. Kiểm tra xem đã thích chưa
      const existing = await watchListModel.hasWatched(userId, productId);

      if (existing) {
        // 2a. Có rồi -> Xóa (Unlike)
        await watchListModel.remove(userId, productId);
        return res.json({ message: 'Đã xóa khỏi yêu thích', isWatched: false });
      } else {
        // 2b. Chưa có -> Thêm (Like)
        await watchListModel.add(userId, productId);
        return res.json({ message: 'Đã thêm vào yêu thích', isWatched: true });
      }

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Lỗi server' });
    }
  });

router.get('/', async (req, res) => {
    try {
      const ids = await watchlistModel.getIdsByUser(req.user.id);
      res.json(ids); // Trả về: [1, 5, 12]
    } catch (err) {
      res.status(500).json({ error: 'Lỗi lấy watchlist' });
    }
});

module.exports = router;
