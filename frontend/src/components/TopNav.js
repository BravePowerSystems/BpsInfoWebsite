import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import ProductsDropDown from "./ProductsDropDown";
import {motion} from "motion/react";
export default function TopNav() {
    const [isHovered, setIsHovered] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsHovered(false);
        }, 200);
    };

    const handleCloseDropdown = () => {
        setTimeout(() => {
            setIsHovered(false);
        }, 0); 
    };

    return (
        <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1,delay: 1, ease: "easeOut" }}
        exit={ { opacity: 0 }}
        >
            <div className="top-nav">
                <div className="container">
                    <Link to="/" >
                        <div className="logo">
                            <div className="brave">
                                <img
                                    src="../images/bpsCompanyIcon.png"
                                    alt="BPS Logo"
                                />
                                <span>BRAVE</span>
                            </div>
                            <div className="divider"></div>
                            <div className="power-systems">POWER SYSTEMS</div>
                        </div>
                    </Link>

                    <div className="nav-content">
                        <ul>
                            <li
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Link to="/Products" onClick={handleCloseDropdown}>
                                    PRODUCTS
                                    <img
                                        src="../images/arrow_down.svg"
                                        alt=""
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link to="/tools">TOOLS</Link>
                            </li>
                            <li>
                                <Link to="/resources">
                                    RESOURCES
                                    <img
                                        src="../images/arrow_down.svg"
                                        alt=""
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link to="/about">ABOUT US</Link>
                            </li>
                            <li>
                                <Link to="/support">SUPPORT</Link>
                            </li>
                            <li>
                                <Link to="/contact">CONTACT US</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="icons">
                        <div className="icon-container">
                            <div className="search-icon">
                                <img src="../images/search.svg" alt="Search" />
                            </div>
                            <div className="save-icon">
                                <img src="../images/save.svg" alt="Save" />
                            </div>
                            <div className="whatsapp-icon">
                                <img
                                    src="../images/whatsapp.png"
                                    alt="WhatsApp"
                                />
                            </div>
                            <div className="hamburger-menu">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isHovered && (
                <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <ProductsDropDown onLinkClick={handleCloseDropdown} />
                </div>
            )}
        </motion.div>
    );
}
