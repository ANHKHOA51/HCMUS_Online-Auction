import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    try {
        // Extract token from Authorization header (Bearer <token>)
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            console.error('❌ No authorization header');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        // Split "Bearer <token>" to get token
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            console.error('❌ No token in authorization header');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        console.log('✅ Token verified:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
}

export default authMiddleware;
