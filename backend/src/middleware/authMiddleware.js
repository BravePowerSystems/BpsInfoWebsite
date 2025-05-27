import jsonwebtoken from 'jsonwebtoken';
const verifyToken = (req, res, next) => {
    try {

        // Check if authorization header exists
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "No token provided" });
        }

        // Check if header has correct format
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Invalid token format" });
        }

        const token = authHeader.split(" ")[1];
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({ error: "Token is required" });
        }

        // Debug: Check if JWT_SECRET is available
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is undefined');
            return res.status(500).json({ error: "Server configuration error" });
        }

        // Debug: Log token details
        console.log('Attempting to verify token:', token);

        // Verify token
        const decodedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;

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
