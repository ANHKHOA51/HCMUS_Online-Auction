import axiosInstance from './axiosInstance';

export const productService = {
    // 1. Lấy danh sách sản phẩm (Có nhận token để check watchlist)
    getProducts: async (params = {}, token = null) => {
        const apiParams = {
            ...(params.q && { search: params.q }),
            ...(params.search && { search: params.search }),
            ...(params.category_id && { category_id: params.category_id }),
            ...(params.category && { category_id: params.category }),
            ...(params.sort && { sort: params.sort }),
        };
        
        const response = await axiosInstance.get('/products', { params: apiParams });
        return response.data;
    },

    // 2. Lấy chi tiết sản phẩm
    getProductDetail: async (productId, token = null) => {
        const response = await axiosInstance.get(`/products/${productId}`);
        return response.data;
    },

    // 3. Các hàm Top (Cũng cần token để hiện tim đỏ nếu user đã thích)
    async getTopClosing(token = null) {
        const response = await axiosInstance.get('/products/top/closing');
        return response.data;
    },

    async getTopBidding(token = null) {
        const response = await axiosInstance.get('/products/top/bidding');
        return response.data;
    },

    async getTopPricing(token = null) {
        const response = await axiosInstance.get('/products/top/pricing');
        return response.data;
    },

    // 4. Các hàm cần Auth bắt buộc (POST)
    async placeBid(productId, bidAmount, token) {
        if (!token) throw new Error('Bạn cần đăng nhập để đấu giá');
        const response = await axiosInstance.post(`/bids/${productId}/bid`, {
            price: bidAmount
        });
        return response.data;
    },

    async buyNow(productId, token) {
        if (!token) throw new Error('Bạn cần đăng nhập để mua ngay');
        const response = await axiosInstance.post(`/bids/${productId}/buy-now`);
        return response.data;
    },

    // Các hàm phụ trợ khác
    async getCategories() {
        const response = await axiosInstance.get('/categories/all');
        return response.data;
    },

    async getProductBids(productId) {
        const response = await axiosInstance.get(`/bids/${productId}/history`);
        return response.data;
    },

    async addProduct(formData, token) {
        const response = await fetch(`${API_BASE_URL}/products/add`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Lỗi khi thêm sản phẩm');
        return response.json();
    }
};

export default productService;
