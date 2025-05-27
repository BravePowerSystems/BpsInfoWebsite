import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from "framer-motion";
import AuthModal from '../components/AuthModal';
import '../scss/pages/UnauthorizedPage.scss';

const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const UnauthorizedPage = ({ 
    type = 'authentication', // 'authentication' or 'authorization'
    currentPath 
}) => {
    const navigate = useNavigate();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    const handleAuthClick = (mode) => {
        setAuthMode(mode);
        setShowAuthModal(true);
    };

    const getIllustration = () => {
        return type === 'authentication' 
            ? '/images/authRequired.jpg'
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
            <div className="unauthorized-page">
                <motion.div 
                    className="content-wrapper"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUpVariants}
                    transition={{ duration: 0.8 }}
                >
                    <div className="illustration">
                        <img src={getIllustration()} alt={getTitle()} />
                    </div>

                    <h1>{getTitle()}</h1>
                    <p className="description">{getDescription()}</p>

                    <div className="actions">
                        {type === 'authentication' ? (
                            <>
                                <button 
                                    className="btn-primary"
                                    onClick={() => handleAuthClick('login')}
                                >
                                    <i className="fas fa-sign-in-alt"></i> Log In
                                </button>
                                <button 
                                    className="btn-secondary"
                                    onClick={() => handleAuthClick('register')}
                                >
                                    Create Account
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" className="btn-primary">
                                    Go to Dashboard
                                </Link>
                                <button 
                                    className="btn-secondary"
                                    onClick={() => navigate(-1)}
                                >
                                    Go Back
                                </button>
                            </>
                        )}
                        
                        <Link to="/" className="btn-text">
                            Return to Home
                        </Link>
                    </div>
                </motion.div>
            </div>

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    initialMode={authMode}
                    redirectPath={currentPath}
                />
            )}
        </>
    );
};

export default UnauthorizedPage;
