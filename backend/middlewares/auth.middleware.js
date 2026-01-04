import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        // Extract token from Authorization header (Bearer <token>)
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            console.error('No authorization header');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        // Split "Bearer <token>" to get token
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            console.error('No token in authorization header');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        console.log('Token verified:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
}

// middlewares/auth.mdw.js
export const verifyBidderEligibility = async (req, res, next) => {
    const { id: productId } = req.params;
    const userId = req.user.id;

    // Lấy thông tin cần thiết (Query thường, không cần transaction)
    const product = await productModel.findById(productId);
    const stats = await userModel.getRatingStats(userId);

    // Logic kiểm tra (Copy từ code cũ của bạn)
    const isNewbie = stats.total === 0;
    
    if (isNewbie && !product.allow_newbie) {
        return res.status(403).json({ error: 'Sản phẩm không cho phép người mới.' });
    }
    
    if (!isNewbie && stats.score < 0.8) {
        return res.status(403).json({ error: 'Điểm uy tín thấp dưới 80%.' });
    }

    // Nếu qua ải thì cho đi tiếp
    next();
};


export default authMiddleware;
