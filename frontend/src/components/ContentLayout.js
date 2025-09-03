import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const fadeInLeftVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
};

const fadeInRightVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
};

const ContentLayout = ({ 
    type = "case-study", // "case-study" or "blog"
    title,
    client,
    industry,
    duration,
    year,
    heroImage,
    sections = [],
    results = [],
    testimonial = null,
    backLink,
    backLinkText
}) => {
    return (
        <div className="content-layout">
            {/* Hero Section */}
            <motion.div 
                className="content-layout__hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="content-layout__hero-content">
                    {backLink && (
                        <Link to={backLink} className="content-layout__back-link">
                            ← {backLinkText || `Back to ${type === "case-study" ? "Case Studies" : "Blog"}`}
                        </Link>
                    )}
                    <h1 className="content-layout__title">{title}</h1>
                    
                    {type === "case-study" && (
                        <div className="content-layout__meta">
                            {client && (
                                <div className="content-layout__meta-item">
                                    <span className="content-layout__meta-label">Client:</span>
                                    <span className="content-layout__meta-value">{client}</span>
                                </div>
                            )}
                            {industry && (
                                <div className="content-layout__meta-item">
                                    <span className="content-layout__meta-label">Industry:</span>
                                    <span className="content-layout__meta-value">{industry}</span>
                                </div>
                            )}
                            {duration && (
                                <div className="content-layout__meta-item">
                                    <span className="content-layout__meta-label">Duration:</span>
                                    <span className="content-layout__meta-value">{duration}</span>
                                </div>
                            )}
                            {year && (
                                <div className="content-layout__meta-item">
                                    <span className="content-layout__meta-label">Year:</span>
                                    <span className="content-layout__meta-value">{year}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {heroImage && (
                    <div className="content-layout__hero-image">
                        <img src={heroImage} alt={title} className="content-layout__hero-img" />
                    </div>
                )}
            </motion.div>

            {/* Content Sections */}
            {sections.length > 0 && (
                <div className="content-layout__container">
                    <div className="content-layout__sections">
                        {sections.map((section, index) => {
                            const sectionImage = section.images && section.images.length > 0 ? section.images[0] : null;
                            
                            return (
                                <motion.div 
                                    key={section.id || index}
                                    className={`content-layout__section content-layout__section--${section.theme || 'light'}`}
                                    variants={index % 2 === 0 ? fadeInLeftVariants : fadeInRightVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.2 }}
                                >
                                    {/* Image positioned alternately */}
                                    {sectionImage && (
                                        <div className="content-layout__section-image-container">
                                            <img 
                                                src={sectionImage} 
                                                alt={`${section.title} visual`} 
                                                className="content-layout__section-image"
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="content-layout__section-content">
                                        <div className="content-layout__section-header">
                                            <h2 className="content-layout__section-number-value">{section.id || index + 1}</h2>
                                            <h3 className="content-layout__section-title">{section.title}</h3>
                                        </div>

                                        <div className="content-layout__section-text">
                                            <p className="content-layout__section-description">{section.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Results Section */}
            {type === "case-study" && results && results.length > 0 && (
                <motion.div 
                    className="content-layout__results"
                    variants={fadeInUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="content-layout__results-title">Key Results</h2>
                    <div className="content-layout__results-grid">
                        {results.map((result, index) => (
                            <div key={index} className="content-layout__result-item">
                                <div className="content-layout__result-number">{index + 1}</div>
                                <p className="content-layout__result-text">{result}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Testimonial Section */}
            {type === "case-study" && testimonial && (
                <motion.div 
                    className="content-layout__testimonial"
                    variants={fadeInUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <blockquote className="content-layout__testimonial-quote">
                        {testimonial.quote}
                    </blockquote>
                    <div className="content-layout__testimonial-author">
                        <p className="content-layout__testimonial-name">{testimonial.author}</p>
                        <p className="content-layout__testimonial-position">{testimonial.position}</p>
                    </div>
                </motion.div>
            )}

            {/* Call to Action */}
            <motion.div 
                className="content-layout__cta"
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <h2 className="content-layout__cta-title">
                    {type === "case-study" 
                        ? "Ready to transform your business?" 
                        : "Ready to explore IoT solutions?"
                    }
                </h2>
                <p className="content-layout__cta-description">
                    {type === "case-study"
                        ? "Let's discuss how our solutions can address your specific challenges."
                        : "Discover how our IoT and smart technology solutions can drive innovation and efficiency in your industry."
                    }
                </p>
                <button 
                    className="content-layout__cta-button"
                    onClick={() => {
                        window.location.href = '/#contact';
                    }}
                >
                    {type === "case-study" ? "Contact Us" : "Get Started"}
                </button>
            </motion.div>
        </div>
    );
};

export default ContentLayout;
