import './App.css'
<<<<<<< HEAD
import Header from './components/Header'
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import OtpPage from './pages/OtpPage';
import RegisterPage from './pages/RegisterPage';
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";

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
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductDetail from './pages/ProductDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        {/* Thêm các route khác ở đây */}
      </Routes>
    </Router>
  )
}

export default App
>>>>>>> tienluat
