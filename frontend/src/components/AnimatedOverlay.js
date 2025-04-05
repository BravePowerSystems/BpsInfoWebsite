import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

const AnimatedOverlay = ({ children, delay = 0, duration = 2 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, delay * 1000);

        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" , border: "1px solid black"}}>
          
            {children}

            <motion.div
                initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
                animate={
                    isVisible
                        ? { clipPath: "inset(0% 0% 0% 0%)" }
                        : { clipPath: "inset(100% 0% 0% 0%)" }
                }
                transition={{
                    duration: duration,
                    ease: "easeInOut",
                }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "black",
                    zIndex: 10,
                }}
            />
        </div>
    );
};

export default AnimatedOverlay;
