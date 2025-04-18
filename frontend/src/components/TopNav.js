import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import MenuPopUp from "./MenuPopUp";
import { motion } from "motion/react";
import ProductsData from "../Pages/ProductsData";

const ProductsList = ({ onLinkClick }) => {
    return ProductsData.map((categoryObj) => {
        const [categoryName, products] = Object.entries(categoryObj)[0];

        return (
            <ul key={categoryName}>
                <Link to={`/Products/${categoryName}`} onClick={onLinkClick}>
                    {categoryName.replace(/[^a-zA-Z0-9]/g, " ")}
                </Link>
                {products.map((product) => (
                    <li key={product.name}>
                        <Link to={product.link} onClick={onLinkClick}>
                            {product.title.replace(/[^a-zA-Z0-9]/g, " ")}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    });
};

const ResourcesList = ({ onLinkClick }) => {
    return (
        <ul className="resources-list">
            <li>
                <Link to="/blog" onClick={onLinkClick}>
                    Blog
                </Link>
            </li>
            <li>
                <Link to="/case-studies" onClick={onLinkClick}>
                    Case Studies
                </Link>
            </li>
        </ul>
    );
};

export default function TopNav() {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const timeoutRef = useRef(null);

    const handleMouseEnter = (dropdown) => {
        setActiveDropdown(dropdown);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 200);
    };

    const handleDropdownMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleDropdownMouseLeave = () => {
        handleMouseLeave();
    };

    const handleCloseDropdown = () => {
        setActiveDropdown(null);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
            >
                <div className="top-nav">
                    <div className="container">
                        <Link to="/">
                            <div className="logo">
                                <div className="brave">
                                    <img
                                        src="../images/bpsCompanyIcon.png"
                                        alt="BPS Logo"
                                    />
                                    <span>BRAVE</span>
                                </div>
                                <div className="divider"></div>
                                <div className="power-systems">
                                    POWER SYSTEMS
                                </div>
                            </div>
                        </Link>

                        <div className="nav-content">
                            <ul>
                                <li
                                    onMouseEnter={() =>
                                        handleMouseEnter("products")
                                    }
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Link
                                        to="/Products"
                                        onClick={handleCloseDropdown}
                                    >
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
                                <li
                                    onMouseEnter={() =>
                                        handleMouseEnter("resources")
                                    }
                                    onMouseLeave={handleMouseLeave}
                                    className="resources"
                                >
                                    
                                        RESOURCES
                                        <img
                                            src="../images/arrow_down.svg"
                                            alt=""
                                        />
                                    
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
                                    <img
                                        src="../images/search.svg"
                                        alt="Search"
                                    />
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
            </motion.div>

            {activeDropdown === "products" && (
                <div
                    className="products-dropdown-container"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                >
                    <MenuPopUp
                        element={
                            <ProductsList onLinkClick={handleCloseDropdown} />
                        }
                    />
                </div>
            )}

            {activeDropdown === "resources" && (
                <div
                    className="resources-dropdown-container"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                >
                    <MenuPopUp
                        element={
                            <ResourcesList onLinkClick={handleCloseDropdown} />
                        }
                    />
                </div>
            )}
        </>
    );
}
