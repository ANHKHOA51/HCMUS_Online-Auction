import { createContext, useContext, useEffect, useState } from "react";
import { loginReq, refreshReq, logoutReq } from "../services/authentication";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [cur_user, setCur_user] = useState(
        JSON.parse(sessionStorage.getItem('user')) || null
    );

    const [accessToken, setAccessToken] = useState(
        sessionStorage.getItem('accessToken') || null
    );

    const login = async (formData) => {
        const rs = await loginReq(formData)
        if (rs.ok) {
            setCur_user(rs.data.user)
            sessionStorage.setItem('user', JSON.stringify(rs.data.user))
            setAccessToken(rs.data.accessToken)
            sessionStorage.setItem('accessToken', rs.data.accessToken)
            console.log(cur_user)
            return {
                ok: true
            }
        } else {
            return {
                ok: false,
                message: rs.message
            }
        }
    };

    const logout = async () => {
        const rs = await logoutReq()
        if (rs.ok) {
            setCur_user(null)
            sessionStorage.removeItem('user')
            setAccessToken(null)
            sessionStorage.removeItem('accessToken')
        }
    }

    const updateUser = (userData) => {
        setCur_user(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
    };

    const refreshToken = async () => {
        if (!cur_user) return;
        
    try {
        const res = await refreshReq();
        if (res.ok) {
            setAccessToken(res.data.accessToken);
            sessionStorage.setItem('accessToken', res.data.accessToken);  // Lưu vào sessionStorage
        } else {
            console.warn('Auto-refresh failed');
        }
    } catch (error) {
        console.error('Auto-refresh error:', error);
    }
};

    useEffect(() => {
        const interval = setInterval(() => {
            refreshToken();
        }, 14 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ cur_user, accessToken, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}
