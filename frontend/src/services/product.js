// ============================================================================
// Frontend API Service - Centralized API calls
// ============================================================================

const API_BASE_URL = 'http://localhost:3000/api';

export const productService = {
  // Lấy danh sách sản phẩm
    getProducts: async (params = {}) => {
        // Map URL param names to API param names
        const apiParams = {
            ...(params.q && { search: params.q }),
            ...(params.search && { search: params.search }),
            ...(params.category_id && { category_id: params.category_id }),
            ...(params.category && { category_id: params.category }),
            ...(params.sort && { sort: params.sort }),
        };
        const queryString = new URLSearchParams(apiParams).toString();
        const response = await fetch(`${API_BASE_URL}/products?${queryString}`);
        if (!response.ok) throw new Error('Lỗi khi lấy danh sách sản phẩm');
        return response.json();
    },

  // Lấy chi tiết sản phẩm
    getProductDetail: async (productId) => {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!response.ok) throw new Error('Lỗi khi lấy chi tiết sản phẩm');
        return response.json();
    },

    // Lấy lịch sử bid
    async getProductBids(productId) {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/bids`);
        if (!response.ok) throw new Error('Lỗi khi lấy lịch sử bid');
        return response.json();
    },

    // Lấy danh sách categories
    async getCategories() {
        const response = await fetch(`${API_BASE_URL}/categories/all`);
        if (!response.ok) throw new Error('Lỗi khi lấy danh sách category');
        return response.json();
    },

  // Lấy danh sách categories
    async getTopClosing() {
        const response = await fetch(`${API_BASE_URL}/top/closing`);
        if (!response.ok) throw new Error('Lỗi khi lấy danh sách sản phẩm sắp kết thúc');
        return response.json();
    },

    // Lấy danh sách sản phẩm được đấu giá nhiều nhất
    async getTopBidding() {
        const response = await fetch(`${API_BASE_URL}/top/bidding`);
        if (!response.ok) throw new Error('Lỗi khi lấy danh sách sản phẩm được đấu giá nhiều nhất');
        return response.json();
    },

    async getTopPricing() {
        const response = await fetch(`${API_BASE_URL}/top/bidding`);
        if (!response.ok) throw new Error('Lỗi khi lấy danh sách sản phẩm được đấu giá nhiều nhất');
        return response.json();
    },

    // Đặt giá mới
    async placeBid(productId, bidAmount, token) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/bid`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bidAmount })
    });
    if (!response.ok) throw new Error('Lỗi khi đặt giá');
    return response.json();
    },

  // Mua ngay
    async buyNow(productId, token) {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/buy-now`, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Lỗi khi mua ngay');
        return response.json();
    }
};

export default productService
