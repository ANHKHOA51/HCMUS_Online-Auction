import axiosInstance from './axiosInstance';

export const bidService = {
    // Đặt giá mới
    async placeBid(productId, bidAmount, token) {
        const response = await axiosInstance.post(`/bids/${productId}/bid`, {
            price: bidAmount
        });
        return response.data;
    },

    // Mua ngay
    async buyNow(productId, token) {
        const response = await axiosInstance.post(`/bids/${productId}/buy-now`);
        return response.data;
    },

    // Lấy lịch sử đấu giá của sản phẩm
    async getBidHistory(productId) {
        const response = await axiosInstance.get(`/bids/${productId}/history`);
        return response.data;
    }
}

export default bidService;
