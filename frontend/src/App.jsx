import './App.css'
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import OtpPage from './pages/OtpPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchResultsPage from './components/SearchResults';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
    return (
        <AuthProvider>
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
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}
