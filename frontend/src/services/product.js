// ============================================================================
// Frontend API Service - Centralized API calls
// ============================================================================

const API_BASE_URL = 'http://localhost:3000';

// Helper: Tự động tạo Header có Token nếu cần
// Giúp code gọn hơn, không phải lặp lại logic "Bearer ..."
const createHeaders = (token) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

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
        const queryString = new URLSearchParams(apiParams).toString();
        
        // Thêm tham số headers vào fetch
        const response = await fetch(`${API_BASE_URL}/products?${queryString}`, {
            method: 'GET',
            headers: createHeaders(token) 
        });

        if (!response.ok) throw new Error('Lỗi khi lấy danh sách sản phẩm');
        return response.json();
    },

    // 2. Lấy chi tiết sản phẩm
    getProductDetail: async (productId, token = null) => {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'GET',
            headers: createHeaders(token)
        });

        if (!response.ok) throw new Error('Lỗi khi lấy chi tiết sản phẩm');
        return response.json();
    },

    // 3. Các hàm Top (Cũng cần token để hiện tim đỏ nếu user đã thích)
    async getTopClosing(token = null) {
        const response = await fetch(`${API_BASE_URL}/products/top/closing`, {
            headers: createHeaders(token)
        });
        if (!response.ok) throw new Error('Lỗi khi lấy danh sách sắp kết thúc');
        return response.json();
    },

    async getTopBidding(token = null) {
        const response = await fetch(`${API_BASE_URL}/products/top/bidding`, {
            headers: createHeaders(token)
        });
        if (!response.ok) throw new Error('Lỗi khi lấy danh sách hot bid');
        return response.json();
    },

    async getTopPricing(token = null) {
        const response = await fetch(`${API_BASE_URL}/products/top/pricing`, {
            headers: createHeaders(token)
        });
        if (!response.ok) throw new Error('Lỗi khi lấy danh sách giá cao');
        return response.json();
    },

    // 4. Các hàm cần Auth bắt buộc (POST)
    async placeBid(productId, bidAmount, token) {
        // Token ở đây là BẮT BUỘC
        if (!token) throw new Error('Bạn cần đăng nhập để đấu giá');

        const response = await fetch(`${API_BASE_URL}/products/${productId}/bid`, {
            method: 'POST',
            headers: createHeaders(token),
            body: JSON.stringify({ bidAmount })
        });
        if (!response.ok) throw new Error('Lỗi khi đặt giá');
        return response.json();
    },

    async buyNow(productId, token) {
        if (!token) throw new Error('Bạn cần đăng nhập để mua ngay');

        const response = await fetch(`${API_BASE_URL}/products/${productId}/buy-now`, {
            method: 'POST',
            headers: createHeaders(token)
        });
        if (!response.ok) throw new Error('Lỗi khi mua ngay');
        return response.json();
    },

    // Các hàm phụ trợ khác giữ nguyên
    async getCategories() {
        const response = await fetch(`${API_BASE_URL}/categories/all`);
        if (!response.ok) throw new Error('Lỗi khi lấy danh sách category');
        return response.json();
    },

    async getProductBids(productId) {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/bids`);
        if (!response.ok) throw new Error('Lỗi khi lấy lịch sử bid');
        return response.json();
    }
};

export default productService;
