import React from 'react';
import ContactForm from '../components/ContactForm';
import { motion } from 'framer-motion';
import '../scss/pages/Contact.scss';

const Contact = () => {
    return (
        <motion.div 
            className="contact-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="contact-header">
                <h1>Get in Touch</h1>
                <p>We'd love to hear from you. Contact us for any questions or support.</p>
            </div>
            
            <div className="contact-content">
                <div className="contact-info">
                    <div className="info-card">
                        <h3>Office Address</h3>
                        <p>🏬 Brave Power Systems</p>
                        <p>📍 Bengaluru, India</p>
                    </div>
                    
                    <div className="info-card">
                        <h3>Contact Details</h3>
                        <p>📞 +917942701967</p>
                        <p>✉️ info@bravepowersystems.com</p>
                    </div>
                </div>
                
                <ContactForm />
            </div>
        </motion.div>
    );
};

export default Contact;