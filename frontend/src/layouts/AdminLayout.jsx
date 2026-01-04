import { Outlet, NavLink, useNavigate } from "react-router";
import { ShoppingBag, List, Users, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout() {
    const { cur_user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { path: "/admin/products", icon: ShoppingBag, label: "Products" },
        { path: "/admin/categories", icon: List, label: "Categories" },
        { path: "/admin/users", icon: Users, label: "Users" },
        { path: "/", icon: ArrowLeft, label: "Back" },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    console.log(cur_user);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-[#E2E8F0] fixed h-full z-10 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0]">
                    <span className="text-xl font-bold text-[#1E293B]">Admin Panel</span>
                </div>
                <nav className="p-4 space-y-1 flex-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 !rounded-lg transition-colors duration-200 ${isActive
                                    ? "bg-[#EFF6FF] text-[#3B82F6]"
                                    : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Info & Logout */}
                {cur_user && (
                    <div className="p-4 border-t border-[#E2E8F0]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                {cur_user.username ? cur_user.username.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 mb-1">
                                    {cur_user.username || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-500 mb-1">
                                    {cur_user.email || ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 !rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
}
