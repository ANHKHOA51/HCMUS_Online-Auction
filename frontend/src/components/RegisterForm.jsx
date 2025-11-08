import ReCAPTCHA from "react-google-recaptcha"
import "./style.css"
import { useState } from "react"

export default function RegisterForm() {
    const [key, setKey] = useState('')
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        address: '',
        username: '',
        email: '',
        password: '',
        confirmPw: '',
        captcha: false
    })

    const onChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));

        if (errors[id]) {
            setErrors((prev) => ({
                ...prev,
                [id]: null,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setErrors({});

        const cur_errors = {};
        if (!formData.captcha) {
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
        else if (!formData.email.includes('@')) {
            cur_errors.email = 'Not a email format'
        }

        if (formData.password.length < 8) {
            cur_errors.password = 'Password must have at least 8 characters'
        }

        if (formData.password === '') {
            cur_errors.password = 'Please fill in this field'
        }

        if (formData.confirmPw !== formData.password) {
            cur_errors.confirmPw = 'Confirm password not match the password'
        }

        if (Object.keys(cur_errors).length > 0) {
            setErrors(cur_errors);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    captcha: key
                })
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Đăng ký thành công:", result);
            } else {
                const serverErrors = {};
                // server may return fields like username, email, captcha or a message
                if (result.username) serverErrors.username = result.username;
                if (result.email) serverErrors.email = result.email;
                if (result.captcha) {
                    // server sent array or string
                    serverErrors.captcha = Array.isArray(result.captcha) ? result.captcha.join(', ') : result.captcha;
                }
                if (result.message && Object.keys(serverErrors).length === 0) {
                    serverErrors.general = result.message;
                }
                setErrors(serverErrors);
                return;
            }

        } catch (error) {
            console.error("Lỗi kết nối:", error);
        }
    }

    const onCheck = (key) => {
        setFormData((prev) => ({
            ...prev,
            captcha: true
        }))
        setKey(key)
        setErrors({})
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
                        sitekey="6LdlVQYsAAAAAA1cMnLOGjj_2kyNEUmChCWFFKvV"
                        onChange={onCheck}
                        onExpired={() => setFormData((prev) => ({
                            ...prev,
                            captcha: false
                        }))}
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