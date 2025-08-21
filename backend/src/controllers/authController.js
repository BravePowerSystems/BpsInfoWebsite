import { AuthService } from "../services/authService.js";

export const register = async (req, res) => {
    try {
        console.log("Registration request received:", {
            username: req.body.username,
            email: req.body.email,
            // Don't log password
        });
        
        // Validate required fields
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ 
                error: "Username, email and password are required" 
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        
        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ 
                error: "Password must be at least 6 characters long" 
            });
        }
        
        await AuthService.registerUser(req.body);
        console.log("User registered successfully:", username);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(400).json({ error: error.message });
    }
};

// login function performs user login
// AuthService.loginUser takes the user credentials from the request body and performs user login
export const login = async (req, res) => {
    try {
        const authData = await AuthService.loginUser(req.body);
        // Set JWT as cookie (not httpOnly so frontend can read it)
        const isProd = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'strict' : 'lax',
            path: '/', // Ensure cookie is available across all paths
            maxAge: 60 * 60 * 1000 // 1 hour
        };
        const refreshCookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };
        res.cookie('accessToken', authData.accessToken, cookieOptions);
        res.cookie('refreshToken', authData.refreshToken, refreshCookieOptions);
        res.status(200).json({
            message: `User logged in successfully as ${authData.user.role}`,
            user: authData.user
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(401).json({ error: error.message });
    }
};

// Logout controller to clear cookies
export const logout = (req, res) => {
    const isProd = process.env.NODE_ENV === 'production';
    const clearOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'strict' : 'lax',
    };
    res.clearCookie('accessToken', clearOptions);
    res.clearCookie('refreshToken', clearOptions);
    res.status(200).json({ message: 'Logged out successfully' });
};

// refreshToken function refreshes the user's access token because the access token expires after a certain time
// access token is used to authenticate and authorize the user for accessing protected routes
export const refreshToken = async (req, res) => {
    try {
        const tokens = await AuthService.refreshUserToken(
            req.body.refreshToken
        );
        // Set new accessToken as cookie
        const isProd = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'strict' : 'lax',
            maxAge: 60 * 60 * 1000 // 1 hour
        };
        res.cookie('accessToken', tokens.accessToken, cookieOptions);
        // Do not send tokens in response
        res.status(200).json({ message: 'Token refreshed' });
    } catch (error) {
        res.status(401).json({ error: "Invalid refresh token" });
    }
};

// Get current user's profile
export const getProfile = async (req, res) => {
    try {
        const user = req.user; // Populated by verifyToken middleware
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            company: user.company,
            phone: user.phone,
            address: user.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// Update current user's profile (username, email, firstName, lastName, company, phone, address)
export const updateProfile = async (req, res) => {
    try {
        const user = req.user; // Populated by verifyToken middleware
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { username, email, firstName, lastName, company, phone, address } = req.body;
        if (username) user.username = username;
        if (email) user.email = email;
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (company !== undefined) user.company = company;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        await user.save();
        res.json({
            message: 'Profile updated successfully',
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            company: user.company,
            phone: user.phone,
            address: user.address
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
