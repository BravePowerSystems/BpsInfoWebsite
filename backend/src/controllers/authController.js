import { AuthService } from '../services/authService.js';

export const register = async (req, res) => {
    try {
        await AuthService.registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const authData = await AuthService.loginUser(req.body);
        res.status(200).json({
            message: `User logged in successfully as ${authData.user.role}`,
            ...authData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ error: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const tokens = await AuthService.refreshUserToken(req.body.refreshToken);
        res.json(tokens);
    } catch (error) {
        res.status(401).json({ error: "Invalid refresh token" });
    }
};
