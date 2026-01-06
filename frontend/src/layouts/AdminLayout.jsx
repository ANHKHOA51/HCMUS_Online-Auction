import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout() {
    const { cur_user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { path: "/admin/products", label: "Products" },
        { path: "/admin/categories", label: "Categories" },
        { path: "/admin/users", label: "Users" },
        { path: "/", label: "Back to Home" },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0 sticky top-0 h-screen w-[280px]">
                <div className="flex items-center px-6 h-16 border-b border-gray-200">
                    <span className="text-xl font-black text-gray-800 uppercase tracking-wide">Admin Panel</span>
                </div>
                <nav className="p-4 flex-grow overflow-y-auto">
                    <ul className="flex flex-col space-y-1">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `block px-4 py-3 rounded-lg font-medium transition-all ${
                                            isActive 
                                            ? "bg-blue-600 text-white shadow-md" 
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Info & Logout */}
                {cur_user && (
                    <div className="p-4 border-t border-gray-200 mt-auto bg-gray-50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-lg">
                                {cur_user.username ? cur_user.username.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-gray-800 truncate">
                                    {cur_user.username || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {cur_user.email || ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-bold"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
