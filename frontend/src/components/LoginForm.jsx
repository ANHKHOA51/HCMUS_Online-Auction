import { NavLink } from "react-router-dom"
import useLogin from "../hooks/auth/useLogin.js"
import "./style.css"

const Separator = () => {
    return (
        <div className="d-flex align-items-center my-3">
            <div className="flex-grow-1 border-bottom"></div>
            <span className="mx-2 text-muted text-uppercase small">or</span>
            <div className="flex-grow-1 border-bottom"></div>
        </div>
    )
}


export default function LoginForm() {
    const { error, isLoading, handleSubmit, onChange } = useLogin()
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <form
                className="bg-white p-4 shadow-lg"
                style={{ width: '100%', maxWidth: '420px', borderRadius: '8px' }}
                onSubmit={handleSubmit}
            >
                <div className="mb-3 mx-auto d-flex">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        width={80}
                        height={80}
                    />
                    <h2 className="ms-2 pt-4">ONLINE AUCTION</h2>
                </div>
                <div className="mb-3">
                    <label htmlFor="InputUser" className="form-label">Username or Email</label>
                    <input className="form-control" id="identifier" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputPassword" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" onChange={onChange} />
                </div>
                {error && (
                    <div className="alert alert-danger mt-2" role="alert">
                        {error}
                    </div>
                )}
                <button type="submit" className="default-button w-100"
                    disabled={isLoading}
                    aria-busy={isLoading}>
                    {isLoading ? "Signing..." : "Sign in"}
                </button>
                <Separator />
                <NavLink to="/register" className="d-block mt-2 text-center">Don't have an account?</NavLink>
                <NavLink to="/forgot-password" className="d-block mt-2 text-center">Forgot Password?</NavLink>
            </form>
        </div>
    )
}