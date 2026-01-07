import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaHeart, FaGavel, FaTrophy, FaStar, FaSignOutAlt, FaStore } from 'react-icons/fa';
import ProfileSettings from './components/ProfileSettings';
import WatchlistTab from './components/WatchlistTab';
import BiddingTab from './components/BiddingTab';
import WonListTab from './components/WonListTab';
import ReviewsTab from './components/ReviewsTab';
import SellerProducts from './components/SellerProducts';
// Đã xóa import './ProfilePage.css';

const ProfilePage = () => {
    const { cur_user: user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('settings');

    const menuItems = [
        { id: 'settings', label: 'Hồ sơ cá nhân', icon: <FaUser /> },
        ...((user?.role === 'seller' || user?.role == 2) ? [
            { id: 'seller-products', label: 'Sản phẩm đăng bán', icon: <FaStore /> }
        ] : []),
        { id: 'watchlist', label: 'Sản phẩm yêu thích', icon: <FaHeart /> },
        { id: 'bidding', label: 'Đang đấu giá', icon: <FaGavel /> },
        { id: 'won', label: 'Đã thắng đấu giá', icon: <FaTrophy /> },
        { id: 'reviews', label: 'Nhận xét của tôi', icon: <FaStar /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'settings': return <ProfileSettings />;
            case 'seller-products': return <SellerProducts />;
            case 'watchlist': return <WatchlistTab />;
            case 'bidding': return <BiddingTab />;
            case 'won': return <WonListTab />;
            case 'reviews': return <ReviewsTab />;
            default: return <ProfileSettings />;
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto p-[40px_15px] min-h-[600px] max-[768px]:flex max-[768px]:flex-col">
            <div className="flex bg-[var(--color-white)] border-[2px] border-solid border-[var(--color-dark)] shadow-[8px_8px_0_var(--color-dark)] rounded-[16px] overflow-hidden min-h-[600px] max-[992px]:flex-col max-[992px]:h-auto">
                {/* Sidebar Menu */}
                <aside className="w-[280px] shrink-0 bg-[var(--color-white)] p-[24px] border-r-[2px] border-solid border-[var(--color-dark)] max-[992px]:w-full max-[992px]:!border-r-0 max-[992px]:border-b-[2px] max-[992px]:border-b-[var(--color-dark)] max-[768px]:w-full">
                    <nav className="flex flex-col gap-[8px]">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                className={`flex items-center gap-[12px] p-[12px_16px] rounded-[8px] cursor-pointer transition-all duration-[0.1s] font-semibold bg-none w-full text-left text-[0.95rem] border-[2px] border-solid ${
                                    activeTab === item.id 
                                        ? 'bg-[var(--color-accent)] text-[var(--color-dark)] border-[var(--color-dark)] shadow-[2px_2px_0_var(--color-dark)]' 
                                        : 'border-transparent text-[var(--color-dark)] hover:bg-[var(--color-white)] hover:border-[var(--color-dark)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[2px_2px_0_var(--color-dark)]'
                                }`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <span className="text-[1.1rem]">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                        
                        <button 
                            className="flex items-center gap-[12px] p-[12px_16px] rounded-[8px] cursor-pointer transition-all duration-[0.1s] font-semibold bg-none w-full text-left text-[0.95rem] border-[2px] border-solid border-transparent text-[var(--color-dark)] hover:bg-[var(--color-white)] hover:border-[var(--color-dark)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[2px_2px_0_var(--color-dark)]"
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                        >
                            <span className="text-[1.1rem]"><FaSignOutAlt /></span>
                            Đăng xuất
                        </button>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 bg-white p-[32px] min-w-0">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
