import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useProducts, useFilters } from '../hooks/useProduct';
import { useAuth } from '../contexts/AuthContext.jsx';
import { BiChevronDown, BiMenu, BiX, BiUser, BiLogOut, BiShoppingBag, BiPlusCircle, BiShield } from 'react-icons/bi';

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

    // --- SỬ DỤNG CSS VARIABLES ---
    // Khai báo ở đây để dùng trong style prop, map với file CSS gốc
    const colors = {
        bg: 'var(--color-white)',
        text: 'var(--color-dark)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        border: 'var(--color-dark)',
        accent: 'var(--color-accent)', // Dùng cho shadow
        gray: 'var(--color-gray)',
        inputBg: '#f4f6f8' // Màu nền input nhẹ
    };

    return (
        <header 
            className="sticky top-0 z-50 transition-all py-2"
            style={{ 
                backgroundColor: colors.bg,
                borderBottom: `3px solid ${colors.border}`
            }}
        >
            <div className="container mx-auto px-6 h-14 flex items-center justify-between">
                
                {/* --- TRÁI: LOGO --- */}
                {/* flex-shrink-0 để không bị co lại, bỏ w-48 để tự giãn theo chữ */}
                <div className="flex-shrink-0 flex items-center"> 
                    <NavLink 
                        to="/" 
                        // Thêm whitespace-nowrap để TUYỆT ĐỐI KHÔNG XUỐNG DÒNG
                        className="text-xl font-black no-underline block hover:opacity-80 transition-opacity whitespace-nowrap" 
                        style={{ color: colors.text, textDecoration: 'none' }}
                    >
                        Đấu Giá Online
                    </NavLink>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="lg:hidden text-2xl bg-transparent border-none cursor-pointer"
                    style={{ color: colors.text }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <BiX /> : <BiMenu />}
                </button>

                {/* --- GIỮA: SEARCH + BUTTONS --- */}
                <div className="hidden lg:flex flex-1 items-center justify-center gap-6 px-4">
                    
                    {/* SEARCH BAR */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md group">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-2 px-5 rounded-full outline-none font-medium transition-all"
                            style={{ 
                                border: `2px solid ${colors.border}`,
                                backgroundColor: colors.inputBg,
                                color: colors.text,
                                boxShadow: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.backgroundColor = colors.bg;
                                e.target.style.boxShadow = `4px 4px 0px ${colors.accent}`;
                            }}
                            onBlur={(e) => {
                                e.target.style.backgroundColor = colors.inputBg;
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </form>

                    {/* CATEGORY BUTTON */}
                    <div className="relative" ref={catDropdownRef}>
                        <button 
                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            // whitespace-nowrap
                            className="font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors bg-transparent border-none hover:bg-gray-100 flex items-center gap-1 whitespace-nowrap"
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
                        
                        {/* Mega Menu Dropdown */}
                        {showCategoryDropdown && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] bg-white rounded-xl overflow-hidden flex z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                                style={{ 
                                    backgroundColor: colors.bg,
                                    border: `3px solid ${colors.border}`,
                                    boxShadow: `6px 6px 0px ${colors.border}`
                                }}
                            >
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
                                                        <div key={child.id} className={`p-2 rounded hover:bg-blue-50 cursor-pointer font-medium text-sm transition-colors ${String(child.id) === selectedCategory ? 'bg-blue-100' : ''}`} style={{ color: String(child.id) === selectedCategory ? colors.primary : colors.gray }} onClick={(e) => { e.stopPropagation(); handleCategorySelect(String(child.id)); }}>
                                                            {child.name}
                                                        </div>
                                                    ))
                                                ) : <p className="text-gray-400 italic col-span-2">Không có mục con</p>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SORT BUTTON */}
                    <div className="relative" ref={sortDropdownRef}>
                        <button 
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            // whitespace-nowrap
                            className="font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors bg-transparent border-none hover:bg-gray-100 flex items-center gap-1 whitespace-nowrap"
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
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white rounded-xl overflow-hidden z-50"
                                 style={{ 
                                    backgroundColor: colors.bg,
                                    border: `3px solid ${colors.border}`,
                                    boxShadow: `4px 4px 0px ${colors.border}`
                                }}>
                                {[ { id: 'newest', label: 'Mới nhất' }, { id: 'ending', label: 'Sắp kết thúc' }, { id: 'price_low', label: 'Giá thấp → cao' }, { id: 'price_high', label: 'Giá cao → thấp' } ].map(opt => (
                                    <button key={opt.id} className="w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors bg-transparent border-none cursor-pointer flex justify-between font-medium" onClick={() => handleSortSelect(opt.id)} style={{ color: sortBy === opt.id ? colors.primary : colors.text }}>
                                        {opt.label} {sortBy === opt.id && <span>✓</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- PHẢI: USER / LOGIN --- */}
                <div className="hidden lg:flex flex-shrink-0 items-center justify-end">
                    {cur_user ? (
                        <div className="relative" ref={userDropdownRef}>
                            <button 
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                className="flex items-center gap-2 px-3 py-1 rounded-lg cursor-pointer transition-colors bg-transparent border-none hover:bg-gray-100"
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm" 
                                    style={{ backgroundColor: colors.primary }}>
                                    {cur_user.username.charAt(0).toUpperCase()}
                                </div>
                                {/* Bỏ max-w và thêm whitespace-nowrap để tên dài cỡ nào cũng nằm 1 dòng */}
                                <span className="font-bold text-sm whitespace-nowrap" style={{ color: colors.text }}>
                                    {cur_user.username}
                                </span>
                                <BiChevronDown 
                                    size={18}
                                    style={{ 
                                        color: colors.text,
                                        transform: showUserDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                />
                            </button>
                            
                            {/* User Dropdown */}
                            {showUserDropdown && (
                                <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-xl overflow-hidden z-50 flex flex-col"
                                    style={{ 
                                        backgroundColor: colors.bg,
                                        border: `3px solid ${colors.border}`,
                                        boxShadow: `6px 6px 0px ${colors.border}` 
                                    }}>
                                    <div className="px-5 py-3 bg-gray-50 border-b-2 border-gray-100"><p className="text-xs uppercase font-bold tracking-wider opacity-60">Tài khoản</p><p className="font-bold truncate" style={{ color: colors.text }}>{cur_user.username}</p></div>
                                    
                                    {(cur_user.role === 'admin' || cur_user.role === 1) && (
                                        <button onClick={() => navigate('/admin')} className="w-full px-5 py-3 text-left hover:bg-gray-50 flex items-center gap-3 bg-transparent border-none cursor-pointer font-medium" style={{ color: colors.primary }}>
                                            <BiShield size={18} /> Quản trị hệ thống
                                        </button>
                                    )}

                                    <button onClick={() => navigate('/profile')} className="w-full px-5 py-3 text-left hover:bg-gray-50 flex items-center gap-3 bg-transparent border-none cursor-pointer font-medium" style={{ color: colors.text }}><BiUser size={18} /> Hồ sơ cá nhân</button>
                                    {cur_user.role === 2 && (<><button onClick={() => navigate('/products/add-product')} className="w-full px-5 py-3 text-left hover:bg-gray-50 flex items-center gap-3 bg-transparent border-none cursor-pointer font-medium" style={{ color: colors.text }}><BiPlusCircle size={18} /> Đăng bán</button><button onClick={() => navigate('/seller/orders')} className="w-full px-5 py-3 text-left hover:bg-gray-50 flex items-center gap-3 bg-transparent border-none cursor-pointer font-medium" style={{ color: colors.text }}><BiShoppingBag size={18} /> Quản lý đơn</button></>)}
                                    <div className="border-t-2 border-gray-100 my-1"></div>
                                    <button onClick={() => { logout(); navigate('/login'); }} className="w-full px-5 py-3 text-left hover:bg-red-50 flex items-center gap-3 bg-transparent border-none cursor-pointer font-bold" style={{ color: colors.secondary }}><BiLogOut size={18} /> Đăng xuất</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate('/login')}
                            // whitespace-nowrap
                            className="px-6 py-2 rounded-lg font-bold text-sm text-white cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
                            style={{ 
                                backgroundColor: colors.primary,
                                border: `2px solid ${colors.border}`,
                                boxShadow: `3px 3px 0px ${colors.border}`
                            }}
                        >
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b-2 border-gray-800 shadow-xl p-6 flex flex-col gap-4 z-40" 
                     style={{ borderBottom: `3px solid ${colors.border}`, backgroundColor: colors.bg }}>
                    <form onSubmit={handleSearchSubmit}>
                        <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-3 px-5 rounded-lg border-2 outline-none font-medium"
                            style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBg }} />
                    </form>
                    {/* ... Mobile Menu Items ... */}
                </div>
            )}
        </header>
    );
}
