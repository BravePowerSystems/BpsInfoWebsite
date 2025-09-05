import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { systemNotifications } from '../utils/notificationHelper';
import '../scss/pages/ResetPassword.scss';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const [error, setError] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        validateToken();
    }, [token]);

    const validateToken = async () => {
        if (!token) {
            setError('Invalid reset link');
            setIsValidating(false);
            return;
        }

        try {
            const response = await authService.validateResetToken(token);
            setIsValidToken(true);
            setUserEmail(response.data.email);
        } catch (error) {
            setError('Invalid or expired reset link');
            setIsValidToken(false);
        } finally {
            setIsValidating(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await authService.resetPassword(token, formData.password);
            systemNotifications.success('Password reset successfully! You can now log in with your new password.');
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to reset password';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isValidating) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-content">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Validating reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className="reset-password-container">
                <motion.div 
                    className="reset-password-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="error-state">
                        <div className="error-icon">⚠️</div>
                        <h2>Invalid Reset Link</h2>
                        <p>{error}</p>
                        <button 
                            className="btn-primary"
                            onClick={() => navigate('/login')}
                        >
                            Back to Login
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="reset-password-container">
            <motion.div 
                className="reset-password-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="reset-password-header">
                    <h1>Reset Your Password</h1>
                    <p>Enter your new password for <strong>{userEmail}</strong></p>
                </div>

                <form onSubmit={handleSubmit} className="reset-password-form">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                            autoComplete="new-password"
                            placeholder="Enter new password"
                        />
                        <small>Password must be at least 6 characters long</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength="6"
                            autoComplete="new-password"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>

                <div className="reset-password-footer">
                    <p>
                        Remember your password?{' '}
                        <button 
                            className="link-button"
                            onClick={() => navigate('/login')}
                        >
                            Back to Login
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
