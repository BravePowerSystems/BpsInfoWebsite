import React from "react";
import "../scss/components/Breadcrumbs.scss";
import "../scss/pages/Home.scss";
import PipelineBackground from "../components/PipelineBackground";
import { motion } from "framer-motion";
function Home() {
    return (
        <motion.div className="home"
        initial={{ opacity: 0}}
        animate={{ opacity: 1, transition: { duration: 2, delay: 0.5} }}>
            <PipelineBackground />
            <h1>
                Pipeline 
            </h1>
        </motion.div>
    );
}
export default Home;