import express from 'express';
//import bidModel from '../models/watchlist.model.js';
import productModel from '../models/product.model.js';
import userModel from '../models/user.model.js';
import db from '../config/db.js';
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware.js');


  // [POST] /api/products/:id/bid
router.post('/:id/bid',authMiddleware, async (req, res) => {
    // Sử dụng Transaction để đảm bảo tính toàn vẹn (Bid lỗi thì không update giá SP)
    const trx = await db.transaction();

    try {
      const productId = req.params.id;
      const userId = req.user.id;
      const bidAmount = parseInt(req.body.price);

      // 1. Lấy thông tin sản phẩm
      const product = await productModel.findById(productId);
      
      if (!product || product.status !== 0) { // 0: Đang đấu
        await trx.rollback();
        return res.status(400).json({ error: 'Sản phẩm không khả dụng hoặc đã kết thúc' });
      }

      // 2. Validate Giá (Phải lớn hơn giá hiện tại + bước giá)
      // Lưu ý: Nếu chưa ai đặt thì so với giá khởi điểm
      const currentHighest = product.current_price || product.start_price;
      const minValidPrice = currentHighest + product.step_price;

      if (bidAmount < minValidPrice) {
        await trx.rollback();
        return res.status(400).json({ error: `Giá phải tối thiểu ${minValidPrice}` });
      }

      // 3. KIỂM TRA ĐIỂM TÍN NHIỆM (Yêu cầu đề bài)
      const stats = await userModel.getRatingStats(userId);
      
      // Trường hợp 1: Newbie (Chưa có đánh giá nào)
      if (stats.total === 0) {
        if (!product.allow_newbie) {
          await trx.rollback();
          return res.status(403).json({ error: 'Người bán không cho phép người mới tham gia đấu giá sản phẩm này.' });
        }
      } 
      // Trường hợp 2: Có đánh giá -> Check tỷ lệ
      else {
        if (stats.score < 0.8) { // Dưới 80%
          await trx.rollback();
          return res.status(403).json({ error: `Điểm tín nhiệm của bạn thấp (${(stats.score * 100).toFixed(1)}%). Yêu cầu > 80%.` });
        }
      }

      // 4. Lưu Bid mới
      await trx('bids').insert({
        amount: bidAmount,
        user_id: userId,
        product_id: productId,
        time: new Date()
      });

      // 5. Cập nhật giá sản phẩm
      await trx('products')
        .where('id', productId)
        .update({ current_price: bidAmount });

      // 6. Xử lý gia hạn tự động (Nếu còn < 5 phút thì cộng 10 phút)
      // ... (Phần này để sau hoặc làm luôn nếu bạn pro)

      await trx.commit(); // Chốt đơn
      res.json({ success: true, message: 'Ra giá thành công!' });

    } catch (err) {
      await trx.rollback();
      console.error(err);
      res.status(500).json({ error: 'Lỗi server khi ra giá' });
    }
  }
);

export default router;
