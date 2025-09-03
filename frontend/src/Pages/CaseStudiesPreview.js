import React from "react";
import { Link } from "react-router-dom";
import ContentCard from "../components/ContentCard";
import "../scss/components/ContentCard.scss";
import { motion } from "framer-motion";
import { fadeInUpVariants } from "../components/HeroSection";

const motionConfig = {
    headerContainer: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.4 },
    },
    contentList: {
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
        description: "How we helped a manufacturing company reduce downtime by 35% through IoT sensors and predictive maintenance.",
        image: "../case1.jpg",
        link: "/case-studies/industrial-iot-implementation",
        imageAlt: "Industrial IoT Implementation"
    },
    {
        id: 2,
        title: "Smart Energy Monitoring System",
        description: "Implementing a comprehensive energy monitoring solution that reduced energy costs by 28% for a commercial building complex.",
        image: "../case2.jpg",
        link: "/case-studies/smart-energy-monitoring",
        imageAlt: "Smart Energy Monitoring"
    },
    {
        id: 3,
        title: "Water Management Solution for Agriculture",
        description: "Developing an automated irrigation system that improved water efficiency by 40% for a large agricultural operation.",
        image: "../case3.jpg",
        link: "/case-studies/water-management-agriculture",
        imageAlt: "Water Management Solution"
    },
    {
        id: 4,
        title: "Remote Asset Tracking for Logistics",
        description: "Creating a GPS-based asset tracking system that improved delivery times and reduced lost shipments by 65%.",
        image: "../case4.jpg",
        link: "/case-studies/remote-asset-tracking",
        imageAlt: "Remote Asset Tracking"
    }
];

function CaseStudiesPreview() {
    return (
        <div className="content-section">
            <motion.div 
                className="content-section__header"
                {...motionConfig.headerContainer}
            >
                <h1 className="content-section__title">Case Studies</h1>
                <p className="content-section__subtitle">Explore our successful implementations</p>
                <p className="content-section__description">
                    Discover how our solutions have helped businesses across various industries 
                    overcome challenges and achieve significant improvements in efficiency, 
                    productivity, and cost savings.
                </p>
            </motion.div>

            <motion.div 
                className="content-section__list"
                {...motionConfig.contentList}
            >
                {caseStudiesData.map((caseStudy, index) => (
                    <ContentCard
                        key={caseStudy.id}
                        {...caseStudy}
                        isReversed={index % 2 === 1}
                        motionProps={{
                            variants: fadeInUpVariants,
                            initial: "hidden",
                            whileInView: "visible",
                            viewport: { once: true },
                            transition: { duration: 0.8, delay: index * 0.2 }
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
}

export default CaseStudiesPreview;