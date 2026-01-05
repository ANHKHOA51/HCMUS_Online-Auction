import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useProducts, useFilters } from '../hooks/useProduct';
import { useAuth } from '../contexts/AuthContext.jsx';
import { BiChevronDown, BiMenu, BiX, BiUser, BiLogOut, BiShoppingBag, BiPlusCircle } from 'react-icons/bi';

export default function Header() {
    const navigate = useNavigate();
    const { categories } = useProducts();
    const { cur_user, logout } = useAuth();
    
    const {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
    } = useFilters([]);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    
    const [hoveredParent, setHoveredParent] = useState(null);
    const catDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);
    const userDropdownRef = useRef(null);

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event) {
            if (catDropdownRef.current && !catDropdownRef.current.contains(event.target)) {
                setShowCategoryDropdown(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Build category tree
    const buildCategoryTree = (cats) => {
        if (!cats) return [];
        const roots = cats.filter(c => !c.parent_category_id);
        return roots.map(root => ({
            ...root,
            children: cats.filter(c => c.parent_category_id === root.id)
        }));
    };
    const categoryTree = buildCategoryTree(categories);

    useEffect(() => {
        if (categoryTree.length > 0) setHoveredParent(categoryTree[0]);
    }, [categories]);

    // Handlers
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(String(categoryId));
        setShowCategoryDropdown(false);
        setIsMobileMenuOpen(false);
        const params = new URLSearchParams();
        if (categoryId) params.set('category', String(categoryId));
        if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);
        navigate(`/search?${params.toString()}`);
    };

    const handleSortSelect = (sortOption) => {
        setSortBy(sortOption);
        setShowSortDropdown(false);
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        params.set('sort', sortOption);
        navigate(`/search?${params.toString()}`);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsMobileMenuOpen(false);
        }
    };

    // --- HAPPY HUES PALETTE ---
    const colors = {
        bg: '#fffffe',
        text: '#094067',
        primary: '#3da9fc',
        border: '#094067',
        secondary: '#90b4ce'
    };

    return (
        <header 
            className="sticky top-0 z-50 transition-all"
            style={{ 
                backgroundColor: colors.bg,
                borderBottom: `3px solid ${colors.border}`,
                width: '100%', // Bung hết cỡ
            }}
        >
            {/* CONTAINER: Dùng padding lớn (px-12) để đẩy 2 bên vào một chút nhưng vẫn xa, justify-between để tách 3 khối */}
            <div className="w-full px-8 md:px-12 h-20 flex items-center justify-between">
                
                {/* --- KHỐI 1: LOGO (Căn trái tuyệt đối) --- */}
                <div className="flex-shrink-0"> 
                    <NavLink 
                        to="/" 
                        className="text-2xl font-black no-underline block hover:opacity-80 transition-opacity whitespace-nowrap" 
                        style={{ color: colors.text, textDecoration: 'none' }}
                    >
                        Đấu Giá Online
                    </NavLink>
                </div>

                {/* Mobile Toggle */}
                <button 
                    className="lg:hidden text-3xl bg-transparent border-none cursor-pointer"
                    style={{ color: colors.text }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <BiX /> : <BiMenu />}
                </button>

                {/* --- KHỐI 2: SEARCH + NAV (Căn giữa tuyệt đối & Giãn cách rộng) --- */}
                {/* flex-1 để chiếm không gian giữa, justify-center để nằm chính giữa màn hình */}
                <div className="hidden lg:flex flex-1 items-center justify-center gap-10 xl:gap-16 px-4">
                    
                    {/* SEARCH BAR (Giới hạn max-width để không bị quá dài như hình cũ) */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-[400px]">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-3 px-6 rounded-full outline-none font-bold transition-all text-sm"
                            style={{ 
                                border: `2px solid ${colors.border}`,
                                backgroundColor: '#f4f6f8',
                                color: colors.text,
                                boxShadow: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.backgroundColor = colors.bg;
                                e.target.style.boxShadow = '4px 4px 0px var(--color-accent)';
                            }}
                            onBlur={(e) => {
                                e.target.style.backgroundColor = '#f4f6f8';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </form>

                    {/* NAV GROUP (Category + Sort) */}
                    <div className="flex items-center gap-8 flex-shrink-0">
                        {/* Category */}
                        <div className="relative" ref={catDropdownRef}>
                            <button 
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                // whitespace-nowrap để chữ không bị rớt dòng
                                className="font-bold text-base cursor-pointer transition-opacity bg-transparent border-none hover:opacity-70 flex items-center gap-1 whitespace-nowrap"
                                style={{ color: colors.text }}
                            >
                                {selectedCategory ? 'Đã chọn' : 'Danh mục'}
                                <BiChevronDown 
                                    size={20} 
                                    style={{ 
                                        transform: showCategoryDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                />
                            </button>
                            {/* Dropdown Content */}
                            {showCategoryDropdown && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-5 w-[600px] bg-white rounded-xl overflow-hidden flex z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                                    style={{ border: `3px solid ${colors.border}`, boxShadow: `6px 6px 0px ${colors.border}` }}
                                >
                                    {/* ... Nội dung dropdown danh mục giữ nguyên ... */}
                                    <div className="w-1/3 bg-gray-50 border-r-2 border-gray-200 max-h-[400px] overflow-y-auto">
                                        <div className="p-4 font-bold cursor-pointer hover:bg-white border-b-2 border-gray-100" style={{ color: colors.text }} onClick={() => handleCategorySelect("")}>Tất cả</div>
                                        {categoryTree.map(parent => (
                                            <div key={parent.id} className={`p-4 cursor-pointer font-medium transition-colors flex justify-between ${hoveredParent?.id === parent.id ? 'bg-white' : 'hover:bg-gray-100'}`} style={{ color: hoveredParent?.id === parent.id ? colors.primary : colors.text }} onMouseEnter={() => setHoveredParent(parent)} onClick={() => handleCategorySelect(String(parent.id))}>
                                                {parent.name} <span>›</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-2/3 p-5 bg-white max-h-[400px] overflow-y-auto">
                                        {hoveredParent && (
                                            <>
                                                <h4 className="font-black text-lg mb-4" style={{ color: colors.text }}>{hoveredParent.name}</h4>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {hoveredParent.children.length > 0 ? (
                                                        hoveredParent.children.map(child => (
                                                            <div key={child.id} className="p-2 rounded hover:bg-blue-50 cursor-pointer font-medium text-sm transition-colors" style={{ color: String(child.id) === selectedCategory ? colors.primary : 'var(--color-gray)' }} onClick={(e) => { e.stopPropagation(); handleCategorySelect(String(child.id)); }}>
                                                                {child.name}
                                                            </div>
                                                        ))
                                                    ) : <p className="text-gray-400 italic col-span-2">Trống</p>}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sort */}
                        <div className="relative" ref={sortDropdownRef}>
                            <button 
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className="font-bold text-base cursor-pointer transition-opacity bg-transparent border-none hover:opacity-70 flex items-center gap-1 whitespace-nowrap"
                                style={{ color: colors.text }}
                            >
                                Sắp xếp
                                <BiChevronDown 
                                    size={20}
                                    style={{ 
                                        transform: showSortDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                />
                            </button>
                            {showSortDropdown && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-5 w-56 bg-white rounded-xl overflow-hidden z-50"
                                     style={{ border: `3px solid ${colors.border}`, boxShadow: `4px 4px 0px ${colors.border}` }}>
                                    {[
                                        { id: 'newest', label: 'Mới nhất' },
                                        { id: 'ending', label: 'Sắp kết thúc' },
                                        { id: 'price_low', label: 'Giá thấp → cao' },
                                        { id: 'price_high', label: 'Giá cao → thấp' }
                                    ].map(opt => (
                                        <button key={opt.id} className="w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors bg-transparent border-none cursor-pointer flex justify-between font-medium" onClick={() => handleSortSelect(opt.id)} style={{ color: sortBy === opt.id ? colors.primary : colors.text }}>
                                            {opt.label}
                                            {sortBy === opt.id && <span>✓</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- KHỐI 3: USER / LOGIN (Căn phải tuyệt đối) --- */}
                <div className="hidden lg:flex flex-shrink-0 items-center justify-end">
                    {cur_user ? (
                        <div className="relative" ref={userDropdownRef}>
                            <button 
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                className="flex items-center gap-3 px-2 py-1 rounded-lg cursor-pointer transition-opacity bg-transparent border-none hover:opacity-70"
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm border-2 border-transparent" 
                                    style={{ backgroundColor: colors.primary }}>
                                    {cur_user.username.charAt(0).toUpperCase()}
                                </div>
                                {/* Ẩn tên user nếu màn hình không quá rộng để giữ layout sạch, hoặc để lại tùy bạn */}
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-sm max-w-[120px] truncate leading-tight" style={{ color: colors.text }}>
                                        {cur_user.username}
                                    </span>
                                </div>
                                <BiChevronDown size={18} style={{ color: colors.text }} />
                            </button>
                            {/* User Dropdown */}
                            {showUserDropdown && (
                                <div className="absolute top-full right-0 mt-5 w-64 bg-white rounded-xl overflow-hidden z-50 flex flex-col"
                                    style={{ border: `3px solid ${colors.border}`, boxShadow: `6px 6px 0px ${colors.border}` }}>
                                    {/* ... User Menu Items ... */}
                                    <button onClick={() => navigate('/profile')} className="w-full px-5 py-3 text-left hover:bg-gray-50 flex items-center gap-3 bg-transparent border-none cursor-pointer font-medium" style={{ color: colors.text }}>
                                        <BiUser size={18} /> Hồ sơ
                                    </button>
                                    <button onClick={() => { logout(); navigate('/login'); }} className="w-full px-5 py-3 text-left hover:bg-red-50 flex items-center gap-3 bg-transparent border-none cursor-pointer font-bold" style={{ color: colors.secondary }}>
                                        <BiLogOut size={18} /> Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate('/login')}
                            className="px-8 py-3 rounded-lg font-bold text-base text-white cursor-pointer transition-transform hover:-translate-y-1 active:translate-y-0"
                            style={{ 
                                backgroundColor: colors.primary,
                                border: `2px solid ${colors.border}`,
                                boxShadow: `4px 4px 0px ${colors.border}`
                            }}
                        >
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b-2 border-gray-800 shadow-xl p-6 flex flex-col gap-4 z-40" 
                     style={{ borderBottom: `3px solid ${colors.border}` }}>
                    {/* ... Mobile content ... */}
                     <form onSubmit={handleSearchSubmit}>
                        <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-3 px-5 rounded-lg border-2 outline-none font-medium" style={{ borderColor: colors.border, color: colors.text, backgroundColor: '#f4f6f8' }} />
                    </form>
                </div>
            )}
        </header>
    );
}
