import jsonwebtoken from 'jsonwebtoken';
import User from '../models/userModel.js';

const verifyToken = async (req, res, next) => {
    try {
        // Check for token in multiple places: Authorization header, cookies, or query params
        let token = null;
        
        // Check Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove 'Bearer ' prefix
        }
        
        // If no token in header, check cookies
        if (!token && req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        
        // If still no token, check query params (for backward compatibility)
        if (!token && req.query.token) {
            token = req.query.token;
        }
        
        if (!token) {
            return res.status(401).json({ 
                error: "No token provided",
                message: "Token required in Authorization header, cookies, or query params"
            });
        }
        
        // Debug: Check if JWT_SECRET is available
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is undefined');
            return res.status(500).json({ error: "Server configuration error" });
        }
        
        // Verify token
        const decodedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        
        // Fetch full user document
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        
        req.user = user;
        next(); // this is used to call the next middleware function
    } catch (error) {
        // Debug: Log the actual error
        console.error('Token verification error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token has expired" });
        }
        return res.status(401).json({ error: "Authentication failed" });
    }
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Authentication required" });
        }
        
        if (req.user.role !== role) {
            return res.status(403).json({ error: "Insufficient permissions" });
        }
        
        next();
    };
};

export { verifyToken, requireRole };
