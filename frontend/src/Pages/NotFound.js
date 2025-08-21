import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import '../scss/pages/NotFound.scss';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <motion.div 
                className="not-found-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you are looking for doesn't exist or has been moved.</p>
                
                <div className="action-buttons">
                    <Link to="/" className="btn-primary">
                        Return to Home
                    </Link>
                    <Link to="/Products" className="btn-secondary">
                        Explore Products
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;