import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../services/axiosInstance';
import ProductsGrid from '../../../components/ProductsGrid';
import { FaHeart } from 'react-icons/fa';

const WatchlistTab = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const response = await axiosInstance.get('/watchlists');
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching watchlist:', err);
                setError('Không thể tải danh sách yêu thích.');
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, []);

    if (error) {
        return <div className="message error">{error}</div>;
    }

    return (
        <div className="watchlist-tab">
            <ProductsGrid 
                title="Sản phẩm bạn đã thích" 
                icon={<FaHeart style={{ color: '#ef4565' }} />}
                products={products} 
                loading={loading} 
            />
        </div>
    );
};

export default WatchlistTab;
