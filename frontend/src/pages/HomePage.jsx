import React, { useState, useEffect } from 'react';
import './HomePage.css';
import ProductCard from '../components/ProductCard';
import { productService } from '../api/apiService';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, selectedCategory, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const categoriesRes = await productService.getCategories();
      if (categoriesRes.success) {
        setCategories(categoriesRes.data);
      }

      // Fetch products
      const productsRes = await productService.getProducts();
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

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      const categoryId = parseInt(selectedCategory);
      filtered = filtered.filter(p => {
        console.log('Comparing:', p.category_id, '===', categoryId, '→', p.category_id === categoryId);
        return p.category_id === categoryId;
      });
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

    console.log('Filtered products:', filtered);
    setFilteredProducts(filtered);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('newest');
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Header */}
      <div className="home-header">
        <div className="header-content">
          <h1>🏆 Sàn Đấu Giá Trực Tuyến</h1>
          <p>Tìm kiếm sản phẩm yêu thích của bạn</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="home-container">
        {/* Sidebar: Filters */}
        <aside className="sidebar">
          <div className="filter-section">
            <h3>🔍 Tìm Kiếm</h3>
            <input
              type="text"
              placeholder="Tên sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <h3>📁 Chuyên Mục</h3>
            <select
              value={selectedCategory}
              onChange={(e) => {
                console.log('Selected category:', e.target.value);
                setSelectedCategory(e.target.value);
              }}
              className="category-select"
            >
              <option value="">Tất cả chuyên mục</option>
              {categories && categories.length > 0 ? (
                categories.map(cat => (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>Đang tải chuyên mục...</option>
              )}
            </select>
          </div>

          <div className="filter-section">
            <h3>📊 Sắp Xếp</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Mới nhất</option>
              <option value="ending">Sắp kết thúc</option>
              <option value="price_low">Giá thấp đến cao</option>
              <option value="price_high">Giá cao đến thấp</option>
            </select>
          </div>

          <button
            className="clear-filters-btn"
            onClick={handleClearFilters}
          >
            🔄 Xóa bộ lọc
          </button>
        </aside>

        {/* Main Content: Products */}
        <main className="products-section">
          {/* Results Header */}
          <div className="results-header">
            <h2>
              {selectedCategory || searchQuery ? '🔎 Kết quả tìm kiếm' : '📦 Tất cả sản phẩm'}
            </h2>
            <p className="result-count">
              Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <div className="no-products-icon">📭</div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>
                {searchQuery || selectedCategory
                  ? 'Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                  : 'Không có sản phẩm nào có sẵn'}
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  className="reset-btn"
                  onClick={handleClearFilters}
                >
                  ↻ Xóa bộ lọc
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
