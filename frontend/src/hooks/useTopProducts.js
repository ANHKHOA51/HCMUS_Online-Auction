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
        const result = await productService.getTopBidding();
        if (result.success) {
          setProducts(result.data);
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
        const result = await productService.getTopPricing();
        if (result.success) {
          // Sort by current_price (highest first), get top 5
          setProducts(result.data);
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
