export const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            // Convert single role to array for uniform checking
            const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
            
            // Check if user has one of the allowed roles
            if (!user || !roles.includes(user.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
