const API_BASE_URL = 'http://localhost:3000';

export const watchlistService = {
  // Lấy danh sách ID sản phẩm yêu thích của user
  async getWatchlist(token) {
    const response = await fetch(`${API_BASE_URL}/watchlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Lỗi khi lấy watchlist');
    return response.json();
  },

  // Toggle add/remove sản phẩm khỏi yêu thích
  async toggleWatchlist(productId, token) {
    const response = await fetch(`${API_BASE_URL}/watchlist/${productId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Lỗi khi toggle watchlist');
    return response.json();
  }
};

export default watchlistService;
