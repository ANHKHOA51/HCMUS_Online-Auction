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

export async function sendQuestionMail(sellerEmail, sellerName, productName, askerName, questionContent, productId) {
    try {
        console.log('📧 Sending question notification to seller:', sellerEmail);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const productLink = `${frontendUrl}/product/${productId}`;
        
        const result = await transporter.sendMail({
            from: "Online Auction",
            to: sellerEmail,
            subject: `❓ Có câu hỏi mới về sản phẩm "${productName}"`,
            html: `
                <p>Xin chào ${sellerName},</p>
                <p>Bạn có một câu hỏi mới về sản phẩm của mình:</p>
                
                <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #0d6efd; margin: 20px 0;">
                    <p><strong>Sản phẩm:</strong> ${productName}</p>
                    <p><strong>Hỏi bởi:</strong> ${askerName}</p>
                    <p><strong>Câu hỏi:</strong></p>
                    <p style="margin: 10px 0; font-style: italic;">"${questionContent}"</p>
                </div>
                
                <p>
                    <a href="${productLink}" style="display: inline-block; background: #0d6efd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Xem sản phẩm & Trả lời
                    </a>
                </p>
                
                <p style="margin-top: 30px; color: #666; font-size: 12px;">
                    Trân trọng,<br/>
                    Đội ngũ Online Auction
                </p>
            `
        });
        console.log('Question notification email sent:', result.response);
        return true;
    } catch (error) {
        console.error('Question email send error:', error.message);
        // Don't throw - email failure shouldn't block question creation
        return false;
    }
}

export default transporter;
