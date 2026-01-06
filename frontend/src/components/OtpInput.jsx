import useOTP from "../hooks/auth/useOTP.js";
import { maskEmail } from "../utils/auth";

export default function OtpInput() {
    const {
        values, inputsRef, isSubmitting, isResending, message, error,
        handleChange, handleKeyDown, handlePaste, handleResend, submitOtp
    } = useOTP()

    const email = maskEmail(sessionStorage.getItem('VerifyingEmail'))

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 shadow-xl rounded-xl text-center w-full max-w-md border border-gray-100">
                <h6 className="text-lg font-bold text-gray-800 mb-2">Enter the OTP to verify your account</h6>
                <div className="text-sm text-gray-600 mb-6">
                    <span>A code has been sent to</span>{" "}
                    <span className="font-bold text-blue-600">{email}</span>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                    {values.map((val, i) => (
                        <input
                            key={i}
                            ref={inputsRef.current[i]}
                            className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-xl font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            type="text"
                            maxLength={1}
                            inputMode="numeric"
                            value={val}
                            onChange={(e) => handleChange(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            onPaste={handlePaste}
                        />
                    ))}
                </div>

                <div className="flex justify-center gap-3">
                    <button
                        className="px-6 py-2 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleResend}
                        disabled={isResending}
                    >
                        {isSubmitting ? "Verifying..." : isResending ? "Sending..." : "Resend Code"}
                    </button>
                </div>

                {message && <div className="mt-4 text-green-600 font-bold bg-green-50 p-2 rounded">{message}</div>}
                {error && <div className="mt-4 text-red-600 font-bold bg-red-50 p-2 rounded">{error}</div>}
            </div>
        </div>
    );
}
