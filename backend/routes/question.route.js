import express from 'express';
import QuestionModel from '../models/question.model.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { db } from '../utils/db.js';
import { sendQuestionMail } from '../utils/mail.js';

const router = express.Router();

// GET tất cả Q&A của sản phẩm (không cần auth)
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const questions = await QuestionModel.getByProductId(productId);
        res.json({ ok: true, data: questions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ ok: false, message: 'Error fetching questions' });
    }
});

// POST câu hỏi mới (cần auth)
router.post('/product/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content || content.trim() === '') {
            return res.status(400).json({ ok: false, message: 'Question content is required' });
        }

        // Get product and seller info
        const product = await db('products').where('id', productId).first();
        if (!product) {
            return res.status(404).json({ ok: false, message: 'Product not found' });
        }

        // Seller cannot ask questions about their own product
        if (product.seller_id === userId) {
            return res.status(403).json({ ok: false, message: 'Seller cannot ask questions about their own product' });
        }

        const seller = await db('users').where('id', product.seller_id).first();
        const asker = await db('users').where('id', userId).first();

        // Create question
        const question = await QuestionModel.create(productId, userId, content);

        // Send email to seller (async, don't block response)
        if (seller?.email) {
            sendQuestionMail(
                seller.email,
                seller.full_name || seller.username,
                product.name,
                asker?.full_name || asker?.username || 'Khách hàng',
                content,
                productId
            ).catch(err => console.error('Failed to send question email:', err));
        }

        res.status(201).json({ ok: true, data: question });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ ok: false, message: 'Error creating question' });
    }
});

// POST trả lời câu hỏi (chỉ người bán)
router.post('/:questionId/answer', authMiddleware, async (req, res) => {
    try {
        const { questionId } = req.params;
        const { answer } = req.body;
        const userId = req.user.id;

        if (!answer || answer.trim() === '') {
            return res.status(400).json({ ok: false, message: 'Answer content is required' });
        }

        // Verify user is the seller of the product
        const question = await QuestionModel.getById(questionId);
        if (!question) {
            return res.status(404).json({ ok: false, message: 'Question not found' });
        }

        // Check if user is the product seller
        const product = await db('products').where('id', question.product_id).first();
        if (product.seller_id !== userId) {
            return res.status(403).json({ ok: false, message: 'Only seller can answer questions' });
        }

        await QuestionModel.answer(questionId, userId, answer);
        res.json({ ok: true, message: 'Answer added successfully' });
    } catch (error) {
        console.error('Error answering question:', error);
        res.status(500).json({ ok: false, message: 'Error answering question' });
    }
});

export default router;
