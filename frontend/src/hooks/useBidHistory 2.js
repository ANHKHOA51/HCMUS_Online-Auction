import { useState, useEffect } from 'react';
import { bidService } from '../services/bid';

export const useBidHistory = (productId) => {
    const [bidHistory, setBidHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId) return;

        const fetchBidHistory = async () => {
            try {
                setIsLoading(true);
                const res = await bidService.getBidHistory(productId);
                setBidHistory(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Error fetching bid history:', err);
                setError('Lỗi lấy lịch sử đấu giá');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBidHistory();
    }, [productId]);

    return { bidHistory, isLoading, error };
};

export default useBidHistory;
