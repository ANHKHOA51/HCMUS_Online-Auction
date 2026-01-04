// hooks/useWatchlist.js
import watchlistService from '../services/watchlist';

export const useWatchlist = () => {
  const toggleWatch = async (productId) => {
    const token = sessionStorage.getItem('accessToken');

    try {
      await watchlistService.toggleWatchlist(productId, token);
      return true; // Thành công
    } catch (err) {
      console.error(err);
      return false; // Thất bại
    }
  };

  return { toggleWatch };
};

export default useWatchlist;

