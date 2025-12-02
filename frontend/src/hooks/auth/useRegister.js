import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import {registerReq} from "../../services/authentication"

export default function useRegister() {
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
    const [isLoading, setLoading] = useState(false)

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

        setLoading(true);
        try {
            const response = await registerReq(formData)

            if (captchaRef.current) {
                captchaRef.current.reset();
                setCaptchaStatus(false);
            }

            setFormData((prev) => ({
                ...prev,
                captcha_key: ''
            }))

            if (response.ok) {
                sessionStorage.setItem('VerifyingEmail', formData.email)
                navigate('/register/otp')
            } else {
                setErrors(response.body);
            }
        } catch (err) {
            console.error(err)
            setErrors({ general: 'Network error' });
        } finally {
            setLoading(false)
        }
    }

    return {
        captchaRef,
        errors,
        isLoading,
        setFormData,
        setCaptchaStatus,
        onChange,
        onCheck,
        handleSubmit
    }
}