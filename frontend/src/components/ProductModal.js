import React, { useState, useEffect } from "react";
import "../scss/components/ProductModal.scss";
import { motion } from "framer-motion";
import { formNotifications } from '../utils/notificationHelper';
import { publicClientMethods, privateClientMethods } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { openWhatsAppProductEnquiry } from '../utils/whatsappHelper';
import CustomDropdown from './CustomDropdown';

const ProductModal = ({ productName, onClose }) => {
    const { isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        phone: "",
        enquiryType: "general",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const enquiryTypes = [
        { value: "general", label: "General Enquiry" },
        { value: "technical", label: "Technical Support" },
        { value: "quote", label: "Request a Quote" },
        { value: "custom", label: "Custom Solution" },
    ];

    // Handle Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Focus trap for accessibility
    useEffect(() => {
        const modal = document.querySelector(".modal-content");
        if (modal) modal.focus();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitEnquiry = async (enquiryData) => {
        const client = isAuthenticated ? privateClientMethods : publicClientMethods;
        const response = await client.post('/enquiries', {
            ...enquiryData,
            productName,
            submittedAt: new Date().toISOString()
        });
        
        if (!response) {
            throw new Error('Failed to submit enquiry');
        }
        
        return response;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            await submitEnquiry(formData);
            formNotifications.submitSuccess('product enquiry');
            onClose();
        } catch (error) {
            console.error('Enquiry submission error:', error);
            formNotifications.submitError('product enquiry');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                tabIndex="-1"
            >
                <button
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <img src="../../close.png" alt="Close" />
                </button>

                <h3 id="modal-title">Enquire about {productName}</h3>
                <p className="modal-subtitle">
                    Reach out and we will get in touch within 24 hours
                </p>

                <form onSubmit={handleSubmit} className="enquiry-form" autoComplete="off">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                aria-required="true"
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                aria-required="true"
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="form-group-single">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            aria-required="true"
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="company">Company Name</label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group-single">
                        <label htmlFor="enquiryType">Enquiry Type</label>
                        <CustomDropdown
                            options={enquiryTypes}
                            value={formData.enquiryType}
                            onChange={(value) => setFormData(prev => ({ ...prev, enquiryType: value }))}
                            placeholder="Select enquiry type..."
                            className="enquiry-type-dropdown"
                        />
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                        </button>
                        <button 
                            type="button"
                            className="whatsapp-btn"
                            onClick={() => openWhatsAppProductEnquiry(productName)}
                            title="Contact us on WhatsApp"
                        >
                            WhatsApp Enquiry
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default ProductModal;
