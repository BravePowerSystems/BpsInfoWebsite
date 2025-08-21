import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../scss/pages/CaseStudiesPreview.scss";
import { fadeInUpVariants } from "../components/HeroSection";

const motionConfig = {
    headerContainer: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.4 },
    },
    caseStudiesContainer: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.6 },
    },
};

// Sample case studies data - in a real app, this would come from an API
const caseStudiesData = [
    {
        id: 1,
        title: "Industrial IoT Implementation for Manufacturing",
        summary: "How we helped a manufacturing company reduce downtime by 35% through IoT sensors and predictive maintenance.",
        image: "../case1.jpg",
        slug: "industrial-iot-implementation"
    },
    {
        id: 2,
        title: "Smart Energy Monitoring System",
        summary: "Implementing a comprehensive energy monitoring solution that reduced energy costs by 28% for a commercial building complex.",
        image: "../case2.jpg",
        slug: "smart-energy-monitoring"
    },
    {
        id: 3,
        title: "Water Management Solution for Agriculture",
        summary: "Developing an automated irrigation system that improved water efficiency by 40% for a large agricultural operation.",
        image: "../case3.jpg",
        slug: "water-management-agriculture"
    },
    {
        id: 4,
        title: "Remote Asset Tracking for Logistics",
        summary: "Creating a GPS-based asset tracking system that improved delivery times and reduced lost shipments by 65%.",
        image: "../case4.jpg",
        slug: "remote-asset-tracking"
    }
];

function CaseStudiesPreview() {
    return (
        <div className="case-studies-preview-container">
            <motion.div 
                className="case-studies-header"
                {...motionConfig.headerContainer}
            >
                <h1 className="case-studies-title">Case Studies</h1>
                <p className="case-studies-subtitle">Explore our successful implementations</p>
                <p className="case-studies-description">
                    Discover how our solutions have helped businesses across various industries 
                    overcome challenges and achieve significant improvements in efficiency, 
                    productivity, and cost savings.
                </p>
            </motion.div>

            <motion.div 
                className="case-studies-list"
                {...motionConfig.caseStudiesContainer}
            >
                {caseStudiesData.map((caseStudy) => (
                    <React.Fragment key={caseStudy.id}>
                        <div className="case-study-card">
                            <div className="case-study-content">
                                <h3 className="case-study-title">{caseStudy.title}</h3>
                                <div className="hr"></div>
                                <p className="case-study-summary">{caseStudy.summary}</p>
                                <Link 
                                    to={`/case-studies/${caseStudy.slug}`} 
                                    className="read-more"
                                >
                                    Read more
                                </Link>
                            </div>
                            <img 
                                src={caseStudy.image} 
                                alt={caseStudy.title} 
                                className="case-study-image"
                            />
                        </div>
                        <div className="case-study-breaker"></div>
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    );
}

export default CaseStudiesPreview;