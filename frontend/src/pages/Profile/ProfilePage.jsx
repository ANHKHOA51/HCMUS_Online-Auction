import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaHeart, FaGavel, FaTrophy, FaStar, FaSignOutAlt } from 'react-icons/fa';
import ProfileSettings from './components/ProfileSettings';
import WatchlistTab from './components/WatchlistTab';
import BiddingTab from './components/BiddingTab';
import WonListTab from './components/WonListTab';
import ReviewsTab from './components/ReviewsTab';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('settings');

    const menuItems = [
        { id: 'settings', label: 'Hồ sơ cá nhân', icon: <FaUser /> },
        { id: 'watchlist', label: 'Sản phẩm yêu thích', icon: <FaHeart /> },
        { id: 'bidding', label: 'Đang đấu giá', icon: <FaGavel /> },
        { id: 'won', label: 'Đã thắng đấu giá', icon: <FaTrophy /> },
        { id: 'reviews', label: 'Nhận xét của tôi', icon: <FaStar /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'settings': return <ProfileSettings />;
            case 'watchlist': return <WatchlistTab />;
            case 'bidding': return <BiddingTab />;
            case 'won': return <WonListTab />;
            case 'reviews': return <ReviewsTab />;
            default: return <ProfileSettings />;
        }
    };

    return (
        <div className="profile-page">
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
                    
                    <button className="menu-item logout-btn" onClick={logout}>
                        <span className="menu-icon"><FaSignOutAlt /></span>
                        Đăng xuất
                    </button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="profile-content">
                <h2 className="tab-title">
                    {menuItems.find(i => i.id === activeTab)?.icon} 
                    <span style={{ marginLeft: '10px' }}>
                        {menuItems.find(i => i.id === activeTab)?.label}
                    </span>
                </h2>
                
                {renderContent()}
            </main>
        </div>
    );
};

export default ProfilePage;
