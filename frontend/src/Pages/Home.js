import React from "react";
import "../scss/components/Breadcrumbs.scss";
import "../scss/pages/Home.scss";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";

function Home() {
    return (
        <>
            <motion.div
                className="home"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    transition: { duration: 2, delay: 0.5 },
                }}
            >
                <HeroSection />
            </motion.div>
        </>
    );
}
export default Home;
