// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.redirect("/login-superadmin");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticate;