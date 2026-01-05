import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../services/axiosInstance';
import ProductsGrid from '../../../components/ProductsGrid';
import { FaGavel } from 'react-icons/fa';

const BiddingTab = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBidding = async () => {
            try {
                const response = await axiosInstance.get('/users/bidding');
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching bidding list:', err);
                setError('Không thể tải danh sách đang đấu giá.');
            } finally {
                setLoading(false);
            }
        };

        fetchBidding();
    }, []);

    if (error) {
        return <div className="message error">{error}</div>;
    }

    return (
        <div className="bidding-tab">
            <ProductsGrid 
                title="Sản phẩm bạn đang tham gia đấu giá" 
                icon={<FaGavel style={{ color: '#3da9fc' }} />}
                products={products} 
                loading={loading} 
            />
        </div>
    );
};

export default BiddingTab;
