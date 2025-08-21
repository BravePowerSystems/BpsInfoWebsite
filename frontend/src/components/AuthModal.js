import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import "../scss/components/AuthModal.scss";
import { publicClientMethods } from "../services/apiClient";

function AuthModal({ onClose, initialMode = "login" }) {
    const [mode, setMode] = useState(initialMode); // 'login' or 'register'
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const { login, register } = useAuth(); // Import the login and register functions from AuthContext

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await publicClientMethods.post('/auth/forgot-password', { email: formData.email });

            setShowForgotPassword(false);
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Password reset request failed";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            if (mode === "register") {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("Passwords do not match");
                }

                // Use the register function from AuthContext
                await register({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                });
                
                // No need to login separately as register will do that
                handleClose();
                return;
            }

            // For login mode
            await login(formData.username, formData.password);
            handleClose();
        } catch (err) {
            console.error("Auth error:", err);
            const errorMessage =
                err.response?.data?.error || err.message || "Authentication failed";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (showForgotPassword) {
        return (
            <motion.div
                className="auth-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="auth-modal-content"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                >
                    <button className="modal-close" onClick={handleClose}>
                        <img src="/close.png" alt="Close" />
                    </button>

                    <h2>Reset Password</h2>
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleForgotPassword} autoComplete="off">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <button
                            type="submit"
                            className="auth-button"
                            disabled={isLoading}
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <button
                        className="auth-link"
                        onClick={() => setShowForgotPassword(false)}
                    >
                        Back to Login
                    </button>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="auth-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="auth-modal-content"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="modal-close"
                    onClick={handleClose}
                    aria-label="Close modal"
                >
                    <img src="/close.png" alt="Close" />
                </button>

                <h2>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                        />
                    </div>

                    {mode === "register" && (
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    {mode === "register" && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? mode === "login"
                                ? "Logging in..."
                                : "Creating Account..."
                            : mode === "login"
                            ? "Login"
                            : "Register"}
                    </button>
                </form>

                {mode === "login" && (
                    <>
                        <button
                            className="auth-link"
                            onClick={() => setShowForgotPassword(true)}
                        >
                            Forgot Password?
                        </button>
                        <button
                            className="auth-link"
                            onClick={() => setMode("register")}
                        >
                            Don't have an account? Register
                        </button>
                    </>
                )}
                {mode === "register" && (
                    <button
                        className="auth-link"
                        onClick={() => setMode("login")}
                    >
                        Already have an account? Login
                    </button>
                )}
            </motion.div>
        </motion.div>
    );
}

export default AuthModal;
