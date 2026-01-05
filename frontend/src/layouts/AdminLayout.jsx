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
        <div className="d-flex min-vh-100 bg-light">
            {/* Sidebar */}
            <aside className="bg-white border-end d-none d-md-flex flex-column flex-shrink-0 sticky-top vh-100" style={{ width: '280px' }}>
                <div className="d-flex align-items-center px-4 border-bottom" style={{ height: '64px' }}>
                    <span className="h5 fw-bold text-dark mb-0">Admin Panel</span>
                </div>
                <nav className="p-3 flex-grow-1 overflow-auto">
                    <ul className="nav nav-pills flex-column mb-auto">
                        {navItems.map((item) => (
                            <li className="nav-item mb-1" key={item.path}>
                                <NavLink
                                    to={item.path}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? "active" : "link-dark"}`
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
                    <div className="p-3 border-top mt-auto">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center fw-bold text-primary" style={{ width: '40px', height: '40px' }}>
                                {cur_user.username ? cur_user.username.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="fw-semibold text-dark mb-0 text-truncate">
                                    {cur_user.username || 'Admin'}
                                </p>
                                <p className="small text-muted mb-0 text-truncate">
                                    {cur_user.email || ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn btn-outline-danger w-100 btn-sm"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-grow-1 p-4 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
