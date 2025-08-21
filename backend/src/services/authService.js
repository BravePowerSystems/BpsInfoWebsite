import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

export class AuthService {
    static async registerUser(userData) {
        const { username, email, password } = userData;
        
        // Additional validation
        if (!username || !email || !password) {
            throw new Error("All fields are required");
        }
        
        try {
            const existingUser = await User.findOne({ 
                $or: [{ username }, { email }]
            });

            if (existingUser) {
                throw new Error(
                    existingUser.username === username 
                        ? 'Username already exists' 
                        : 'Email already exists'
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ 
                username, 
                email, 
                password: hashedPassword, 
                role: 'user' 
            });

            return await user.save();
        } catch (error) {
            // Check if it's a MongoDB duplicate key error
            if (error.code === 11000) {
                // Extract the duplicate field name from the error message
                const field = Object.keys(error.keyPattern)[0];
                throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`);
            }
            
            // Re-throw other errors
            throw error;
        }
    }

    static async loginUser(credentials) {
        const { username, password } = credentials;
        const user = await User.findOne({ username });
        
        if (!user) {
            throw new Error('Invalid username');
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        return {
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user),
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        };
    }

    static async refreshUserToken(refreshToken) {
        if (!refreshToken) {
            throw new Error('Refresh token required');
        }

        const decoded = jsonwebtoken.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        return {
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user)
        };
    }

    static generateAccessToken(user) {
        return jsonwebtoken.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    }

    static generateRefreshToken(user) {
        return jsonwebtoken.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );
    }
}
