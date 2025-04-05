import React, { useState } from "react";
import "../scss/components/EnquirePopup.scss";
function EnquirePopup({ productName, onClose }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        phone: "",
        enquiryType: "general",
    });

    const enquiryTypes = [
        { value: "general", label: "General Enquiry" },
        { value: "technical", label: "Technical Support" },
        { value: "quote", label: "Request a Quote" },
        { value: "custom", label: "Custom Solution" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert(
            `Thank you for your enquiry about ${productName}! We'll contact you soon.`
        );
        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close" onClick={onClose}>
                    ×
                </button>

                <h3>Enquire about {productName}</h3>
                <p className="popup-subtitle">
                    Reach out and we will get in touch within 24 hours
                </p>

                <form onSubmit={handleSubmit} className="enquiry-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name*</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last Name*</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
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

                    <div className="form-group">
                        <label htmlFor="enquiryType">Enquiry Type*</label>
                        <select
                            id="enquiryType"
                            name="enquiryType"
                            value={formData.enquiryType}
                            onChange={handleChange}
                            required
                        >
                            {enquiryTypes.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            Submit Enquiry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EnquirePopup;
