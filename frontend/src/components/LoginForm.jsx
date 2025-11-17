import "./style.css"

export default function LoginForm() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <form
                className="bg-white p-4 shadow-lg"
                style={{ width: '100%', maxWidth: '420px', borderRadius: '8px' }}
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
                    <input className="form-control" id="InputUser" />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputPassword" className="form-label">Password</label>
                    <input type="password" className="form-control" id="InputPassword" />
                </div>
                <button type="submit" className="btn btn-primary w-100">Sign in</button>
                <a href="/register" className="d-block mt-2 text-center">Don't have an account?</a>
            </form>
        </div>
    )
}