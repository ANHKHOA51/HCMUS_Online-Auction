import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import axiosInstance from '../../../services/axiosInstance';
import { FaUser, FaEnvelope, FaIdCard, FaPen, FaLock, FaTimes, FaSave, FaStar, FaArrowUp } from 'react-icons/fa';
import './ProfileSettings.css';

const ProfileSettings = () => {
    const { cur_user: user, updateUser } = useAuth();
    
    // Modes: 'view', 'edit_info', 'change_pass'
    const [mode, setMode] = useState('view');
    
    // State cho form thông tin
    const [infoForm, setInfoForm] = useState({
        full_name: '',
        email: ''
    });
    const [infoMessage, setInfoMessage] = useState({ type: '', text: '' });
    const [isInfoLoading, setIsInfoLoading] = useState(false);

    // State cho form mật khẩu
    const [passForm, setPassForm] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [passMessage, setPassMessage] = useState({ type: '', text: '' });
    const [isPassLoading, setIsPassLoading] = useState(false);

    // Load thông tin user vào form khi component mount hoặc user change
    useEffect(() => {
        if (user) {
            setInfoForm({
                full_name: user.full_name || '',
                email: user.email || ''
            });
        }
    }, [user]);

    // Reset messages khi chuyển mode
    useEffect(() => {
        setInfoMessage({ type: '', text: '' });
        setPassMessage({ type: '', text: '' });
    }, [mode]);

    // Xử lý cập nhật thông tin
    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        setInfoMessage({ type: '', text: '' });
        setIsInfoLoading(true);

        try {
            const response = await axiosInstance.patch('/users/update', infoForm);
            setInfoMessage({ type: 'success', text: response.data.message });
            
            // Tự động chuyển về view mode sau 1s nếu thành công
            setTimeout(() => {
                setMode('view');
                if (response.data.user) {
                    updateUser(response.data.user);
                }
            }, 1000);
            
        } catch (error) {
            setInfoMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Có lỗi xảy ra.' 
            });
        } finally {
            setIsInfoLoading(false);
        }
    };

    // Xử lý đổi mật khẩu
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPassMessage({ type: '', text: '' });

        if (passForm.new_password !== passForm.confirm_password) {
            setPassMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
            return;
        }

        setIsPassLoading(true);

        try {
            const response = await axiosInstance.patch('/users/change-password', {
                old_password: passForm.old_password,
                new_password: passForm.new_password
            });

            setPassMessage({ type: 'success', text: response.data.message });
            setPassForm({ old_password: '', new_password: '', confirm_password: '' });
            
            // Tự động chuyển về view mode sau 1s
            setTimeout(() => {
                setMode('view');
            }, 1500);

        } catch (error) {
            setPassMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Có lỗi xảy ra.' 
            });
        } finally {
            setIsPassLoading(false);
        }
    };

    // Xử lý yêu cầu nâng cấp
    const handleUpgradeRequest = async () => {
        if (!window.confirm('Bạn có chắc muốn gửi yêu cầu nâng cấp lên tài khoản người bán?')) return;
        
        try {
            await axiosInstance.post('/users/upgrade-request');
            alert('Đã gửi yêu cầu thành công! Vui lòng chờ quản trị viên xét duyệt.');
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra.');
        }
    };

    // --- RENDER: VIEW MODE (INFO CARD) ---
    const renderInfoCard = () => (
        <div className="info-card">
            <div className="info-header">
                <div className="avatar-large">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                    <button className="avatar-edit-btn" title="Đổi avatar (Chưa hỗ trợ)">
                        <FaPen />
                    </button>
                </div>
                <div className="info-main">
                    <h3>{user?.full_name || 'Chưa cập nhật tên'}</h3>
                    <span className="role-badge">
                        {(user?.role === 'seller' || user?.role == 2) ? 'Người bán' 
                        : (user?.role === 'admin' || user?.role == 1) ? 'Quản trị viên' 
                        : 'Người mua'}
                    </span>
                </div>
            </div>

            <div className="info-details">
                <div className="detail-row">
                    <div className="detail-icon"><FaEnvelope /></div>
                    <div className="detail-content">
                        <label>Email</label>
                        <p>{user?.email}</p>
                    </div>
                </div>
                <div className="detail-row">
                    <div className="detail-icon"><FaIdCard /></div>
                    <div className="detail-content">
                        <label>User ID</label>
                        <p>#{user?.id}</p>
                    </div>
                </div>
                <div className="detail-row">
                    <div className="detail-icon"><FaStar /></div>
                    <div className="detail-content">
                        <label>Điểm đánh giá</label>
                        <p>
                            <span style={{ color: '#27ae60', fontWeight: 'bold' }}>+{user?.rating_positive || 0}</span> / 
                            <span style={{ color: '#e74c3c', fontWeight: 'bold' }}> -{user?.rating_negative || 0}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="action-buttons">
                <button className="btn-action btn-edit" onClick={() => setMode('edit_info')}>
                    <FaPen /> Cập nhật thông tin
                </button>
                <button className="btn-action btn-password" onClick={() => setMode('change_pass')}>
                    <FaLock /> Đổi mật khẩu
                </button>
                {/* Check if user is bidder (role 0 or 'bidder') */}
                {(user?.role === 'bidder' || user?.role == 0) && (
                    <button className="btn-action btn-upgrade" onClick={handleUpgradeRequest} style={{ backgroundColor: '#8e44ad', color: 'white' }}>
                        <FaArrowUp /> Xin nâng cấp
                    </button>
                )}
            </div>
        </div>
    );

    // --- RENDER: EDIT INFO FORM ---
    const renderEditInfoForm = () => (
        <div className="edit-form-container">
            <div className="form-header">
                <h3>Cập nhật thông tin</h3>
                <button className="btn-close" onClick={() => setMode('view')}><FaTimes /></button>
            </div>

            {infoMessage.text && (
                <div className={`message-alert ${infoMessage.type}`}>
                    {infoMessage.text}
                </div>
            )}

            <form onSubmit={handleUpdateInfo}>
                <div className="form-group">
                    <label>Họ và tên</label>
                    <div className="input-with-icon">
                        <FaUser />
                        <input 
                            type="text" 
                            value={infoForm.full_name}
                            onChange={(e) => setInfoForm({...infoForm, full_name: e.target.value})}
                            required
                            placeholder="Nhập họ tên của bạn"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <div className="input-with-icon">
                        <FaEnvelope />
                        <input 
                            type="email" 
                            value={infoForm.email}
                            onChange={(e) => setInfoForm({...infoForm, email: e.target.value})}
                            required
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => setMode('view')}>Hủy</button>
                    <button type="submit" className="btn-primary" disabled={isInfoLoading}>
                        {isInfoLoading ? 'Đang lưu...' : <><FaSave /> Lưu thay đổi</>}
                    </button>
                </div>
            </form>
        </div>
    );

    // --- RENDER: CHANGE PASSWORD FORM ---
    const renderChangePassForm = () => (
        <div className="edit-form-container">
            <div className="form-header">
                <h3>Đổi mật khẩu</h3>
                <button className="btn-close" onClick={() => setMode('view')}><FaTimes /></button>
            </div>

            {passMessage.text && (
                <div className={`message-alert ${passMessage.type}`}>
                    {passMessage.text}
                </div>
            )}

            <form onSubmit={handleChangePassword}>
                <div className="form-group">
                    <label>Mật khẩu hiện tại</label>
                    <div className="input-with-icon">
                        <FaLock />
                        <input 
                            type="password" 
                            value={passForm.old_password}
                            onChange={(e) => setPassForm({...passForm, old_password: e.target.value})}
                            required
                            placeholder="••••••"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Mật khẩu mới</label>
                    <div className="input-with-icon">
                        <FaLock />
                        <input 
                            type="password" 
                            value={passForm.new_password}
                            onChange={(e) => setPassForm({...passForm, new_password: e.target.value})}
                            required
                            minLength={6}
                            placeholder="Ít nhất 6 ký tự"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Nhập lại mật khẩu mới</label>
                    <div className="input-with-icon">
                        <FaLock />
                        <input 
                            type="password" 
                            value={passForm.confirm_password}
                            onChange={(e) => setPassForm({...passForm, confirm_password: e.target.value})}
                            required
                            placeholder="••••••"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => setMode('view')}>Hủy</button>
                    <button type="submit" className="btn-primary" disabled={isPassLoading}>
                        {isPassLoading ? 'Đang xử lý...' : <><FaSave /> Đổi mật khẩu</>}
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="profile-settings">
            {mode === 'view' && renderInfoCard()}
            {mode === 'edit_info' && renderEditInfoForm()}
            {mode === 'change_pass' && renderChangePassForm()}
        </div>
    );
};

export default ProfileSettings;

