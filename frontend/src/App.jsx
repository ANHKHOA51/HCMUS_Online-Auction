import './App.css'
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import OtpPage from './pages/OtpPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetail from './pages/ProductDetail';
import SearchResultsPage from './pages/SearchResultsPage';
import { Route, Routes, BrowserRouter } from "react-router-dom";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/register/otp" element={<OtpPage />} />
                </Route>

                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
