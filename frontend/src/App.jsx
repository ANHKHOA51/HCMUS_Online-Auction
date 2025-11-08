import './App.css'
import Header from './components/Header'
import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";

function AppRouter() {
    const showHeader = useLocation().pathname !== '/' && useLocation().pathname !== '/register';
    return (
        <>
            {showHeader && <Header />}
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    )
}