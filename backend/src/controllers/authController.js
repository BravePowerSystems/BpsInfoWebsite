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
        
        res.status(200).json({
            message: `User logged in successfully as ${authData.user.role}`,
            user: authData.user,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(401).json({ error: error.message });
    }
};

// Logout controller - no need to clear cookies since we're using localStorage
export const logout = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};

// refreshToken function refreshes the user's access token because the access token expires after a certain time
// access token is used to authenticate and authorize the user for accessing protected routes
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token is required" });
        }
        
        const tokens = await AuthService.refreshUserToken(refreshToken);
        
        res.status(200).json({ 
            message: 'Token refreshed',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
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

// Update current user's profile (username, firstName, lastName, phone)
export const updateProfile = async (req, res) => {
    try {
        const user = req.user; // Populated by verifyToken middleware
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { username, firstName, lastName, phone } = req.body;
        if (username) user.username = username;
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (phone !== undefined) user.phone = phone;
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

// Request password reset
export const forgotPassword = async (req, res) => {
    try {
        console.log('🔐 Forgot password request received');
        console.log('📧 Request body:', { email: req.body.email });
        
        const { email } = req.body;
        
        if (!email) {
            console.log('❌ No email provided in request');
            return res.status(400).json({ error: 'Email is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Invalid email format:', email);
            return res.status(400).json({ error: 'Invalid email format' });
        }

        console.log('✅ Email format validation passed');
        console.log('🔄 Calling AuthService.requestPasswordReset...');
        
        const result = await AuthService.requestPasswordReset(email);
        
        console.log('✅ Password reset request completed successfully');
        res.status(200).json(result);
    } catch (error) {
        console.error('❌ Forgot password error:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({ error: error.message });
    }
};

// Reset password with token
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        
        if (!token || !password) {
            return res.status(400).json({ error: 'Token and password are required' });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters long' 
            });
        }

        const result = await AuthService.resetPassword(token, password);
        res.status(200).json(result);
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({ error: error.message });
    }
};

// Validate reset token
export const validateResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const result = await AuthService.validateResetToken(token);
        res.status(200).json(result);
    } catch (error) {
        console.error('Validate token error:', error);
        res.status(400).json({ error: error.message });
    }
};
