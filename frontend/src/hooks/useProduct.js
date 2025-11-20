import { useState, useEffect } from 'react';
import { productService } from '../services/apiService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesRes, productsRes] = await Promise.all([
          productService.getCategories(),
          productService.getProducts(),
        ]);

        if (categoriesRes.success) {
          setCategories(categoriesRes.data);
        }

        if (productsRes.success) {
          setProducts(productsRes.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, categories, loading, error };
};

export const useFilters = (products) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, selectedCategory, sortBy]);

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      const categoryId = parseInt(selectedCategory);
      filtered = filtered.filter(p => p.category_id === categoryId);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'price_low':
        filtered.sort((a, b) => (a.current_price || a.starting_price) - (b.current_price || b.starting_price));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.current_price || b.starting_price) - (a.current_price || a.starting_price));
        break;
      case 'ending':
        filtered.sort((a, b) => new Date(a.end_time) - new Date(b.end_time));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('newest');
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filteredProducts,
    handleClearFilters,
  };
};

export const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [highestBidder, setHighestBidder] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await productService.getProductDetail(productId);

        if (!result.success) {
          throw new Error(result.error || 'Lỗi không xác định');
        }

        const { product, highestBidder, faqs, relatedProducts } = result.data;

        const sellerInfo = {
          id: product.seller_id,
          full_name: product.seller_name,
          email: product.seller_email,
          phone: product.seller_phone,
          avatar: product.seller_avatar,
          rating_positive: product.rating_positive,
          rating_negative: product.rating_negative,
        };

        setProduct(product);
        setSeller(sellerInfo);
        setHighestBidder(highestBidder);
        setFaqs(faqs || []);
        setRelatedProducts(relatedProducts || []);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.message || 'Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [productId]);

  return {
    product,
    seller,
    highestBidder,
    faqs,
    relatedProducts,
    loading,
    error,
  };
};
