import ReCAPTCHA from "react-google-recaptcha"
import "./style.css"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import registerReq from "../services/register"

export default function RegisterForm() {
    const initData = {
        firstname: '',
        lastname: '',
        address: '',
        username: '',
        email: '',
        password: '',
        confirmPw: '',
        captcha_status: false,
        captcha_key: ''
    }

    const navigate = useNavigate();
    const [captchaStatus, setCaptchaStatus] = useState(false)
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState(initData)
    const captchaRef = useRef(null);

    const onChange = (e) => {
        const { id, value } = e.target;
        if (errors[id]) {
            setErrors((prev) => ({
                ...prev,
                [id]: null,
            }));
        }

        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const onCheck = (key) => {
        setFormData((prev) => ({
            ...prev,
            captcha_key: key
        }))
        setCaptchaStatus(true)
        setErrors({})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setErrors({});

        const cur_errors = {};
        if (!captchaStatus) {
            cur_errors.captcha = 'Forget to check captcha'
            setErrors(cur_errors)
            return
        }

        if (formData.firstname === '') {
            cur_errors.firstname = 'Please fill in this field'
        }

        if (formData.lastname === '') {
            cur_errors.lastname = 'Please fill in this field'
        }

        if (formData.username === '') {
            cur_errors.username = 'Please fill in this field'
        }

        if (formData.email === '') {
            cur_errors.email = 'Please fill in this field'
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            cur_errors.email = 'Not a valid email format'
        }

        if (formData.password === '') {
            cur_errors.password = 'Please fill in this field'
        }
        else if (formData.password.length < 8) {
            cur_errors.password = 'Password must have at least 8 characters'
        }
        else if (formData.confirmPw !== formData.password) {
            cur_errors.confirmPw = 'Confirm password does not match the password'
        }

        if (Object.keys(cur_errors).length > 0) {
            setErrors(cur_errors);
            return;
        }

        const response = await registerReq(formData)
        
        console.log(response)

        if (captchaRef.current) {
            captchaRef.current.reset();
            setCaptchaStatus(false);
        }

        setFormData((prev) => ({
            ...prev,
            captcha_key: ''
        }))

        if (response.ok) {
            setFormData(initData)
            sessionStorage.setItem('Verifying email', formData.email)
            navigate('/register/otp')
        } else {
            setErrors(response.body);
        }
    }

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

                <button type="submit" className="mt-2 btn btn-primary w-100">Register</button>

                <a href="/login" className="d-block mt-2 text-center">Already have an account?</a>
            </form>
        </div>
    )
}