import { useState, useEffect } from 'react';
import { productService } from '../services/product';

export const useTopProductsEndingSoon = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await productService.getTopClosing();
        console.log("Danh sách sản phẩm nhận được:", result); // 👈 Log ở đây
        setProducts(result.data);
        
      } catch (err) {
        console.error('Error fetching top ending soon products:', err);
        setError('Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, loading, error };
};



export const useTopProductsByBids = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await productService.getProducts();
        if (result.success) {
          // Sort by bid count (highest first), get top 5
          const sorted = [...result.data]

            .sort((a, b) => (b.bid_count || 0) - (a.bid_count || 0))
            .slice(0, 5);
          setProducts(sorted);
        }
      } catch (err) {
        console.error('Error fetching top bids products:', err);
        setError('Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, loading, error };
};

export const useTopProductsByPrice = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await productService.getProducts();
        if (result.success) {
          // Sort by current_price (highest first), get top 5
          const sorted = [...result.data]
            .sort((a, b) => (b.current_price || b.starting_price) - (a.current_price || a.starting_price))
            .slice(0, 5);
          setProducts(sorted);
        }
      } catch (err) {
        console.error('Error fetching top price products:', err);
        setError('Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, loading, error };
};
