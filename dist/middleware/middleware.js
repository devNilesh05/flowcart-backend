import jwt from 'jsonwebtoken';
export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ messgae: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info (id + email)
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
//# sourceMappingURL=middleware.js.map