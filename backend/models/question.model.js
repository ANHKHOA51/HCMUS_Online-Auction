import { db } from '../utils/db.js';

export const QuestionModel = {
    // Lấy tất cả Q&A của sản phẩm
    getByProductId: async (productId) => {
        try {
            return await db('questions_answers as qa')
                .select(
                    'qa.id',
                    'qa.product_id',
                    'qa.user_id',
                    'qa.question as question',
                    'qa.answer',
                    'qa.answered_by',
                    'qa.created_at',
                    'u1.full_name as asker_name',
                    'u1.username as asker_username',
                    'u2.full_name as answerer_name',
                    'u2.username as answerer_username'
                )
                .join('users as u1', 'qa.user_id', 'u1.id')
                .leftJoin('users as u2', 'qa.answered_by', 'u2.id')
                .where('qa.product_id', productId)
                .orderBy('qa.created_at', 'desc');
        } catch (error) {
            console.error('Error in getByProductId:', error);
            throw error;
        }
    },

    // Tạo câu hỏi mới
    create: async (productId, userId, content) => {
        try {
            const [id] = await db('questions_answers')
                .insert({
                    product_id: productId,
                    user_id: userId,
                    question: content,
                    created_at: new Date()
                })
                .returning('id');
            
            return { id, product_id: productId, user_id: userId, question: content, created_at: new Date() };
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    },

    // Trả lời câu hỏi
    answer: async (questionId, userId, answer) => {
        try {
            return await db('questions_answers')
                .where('id', questionId)
                .update({
                    answer,
                    answered_by: userId,
                    updated_at: new Date()
                });
        } catch (error) {
            console.error('Error in answer:', error);
            throw error;
        }
    },

    // Lấy 1 câu hỏi
    getById: async (id) => {
        try {
            return await db('questions_answers').where('id', id).first();
        } catch (error) {
            console.error('Error in getById:', error);
            throw error;
        }
    }
};

export default QuestionModel;
