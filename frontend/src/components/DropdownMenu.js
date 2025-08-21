import "../scss/components/DropdownMenu.scss";
import { motion } from "framer-motion";

function DropdownMenu({ element }) {
    return (
        <motion.div 
            className="dropdown-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, type: "tween" }}}
        >
            {element}
        </motion.div>
    );
}

export default DropdownMenu;
