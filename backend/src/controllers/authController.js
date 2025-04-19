import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

const generateTokens = (user) => {
    const accessToken = jsonwebtoken.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const refreshToken = jsonwebtoken.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: existingUser.username === username 
                    ? 'Username already exists' 
                    : 'Email already exists'
            });
        }
        
        // Force role to be 'user' for all registrations
        const role = 'user';
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ 
            username, 
            email, 
            password: hashedPassword, 
            role 
        });
        await user.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        res.status(200).json({ 
            message: `User logged in successfully as ${user.role}`,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(401).json({ error: "Refresh token required" });
        }

        const decoded = jsonwebtoken.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user);

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        res.status(401).json({ error: "Invalid refresh token" });
    }
};

export { register, login, refreshToken };
