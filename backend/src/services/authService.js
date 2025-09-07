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
        console.log('🔐 Password reset requested');
        
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('❌ User not found');
            // Don't reveal if email exists or not for security
            return { message: 'If an account with that email exists, a password reset link has been sent.' };
        }

        console.log('✅ User found for password reset');

        // Generate reset token
        const resetToken = EmailService.generateResetToken();
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now
        
        console.log('🔑 Generated reset token');
        console.log('⏰ Token expires in 1 hour');

        // Save reset token to user
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetExpires;
        await user.save();
        
        console.log('💾 Reset token saved to database');

        // Send reset email
        try {
            console.log('📧 Attempting to send password reset email...');
            console.log('📧 Email service configuration check');
            
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
        console.log('🔐 Attempting password reset');
        
        // Validate inputs
        if (!token || typeof token !== 'string') {
            throw new Error('Invalid reset token');
        }
        
        if (!newPassword || typeof newPassword !== 'string') {
            throw new Error('Password is required');
        }

        if (newPassword.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            console.log('❌ No user found with valid token');
            // Let's check if there's a user with this token but expired
            const expiredUser = await User.findOne({ passwordResetToken: token });
            if (expiredUser) {
                console.log('⚠️ Found user with expired token');
                throw new Error('Reset token has expired. Please request a new password reset.');
            } else {
                console.log('❌ No user found with this token');
                throw new Error('Invalid reset token');
            }
        }
        
        console.log('✅ User found with valid token');

        try {
            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            // Update user
            user.password = hashedPassword;
            user.passwordResetToken = null;
            user.passwordResetExpires = null;
            await user.save();
            
            console.log('✅ Password updated successfully');

            // Send confirmation email (don't fail if this fails)
            try {
                await EmailService.sendPasswordResetConfirmation(user.email, user.firstName);
                console.log('✅ Password reset confirmation email sent');
            } catch (emailError) {
                console.log('⚠️ Password reset successful, but confirmation email failed:', emailError.message);
            }

            return { 
                success: true,
                message: 'Password has been reset successfully',
                email: user.email
            };
        } catch (error) {
            console.error('❌ Error updating password:', error);
            throw new Error('Failed to update password. Please try again.');
        }
    }

    static async validateResetToken(token) {
        console.log('🔍 Validating reset token');
        
        // Validate input
        if (!token || typeof token !== 'string') {
            throw new Error('Invalid reset token');
        }
        
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            console.log('❌ No user found with valid token during validation');
            // Let's check if there's a user with this token but expired
            const expiredUser = await User.findOne({ passwordResetToken: token });
            if (expiredUser) {
                console.log('⚠️ Found user with expired token during validation');
                throw new Error('Reset token has expired. Please request a new password reset.');
            } else {
                console.log('❌ No user found with this token during validation');
                throw new Error('Invalid reset token');
            }
        }
        
        console.log('✅ Token validation successful');
        return { 
            valid: true, 
            email: user.email,
            success: true
        };
    }
}
