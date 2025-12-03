import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

export default function useOTP() {
    const LEN = 6;

    const [values, setValues] = useState(Array(LEN).fill(""));
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const navigate = useNavigate();

    const inputsRef = useRef([]);
    inputsRef.current = Array(LEN)
        .fill(0)
        .map((_, i) => inputsRef.current[i] || React.createRef());

    useEffect(() => {
        inputsRef.current[0].current.focus();
    }, []);

    useEffect(() => {
        const otp = values.join("");
        if (otp.length === LEN && !isSubmitting) {
            const email = sessionStorage.getItem('VerifyingEmail')
            submitOtp(email, otp);
        }
    }, [values]);

    const updateValue = (idx, v) => {
        setValues((prev) => {
            const next = [...prev];
            next[idx] = v;
            return next;
        });
    };

    const handleChange = (e, idx) => {
        const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
        updateValue(idx, v);

        if (v && idx < LEN - 1) {
            inputsRef.current[idx + 1]?.current?.focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace") {
            if (values[idx]) {
                updateValue(idx, "");
                return e.preventDefault();
            }
            if (idx > 0) {
                updateValue(idx - 1, "");
                inputsRef.current[idx - 1].current.focus();
                return e.preventDefault();
            }
        }

        if (e.key === "ArrowLeft" && idx > 0) {
            inputsRef.current[idx - 1].current.focus();
        }

        if (e.key === "ArrowRight" && idx < LEN - 1) {
            inputsRef.current[idx + 1].current.focus();
        }

        if (e.key === "Enter") {
            const otp = values.join("");
            if (otp.length === LEN) {
                const email = sessionStorage.getItem('VerifyingEmail')
                submitOtp(email, otp);
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const digits = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, LEN).split("");

        setValues((prev) => {
            const next = [...prev];
            for (let i = 0; i < LEN; i++) next[i] = digits[i] || "";
            return next;
        });

        const last = Math.min(digits.length - 1, LEN - 1);
        inputsRef.current[last]?.current?.focus();
    };

    async function submitOtp(email, otp) {
        setIsSubmitting(true);
        setMessage(null);
        setError(null);

        try {
            const res = await fetch("http://localhost:3000/auths/register/otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Verify failed");

            setMessage("Xác thực thành công!");
            navigate('/login')
        } catch (err) {
            setError(err.message);
            setValues(Array(LEN).fill(""));
            inputsRef.current[0]?.current?.focus();
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleResend() {
        setIsResending(true);
        setMessage(null);
        setError(null);

        try {
            const email = sessionStorage.getItem('VerifyingEmail')
            const res = await fetch("http://localhost:3000/auths/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Resend failed");

            setMessage("OTP đã được gửi lại!");
            setValues(Array(LEN).fill(""));
            inputsRef.current[0].current.focus();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsResending(false);
        }
    }

    return {
        values,
        inputsRef,
        isSubmitting,
        isResending,
        message,
        error,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleResend,
        submitOtp
    }
}
