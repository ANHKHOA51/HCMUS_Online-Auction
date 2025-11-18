import useOTP from "../hooks/auth/useOTP";
import { maskEmail } from "../utils/auth";

export default function OtpInput() {
    const {
        values, inputsRef, isSubmitting, isResending, message, error,
        handleChange, handleKeyDown, handlePaste, handleResend, submitOtp
    } = useOTP()

    const email = maskEmail(sessionStorage.getItem('VerifyingEmail'))

    return (
        <div className="container min-vh-100 d-flex justify-content-center align-items-center">
            <div className="card p-3 text-center" style={{ minWidth: 320 }}>
                <h6>Enter the OTP to verify your account</h6>
                <div>
                    <span>A code has been sent to</span>{" "}
                    <small className="text-muted">{email}</small>
                </div>

                <div className="d-flex justify-content-center mt-3">
                    {values.map((val, i) => (
                        <input
                            key={i}
                            ref={inputsRef.current[i]}
                            className="m-2 text-center form-control rounded"
                            type="text"
                            maxLength={1}
                            inputMode="numeric"
                            value={val}
                            onChange={(e) => handleChange(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            onPaste={handlePaste}
                            style={{ width: 48, height: 48, fontSize: 20 }}
                        />
                    ))}
                </div>

                <div className="mt-3 d-flex justify-content-center gap-2">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleResend}
                        disabled={isResending}
                    >
                        {isSubmitting ? "Verifying..." : isResending ? "Sending..." : "Resend"}
                    </button>
                </div>

                {message && <div className="mt-3 text-success">{message}</div>}
                {error && <div className="mt-3 text-danger">{error}</div>}
            </div>
        </div>
    );
}
