
import React, { useState, useRef, useEffect } from "react";

import { Link } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import { motion } from "motion/react";
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { productService } from "../services/productService";

const ProductsList = ({ onLinkClick }) => {
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getAllProducts();
                const { data } = response;
                setCategories(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return categories.map((categoryObj) => {
        const [categoryName, products] = Object.entries(categoryObj)[0];  // Object.entries return an array of arrays, each containing a key-value pair from the object.

        return (
            <ul key={categoryName}>
                <Link to={`/Products/${categoryName}`} onClick={onLinkClick}>
                    {categoryName.replace(/[^a-zA-Z0-9]/g, " ")}
                </Link>
                {products.map((product) => (
                    <li key={product._id || product.title}>
                        <Link 
                            to={`/Products/${categoryName}/${product.title.replace(/\s+/g, '-')}`} 
                            onClick={onLinkClick}
                        >
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
    const {  isAuthenticated, isAdmin, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    
    const handleAuthClick = (mode) => {
        setAuthMode(mode);
        setShowAuthModal(true);
    };

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

    const handleLogout = () => {
        logout();
        // The notification will be triggered from the AuthContext logout function
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
                                {!isAuthenticated && (
                                    <div className="auth-buttons">
                                        <button
                                            onClick={() =>
                                                handleAuthClick("login")
                                            }
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleAuthClick("register")
                                            }
                                        >
                                            Register
                                        </button>
                                    </div>
                                )}
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
                                    <Link to="/wishlist">
                                        <img
                                            src="../images/save.svg"
                                            alt="Save"
                                        />
                                    </Link>
                                </div>

                                <div className="whatsapp-icon">
                                    <img
                                        src="../images/whatsapp.png"
                                        alt="WhatsApp"
                                    />
                                </div>
                                {isAuthenticated && (
                                    <div
                                        className="profile-icon"
                                        onMouseEnter={() =>
                                            handleMouseEnter("user")
                                        }
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <img
                                            src="../images/profile.png"
                                            alt="Profile"
                                        />
                                        {activeDropdown === "user" && (
                                            <div
                                                className="user-dropdown"
                                                onMouseEnter={
                                                    handleDropdownMouseEnter
                                                }
                                                onMouseLeave={
                                                    handleDropdownMouseLeave
                                                }
                                            >
                                                <Link to="/dashboard">
                                                    Dashboard
                                                </Link>
                                                <Link to="/profile">
                                                    Profile
                                                </Link>
                                                {isAdmin && (
                                                    <Link to="/admin">
                                                        Admin Panel
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={handleLogout}
                                                    className="logout-button"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
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
                    <DropdownMenu
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
                    <DropdownMenu
                        element={
                            <ResourcesList onLinkClick={handleCloseDropdown} />
                        }
                    />
                </div>
            )}
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    initialMode={authMode}
                />
            )}
        </>
    );
}
