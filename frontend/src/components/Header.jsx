import './Header.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProducts, useFilters } from '../hooks/useProduct';

export default function Header() {
        const navigate = useNavigate();
        const { categories } = useProducts();
        const {
            searchQuery,
            setSearchQuery,
            selectedCategory,
            setSelectedCategory,
            sortBy,
            setSortBy,
        } = useFilters([]);
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
        const [isDropdownOpenSort, setIsDropdownOpenSort] = useState(false);

        // Chia categories thành các cột (chưa có hiểu đoạn này nhe)
        const splitIntoColumns = (arr, numCols) => {
            if (!arr || arr.length === 0) return [];
            const itemsPerCol = Math.ceil(arr.length / numCols);
            return Array.from({ length: numCols }, (_, i) =>
                arr.slice(i * itemsPerCol, i * itemsPerCol + itemsPerCol)
            );
        };
        const categoryColumns = splitIntoColumns(categories, 3);

        // Xử lý chọn chuyên mục và sắp xếp
        const handleCategorySelect = (categoryId) => {
            setSelectedCategory(String(categoryId));
            setIsDropdownOpen(false);
            const params = new URLSearchParams();
            params.set('category', String(categoryId));
            if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);
            navigate(`/search?${params.toString()}`);
        };

        // Xử lý chọn sắp xếp
        const handleSortSelect = (sortOption) => {
            setSortBy(sortOption);
            setIsDropdownOpenSort(false);
            const params = new URLSearchParams();
            if (selectedCategory) params.set('category', selectedCategory);
            params.set('sort', sortOption);
            navigate(`/search?${params.toString()}`);
        };

        // Xử lý nhập và submit tìm kiếm
        const handleSearchInput = (e) => {
            setSearchQuery(e.target.value);
        };

        // Xử lý submit tìm kiếm
        const handleSearchSubmit = (e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}&sort=${sortBy}${selectedCategory ? '&category=' + selectedCategory : ''}`);
            }
        };

        return (
            <header className="header">
                <div className="header-container">
                    {/* Logo */}
                    <a className="header-logo" href="/">
                        <span className="logo-text">Đấu Giá Online</span>
                    </a>

                    {/* Search Bar */}
                    <form className="search-form" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Tìm sản phẩm yêu thích..."
                            value={searchQuery}

                            // Là nó sẽ thay đổi trang khúc này
                            onChange={handleSearchInput}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">Tìm</button>
                    </form>

                    {/* Filters */}
                    <div className="filters-bar">
                        {/* Category Filter */}
                        <div className="filter-dropdown">
                            <button 
                                className={`filter-btn ${selectedCategory ? 'active' : ''}`}
                                onClick={() => {
                                    setIsDropdownOpen(!isDropdownOpen);
                                    if (!isDropdownOpen) setIsDropdownOpenSort(false);
                                }}>
                                <span>Chuyên Mục</span>
                                <span className="arrow">{isDropdownOpen ? '▲' : '▼'}</span>
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    {categoryColumns.length > 0 ? (
                                        categoryColumns.map((column, colIndex) => (
                                            <ul key={colIndex} className="dropdown-list">
                                                {colIndex === 0 && (
                                                    <li
                                                        className={selectedCategory === "" ?'active' : ''}
                                                        onClick={() => handleCategorySelect("")}
                                                    >
                                                    Tất cả chuyên mục
                                                    </li>

                                                )}
                                                {column.map(cat => (
                                                    <li
                                                        key={cat.id}
                                                        className={String(cat.id) === selectedCategory ? 'active' : ''}
                                                        onClick={() => handleCategorySelect(String(cat.id))}
                                                    >
                                                    {cat.name}
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

                        {/* Sort Filter */}
                        <div className="filter-dropdown">
                            <button 
                                className={`filter-btn ${sortBy !== 'newest' ? 'active' : ''}`}
                                onClick={() => {
                                    setIsDropdownOpenSort(!isDropdownOpenSort);
                                    if (!isDropdownOpenSort) setIsDropdownOpen(false);
                                }}>
                                <span>Sắp xếp</span>
                                <span className="arrow">{isDropdownOpenSort ? '▲' : '▼'}</span>
                            </button>
                            {isDropdownOpenSort && (
                                <div className="dropdown-menu">
                                    <ul className="dropdown-list">
                                        <li 
                                            className={sortBy === 'newest' ? 'active' : ''}
                                            onClick={() => {
                                                handleSortSelect('newest');
                                            }}
                                        >
                                            Mới nhất
                                        </li>
                                        <li 
                                            className={sortBy === 'ending' ? 'active' : ''}
                                            onClick={() => handleSortSelect('ending')}
                                        >
                                            Sắp kết thúc
                                        </li>
                                        <li 
                                            className={sortBy === 'price_low' ? 'active' : ''}
                                            onClick={() => handleSortSelect('price_low')}
                                        >
                                            Giá thấp đến cao
                                        </li>
                                        <li 
                                            className={sortBy === 'price_high' ? 'active' : ''}
                                            onClick={() => handleSortSelect('price_high')}
                                        >
                                            Giá cao đến thấp
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Login */}
                    <a href="/login" className="header-login">
                        🔐 Đăng nhập
                    </a>
                </div>
            </header>
        );
}
