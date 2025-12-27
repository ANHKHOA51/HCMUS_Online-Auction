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
// import AdminLayout from "../components/AdminLayout";
import Page404 from "../pages/404";
// import ListProduct from "../components/ListProduct";
// import ListCategory from "../components/ListCategory";
// import ListUser from "../components/ListUser";

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

    // {
    //     path: "/admin",
    //     Component: AdminLayout,
    //     children: [
    //         { index: true, Component: HomePage },
    //         { path: "product", Component: ListProduct },
    //         { path: "category", Component: ListCategory },
    //         { path: "user", Component: ListUser }
    //     ]
    // },

    {
        path: "*",
        Component: Page404
    },

]);

export default router;
