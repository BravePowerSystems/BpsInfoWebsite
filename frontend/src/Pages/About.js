import React from 'react';
import { motion } from 'motion/react';
import '../scss/pages/About.scss';

const About = () => {
    return (
        <div className="about-page">
            <motion.div 
                className="about-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>About Brave Power Systems</h1>
                <p className="subtitle">Powering the future with innovative solutions</p>
            </motion.div>
            
            <div className="about-content">
                <motion.section 
                    className="about-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2>Our Story</h2>
                    <p>
                        Founded in 2010, Brave Power Systems has been at the forefront of power 
                        system innovation for over a decade. What started as a small team of 
                        engineers with a vision has grown into a leading provider of power 
                        solutions across multiple industries.
                    </p>
                    <p>
                        Our journey has been defined by a commitment to quality, reliability, 
                        and cutting-edge technology. We believe in creating products that not 
                        only meet but exceed industry standards.
                    </p>
                </motion.section>
                
                <motion.section 
                    className="about-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2>Our Mission</h2>
                    <p>
                        At Brave Power Systems, our mission is to provide reliable, efficient, 
                        and innovative power solutions that empower businesses to achieve their 
                        goals. We are committed to sustainability, quality, and customer satisfaction.
                    </p>
                </motion.section>
                
                <motion.section 
                    className="about-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <h2>Our Values</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <h3>Innovation</h3>
                            <p>We constantly push the boundaries of what's possible in power systems.</p>
                        </div>
                        <div className="value-card">
                            <h3>Quality</h3>
                            <p>We never compromise on the quality of our products and services.</p>
                        </div>
                        <div className="value-card">
                            <h3>Reliability</h3>
                            <p>Our customers depend on our solutions, and we take that responsibility seriously.</p>
                        </div>
                        <div className="value-card">
                            <h3>Sustainability</h3>
                            <p>We're committed to developing eco-friendly power solutions for a better future.</p>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default About;