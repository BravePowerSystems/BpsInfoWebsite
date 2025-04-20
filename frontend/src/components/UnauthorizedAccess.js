import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import '../scss/components/UnauthorizedAccess.scss';

const UnauthorizedAccess = ({ 
    type, 
    message, 
    showBackButton = true,
    alternativeLinks = [],
    currentPath,
    showLoginButton = false
}) => {
    const navigate = useNavigate();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // Add state for auth mode

    const handleLoginClick = () => {
        setAuthMode('login');
        setShowAuthModal(true);
    };

    const handleSignUpClick = () => {
        setAuthMode('register');
        setShowAuthModal(true);
    };

    const getIllustration = () => {
        return type === 'authentication' 
            ? '/images/auth-required.svg'  // Add these illustrations to your assets
            : '/images/access-denied.svg';
    };

    const getTitle = () => {
        return type === 'authentication'
            ? 'Authentication Required'
            : 'Access Denied';
    };

    const getDescription = () => {
        return type === 'authentication'
            ? 'Please log in to access this page'
            : "You don't have sufficient permissions to access this area";
    };

    return (
        <>
            <div className="unauthorized-container">
                <div className="unauthorized-content">
                    <div className="unauthorized-illustration">
                        <img src={getIllustration()} alt={getTitle()} />
                    </div>
                    
                    <div className="unauthorized-icon">
                        {type === 'authentication' ? '🔒' : '⚠️'}
                    </div>
                    
                    <h2>{getTitle()}</h2>
                    <p className="message">{message || getDescription()}</p>

                    <div className="action-buttons">
                        {showBackButton && (
                            <button 
                                className="btn-secondary"
                                onClick={() => navigate(-1)}
                            >
                                <i className="fas fa-arrow-left"></i> Go Back
                            </button>
                        )}

                        {showLoginButton && (
                            <button 
                                className="btn-primary"
                                onClick={handleLoginClick}
                            >
                                <i className="fas fa-sign-in-alt"></i> Log In
                            </button>
                        )}

                        {alternativeLinks.map((link, index) => (
                            <Link 
                                key={index}
                                to={link.to}
                                className="btn-alternative"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {type === 'authentication' && (
                        <div className="help-section">
                            <p className="help-text">
                                Don't have an account?{' '}
                                <button 
                                    className="text-button"
                                    onClick={handleSignUpClick} // Changed to new handler
                                >
                                    Sign up here
                                </button>
                            </p>
                            <p className="help-subtext">
                                Your original destination will be saved for after login
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    initialMode={authMode} // Use the authMode state
                    redirectPath={currentPath}
                />
            )}
        </>
    );
};

export default UnauthorizedAccess;


