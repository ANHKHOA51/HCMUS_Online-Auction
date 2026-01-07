import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import axiosInstance from '../../../services/axiosInstance';
import { FaUser, FaEnvelope, FaIdCard, FaPen, FaLock, FaTimes, FaSave, FaStar, FaArrowUp } from 'react-icons/fa';
// Removed import './ProfileSettings.css';

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

    // --- SHARED STYLES ---
    const btnActionBase = "flex-1 p-[12px] border-[2px] border-solid border-[var(--color-dark)] rounded-[var(--radius-md)] font-[700] cursor-pointer flex items-center justify-center gap-[8px] transition-all duration-[0.1s] shadow-[2px_2px_0_var(--color-dark)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";
    
    const inputWithIconWrapper = "relative";
    const inputIcon = "absolute left-[12px] top-[50%] -translate-y-[50%] text-[var(--color-gray-600)]";
    const inputField = "w-full p-[12px_12px_12px_40px] border-[2px] border-solid border-[var(--color-gray-600)] rounded-[var(--radius-md)] text-[1rem] transition-colors duration-[0.2s] bg-[var(--color-white)] text-[var(--color-gray-600)] focus:border-[var(--color-dark)] focus:outline-none";

    const btnFormBase = "p-[10px_24px] rounded-[var(--radius-md)] font-[700] cursor-pointer border-[2px] border-solid border-[var(--color-dark)] shadow-[2px_2px_0_var(--color-dark)] transition-all duration-[0.1s] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

    // --- RENDER: VIEW MODE (INFO CARD) ---
    const renderInfoCard = () => (
        <div className="bg-transparent border-none rounded-none p-0 shadow-none flex flex-col gap-[var(--spacing-lg)]">
            <div className="flex items-center gap-[var(--spacing-lg)] pb-[var(--spacing-lg)] border-b-[2px] border-dashed border-[var(--color-gray-600)]">
                <div className="w-[100px] h-[100px] bg-[var(--color-primary)] text-[var(--color-white)] text-[40px] font-[900] rounded-[50%] flex items-center justify-center border-[2px] border-solid border-[var(--color-dark)] relative">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                    <button 
                        className="absolute bottom-0 right-0 w-[32px] h-[32px] bg-[var(--color-secondary)] border-[2px] border-solid border-[var(--color-dark)] rounded-[50%] flex items-center justify-center cursor-pointer text-[var(--color-dark)] text-[14px] transition-transform duration-[0.1s] hover:scale-[1.1]" 
                        title="Đổi avatar (Chưa hỗ trợ)"
                    >
                        <FaPen />
                    </button>
                </div>
                <div className="flex-1">
                    <h3 className="m-[0_0_var(--spacing-xs)] text-[1.5rem] text-[var(--color-dark)]">{user?.full_name || 'Chưa cập nhật tên'}</h3>
                    <span className="inline-block bg-[var(--color-accent)] text-[var(--color-dark)] p-[4px_12px] rounded-[20px] text-[var(--font-size-sm)] font-[700] border-[2px] border-solid border-[var(--color-dark)] uppercase">
                        {(user?.role === 'seller' || user?.role == 2) ? 'Người bán' 
                        : (user?.role === 'admin' || user?.role == 1) ? 'Quản trị viên' 
                        : 'Người mua'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[var(--spacing-md)]">
                <div className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-md)] bg-[var(--color-white)] rounded-[var(--radius-md)] border-[1px] border-solid border-[var(--color-dark)]">
                    <div className="w-[40px] h-[40px] bg-[var(--color-white)] border-[2px] border-solid border-[var(--color-dark)] rounded-[50%] flex items-center justify-center text-[var(--color-dark)]"><FaEnvelope /></div>
                    <div className="flex-1">
                        <label className="block text-[var(--font-size-sm)] text-[var(--color-gray-600)] font-[700] uppercase">Email</label>
                        <p className="m-0 font-[600] text-[var(--color-dark)]">{user?.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-md)] bg-[var(--color-white)] rounded-[var(--radius-md)] border-[1px] border-solid border-[var(--color-dark)]">
                    <div className="w-[40px] h-[40px] bg-[var(--color-white)] border-[2px] border-solid border-[var(--color-dark)] rounded-[50%] flex items-center justify-center text-[var(--color-dark)]"><FaIdCard /></div>
                    <div className="flex-1">
                        <label className="block text-[var(--font-size-sm)] text-[var(--color-gray-600)] font-[700] uppercase">User ID</label>
                        <p className="m-0 font-[600] text-[var(--color-dark)]">#{user?.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-md)] bg-[var(--color-white)] rounded-[var(--radius-md)] border-[1px] border-solid border-[var(--color-dark)]">
                    <div className="w-[40px] h-[40px] bg-[var(--color-white)] border-[2px] border-solid border-[var(--color-dark)] rounded-[50%] flex items-center justify-center text-[var(--color-dark)]"><FaStar /></div>
                    <div className="flex-1">
                        <label className="block text-[var(--font-size-sm)] text-[var(--color-gray-600)] font-[700] uppercase">Điểm đánh giá</label>
                        <p className="m-0 font-[600] text-[var(--color-dark)]">
                            <span style={{ color: '#27ae60', fontWeight: 'bold' }}>+{user?.rating_positive || 0}</span> / 
                            <span style={{ color: '#e74c3c', fontWeight: 'bold' }}> -{user?.rating_negative || 0}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-[var(--spacing-md)] mt-[var(--spacing-md)]">
                <button className={`${btnActionBase} bg-[var(--color-secondary)] text-[var(--color-dark)]`} onClick={() => setMode('edit_info')}>
                    <FaPen /> Cập nhật thông tin
                </button>
                <button className={`${btnActionBase} bg-[var(--color-white)] text-[var(--color-dark)]`} onClick={() => setMode('change_pass')}>
                    <FaLock /> Đổi mật khẩu
                </button>
                {/* Check if user is bidder (role 0 or 'bidder') */}
                {(user?.role === 'bidder' || user?.role == 0) && (
                    <button className={`${btnActionBase}`} onClick={handleUpgradeRequest} style={{ backgroundColor: '#8e44ad', color: 'white' }}>
                        <FaArrowUp /> Xin nâng cấp
                    </button>
                )}
            </div>
        </div>
    );

    // --- RENDER: EDIT INFO FORM ---
    const renderEditInfoForm = () => (
        <div className="bg-transparent border-none rounded-none p-0 shadow-none animate-[slideUp_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-[var(--spacing-lg)] pb-[var(--spacing-md)] border-b-[2px] border-solid border-[var(--color-gray)]">
                <h3 className="m-0 text-[var(--color-dark)]">Cập nhật thông tin</h3>
                <button className="bg-none border-none text-[1.2rem] cursor-pointer text-[var(--color-gray-600)] transition-colors duration-[0.2s] hover:text-[var(--color-danger)]" onClick={() => setMode('view')}><FaTimes /></button>
            </div>

            {infoMessage.text && (
                <div className={`p-[12px] rounded-[var(--radius-md)] mb-[var(--spacing-md)] font-[600] border-[2px] border-solid border-current ${
                    infoMessage.type === 'success' ? 'text-[var(--color-success)] bg-[rgba(149,225,211,0.1)]' : 
                    infoMessage.type === 'error' ? 'text-[var(--color-danger)] bg-[rgba(255,107,107,0.1)]' : ''
                }`}>
                    {infoMessage.text}
                </div>
            )}

            <form onSubmit={handleUpdateInfo}>
                <div className="mb-[var(--spacing-md)]">
                    <label className="block mb-[8px] font-[700] text-[var(--color-dark)]">Họ và tên</label>
                    <div className={inputWithIconWrapper}>
                        <FaUser className={inputIcon} />
                        <input 
                            className={inputField}
                            type="text" 
                            value={infoForm.full_name}
                            onChange={(e) => setInfoForm({...infoForm, full_name: e.target.value})}
                            required
                            placeholder="Nhập họ tên của bạn"
                        />
                    </div>
                </div>

                <div className="mb-[var(--spacing-md)]">
                    <label className="block mb-[8px] font-[700] text-[var(--color-dark)]">Email</label>
                    <div className={inputWithIconWrapper}>
                        <FaEnvelope className={inputIcon} />
                        <input 
                            className={inputField}
                            type="email" 
                            value={infoForm.email}
                            onChange={(e) => setInfoForm({...infoForm, email: e.target.value})}
                            required
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-[var(--spacing-md)] mt-[var(--spacing-lg)]">
                    <button type="button" className={`${btnFormBase} bg-[var(--color-white)] text-[var(--color-dark)]`} onClick={() => setMode('view')}>Hủy</button>
                    <button type="submit" className={`${btnFormBase} bg-[var(--color-primary)] text-[var(--color-white)]`} disabled={isInfoLoading}>
                        {isInfoLoading ? 'Đang lưu...' : <><FaSave /> Lưu thay đổi</>}
                    </button>
                </div>
            </form>
        </div>
    );

    // --- RENDER: CHANGE PASSWORD FORM ---
    const renderChangePassForm = () => (
        <div className="bg-transparent border-none rounded-none p-0 shadow-none animate-[slideUp_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-[var(--spacing-lg)] pb-[var(--spacing-md)] border-b-[2px] border-solid border-[var(--color-gray)]">
                <h3 className="m-0 text-[var(--color-dark)]">Đổi mật khẩu</h3>
                <button className="bg-none border-none text-[1.2rem] cursor-pointer text-[var(--color-gray-600)] transition-colors duration-[0.2s] hover:text-[var(--color-danger)]" onClick={() => setMode('view')}><FaTimes /></button>
            </div>

            {passMessage.text && (
                <div className={`p-[12px] rounded-[var(--radius-md)] mb-[var(--spacing-md)] font-[600] border-[2px] border-solid border-current ${
                    passMessage.type === 'success' ? 'text-[var(--color-success)] bg-[rgba(149,225,211,0.1)]' : 
                    passMessage.type === 'error' ? 'text-[var(--color-danger)] bg-[rgba(255,107,107,0.1)]' : ''
                }`}>
                    {passMessage.text}
                </div>
            )}

            <form onSubmit={handleChangePassword}>
                <div className="mb-[var(--spacing-md)]">
                    <label className="block mb-[8px] font-[700] text-[var(--color-dark)]">Mật khẩu hiện tại</label>
                    <div className={inputWithIconWrapper}>
                        <FaLock className={inputIcon} />
                        <input 
                            className={inputField}
                            type="password" 
                            value={passForm.old_password}
                            onChange={(e) => setPassForm({...passForm, old_password: e.target.value})}
                            required
                            placeholder="••••••"
                        />
                    </div>
                </div>

                <div className="mb-[var(--spacing-md)]">
                    <label className="block mb-[8px] font-[700] text-[var(--color-dark)]">Mật khẩu mới</label>
                    <div className={inputWithIconWrapper}>
                        <FaLock className={inputIcon} />
                        <input 
                            className={inputField}
                            type="password" 
                            value={passForm.new_password}
                            onChange={(e) => setPassForm({...passForm, new_password: e.target.value})}
                            required
                            minLength={6}
                            placeholder="Ít nhất 6 ký tự"
                        />
                    </div>
                </div>

                <div className="mb-[var(--spacing-md)]">
                    <label className="block mb-[8px] font-[700] text-[var(--color-dark)]">Nhập lại mật khẩu mới</label>
                    <div className={inputWithIconWrapper}>
                        <FaLock className={inputIcon} />
                        <input 
                            className={inputField}
                            type="password" 
                            value={passForm.confirm_password}
                            onChange={(e) => setPassForm({...passForm, confirm_password: e.target.value})}
                            required
                            placeholder="••••••"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-[var(--spacing-md)] mt-[var(--spacing-lg)]">
                    <button type="button" className={`${btnFormBase} bg-[var(--color-white)] text-[var(--color-dark)]`} onClick={() => setMode('view')}>Hủy</button>
                    <button type="submit" className={`${btnFormBase} bg-[var(--color-primary)] text-[var(--color-white)]`} disabled={isPassLoading}>
                        {isPassLoading ? 'Đang xử lý...' : <><FaSave /> Đổi mật khẩu</>}
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="animate-[fadeIn_0.3s_ease-in-out]">
            {mode === 'view' && renderInfoCard()}
            {mode === 'edit_info' && renderEditInfoForm()}
            {mode === 'change_pass' && renderChangePassForm()}

            {/* Injected styles for keyframes referenced in arbitrary values */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ProfileSettings;
