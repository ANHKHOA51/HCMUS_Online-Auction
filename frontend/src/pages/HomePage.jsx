<<<<<<< HEAD
import TopProduct from "../components/TopProduct";
import { fakeFetchItems } from "../services/fakeFetch";

export default function Home() {
    return (
        <>
            <TopProduct title={"Top 5 sản phẩm gần kết thúc"} fetchFunc={fakeFetchItems}></TopProduct>
            <TopProduct title={"Top 5 sản phẩm gần kết thúc"} fetchFunc={fakeFetchItems}></TopProduct>
            <TopProduct title={"Top 5 sản phẩm gần kết thúc"} fetchFunc={fakeFetchItems}></TopProduct>
        </>
    )
}
=======
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenSort, setIsDropdownOpenSort] = useState(false);



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

  // Chia mảng thành các cột
  const splitIntoColumns = (arr, numCols) => {
        if (!arr || arr.length === 0) return [];
        const itemsPerCol = Math.ceil(arr.length / numCols);
        return Array.from({ length: numCols }, (_, i) => 
            arr.slice(i * itemsPerCol, i * itemsPerCol + itemsPerCol)
        );
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

  const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        // Đóng dropdown sau khi chọn
        setIsDropdownOpen(false); 
    };

    const handleSortSelect = (sortOption) => {
        setSortBy(sortOption);
        // Đóng dropdown sau khi chọn
        setIsDropdownOpenSort(false); 
    }

  const categoryColumns = splitIntoColumns(categories, 4);

  return (
    <div className="home-page">
      {/* Header */}
      <div className="home-header">
        <div className="header-content">
          <h1>Auction</h1>
        </div>
        <div className="filters-container">
            
            <div className="filter-search">
                <input
                type="text"
                placeholder="Tên sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                />
            </div>
        
            
                <div className="filter-category custom-dropdown">
                    <div
                        className="dropdown-toggle"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <h3>Chuyên Mục</h3><span className="arrow">▼</span>
                    </div>

                    {isDropdownOpen && (
                        <div className="custom-dropdown-content">
                            {categoryColumns.length > 0 ? (
                                categoryColumns.map((column, colIndex) => (
                                    <ul key={colIndex} className="genre-columns">
                                        {/* Mục "Tất cả" luôn ở cột đầu tiên */}
                                        {colIndex === 0 && (
                                            <li 
                                                onClick={() => handleCategorySelect("")}
                                                className={selectedCategory === "" ? "selected" : ""}
                                            >
                                                <a href="#">Tất cả chuyên mục</a>
                                            </li>
                                        )}

                                        {column.map(cat => (
                                            <li 
                                                key={cat.id} 
                                                onClick={() => handleCategorySelect(String(cat.id))}
                                                className={String(cat.id) === selectedCategory ? "selected" : ""}
                                            >
                                                <a href="#">{cat.name}</a>
                                            </li>
                                        ))}
                                    </ul>
                                ))
                            ) : (
                                <div className="loading-message">Đang tải chuyên mục...</div>
                            )}
                        </div>
                    )}  
                </div>
            
                <div className="filter-sort custom-dropdown">
                    <div
                        className="dropdown-toggle"
                        onClick={() => setIsDropdownOpenSort(!isDropdownOpenSort)}>
                        <h3>Sắp xếp</h3><span className="arrow">▼</span>
                    </div>
                    
                    {isDropdownOpenSort && (
                        <div className="custom-dropdown-content">
                            <ul className ="genre-columns">
                                <li onClick={() => handleSortSelect('newest')} className={sortBy === 'newest' ? 'selected' : ''}>
                                    <a href="#">Mới nhất</a>
                                </li>
                                <li onClick={() => handleSortSelect('ending')} className={sortBy === 'ending' ? 'selected' : ''}>
                                    <a href="#">Sắp kết thúc</a>
                                </li>
                                <li onClick={() => handleSortSelect('price_low')} className={sortBy === 'price_low' ? 'selected' : ''}>
                                    <a href="#">Giá thấp đến cao</a>
                                </li>
                                <li onClick={() => handleSortSelect('price_high')} className={sortBy === 'price_high' ? 'selected' : ''}>
                                    <a href="#">Giá cao đến thấp</a>
                                </li>
                            </ul>
                        </div>
                    )}  
                </div>

        </div>

        <div className="header-content">
            <h1>Auction</h1>
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


          <button
            className="clear-filters-btn"
            onClick={handleClearFilters}
          >
             Xóa bộ lọc
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
>>>>>>> tienluat
