import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({
  categories,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  onClearFilters,
}) => {
  const [isDropdownOpenCat, setIsDropdownOpenCat] = useState(false);
  const [isDropdownOpenSort, setIsDropdownOpenSort] = useState(false);

  // Chia categories thành các cột
  const splitIntoColumns = (arr, numCols) => {
    if (!arr || arr.length === 0) return [];
    const itemsPerCol = Math.ceil(arr.length / numCols);
    return Array.from({ length: numCols }, (_, i) =>
      arr.slice(i * itemsPerCol, i * itemsPerCol + itemsPerCol)
    );
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsDropdownOpenCat(false);
  };

  const handleSortSelect = (sortOption) => {
    setSortBy(sortOption);
    setIsDropdownOpenSort(false);
  };

  const categoryColumns = splitIntoColumns(categories, 3);

  return (
    <aside className="sidebar">
      {/* Search */}
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

      {/* Category Dropdown */}
      <div className="filter-section">
        <div className="custom-dropdown">
          <div
            className="dropdown-toggle"
            onClick={() => setIsDropdownOpenCat(!isDropdownOpenCat)}
          >
            <h3>📁 Chuyên Mục</h3>
            <span className="arrow">▼</span>
          </div>

          {isDropdownOpenCat && (
            <div className="custom-dropdown-content">
              {categoryColumns.length > 0 ? (
                categoryColumns.map((column, colIndex) => (
                  <ul key={colIndex} className="genre-columns">
                    {colIndex === 0 && (
                      <li
                        onClick={() => handleCategorySelect('')}
                        className={selectedCategory === '' ? 'selected' : ''}
                      >
                        <a href="#">Tất cả chuyên mục</a>
                      </li>
                    )}

                    {column.map(cat => (
                      <li
                        key={cat.id}
                        onClick={() => handleCategorySelect(String(cat.id))}
                        className={String(cat.id) === selectedCategory ? 'selected' : ''}
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
      </div>

      {/* Sort Dropdown */}
      <div className="filter-section">
        <div className="custom-dropdown">
          <div
            className="dropdown-toggle"
            onClick={() => setIsDropdownOpenSort(!isDropdownOpenSort)}
          >
            <h3>📊 Sắp Xếp</h3>
            <span className="arrow">▼</span>
          </div>

          {isDropdownOpenSort && (
            <div className="custom-dropdown-content">
              <ul className="genre-columns">
                <li
                  onClick={() => handleSortSelect('newest')}
                  className={sortBy === 'newest' ? 'selected' : ''}
                >
                  <a href="#">Mới nhất</a>
                </li>
                <li
                  onClick={() => handleSortSelect('ending')}
                  className={sortBy === 'ending' ? 'selected' : ''}
                >
                  <a href="#">Sắp kết thúc</a>
                </li>
                <li
                  onClick={() => handleSortSelect('price_low')}
                  className={sortBy === 'price_low' ? 'selected' : ''}
                >
                  <a href="#">Giá thấp đến cao</a>
                </li>
                <li
                  onClick={() => handleSortSelect('price_high')}
                  className={sortBy === 'price_high' ? 'selected' : ''}
                >
                  <a href="#">Giá cao đến thấp</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="filter-section">
        <button
          className="clear-filters-btn"
          onClick={onClearFilters}
        >
          ↻ Xóa bộ lọc
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
