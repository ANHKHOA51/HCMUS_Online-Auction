import { NavLink } from "react-router-dom"
import useLogin from "../hooks/auth/useLogin.js"
import "./style.css"

const Separator = () => {
    return (
        <div className="flex items-center my-4">
            <div className="flex-grow border-b border-gray-300"></div>
            <span className="mx-2 text-gray-500 uppercase text-xs font-bold">or</span>
            <div className="flex-grow border-b border-gray-300"></div>
        </div>
    )
}


export default function LoginForm() {
    const { error, isLoading, handleSubmit, onChange } = useLogin()
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <form
                className="bg-white p-8 shadow-xl rounded-xl w-full max-w-md border border-gray-100"
                onSubmit={handleSubmit}
            >
                <div className="mb-6 flex flex-col items-center">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        width={80}
                        height={80}
                        className="mb-2"
                    />
                    <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide">ONLINE AUCTION</h2>
                </div>
                <div className="mb-4">
                    <label htmlFor="identifier" className="block text-sm font-bold text-gray-700 mb-1">Username or Email</label>
                    <input 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        id="identifier" 
                        onChange={onChange} 
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                    <input 
                        type="password" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        id="password" 
                        onChange={onChange} 
                    />
                </div>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm font-medium" role="alert">
                        {error}
                    </div>
                )}
                <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    aria-busy={isLoading}>
                    {isLoading ? "Signing..." : "Sign in"}
                </button>
                <Separator />
                <div className="flex flex-col gap-2">
                    <NavLink to="/register" className="block text-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">Don't have an account?</NavLink>
                    <NavLink to="/forgot-password" className="block text-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline">Forgot Password?</NavLink>
                </div>
            </form>
        </div>
    )
}
