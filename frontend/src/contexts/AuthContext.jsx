import { createContext, useContext, useEffect, useState } from "react";
import { loginReq, refreshReq, logoutReq } from "../services/authentication";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [cur_user, setCur_user] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );

    const [accessToken, setAccessToken] = useState(
        localStorage.getItem('accessToken') || null
    );

    const login = async (formData) => {
        const rs = await loginReq(formData)
        if (rs.ok) {
            setCur_user(rs.data.user)
            localStorage.setItem('user', JSON.stringify(rs.data.user))
            setAccessToken(rs.data.accessToken)
            localStorage.setItem('accessToken', rs.data.accessToken)
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
            localStorage.removeItem('user')
            setAccessToken(null)
            localStorage.removeItem('accessToken')
        }
    }

    const refreshToken = async () => {
        const res = await refreshReq();

        if (!res.ok) return;

        const data = await res.json();
        setAccessToken(data.accessToken);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            refreshToken();
        }, 14 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ cur_user, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}