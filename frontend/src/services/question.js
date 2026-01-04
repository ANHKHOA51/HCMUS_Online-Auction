import axiosInstance from './axiosInstance.js';

export const questionService = {
    // Lấy tất cả Q&A của sản phẩm
    getQuestions: async (productId) => {
        try {
            const res = await axiosInstance.get(`/questions/product/${productId}`);
            return res.data;
        } catch (error) {
            console.error('Error fetching questions:', error);
            throw error;
        }
    },

    // Tạo câu hỏi mới
    askQuestion: async (productId, content) => {
        try {
            const res = await axiosInstance.post(`/questions/product/${productId}`, { content });
            return res.data;
        } catch (error) {
            console.error('Error asking question:', error);
            throw error;
        }
    },

    // Trả lời câu hỏi
    answerQuestion: async (questionId, answer) => {
        try {
            const res = await axiosInstance.post(`/questions/${questionId}/answer`, { answer });
            return res.data;
        } catch (error) {
            console.error('Error answering question:', error);
            throw error;
        }
    }
};

export default questionService;
