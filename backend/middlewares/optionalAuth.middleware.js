import jwt from 'jsonwebtoken';

// Optional auth middleware - lấy token nếu có, không bắt buộc
export const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
                req.user = decoded;
                console.log('User authenticated:', decoded.id, 'Role:', decoded.role);
            }
        }
    } catch (error) {
        console.log('Auth optional, continuing without user');
    }
    next();
};


export default optionalAuth;
