import { useState } from "react";
import { Link } from "react-router";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        setError(null);

        try {
            const res = await fetch("http://localhost:3000/auths/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to send reset link");

            setMessage(data.message);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 shadow-xl rounded-xl w-full max-w-md border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quên Mật Khẩu</h2>

                {message ? (
                    <div className="text-center">
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">
                            {message}
                        </div>
                        <p className="text-gray-600 mb-4">
                            Vui lòng kiểm tra email của bạn để lấy liên kết đặt lại mật khẩu.
                        </p>
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Quay lại đăng nhập
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email đăng ký
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Đang gửi..." : "Gửi liên kết xác thực"}
                        </button>

                        <div className="text-center mt-4">
                            <Link to="/login" className="text-sm text-blue-600 hover:underline">
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
