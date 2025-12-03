export const roleMiddleware = (minRole) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user || user.role < minRole) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}