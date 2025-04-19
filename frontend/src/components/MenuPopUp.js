import React from "react";
import "../scss/components/MenuPopUp.scss";
import { motion } from "motion/react";

function MenuPopUp({ element }) {
    return (
        <motion.div 
            className="MenuPopUp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, type: "tween" }}}
        >
            {element}
        </motion.div>
    );
}

export default MenuPopUp;
