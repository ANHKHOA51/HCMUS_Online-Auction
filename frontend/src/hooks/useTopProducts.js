import { useState, useEffect } from 'react';
import { productService } from '../services/product';

// Helper nhỏ để lấy token an toàn (tránh lỗi nếu chạy SSR)
const getToken = () => {
  return sessionStorage.getItem('accessToken'); // Hoặc tên key bạn đã lưu lúc login
};

export const useTopProductsEndingSoon = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Lấy token từ bộ nhớ (nếu chưa đăng nhập nó sẽ là null)
        const token = getToken(); 
        
        // 2. Truyền token vào hàm service
        const result = await productService.getTopClosing(token);
        
        console.log("Danh sách sắp kết thúc:", result);
        setProducts(result.data || []); // Safety check: thêm || [] để tránh lỗi map

      } catch (err) {
        console.error('Error fetching top ending soon products:', err);
        setError('Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Chạy 1 lần khi mount

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
        const token = getToken(); // Lấy token

        // Truyền token vào service
        const result = await productService.getTopBidding(token);
        
        if (result.success) {
          setProducts(result.data || []);
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
        const token = getToken(); // Lấy token

        // Truyền token vào service
        const result = await productService.getTopPricing(token);
        
        if (result.success) {
          setProducts(result.data || []);
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
