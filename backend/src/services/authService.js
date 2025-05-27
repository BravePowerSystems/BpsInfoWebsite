import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

export class AuthService {
    static async registerUser(userData) {
        const { username, email, password } = userData;
        
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