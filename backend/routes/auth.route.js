import express from 'express';
import AuthService from '../services/auth.service.js';
const router = express.Router();

router.post("/register", async (req, res) => {
    const { firstname, lastname, username, email, password, captcha_key } = req.body;

    if (!firstname || !lastname || !username || !email || !password) {
        return res.status(400).json({ message: "Not enough information" });
    }

    const errors = await AuthService.checkExisted(username, email, captcha_key)

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }
    console.log('Registering user:', { firstname, lastname, username, email });

    try {

        await AuthService.add2Pending({ firstname, lastname, username, email, password })

        return res.status(201).json({
            message: "Register successful",
            email: email
        });

    } catch (error) {
        console.error('Failed to send OTP email:', error);
        return res.status(500).json({ message: "Failed to send OTP email" });
    }
})

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const rs = await AuthService.forgotPassword(email);
        if (rs.ok) {
            return res.json({ message: "Reset link has been sent to your email" });
        } else {
            if (rs.reason === 'not_found') {
                return res.status(404).json({ message: "Email not found" });
            }
            return res.status(400).json({ message: "Error processing request" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Token and new password required" });

    if (newPassword.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    try {
        const rs = await AuthService.resetPassword(token, newPassword);
        if (rs.ok) {
            return res.json({ message: "Password reset successful" });
        } else {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});
router.post("/register/otp", async (req, res) => {
    const { email, otp } = req.body
    try {
        const rs = await AuthService.verifyOtp(email, otp)
        if (rs.ok) {
            return res.status(201).json({
                message: "Verify successful"
            })
        } else {
            return res.status(401).json({
                message: rs.reason
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Server error"
        })
    }
})

router.post("/resend-otp", async (req, res) => {
    const { email } = req.body
    try {
        const rs = await AuthService.resendOtp(email)
        if (rs.ok) {
            return res.status(201).json({
                message: "Resend successful"
            })
        } else {
            return res.status(401).json({
                message: rs.reason
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Server error"
        })
    }
})

router.post("/login", async (req, res) => {
    const { identifier, password } = req.body
    try {
        const rs = await AuthService.signIn(identifier, password)
        if (rs.ok) {
            res.cookie("refreshToken", rs.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            })

            res.status(201).json({
                message: "Sign in successful",
                user: {
                    id: rs.user.id,
                    username: rs.user.username,
                    email: rs.user.email,
                    role: rs.user.role,
                    full_name: rs.user.full_name
                },
                accessToken: rs.accessToken,
                refreshToken: rs.refreshToken
            })
        } else {
            return res.status(401).json({
                message: "Invalid username/email or password"
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Server error"
        })
    }
})

router.post("/refresh", async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.status(401).json({
        message: "Unauthorized"
    })

    try {
        const rs = await AuthService.refreshToken(refreshToken)
        if (rs.ok) {
            res.cookie("refreshToken", rs.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            })

            res.status(201).json({
                message: "Refresh successful",
                user: {
                    id: rs.user.id,
                    username: rs.user.username,
                    email: rs.user.email,
                    role: rs.user.role,
                    full_name: rs.user.full_name
                },
                accessToken: rs.accessToken,
            })
        } else {
            return res.status(401).json({
                message: "Invalid refresh token"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server error"
        })
    }
})

router.post("/logout", async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.status(401).json({
        message: "Unauthorized"
    })

    try {
        const rs = await AuthService.removeToken(refreshToken)
        if (rs.ok) {
            res.clearCookie("refreshToken")
            res.status(201).json({
                message: "Logout successful"
            })
        } else {
            return res.status(401).json({
                message: "Invalid refresh token"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server error"
        })
    }
})

export default router;
