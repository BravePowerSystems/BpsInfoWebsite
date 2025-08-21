import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../scss/pages/CaseStudy.scss";

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

function CaseStudy() {
    const { caseStudySlug } = useParams();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // This would normally fetch the specific case study data based on the slug
    // For now, we'll use placeholder data
    const caseStudyData = {
        title: "Industrial IoT Implementation for Manufacturing",
        client: "TechManufacture Inc.",
        industry: "Manufacturing",
        duration: "6 months",
        year: "2023",
        heroImage: "../case-hero.jpg",
        sections: [
            {
                id: 1,
                title: "INTRODUCTION",
                description: "TechManufacture Inc. was facing significant challenges with equipment downtime and maintenance costs. Their legacy systems provided limited visibility into machine performance, resulting in unexpected failures and production delays.",
                images: ["../pic1.jpeg", "../pic2.jpg", "../pic3.jpeg"],
                rightImage: "../pic4.jpg",
                theme: "light"
            },
            {
                id: 2,
                title: "PROBLEM",
                description: "The client was experiencing an average of 12 hours of unplanned downtime per month, costing approximately $25,000 per hour in lost production. Maintenance was primarily reactive, and there was no system in place to predict potential failures or optimize maintenance schedules.",
                images: ["../pic1.jpeg", "../pic2.jpg", "../pic3.jpeg"],
                theme: "dark"
            },
            {
                id: 3,
                title: "SOLUTION",
                description: "We implemented a comprehensive IoT solution with sensors on critical equipment, connected to a central monitoring platform. The system collected real-time data on temperature, vibration, power consumption, and other key parameters. Our custom analytics engine used machine learning to identify patterns that preceded failures.",
                images: ["../pic1.jpeg", "../pic2.jpg", "../pic3.jpeg"],
                rightImage: "../pic4.jpg",
                theme: "light"
            },
            {
                id: 4,
                title: "IMPACT",
                description: "Within three months of implementation, unplanned downtime was reduced by 35%. Maintenance costs decreased by 28%, and overall equipment effectiveness (OEE) improved by 15%. The client was able to transition from reactive to predictive maintenance, optimizing their maintenance schedule and resource allocation.",
                images: ["../pic1.jpeg", "../pic2.jpg", "../pic3.jpeg"],
                theme: "dark"
            },
            {
                id: 5,
                title: "CONCLUSION",
                description: "The IoT implementation transformed the client's operations, providing data-driven insights that enabled better decision-making. The return on investment was achieved within 9 months, and the system continues to deliver value through ongoing optimization and expanded capabilities.",
                images: ["../pic1.jpeg", "../pic2.jpg", "../pic3.jpeg"],
                rightImage: "../pic4.jpg",
                theme: "light"
            }
        ],
        results: [
            "35% reduction in unplanned downtime",
            "28% decrease in maintenance costs",
            "15% improvement in overall equipment effectiveness",
            "ROI achieved within 9 months"
        ],
        testimonial: {
            quote: "The IoT solution implemented by the team has transformed our maintenance operations. We now have visibility into our equipment health that we never had before, allowing us to prevent issues before they cause downtime.",
            author: "Sarah Johnson",
            position: "Operations Director, TechManufacture Inc."
        }
    };

    return (
        <div className="case-study-page">
            <motion.div 
                className="case-study-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="hero-content">
                    <Link to="/case-studies" className="back-link">
                        ← Back to Case Studies
                    </Link>
                    <h1>{caseStudyData.title}</h1>
                    <div className="case-meta">
                        <div className="meta-item">
                            <span className="label">Client:</span>
                            <span className="value">{caseStudyData.client}</span>
                        </div>
                        <div className="meta-item">
                            <span className="label">Industry:</span>
                            <span className="value">{caseStudyData.industry}</span>
                        </div>
                        <div className="meta-item">
                            <span className="label">Duration:</span>
                            <span className="value">{caseStudyData.duration}</span>
                        </div>
                        <div className="meta-item">
                            <span className="label">Year:</span>
                            <span className="value">{caseStudyData.year}</span>
                        </div>
                    </div>
                </div>
                <div className="hero-image-container">
                    <img src={caseStudyData.heroImage} alt={caseStudyData.title} className="hero-image" />
                </div>
            </motion.div>

            <div className="container">
                <div className="components">
                    {caseStudyData.sections.map((section, index) => (
                        section.theme === "light" ? (
                            <motion.div 
                                key={section.id}
                                className="component1"
                                variants={fadeInLeftVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="left-images">
                                    {section.images.map((img, i) => (
                                        <img 
                                            key={i} 
                                            src={img} 
                                            alt={`Case study visual ${i+1}`} 
                                            className={`image${i+1}`}
                                        />
                                    ))}
                                </div>

                                <div className="content">
                                    <div className="serialNumber">
                                        <div className="square"></div>
                                        <p>NO.</p>
                                        <h1>{section.id}</h1>
                                    </div>

                                    <div className="light-theme">
                                        <p className="title">{section.title}</p>
                                        <p className="description">{section.description}</p>
                                    </div>
                                </div>

                                {section.rightImage && (
                                    <div className="right-image">
                                        <img src={section.rightImage} alt="Additional visual" className="image4"/>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key={section.id}
                                className="component2"
                                variants={fadeInRightVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="content1">
                                    <div className="serialNumber1">
                                        <div className="square1"></div>
                                        <p>NO.</p>
                                        <h1>{section.id}</h1>
                                    </div>

                                    <div className="dark-theme">
                                        <p className="title1">{section.title}</p>
                                        <p className="description1">{section.description}</p>
                                    </div>
                                </div>

                                <div className="left-images1">
                                    {section.images.map((img, i) => (
                                        <img 
                                            key={i} 
                                            src={img} 
                                            alt={`Case study visual ${i+1}`} 
                                            className={`image${i+2}2`}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )
                    ))}
                </div>
            </div>

            <motion.div 
                className="case-study-results"
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2>Key Results</h2>
                <div className="results-grid">
                    {caseStudyData.results.map((result, index) => (
                        <div key={index} className="result-item">
                            <div className="result-number">{index + 1}</div>
                            <p>{result}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div 
                className="case-study-testimonial"
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="quote-mark">"</div>
                <blockquote>
                    {caseStudyData.testimonial.quote}
                </blockquote>
                <div className="testimonial-author">
                    <p className="author-name">{caseStudyData.testimonial.author}</p>
                    <p className="author-position">{caseStudyData.testimonial.position}</p>
                </div>
            </motion.div>

            <motion.div 
                className="case-study-cta"
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <h2>Ready to transform your business?</h2>
                <p>Let's discuss how our solutions can address your specific challenges.</p>
                <Link to="/contact" className="contact-button">Contact Us</Link>
            </motion.div>
        </div>
    );
}

export default CaseStudy;
