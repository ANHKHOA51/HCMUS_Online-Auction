import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "anhkhoanguyen11012022@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD
    }
});


export async function sendOtpMail(toEmail, otp) {
    try {
        console.log('📧 Sending OTP email to:', toEmail);
        const result = await transporter.sendMail({
            from: "Online Auction",
            to: toEmail,
            subject: "Mã OTP xác thực của bạn",
            text: `Mã OTP của bạn là ${otp}. Hết hạn trong 5 phút.`,
            html: `<p>Xin chào,</p>
             <p>Bạn vừa yêu cầu mã OTP để xác thực. Mã của bạn là:</p>
             <h2 style="color:#0d6efd;">${otp}</h2>
             <p>Mã sẽ hết hạn trong <strong>5 phút</strong>.</p>
             <p>Nếu bạn không yêu cầu mã này, có thể bỏ qua email này.</p>
             <p>Trân trọng,<br/>Đội ngũ hỗ trợ Online Auction</p>`
        });
        console.log('Email sent successfully:', result.response);

    } catch (error) {
        console.error('Email send error:', error.message);
        throw error
    }
}

export async function sendResetPasswordMail(toEmail, password) {
    try {
        console.log('📧 Sending reset password email to:', toEmail);
        const result = await transporter.sendMail({
            from: "Online Auction",
            to: toEmail,
            subject: "Đặt lại mật khẩu",
            text: `Mật khẩu của bạn đã được thay đổi`,
            html: `<p>Xin chào,</p>
             <p>Mật khẩu của bạn đã được thay đổi</p>
             <p>Mật khẩu mới của bạn là: ${password}</p>
             <p>Vui lòng thay đổi mật khẩu ngay khi nhận được email này</p>
             <p>Trân trọng,<br/>Đội ngũ hỗ trợ Online Auction</p>`
        });
        console.log('Email sent successfully:', result.response);

    } catch (error) {
        console.error('Email send error:', error.message);
        throw error
    }
}

export default transporter;
