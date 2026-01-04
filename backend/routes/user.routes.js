import express from 'express';
import { UserModel } from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { ProductModel } from '../models/product.model.js';
import { ReviewModel } from '../models/review.model.js';

const router = express.Router();

// Update Profile Info
router.patch('/update', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { full_name, email } = req.body;

        // Validate
        if (!full_name || !email) {
            return res.status(400).json({ message: 'Họ tên và Email không được để trống.' });
        }

        // Check if email exists (if changed)
        const currentUser = await UserModel.findById(userId);
        if (email !== currentUser.email) {
            const existingUser = await UserModel.existsByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email này đã được sử dụng.' });
            }
        }

        // Update
        const [updatedUser] = await UserModel.update(userId, { full_name, email });
        
        // Remove password from response
        delete updatedUser.password;

        res.json({
            message: 'Cập nhật thông tin thành công.',
            user: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin.' });
    }
});

// Change Password
router.patch('/change-password', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { old_password, new_password } = req.body;

        if (!old_password || !new_password) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mới.' });
        }

        if (new_password.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
        }

        // Get user with password
        const user = await UserModel.findByIdWithPassword(userId);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        // Verify old password
        const isValid = await comparePassword(old_password, user.password);
        if (!isValid) {
            return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });
        }

        // Hash new password
        const hashedPassword = await hashPassword(new_password);

        // Update
        await UserModel.update(userId, { password: hashedPassword });

        res.json({ message: 'Đổi mật khẩu thành công.' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Lỗi server khi đổi mật khẩu.' });
    }
});



// Get Bidding Products
router.get('/bidding', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const products = await ProductModel.getBiddingProducts(userId);
        res.json(products);
    } catch (error) {
        console.error('Get bidding products error:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách đấu giá.' });
    }
});

// Get Won Products
router.get('/won', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const products = await ProductModel.getWonProducts(userId);
        res.json(products);
    } catch (error) {
        console.error('Get won products error:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách thắng đấu giá.' });
    }
});

// Get User Reviews (Received) - Private (My Reviews)
router.get('/reviews', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await ReviewModel.getByUserId(userId);
        const stats = await ReviewModel.getStats(userId);
        res.json({ reviews, stats });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách đánh giá.' });
    }
});

// Get Public User Reviews
router.get('/:id/reviews', async (req, res) => {
    try {
        const userId = req.params.id;
        const reviews = await ReviewModel.getByUserId(userId);
        const stats = await ReviewModel.getStats(userId);
        res.json({ reviews, stats });
    } catch (error) {
        console.error('Get public reviews error:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách đánh giá.' });
    }
});

export default router;
