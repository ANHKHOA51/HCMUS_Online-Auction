


const API_BASE_URL = 'http://localhost:3000';

export const bidService = {
    // Đặt giá mới
    async placeBid(productId, bidAmount, token) {
        const response = await fetch(`${API_BASE_URL}/bids/${productId}/bid`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ price: bidAmount })
        });
        if (!response.ok) throw new Error('Lỗi khi đặt giá');
        return response.json();
    },

    // Mua ngay
    async buyNow(productId, token) {
        const response = await fetch(`${API_BASE_URL}/bids/${productId}/buy-now`, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Lỗi khi mua ngay');
        return response.json();
    }

}

export default bidService;
