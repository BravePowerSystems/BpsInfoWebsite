import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { EmailService } from './emailService.js';

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
        const { email, password } = credentials;
        const user = await User.findOne({ email });
        
        if (!user) {
            throw new Error('Invalid email');
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
                email: user.email,
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
            { expiresIn: '30d' }
        );
    }

    static generateRefreshToken(user) {
        return jsonwebtoken.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '30d' }
        );
    }

    static async requestPasswordReset(email) {
        console.log('🔐 Password reset requested for email:', email);
        
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('❌ User not found for email:', email);
            // Don't reveal if email exists or not for security
            return { message: 'If an account with that email exists, a password reset link has been sent.' };
        }

        console.log('✅ User found:', { id: user._id, username: user.username, email: user.email });

        // Generate reset token
        const resetToken = EmailService.generateResetToken();
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now
        
        console.log('🔑 Generated reset token:', resetToken.substring(0, 10) + '...');
        console.log('⏰ Token expires at:', resetExpires.toISOString());

        // Save reset token to user
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetExpires;
        await user.save();
        
        console.log('💾 Reset token saved to database');

        // Send reset email
        try {
            console.log('📧 Attempting to send password reset email...');
            console.log('📧 Email service configuration check:', {
                SENDGRID_KEY: process.env.SENDGRID_KEY ? 'Set' : 'Not set',
                SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || 'Using default',
                FRONTEND_URL: process.env.FRONTEND_URL || 'Using default'
            });
            
            await EmailService.sendPasswordResetEmail(user.email, resetToken, user.firstName);
            console.log('✅ Password reset email sent successfully');
            return { message: 'If an account with that email exists, a password reset link has been sent.' };
        } catch (error) {
            console.error('❌ Failed to send password reset email:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            // Clear the reset token if email fails
            user.passwordResetToken = null;
            user.passwordResetExpires = null;
            await user.save();
            console.log('🧹 Cleared reset token from database due to email failure');
            throw new Error('Failed to send password reset email');
        }
    }

    static async resetPassword(token, newPassword) {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        // Validate new password
        if (!newPassword || newPassword.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user
        user.password = hashedPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        // Send confirmation email
        try {
            await EmailService.sendPasswordResetConfirmation(user.email, user.firstName);
        } catch (error) {
            // Don't fail the reset if confirmation email fails
            console.log('Password reset successful, but confirmation email failed');
        }

        return { message: 'Password has been reset successfully' };
    }

    static async validateResetToken(token) {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        return { valid: true, email: user.email };
    }
}
