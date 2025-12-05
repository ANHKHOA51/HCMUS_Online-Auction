import { useState, useEffect } from 'react';
import watchlistService from '../services/watchlist';

export const useWatchlist = () => {
  const [watchedIds, setWatchedIds] = useState([]); // [1, 5, 12]
  const [loading, setLoading] = useState(false);

  // 1. Fetch watchlist khi component mount
  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setWatchedIds([]);
        return;
      }

      try {
        setLoading(true);
        const data = await watchlistService.getWatchlist(token);
        // Backend trả về mảng ID: [1, 5, 12]
        setWatchedIds(Array.isArray(data) ? data : (data?.data || []));
      } catch (err) {
        console.error('Error fetching watchlist:', err);
        setWatchedIds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  // 2. Helper: Check xem productId có trong watchlist không
  const isWatched = (productId) => watchedIds.includes(productId);

  // 3. Helper: Toggle watchlist (add/remove)
  const toggleWatch = async (productId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Token not found');
      return false;
    }

    try {
      const response = await watchlistService.toggleWatchlist(productId, token);
      
      // Update local state
      if (response.isWatched) {
        setWatchedIds([...watchedIds, productId]);
      } else {
        setWatchedIds(watchedIds.filter(id => id !== productId));
      }
      
      return response.isWatched;
    } catch (err) {
      console.error('Error toggling watchlist:', err);
      return null;
    }
  };

  return { watchedIds, loading, isWatched, toggleWatch };
};

export default useWatchlist;
