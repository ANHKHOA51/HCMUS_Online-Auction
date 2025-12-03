import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import SearchResultsPage from "../components/SearchResults";
import ProductDetailPage from "../pages/ProductDetailPage";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OtpPage from "../pages/OtpPage";

const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            { index: true, Component: HomePage },
            { path: "search", Component: SearchResultsPage },
            { path: "products/:id", Component: ProductDetailPage }
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
    }
]);

export default router;
