const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT token
const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1]; //Extract token 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user data (id, role) to `request.user`
        next();
    } catch (err) {
        res.status(403).json({ msg: 'Token is not valid' });
    }
}

module.exports = authMiddleWare;