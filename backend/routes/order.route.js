import express from 'express';
import OrderModel from '../models/order.model.js';
import productModel from '../models/product.model.js';
import userModel from '../models/user.model.js';
import auth from '../middlewares/auth.middleware.js';

const router = express.Router();

// ⭐ SPECIFIC ROUTES FIRST (trước generic routes)

// GET /orders/won - Get all orders where current user is the buyer
router.get('/won', auth, async (req, res) => {
    try {
        const buyerId = req.user.id;
        const orders = await OrderModel.findByBuyer(buyerId);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching won orders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /orders/seller - Get all orders for the logged-in seller
router.get('/seller', auth, async (req, res) => {
    try {
        const sellerId = req.user.id;
        const orders = await OrderModel.findBySeller(sellerId);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('[GET /orders/seller] Error fetching seller orders:', error.message, error.stack);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ⭐ GENERIC ROUTES AFTER (/:id comes last)

// GET /orders/:id - Get order details (Protected)
router.get('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        // Retrieve product details for verification
        const product = await productModel.findById(order.product_id);
        
        // Security check: Only Buyer or Seller can view
        // Note: product.seller_id vs order.buyer_id
        if (order.buyer_id !== req.user.id && product.seller_id !== req.user.id) {
            // Optional: allow admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Unauthorized access to this order' });
            }
        }

        res.json({ success: true, data: { ...order, seller_id: product.seller_id, product } });
    } catch (error) {
        console.error('Error fetching order detail:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /orders/pay/:id - Simulate Payment & Update Shipping Info
router.post('/pay/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { shipping_address, payment_method, note } = req.body;

    try {
        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.buyer_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        if (order.status !== 'pending') {
             return res.status(400).json({ success: false, message: 'Order is explicitly not in pending state.' });
        }

        // Simulate successful payment processing
        // In real app, verify with Stripe/OnePay here.
        
        const shippingInfoJson = JSON.stringify({
            address: shipping_address || 'Default Address',
            method: 'standard',
            tracking: null
        });

        // Update status to 'paid' (or 'shipping' if auto-approved)
        await OrderModel.updateStatus(id, 'paid', note, shippingInfoJson);

        res.json({ success: true, message: 'Payment successful, order updated' });
    } catch (error) {
        console.error('Error paying order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /orders/confirm/:id - Seller confirms payment & uploads shipping code
router.post('/confirm/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { shipping_info } = req.body;
    
    try {
        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Verify seller owns this product
        const product = await productModel.findById(order.product_id);
        if (product.seller_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Check order is in 'paid' status before confirming
        if (order.status !== 'paid') {
            return res.status(400).json({ success: false, message: 'Order must be in paid status to confirm' });
        }

        // Update order status to 'shipped' with shipping tracking code
        await OrderModel.updateStatus(id, 'shipped', null, shipping_info);

        res.json({ success: true, message: 'Order confirmed successfully, status updated to shipped' });
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /orders/completed/:id - Mark order as completed (buyer confirms received)
router.post('/completed/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.buyer_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        if (order.status !== 'shipped') {
            return res.status(400).json({ success: false, message: 'Order must be shipped before marking as completed' });
        }

        await OrderModel.updateStatus(id, 'completed');
        res.json({ success: true, message: 'Order marked as completed' });
    } catch (error) {
        console.error('Error completing order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /orders/reject/:id - Seller rejects payment
router.post('/reject/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { note } = req.body;

    try {
        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Verify seller owns this product
        const product = await productModel.findById(order.product_id);
        if (product.seller_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await OrderModel.updateStatus(id, 'rejected', note);
        res.json({ success: true, message: 'Order rejected' });
    } catch (error) {
        console.error('Error rejecting order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /orders/cancel/:id - Buyer cancels order
router.post('/cancel/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    try {
        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.buyer_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await OrderModel.cancelOrder(id, reason);

        // Auto-rate buyer as negative (already done in cancelOrder)
        res.json({ success: true, message: 'Order cancelled and buyer rated negative' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /orders/:id/upload-payment-proof - Buyer uploads payment proof (bill)
router.post('/:id/upload-payment-proof', auth, async (req, res) => {
    const { id } = req.params;
    const { payment_proof_url } = req.body;

    try {
        if (!payment_proof_url) {
            return res.status(400).json({ success: false, message: 'payment_proof_url is required' });
        }

        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Verify buyer
        if (order.buyer_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Only buyer can upload payment proof' });
        }

        // Update order with payment proof URL
        await OrderModel.update(id, { payment_proof_url });
        res.json({ success: true, message: 'Payment proof uploaded successfully', data: { payment_proof_url } });
    } catch (error) {
        console.error('Error uploading payment proof:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /orders/:id/upload-shipping-invoice - Seller uploads shipping invoice
router.post('/:id/upload-shipping-invoice', auth, async (req, res) => {
    const { id } = req.params;
    const { shipping_invoice_url } = req.body;

    try {
        if (!shipping_invoice_url) {
            return res.status(400).json({ success: false, message: 'shipping_invoice_url is required' });
        }

        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Verify seller owns this product
        const product = await productModel.findById(order.product_id);
        if (product.seller_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only seller can upload shipping invoice' });
        }

        // Update order with shipping invoice URL
        await OrderModel.update(id, { shipping_invoice_url });
        res.json({ success: true, message: 'Shipping invoice uploaded successfully', data: { shipping_invoice_url } });
    } catch (error) {
        console.error('Error uploading shipping invoice:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /orders/:id/payment-info - Seller provides bank account info (Bước 1)
router.post('/:id/payment-info', auth, async (req, res) => {
    const { id } = req.params;
    const { bank_name, account_number, account_holder, bank_code } = req.body;

    try {
        if (!bank_name || !account_number || !account_holder) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin ngân hàng' });
        }

        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Verify seller owns this product
        const product = await productModel.findById(order.product_id);
        if (product.seller_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only seller can provide payment info' });
        }

        // Check order is in 'pending' status
        if (order.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Order must be pending to add payment info' });
        }

        // Save payment info as JSON
        const paymentInfo = JSON.stringify({
            bank_name,
            account_number,
            account_holder,
            bank_code: bank_code || null,
            provided_at: new Date().toISOString()
        });

        await OrderModel.update(id, { payment_info: paymentInfo });
        res.json({ success: true, message: 'Payment info saved successfully', data: { payment_info: JSON.parse(paymentInfo) } });
    } catch (error) {
        console.error('Error saving payment info:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /orders/delivered/:id - Buyer confirms received (Bước 3)
router.post('/delivered/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Verify buyer
        if (order.buyer_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Only buyer can confirm delivery' });
        }

        // Check order is in 'shipped' status
        if (order.status !== 'shipped') {
            return res.status(400).json({ success: false, message: 'Order must be shipped before marking as delivered' });
        }

        // Update status to 'completed'
        await OrderModel.updateStatus(id, 'completed');
        res.json({ success: true, message: 'Order delivered successfully' });
    } catch (error) {
        console.error('Error marking order delivered:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
