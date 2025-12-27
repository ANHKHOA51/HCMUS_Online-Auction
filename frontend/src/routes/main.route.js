import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import SearchResultsPage from "../components/SearchResults";
import ProductDetailPage from "../pages/ProductDetailPage";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OtpPage from "../pages/OtpPage";
import AddProductPage from "../pages/AddProductPage";
import AdminLayout from "../layouts/AdminLayout";
import Page404 from "../pages/404";
import ListProduct from "../components/ListProduct";
import ListCategory from "../components/ListCategory";
import AddCategory from "../components/AddCategory";
import EditCategory from "../components/EditCategory";
import ListUser from "../components/ListUser";

const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            { index: true, Component: HomePage },
            { path: "search", Component: SearchResultsPage },
            { path: "products/:id", Component: ProductDetailPage },
            { path: "products/add-product", Component: AddProductPage }
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
            { path: "products", Component: ListProduct },
            {
                path: "categories",
                children: [
                    {
                        index: true,
                        Component: ListCategory,
                    },
                    { path: "add", Component: AddCategory },
                    {
                        path: "edit/:catid",
                        Component: EditCategory,
                    }
                ]
            },
            { path: "users", Component: ListUser }
        ]
    },

    {
        path: "*",
        Component: Page404
    },

]);

export default router;
