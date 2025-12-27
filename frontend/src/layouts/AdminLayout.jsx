import { Outlet, NavLink } from "react-router";
import { ShoppingBag, List, Users, ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
    const navItems = [
        { path: "/admin/products", icon: ShoppingBag, label: "Products" },
        { path: "/admin/categories", icon: List, label: "Categories" },
        { path: "/admin/users", icon: Users, label: "Users" },
        { path: "/", icon: ArrowLeft, label: "Back" },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-[#E2E8F0] fixed h-full z-10 hidden md:block">
                <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0]">
                    <span className="text-xl font-bold text-[#1E293B]">Admin Panel</span>
                </div>
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
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
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
}
