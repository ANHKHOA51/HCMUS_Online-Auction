import ReCAPTCHA from "react-google-recaptcha"
import "./style.css"
import useRegister from "../hooks/auth/useRegister.js"
import { NavLink } from "react-router-dom"


export default function RegisterForm() {
    const { captchaRef, errors, isLoading,
        setFormData, setCaptchaStatus, onChange, onCheck, handleSubmit
    } = useRegister()

    // Helper classes
    const inputClass = (error) => `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`;
    const labelClass = "block text-sm font-bold text-gray-700 mb-1";
    const errorClass = "text-red-500 text-xs mt-1 font-medium";

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
            <form
                className="bg-white p-8 shadow-xl rounded-xl w-full max-w-md border border-gray-100"
                noValidate
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

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="firstname" className={labelClass}>First name</label>
                        <input type="text" className={inputClass(errors.firstname)} id="firstname" aria-label="First name"
                            onChange={onChange} />
                        {errors.firstname && (<div className={errorClass}>
                            {errors.firstname}
                        </div>)}
                    </div>

                    <div>
                        <label htmlFor="lastname" className={labelClass}>Last name</label>
                        <input type="text" className={inputClass(errors.lastname)} id="lastname" aria-label="Last name" onChange={onChange} />
                        {errors.lastname && (<div className={errorClass}>
                            {errors.lastname}
                        </div>)}
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="address" className={labelClass}>Address</label>
                    <input type="text" className={inputClass(null)} id="address" onChange={onChange} />
                </div>

                <div className="mb-4">
                    <label htmlFor="username" className={labelClass}>User name</label>
                    <input type="text" className={inputClass(errors.username)} id="username" onChange={onChange} />
                    {errors.username && (<div className={errorClass}>
                        {errors.username}
                    </div>)}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className={labelClass}>Email address</label>
                    <input type="email" className={inputClass(errors.email)} id="email" onChange={onChange} />
                    {errors.email && (<div className={errorClass}>
                        {errors.email}
                    </div>)}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className={labelClass}>Password</label>
                    <input type="password" className={inputClass(errors.password)} id="password" onChange={onChange} />
                    {errors.password && (<div className={errorClass}>
                        {errors.password}
                    </div>)}
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPw" className={labelClass}>Confirm password</label>
                    <input type="password" className={inputClass(errors.confirmPw)} id="confirmPw" onChange={onChange} />
                    {errors.confirmPw && (<div className={errorClass}>
                        {errors.confirmPw}
                    </div>)}
                </div>

                <div className="mb-6 flex flex-col items-center">
                    <ReCAPTCHA className="flex justify-center"
                        ref={captchaRef}
                        sitekey="6LdlVQYsAAAAAA1cMnLOGjj_2kyNEUmChCWFFKvV"
                        onChange={onCheck}
                        onExpired={() => setFormData((prev) => ({
                            ...prev,
                            captcha_key: ''
                        }), setCaptchaStatus(false))}
                    />
                    {errors.captcha && (<div className={`${errorClass} text-center`}>
                        {errors.captcha}
                    </div>)}
                </div>

                <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    aria-busy={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                </button>

                <NavLink to="/login" className="block mt-4 text-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">Already have an account?</NavLink>
            </form>
        </div>
    )
}
