import React from "react";
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

// Sample blog data - in a real app, this would come from an API
const blogData = [
    {
        id: 1,
        title: "The Future of Industrial IoT: Smart Manufacturing Solutions",
        description: "Discover how IoT sensors and smart monitoring systems are revolutionizing manufacturing processes. Learn about predictive maintenance, real-time data analytics, and how businesses are achieving 35% reduction in downtime through intelligent automation.",
        image: "../pic1.jpeg",
        link: "/blog/industrial-iot-future",
        imageAlt: "Industrial IoT Manufacturing"
    },
    {
        id: 2,
        title: "Smart Energy Management: Reducing Costs with IoT Technology",
        description: "Explore how IoT-powered energy monitoring systems are helping commercial buildings cut energy costs by up to 28%. From smart meters to automated controls, see how intelligent energy management is shaping the future of sustainable business operations.",
        image: "../pic2.jpg",
        link: "/blog/smart-energy-management",
        imageAlt: "Smart Energy Management"
    },
    {
        id: 3,
        title: "Water Conservation in Agriculture: IoT-Driven Irrigation Systems",
        description: "Learn about automated irrigation solutions that improve water efficiency by 40% in agricultural operations. Discover how soil moisture sensors, weather data integration, and smart controllers are transforming traditional farming practices.",
        image: "../pic3.jpeg",
        link: "/blog/agriculture-water-conservation",
        imageAlt: "Agricultural IoT Solutions"
    },
    {
        id: 4,
        title: "Connected Logistics: GPS Asset Tracking for Modern Supply Chains",
        description: "See how GPS-based asset tracking systems are improving delivery times and reducing lost shipments by 65%. From real-time location monitoring to predictive route optimization, explore the technologies driving logistics innovation.",
        image: "../pic4.jpg",
        link: "/blog/connected-logistics-tracking",
        imageAlt: "Connected Logistics Tracking"
    }
];

function Blog() {
    return (
        <div className="content-section">
            <motion.div 
                className="content-section__header"
                {...motionConfig.headerContainer}
            >
                <h1 className="content-section__title">Blog</h1>
                <p className="content-section__subtitle">Discover all our blog posts</p>
                <p className="content-section__description">
                    Explore insights, case studies, and industry trends in IoT and smart technology. From technical deep-dives to business transformation stories, discover how our solutions are shaping the future.
                </p>
            </motion.div>

            <motion.div 
                className="content-section__list"
                {...motionConfig.contentList}
            >
                {blogData.map((blog, index) => (
                    <ContentCard
                        key={blog.id}
                        {...blog}
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

export default Blog;