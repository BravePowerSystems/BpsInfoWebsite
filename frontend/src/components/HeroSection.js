import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../scss/components/HeroSection.scss";
import { motion } from "framer-motion";

export const fadeInUpVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
};

const motionConfig = {
    logo: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.4 },
    },
    description: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.6 },
    },
    ctaContainer: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.8 },
    },
};
export default function HeroSection() {
    const transformRef = useRef(null);  // Reference to the transform wrapper

   

    useEffect(() => {
        const handleMouseMove = (e) => {  // Event handler for mouse movement
            if (!transformRef.current) return;

            const { left, top, width, height } =
                transformRef.current.getBoundingClientRect();  // Get the bounding rectangle of the transform wrapper
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            transformRef.current.style.transform = `  
                perspective(1000px)
                rotateY(${x * 5}deg)
                rotateX(${y * -5}deg)
            `;                                   
        };

        window.addEventListener("mousemove", handleMouseMove);  // Attach event listener

        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="hero-section">
            <div className="hero-transform-wrapper" ref={transformRef}>
                <div className="hero-content">
                    <motion.div
                        {...motionConfig.logo}
                        className="hero-logo"
                    >
                        <span className="hero-logo-text">
                            BRAVE POWER SYSTEMS
                        </span>
                    </motion.div>

                    <motion.p
                        {...motionConfig.description}
                        className="hero-description"
                    >
                        We develop cutting-edge IoT solutions that transform
                        industrial operations, smart cities, and connected homes
                        through secure, scalable device networks.
                    </motion.p>

                    <motion.div
                        {...motionConfig.ctaContainer}
                        className="hero-cta-container"
                    >
                        <Link to="/Products">
                            <button className="hero-cta-button primary">
                                Explore Products
                            </button>
                        </Link>
                        <a href="#contact-us">
                            <button className="hero-cta-button secondary">
                                Contact Us
                            </button>
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
