import './style.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');


  // Filter & Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownOpenSort, setIsDropdownOpenSort] = useState(false);

    

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchInput)}`);
            setSearchInput('');
        }
    };

    return (
        <div className="home-header">
            <a className="navbar-brand fs-4" href="/">
                <img
                    src="logo.png"
                    alt="Logo"
                    width="60"
                    height="60"
                    className="d-inline-block align-text-center me-2"
                />
                ONLINE AUCTION
            </a>
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
    )
}
