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
        console.log(' Sending question notification to seller:', sellerEmail);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const productLink = `${frontendUrl}/products/${productId}`;

        const result = await transporter.sendMail({
            from: "Online Auction",
            to: sellerEmail,
            subject: ` Có câu hỏi mới về sản phẩm "${productName}"`,
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



export async function sendForgotPasswordMail(toEmail, resetLink) {
    try {
        console.log('📧 Sending forgot password email to:', toEmail);
        const result = await transporter.sendMail({
            from: "Online Auction",
            to: toEmail,
            subject: "Yêu cầu đặt lại mật khẩu",
            text: `Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng truy cập liên kết sau để đặt lại mật khẩu: ${resetLink}. Liên kết có hiệu lực trong 15 phút.`,
            html: `<p>Xin chào,</p>
             <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
             <p style="text-align: center;">
                <a href="${resetLink}" style="display: inline-block; background-color: #0d6efd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Đặt lại mật khẩu</a>
             </p>
             <p>Hoặc truy cập liên kết sau: <a href="${resetLink}">${resetLink}</a></p>
             <p>Liên kết này có hiệu lực trong <strong>15 phút</strong>.</p>
             <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
             <p>Trân trọng,<br/>Đội ngũ hỗ trợ Online Auction</p>`
        });
        console.log('Email sent successfully:', result.response);
        return true;
    } catch (error) {
        console.error('Email send error:', error.message);
        throw error
    }
}

export async function sendBidSuccessMail(toEmail, userName, productName, bidAmount) {
    try {
        console.log('📧 Sending Bid Success mail to:', toEmail);
        const result = await transporter.sendMail({
            from: "Online Auction",
            to: toEmail,
            subject: `✅ Đặt giá thành công: ${productName}`,
            html: `
                <p>Xin chào ${userName},</p>
                <p>Bạn đã đặt giá thành công cho sản phẩm <strong>${productName}</strong>.</p>
                <p>Giá đặt: <strong style="color: #0d6efd;">${Number(bidAmount).toLocaleString('vi-VN')} VNĐ</strong></p>
                <p>Chúc bạn may mắn!</p>
            `
        });
        return true;
    } catch (error) {
        console.error('Bid success email error:', error.message);
        return false;
    }
}


export async function sendNewBidNotificationToSeller(toEmail, sellerName, productName, bidAmount, bidderName) {
    try {
        console.log('📧 Sending New Bid mail to Seller:', toEmail);
        const result = await transporter.sendMail({
            from: "Online Auction",
            to: toEmail,
            subject: `💰 Giá mới cho sản phẩm: ${productName}`,
            html: `
                <p>Xin chào ${sellerName},</p>
                <p>Sản phẩm <strong>${productName}</strong> vừa nhận được lượt đặt giá mới.</p>
                <p><strong>Người đặt:</strong> ${bidderName}</p>
                <p><strong>Giá đặt:</strong> <span style="color: #0d6efd; font-weight: bold;">${Number(bidAmount).toLocaleString('vi-VN')} VNĐ</span></p>
            `
        });
        return true;
    } catch (error) {
        console.error('Seller new bid email error:', error.message);
        return false;
    }
}

export async function sendOutbidNotification(toEmail, userName, productName, newPrice, productId) {
    try {
        console.log('📧 Sending Outbid mail to Previous Bidder:', toEmail);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const productLink = `${frontendUrl}/products/${productId}`;
        const result = await transporter.sendMail({
            from: "Online Auction",
            to: toEmail,
            subject: ` Bạn đã bị vượt giá: ${productName}`,
            html: `
                <p>Xin chào ${userName},</p>
                <p>Có người vừa đặt giá cao hơn bạn cho sản phẩm <strong>${productName}</strong>.</p>
                <p>Giá hiện tại: <strong style="color: #d63384;">${Number(newPrice).toLocaleString('vi-VN')} VNĐ</strong></p>
                <p>
                    <a href="${productLink}" style="display: inline-block; background: #0d6efd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Xem sản phẩm & Đặt giá lại</a>
                </p>
                <p>Hãy đặt giá lại ngay để giành chiến thắng!</p>
            `
        });
        return true;
    } catch (error) {
        console.error('Outbid email error:', error.message);
        return false;
    }
}

export async function sendBidRejectedMail(toEmail, userName, productName) {
    try {
        console.log(' Sending Reject mail to Bidder:', toEmail);
        const result = await transporter.sendMail({
            from: "Online Auction",
            to: toEmail,
            subject: `🚫 Lượt đặt giá bị từ chối: ${productName}`,
            html: `
                <p>Xin chào ${userName},</p>
                <p>Lượt đặt giá của bạn cho sản phẩm <strong>${productName}</strong> đã bị người bán từ chối.</p>
            `
        });
        return true;
    } catch (error) {
        console.error('Reject bid email error:', error.message);
        return false;
    }
}

export async function sendNewAnswerNotification(toEmail, userName, productName, question, answer) {
    try {
        console.log(' Sending New Answer mail to:', toEmail);
        const result = await transporter.sendMail({
            from: "Online Auction",
            to: toEmail,
            subject: ` Phản hồi mới về sản phẩm: ${productName}`,
            html: `
                <p>Xin chào ${userName},</p>
                <p>Người bán đã trả lời câu hỏi về sản phẩm <strong>${productName}</strong>:</p>
                <div style="background: #f8f9fa; padding: 10px; margin: 10px 0;">
                    <p><strong>Q:</strong> ${question}</p>
                    <p><strong>A:</strong> <span style="color: #0d6efd;">${answer}</span></p>
                </div>
            `
        });
        return true;
    } catch (error) {
        console.error('New answer email error:', error.message);
        return false;
    }
}


export async function sendAuctionEndWinnerMail(toEmail, userName, productName, price) {
    try {
        console.log('📧 Sending Winner mail to:', toEmail);
        const result = await transporter.sendMail({
            from: "Online Auction",
            to: toEmail,
            subject: ` CHÚC MỪNG CHIẾN THẮNG: ${productName}`,
            html: `
                <div style="text-align: center; border: 2px solid #ffd803; padding: 20px;">
                    <h2 style="color: #e67e22;">Chúc mừng ${userName}!</h2>
                    <p>Bạn đã chiến thắng đấu giá sản phẩm:</p>
                    <h3>${productName}</h3>
                    <p>Với mức giá: <strong>${Number(price).toLocaleString('vi-VN')} VNĐ</strong></p>
                    <p>Vui lòng đăng nhập vào hệ thống để xem chi tiết và liên hệ người bán.</p>
                </div>
            `
        });
        return true;
    } catch (error) {
        console.error('Winner email error:', error.message);
        return false;
    }
}

export async function sendAuctionEndSellerMail(toEmail, userName, productName, winnerName, price) {
    try {
        console.log('📧 Sending Seller mail to:', toEmail);
        const result = await transporter.sendMail({
            from: "Online Auction",
            to: toEmail,
            subject: ` Đấu giá kết thúc: ${productName}`,
            html: `
                <p>Xin chào ${userName},</p>
                <p>Sản phẩm <strong>${productName}</strong> đã kết thúc đấu giá.</p>
                ${winnerName
                    ? `<p><strong>Người thắng:</strong> ${winnerName}</p><p><strong>Giá cuối:</strong> ${Number(price).toLocaleString('vi-VN')} VNĐ</p>`
                    : '<p><strong>Kết quả:</strong> Không có người mua.</p>'}
                    <p>Vui lòng đăng nhập vào hệ thống để xem chi tiết.</p>
            `
        });
        return true;
    } catch (error) {
        console.error('Seller email error:', error.message);
        return false;
    }
}

export async function sendRejectMail(toEmail, productName) {
    try {
        console.log(' Sending reject email to:', toEmail);
        const result = await transporter.sendMail({
            from: "Online Auction",
            to: toEmail,
            subject: "Lượt ra giá bị từ chối",
            text: `Lượt ra giá của bạn đã bị từ chối`,
            html: `<p>Xin chào,</p>
             <p>Lượt ra giá của bạn đã bị từ chối cho sản phẩm "${productName}"</p>
             <p>Trân trọng,<br/>Đội ngũ hỗ trợ Online Auction</p>`
        });
        console.log('Email sent successfully:', result.response);

    } catch (error) {
        console.error('Email send error:', error.message);
        throw error
    }
}

export async function sendAppendDescription(toEmail, productName) {
    try {
        console.log('📧 Sending append description email to:', toEmail);
        const result = await transporter.sendMail({
            from: "Online Auction",
            to: toEmail,
            subject: "Mô tả sản phẩm đã được thêm",
            text: `Mô tả sản phẩm bạn đang đặt đã được thêm một số thông tin`,
            html: `<p>Xin chào,</p>
             <p>Mô tả sản phẩm của cho sản phẩm "${productName}" đã được thêm thông tin</p>
             <p>Trân trọng,<br/>Đội ngũ hỗ trợ Online Auction</p>`
        });
        console.log('Email sent successfully:', result.response);

    } catch (error) {
        console.error('Email send error:', error.message);
        throw error
    }
}

export default transporter;
