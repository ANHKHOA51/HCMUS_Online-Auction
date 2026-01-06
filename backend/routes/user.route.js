import express from 'express';
import { UserModel } from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { ProductModel } from '../models/product.model.js';
import { ReviewModel } from '../models/review.model.js';
import { sendResetPasswordMail } from '../utils/mail.js';
import { db } from '../utils/db.js';

const router = express.Router();

// --- ADMIN ROUTES (Must be before dynamic :id routes if conflicts exist) ---

// Get all users (Admin only)
router.get('/', authMiddleware, roleMiddleware([1]), async (req, res) => {
    try {
        const users = await UserModel.getAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get bidder upgrade requests (Admin only)
router.get('/bidder-requests', authMiddleware, roleMiddleware([1]), async (req, res) => {
    try {
        const users = await UserModel.getBidderRequests();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update User Role (Admin only)
router.post('/update-role', authMiddleware, roleMiddleware([1]), async (req, res) => {
    try {
        const { id, role } = req.body;
        const updatedUser = await UserModel.updateRole(id, role);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Accept Upgrade (Admin only)
router.post('/accept-upgrade', authMiddleware, roleMiddleware([1]), async (req, res) => {
    try {
        const { id } = req.body;
        const updatedUser = await UserModel.acceptUpgrade(id);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Reject Upgrade (Admin only)
router.post('/reject-upgrade', authMiddleware, roleMiddleware([1]), async (req, res) => {
    try {
        const { id } = req.body;
        const updatedUser = await UserModel.rejectUpgrade(id);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Reset User Password (Admin only)
router.post('/reset-password', authMiddleware, roleMiddleware([1]), async (req, res) => {
    try {
        const { id } = req.body;
        const updatedUser = await UserModel.resetPassword(id);
        console.log(updatedUser);
        sendResetPasswordMail(updatedUser.email, updatedUser.password);
        res.status(200).json({ success: true, data: updatedUser }); 
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete User (Admin only)
router.delete('/delete/:id', authMiddleware, roleMiddleware([1]), async (req, res) => {
    try {
        const user = await UserModel.deleteUser(req.params.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Rate User (Admin/System?) -> kept as is from original source
router.post('/rate/:id', authMiddleware, roleMiddleware([1]), async (req, res) => {
    try {
        const { id } = req.params;
        const { note } = req.body;
        const updatedUser = await UserModel.rate(id, note);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- USER PROFILE ROUTES ---

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
        const isValid = await comparePassword(old_password, user.password_hash);
        if (!isValid) {
            return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });
        }

        // Hash new password
        const hashedPassword = await hashPassword(new_password);

        // Update
        await UserModel.update(userId, { password_hash: hashedPassword });

        res.json({ message: 'Đổi mật khẩu thành công.' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Lỗi server khi đổi mật khẩu.' });
    }
});

// Request Upgrade to Seller
router.post('/upgrade-request', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`User ${userId} requested upgrade to seller.`);
        
        // Check if request already exists
        const existingRequest = await db('bidder_requests')
            .where({ bidder_id: userId })
            .first();

        if (existingRequest) {
            return res.status(400).json({ message: 'Bạn đã có yêu cầu đang chờ duyệt.' });
        }

        // Insert into bidder_requests table
        await db('bidder_requests').insert({
            bidder_id: userId,
            created_at: new Date()
        });
        
        res.json({ message: 'Yêu cầu nâng cấp đã được gửi thành công.' });
    } catch (error) {
        console.error('Upgrade request error:', error);
        res.status(500).json({ message: 'Lỗi server khi gửi yêu cầu.' });
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
