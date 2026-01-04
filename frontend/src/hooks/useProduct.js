import { useState, useEffect } from 'react';
import { productService } from '../services/product';

// Global cache for categories
let categoriesCache = null;
let categoriesPromise = null;

// Global cache for products (key: JSON.stringify(queryParams))
const productsCache = new Map();

export const useProducts = (queryParams = {}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(categoriesCache || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories (Promise-based caching to handle race conditions)
  useEffect(() => {
    if (categoriesCache) {
      setCategories(categoriesCache);
    } else {
      if (!categoriesPromise) {
        categoriesPromise = productService.getCategories().then(res => {
          if (res.success) {
            categoriesCache = res.data;
            return res.data;
          }
          throw new Error('Failed to fetch categories');
        });
      }

      categoriesPromise
        .then(data => setCategories(data))
        .catch(err => console.error('Error fetching categories:', err));
    }
  }, []);

  // Fetch products (Cache-first strategy)
  useEffect(() => {
    const fetchProducts = async () => {
      const queryKey = JSON.stringify(queryParams);

      // Check cache first
      if (productsCache.has(queryKey)) {
        setProducts(productsCache.get(queryKey));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const token = getToken();

        // Fetch categories always
        const categoriesRes = await productService.getCategories();
        if (categoriesRes.success) {
          setCategories(categoriesRes.data);
        }

        // Fetch products with query params (search, category, sort)
        const productsRes = await productService.getProducts(queryParams, token);
        if (productsRes.success) {
          setProducts(productsRes.data);
          productsCache.set(queryKey, productsRes.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(queryParams)]);

  return { products, categories, loading, error };
};



export const useFilters = (products) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
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

        const token = getToken();
        // Fetch product details

        const result = await productService.getProductDetail(productId, token);
        if (!result.success) {
          throw new Error(result.error || 'Lỗi không xác định');
        }

        const { product, highestBidder, faqs, relatedProducts } = result.data;

        const sellerInfo = {
          id: product.seller_id,
          full_name: product.seller_name,
          email: product.seller_email,
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
