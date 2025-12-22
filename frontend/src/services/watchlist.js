const API_BASE_URL = 'http://localhost:3000';

export const watchlistService = {

  // Toggle add/remove sản phẩm khỏi yêu thích
  async toggleWatchlist(productId, token) {
    const response = await fetch(`${API_BASE_URL}/watchlists/${productId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Lỗi khi toggle watchlist');
    return response.json();
  }
};

export default watchlistService;
