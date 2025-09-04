import React, { useState } from "react";
import "../scss/components/ContactForm.scss";
import { motion } from "framer-motion";
import { publicClientMethods } from '../services/apiClient';
import { formNotifications } from '../utils/notificationHelper';
import { openWhatsAppGeneralEnquiry } from '../utils/whatsappHelper';
import { validateIndianPhone, formatIndianPhoneInput } from '../utils/phoneValidation';
import CustomDropdown from './CustomDropdown';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        phone: "",
        message: "",
        enquiryType: "general",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [phoneError, setPhoneError] = useState("");

    const enquiryTypes = [
        { value: "general", label: "General Enquiry" },
        { value: "technical", label: "Technical Support" },
        { value: "quote", label: "Request a Quote" },
        { value: "custom", label: "Custom Solution" },
    ];

    const validatePhone = (phone) => {
        // Use Indian phone validation utility
        const validation = validateIndianPhone(phone);
        return validation.error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Validate phone number on change
        if (name === "phone") {
            const error = validatePhone(value);
            setPhoneError(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        // Validate phone number before submission
        const phoneValidationError = validatePhone(formData.phone);
        if (phoneValidationError) {
            setPhoneError(phoneValidationError);
            return;
        }
        
        setIsSubmitting(true);
        try {
            const response = await publicClientMethods.post('/enquiries', {
                ...formData,
                submittedAt: new Date().toISOString()
            });
            
            if (!response) {
                throw new Error('Failed to submit enquiry');
            }
            
            formNotifications.submitSuccess('contact enquiry');
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                company: "",
                phone: "",
                enquiryType: "general",
                message: ""
            });
            setPhoneError(""); // Clear phone error on successful submission
        } catch (error) {
            console.error('Enquiry submission error:', error);
            formNotifications.submitError('contact enquiry');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="contact-form-container"
        >
            <h2>Contact Us</h2>
            <p className="contact-subtitle">
                Have questions? We're here to help. Fill out the form below and we'll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="contact-form" autoComplete="off">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName" className="visually-hidden">First Name</label>
                        <input 
                            type="text" 
                            id="firstName"
                            name="firstName" 
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name *" 
                            required 
                            aria-required="true"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName" className="visually-hidden">Last Name</label>
                        <input 
                            type="text" 
                            id="lastName"
                            name="lastName" 
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name" 
                        />
                    </div>
                </div>

                <div className="form-group-single">
                    <label htmlFor="email" className="visually-hidden">Email Address</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address *" 
                        required 
                        aria-required="true"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="company" className="visually-hidden">Company Name</label>
                        <input 
                            type="text" 
                            id="company"
                            name="company" 
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Company Name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone" className="visually-hidden">Phone Number</label>
                        <div className={`phone-input-container ${phoneError ? "error" : ""}`}>
                            <span className="phone-prefix">+91</span>
                            <input 
                                type="tel" 
                                id="phone"
                                name="phone" 
                                value={formData.phone.replace('+91', '')}
                                onChange={(e) => {
                                    const { name, value } = e.target;
                                    const formattedPhone = formatIndianPhoneInput(value);
                                    setFormData(prev => ({
                                        ...prev,
                                        [name]: formattedPhone
                                    }));
                                    
                                    // Validate phone number on change
                                    const error = validatePhone(formattedPhone);
                                    setPhoneError(error);
                                }}
                                placeholder="Enter 10 digit mobile number" 
                                required 
                                aria-required="true"
                                maxLength="10"
                            />
                        </div>
                        {phoneError && <span className="error-message">{phoneError}</span>}
                    </div>
                </div>

                <div className="form-group-single">
                    <label htmlFor="enquiryType" className="visually-hidden">Enquiry Type</label>
                    <CustomDropdown
                        options={enquiryTypes}
                        value={formData.enquiryType}
                        onChange={(value) => setFormData(prev => ({ ...prev, enquiryType: value }))}
                        placeholder="Select enquiry type..."
                        className="enquiry-type-dropdown"
                    />
                </div>

                <div className="form-group-single">
                    <label htmlFor="message" className="visually-hidden">Message</label>
                    <textarea 
                        id="message"
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message *" 
                        required 
                        aria-required="true"
                        rows="5"
                    />
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                    <button 
                        type="button"
                        className="whatsapp-btn"
                        onClick={() => openWhatsAppGeneralEnquiry()}
                        title="Contact us on WhatsApp"
                    >
                        <img src="/whatsapp.png" alt="WhatsApp" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                        WhatsApp
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default ContactForm;

