import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginReq } from "../../services/authentication";

export default function useLogin() {
    const init = {
        identifier: "",
        password: ""
    }

    const [formData, setFormData] = useState(init)
    const [error, setError] = useState("")
    const [isLoading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onChange = (e) => {
        setError('')
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setError('')

        if (formData.identifier === '' || formData.password === '') {
            setError('Please fill all the fields')
            return
        }

        setLoading(true);
        try {
            const response = await loginReq(formData)

            if (response.ok) {
                setFormData(init)            
                navigate('/')
            } else {
                setError('Invalid username/email or password');
            }
        } catch (err) {
            console.error(err)
            setError('Network error');
        } finally {
            setLoading(false)
        }
    }

    return {
        error,
        isLoading,
        onChange,
        handleSubmit,
    }
}