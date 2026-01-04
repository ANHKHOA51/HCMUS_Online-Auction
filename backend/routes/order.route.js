import express from 'express';
import OrderModel from '../models/order.model.js';
import productModel from '../models/product.model.js';
import userModel from '../models/user.model.js'; // Assuming we might need this later for rating

const router = express.Router();

// Middleware verify seller could be added here if we had authentication middleware available in this context
// For now assuming the logged in user info comes from request header or body? 
// Based on previous chats, it seems there's no strict auth middleware shown yet, 
// usually we get user from req.user if auth middleware is running.

// Helper to get current user ID (mock or from req)
// Since we don't have the auth middleware code in full context, I'll assume req.user is populated by existing auth middleware
// If not, I'll use a placeholder or check headers.

// GET /orders/seller - Get all orders for the logged-in seller
router.get('/seller', async (req, res) => {
    // TODO: Require Authentication
    // const sellerId = req.user.id; 
    // For simplified context if req.user not available:
    const sellerId = req.query.seller_id || req.body.seller_id;

    // NOTE: In a real app, ensure `req.user` is set by auth middleware.
    // If you have `verifyToken` middleware, please use it in index.js or here.

    if (!sellerId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Seller ID required' });
    }

    try {
        const orders = await OrderModel.findBySeller(sellerId);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching seller orders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /orders/confirm/:id
router.post('/confirm/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update order status
        await OrderModel.updateStatus(id, 'paid');

        // Also update product status to 'sold'? Or keep it active until specific logic?
        // Usually "paid" means deal closed.

        res.json({ success: true, message: 'Order confirmed successfully' });
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /orders/reject/:id
router.post('/reject/:id', async (req, res) => {
    const { id } = req.params;
    const { note } = req.body;

    try {
        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        await OrderModel.updateStatus(id, 'rejected', note);
        res.json({ success: true, message: 'Order rejected' });
    } catch (error) {
        console.error('Error rejecting order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
