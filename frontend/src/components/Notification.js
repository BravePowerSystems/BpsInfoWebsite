import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
import '../scss/components/Notification.scss';

const Notification = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="notification-container">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        className={`notification ${notification.type}`}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        <div className="notification-content">
                            {notification.icon && (
                                <span className="notification-icon">{notification.icon}</span>
                            )}
                            <p>{notification.message}</p>
                        </div>
                        <button 
                            className="notification-close"
                            onClick={() => removeNotification(notification.id)}
                        >
                            ×
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Notification;