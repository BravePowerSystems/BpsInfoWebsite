import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../scss/pages/FAQ.scss';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    
    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    
    const faqs = [
        {
            question: "What types of products does Brave Power Systems offer?",
            answer: "Brave Power Systems offers a wide range of products including transmitters, controllers, and IOT & PLC modules. Our products are designed for various industrial applications with a focus on reliability and performance."
        },
        {
            question: "How can I request a quote for a product?",
            answer: "You can request a quote by visiting the specific product page and clicking on the 'Enquire Now' button. Alternatively, you can contact our sales team directly through our Contact page or by calling our customer service number."
        },
        {
            question: "Do you offer customized solutions?",
            answer: "Yes, we specialize in creating customized power solutions tailored to specific industry requirements. Please contact our technical team to discuss your specific needs and requirements."
        },
        {
            question: "What is the warranty period for your products?",
            answer: "Most of our products come with a standard 1-year warranty. Extended warranty options are available for select products. Please refer to the specific product documentation for detailed warranty information."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is processed, you will receive a confirmation email with tracking information. You can also log in to your account on our website to track your order status."
        },
        {
            question: "Do you provide installation services?",
            answer: "Yes, we offer professional installation services for our products. Our team of experienced technicians ensures proper installation and optimal performance of our systems."
        },
        {
            question: "What technical support options are available?",
            answer: "We provide comprehensive technical support through various channels including phone, email, and live chat. Our support team is available during business hours to assist with any technical queries or issues."
        },
        {
            question: "How can I become a distributor for Brave Power Systems?",
            answer: "If you're interested in becoming a distributor, please visit our Contact page and fill out the distributor application form. Our business development team will review your application and get in touch with you."
        }
    ];
    
    return (
        <div className="faq-page">
            <motion.div 
                className="faq-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>Frequently Asked Questions</h1>
                <p className="subtitle">Find answers to common questions about our products and services</p>
            </motion.div>
            
            <div className="faq-content">
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <motion.div 
                            key={index}
                            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div 
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                            >
                                <h3>{faq.question}</h3>
                                <span className="faq-icon">
                                    {activeIndex === index ? '−' : '+'}
                                </span>
                            </div>
                            {activeIndex === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
                
                <motion.div 
                    className="faq-contact"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <h2>Still have questions?</h2>
                    <p>Our support team is here to help you with any other questions you might have.</p>
                    <a href="/contact" className="contact-button">Contact Us</a>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQ;