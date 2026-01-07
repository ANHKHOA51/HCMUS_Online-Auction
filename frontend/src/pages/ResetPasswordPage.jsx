import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Liên kết không hợp lệ hoặc đã hết hạn.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        setIsLoading(true);
        setMessage(null);
        setError(null);

        try {
            const res = await fetch("http://localhost:3000/auths/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to reset password");

            setMessage("Đổi mật khẩu thành công! Đang chuyển hướng...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 shadow-xl rounded-xl w-full max-w-md border border-gray-100 text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Lỗi</h2>
                    <p className="text-gray-600 mb-6">Thiếu token xác thực. Vui lòng kiểm tra lại liên kết trong email.</p>
                    <Link to="/login" className="text-blue-600 hover:underline">Quay lại trang chủ</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 shadow-xl rounded-xl w-full max-w-md border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đặt lại mật khẩu</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Ít nhất 6 ký tự"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Nhập lại mật khẩu mới"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/login" className="text-sm text-blue-600 hover:underline">
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
