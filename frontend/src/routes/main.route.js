import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import SearchResultsPage from "../components/SearchResults";
import ProductDetailPage from "../pages/ProductDetailPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OtpPage from "../pages/OtpPage";
import AddProductPage from "../pages/AddProductPage";
import AdminLayout from "../layouts/AdminLayout";
import Page404 from "../pages/404";
import ListProduct from "../features/AdminManagement/components/ListProduct";
import ListCategory from "../features/AdminManagement/components/ListCategory";
import AddCategory from "../features/AdminManagement/components/AddCategory";
import EditCategory from "../features/AdminManagement/components/EditCategory";
import ListUser from "../features/AdminManagement/components/ListUser";
import ProductDetail from "../features/AdminManagement/components/ProductDetail";
import SellerOrderList from "../features/Payment/components/SellerOrderList";
import UserDetail from "../features/AdminManagement/components/UserDetail";

// ... existing imports

const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            { index: true, Component: HomePage },
            { path: "search", Component: SearchResultsPage },
            { path: "products/:id", Component: ProductDetailPage },
            { path: "products/add-product", Component: AddProductPage },
            { path: "seller/orders", Component: SellerOrderList },
            { path: "profile", Component: ProfilePage }
        ]
    },

    {
        Component: AuthLayout,
        children: [
            { path: "/login", Component: LoginPage },
            {
                path: "/register", Component: RegisterPage,
                children: [
                    { index: true, Component: RegisterPage },
                    { path: "otp", Component: OtpPage }
                ]
            }
        ]
    },

    {
        path: "/admin",
        Component: AdminLayout,
        children: [
            {
                path: "products",
                children: [
                    { index: true, Component: ListProduct },
                    { path: "edit/:id", Component: ProductDetail }
                ]
            },
            {
                path: "categories",
                children: [
                    {
                        index: true,
                        Component: ListCategory,
                    },
                    { path: "add", Component: AddCategory },
                    {
                        path: "edit/:id",
                        Component: EditCategory,
                    }
                ]
            },
            {
                path: "users",
                children: [
                    { index: true, Component: ListUser },
                    { path: "edit/:id", Component: UserDetail }
                ]
            }
        ]
    },

    {
        path: "*",
        Component: Page404
    },

]);

export default router;
