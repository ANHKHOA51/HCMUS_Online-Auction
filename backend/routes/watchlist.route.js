
import express from 'express';
import watchListModel from '../models/watchlist.model.js';
const router = express.Router();
import authMiddleware from '../middlewares/auth.middleware.js';


router.post('/:id', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id; // Lấy từ token (auth middleware)
      const productId = req.params.id;

      // 1. Kiểm tra xem đã thích chưa
      const existing = await watchListModel.hasWatched(userId, productId);

      if (existing) {
        // 2a. Có rồi -> Xóa (Unlike)
        await watchListModel.remove(userId, productId);
        return res.json({ message: 'Đã xóa khỏi yêu thích'});
      } else {
        // 2b. Chưa có -> Thêm (Like)
        await watchListModel.add(userId, productId);
        return res.json({ message: 'Đã thêm vào yêu thích'});
      }

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Lỗi server' });
    }
  });



export default router;
