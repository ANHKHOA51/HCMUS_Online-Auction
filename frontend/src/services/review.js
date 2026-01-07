import axiosInstance from './axiosInstance';

export const reviewService = {
    addReview: async ({ to_user_id, product_id, score, comment }) => {
        const response = await axiosInstance.post('/reviews', {
            to_user_id,
            product_id,
            score,
            comment
        });
        return response.data;
    },

    getUserReviews: async () => {
        const response = await axiosInstance.get('/reviews/user/reviews');
        return response.data.data || response.data;
    },

    getUserStats: async () => {
        const response = await axiosInstance.get('/reviews/user/stats');
        return response.data.data || response.data;
    }
};

export default reviewService;
