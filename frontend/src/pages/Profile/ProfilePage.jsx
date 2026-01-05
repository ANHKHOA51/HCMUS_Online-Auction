import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaHeart, FaGavel, FaTrophy, FaStar, FaSignOutAlt, FaStore } from 'react-icons/fa';
import ProfileSettings from './components/ProfileSettings';
import SellerProducts from './components/SellerProducts';
import WatchlistTab from './components/WatchlistTab';
import BiddingTab from './components/BiddingTab';
import WonListTab from './components/WonListTab';
import ReviewsTab from './components/ReviewsTab';
import './ProfilePage.css';

const ProfilePage = () => {
    const { cur_user: user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('settings');

    const menuItems = [
        { id: 'settings', label: 'Hồ sơ cá nhân', icon: <FaUser /> },
        // Hiển thị tab bán hàng nếu là Seller (role = 2 hoặc 'seller')
        // Sử dụng so sánh lỏng (==) để chấp nhận cả chuỗi '2' và số 2
        ...((user?.role === 'seller' || user?.role == 2) ? [{ id: 'selling', label: 'Sản phẩm đăng bán', icon: <FaStore /> }] : []),
        { id: 'watchlist', label: 'Sản phẩm yêu thích', icon: <FaHeart /> },
        { id: 'bidding', label: 'Đang đấu giá', icon: <FaGavel /> },
        { id: 'won', label: 'Đã thắng đấu giá', icon: <FaTrophy /> },
        { id: 'reviews', label: 'Nhận xét của tôi', icon: <FaStar /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'settings': return <ProfileSettings />;
            case 'selling': return <SellerProducts />;
            case 'watchlist': return <WatchlistTab />;
            case 'bidding': return <BiddingTab />;
            case 'won': return <WonListTab />;
            case 'reviews': return <ReviewsTab />;
            default: return <ProfileSettings />;
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-dashboard-card">
                {/* Sidebar Menu */}
                <aside className="profile-sidebar">
                    <nav className="profile-menu">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <span className="menu-icon">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                        
                        <button className="menu-item logout-btn" onClick={() => {
                            logout();
                            navigate('/login');
                        }}>
                            <span className="menu-icon"><FaSignOutAlt /></span>
                            Đăng xuất
                        </button>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="profile-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
