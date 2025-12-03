import ReCAPTCHA from "react-google-recaptcha"
import "./style.css"
import useRegister from "../hooks/auth/useRegister.js"


export default function RegisterForm() {
    const { captchaRef, errors, isLoading,
        setFormData, setCaptchaStatus, onChange, onCheck, handleSubmit
    } = useRegister()

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <form
                className="bg-white p-4 shadow-lg"
                style={{ width: '100%', maxWidth: '420px', borderRadius: '8px' }}
                noValidate
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

                <div className="row g-3 mb-2">
                    <div className="col">
                        <label htmlFor="InputUser" className="form-label">First name</label>
                        <input type="text" className={`form-control ${errors.firstname ? 'is-invalid' : ''}`} id="firstname" aria-label="First name"
                            onChange={onChange} />
                        {errors.firstname && (<div className="invalid-feedback">
                            {errors.firstname}
                        </div>)}
                    </div>

                    <div className="col">
                        <label htmlFor="InputUser" className="form-label">Last name</label>
                        <input type="text" className={`form-control ${errors.lastname ? 'is-invalid' : ''}`} id="lastname" aria-label="Last name" onChange={onChange} />
                        {errors.lastname && (<div className="invalid-feedback">
                            {errors.lastname}
                        </div>)}
                    </div>
                </div>

                <div className="mb-2">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" onChange={onChange} />
                </div>

                <div className="mb-2">
                    <label htmlFor="InputUser" className="form-label">User name</label>
                    <input type="text" className={`form-control ${errors.username ? 'is-invalid' : ''}`} id="username" onChange={onChange} />
                    {errors.username && (<div className="invalid-feedback">
                        {errors.username}
                    </div>)}
                </div>

                <div className="mb-2">
                    <label htmlFor="InputUser" className="form-label">Email address</label>
                    <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="email" onChange={onChange} />
                    {errors.email && (<div className="invalid-feedback">
                        {errors.email}
                    </div>)}
                </div>

                <div className="mb-2">
                    <label htmlFor="InputUser" className="form-label">Password</label>
                    <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="password" onChange={onChange} />
                    {errors.password && (<div className="invalid-feedback">
                        {errors.password}
                    </div>)}
                </div>

                <div className="mb-2">
                    <label htmlFor="InputUser" className="form-label">Confirm password</label>
                    <input type="password" className={`form-control ${errors.confirmPw ? 'is-invalid' : ''}`} id="confirmPw" onChange={onChange} />
                    {errors.confirmPw && (<div className="invalid-feedback">
                        {errors.confirmPw}
                    </div>)}
                </div>

                <div className="mb-2">
                    <ReCAPTCHA className="d-flex justify-content-center"
                        ref={captchaRef}
                        sitekey="6LdlVQYsAAAAAA1cMnLOGjj_2kyNEUmChCWFFKvV"
                        onChange={onCheck}
                        onExpired={() => setFormData((prev) => ({
                            ...prev,
                            captcha_key: ''
                        }), setCaptchaStatus(false))}
                    />
                    {errors.captcha && (<div className="invalid-feedback d-block">
                        {errors.captcha}
                    </div>)}
                </div>

                <button type="submit" className="default-button mt-2 w-100"
                    disabled={isLoading}
                    aria-busy={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                </button>

                <a href="/login" className="d-block mt-2 text-center">Already have an account?</a>
            </form>
        </div>
    )
}