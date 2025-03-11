import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import ProductsDropDown from "./ProductsDropDown";

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

    return (
        <div>
            <div className="top-nav">
                <div className="container">
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

                    <div className="nav-content">
                        <ul>
                            <li
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Link to="/Products">
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

            {/* Show dropdown only if hovered */}
            {isHovered && (
                <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <ProductsDropDown />
                </div>
            )}
        </div>
    );
}
