import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import DropdownMenu from "./DropdownMenu";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { productService } from "../services/productService";

// --- COMPONENTS ---
const ProductsList = ({ onLinkClick }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await productService.getAllProducts();
                setCategories(data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return categories.map((categoryObj) => {
        const [categoryName, products] = Object.entries(categoryObj)[0];
        const cleanedCategory = categoryName.replace(/[^a-zA-Z0-9]/g, " ");

        return (
            <ul key={categoryName}>
                <Link to={`/Products/${categoryName}`} onClick={onLinkClick}>
                    {cleanedCategory}
                </Link>
                {products.map((product) => (
                    <li key={product._id || product.title}>
                        <Link
                            to={`/Products/${categoryName}/${product.title.replace(
                                /\s+/g,
                                "-"
                            )}`}
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

const ResourcesList = ({ onLinkClick }) => (
    <ul className="resources-list">
        {["/blog", "/case-studies"].map((path) => (
            <li key={path}>
                <Link to={path} onClick={onLinkClick}>
                    {path.replace("/", "").replace("-", " ").toUpperCase()}
                </Link>
            </li>
        ))}
    </ul>
);

// --- MAIN NAV COMPONENT ---
export default function TopNav() {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const timeoutRef = useRef(null);
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("login");

    const openDropdown = (type) => setActiveDropdown(type);
    const closeDropdown = () => setActiveDropdown(null);

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(closeDropdown, 100);
    };

    const clearDropdownTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleAuthClick = (mode) => {
        setAuthMode(mode);
        setShowAuthModal(true);
    };

    const NavLink = ({ to, children, withDropdown }) => (
        <li
            onMouseEnter={() => withDropdown && openDropdown(withDropdown)}
            onMouseLeave={handleMouseLeave}
            className={withDropdown}
        >
            <Link to={to} onClick={closeDropdown}>
                {children}
                {withDropdown && (
                    <img src="../../arrow_down.svg" alt="Dropdown arrow" />
                )}
            </Link>
        </li>
    );

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
                                        src="../../bpsCompanyIcon.png"
                                        alt="BPS Logo"
                                    />
                                    <span>BRAVE</span>
                                </div>
                                <div className="divider" />
                                <div className="power-systems">
                                    POWER SYSTEMS
                                </div>
                            </div>
                        </Link>

                        <div className="nav-content">
                            <ul>
                                <NavLink to="/Products" withDropdown="products">
                                    PRODUCTS
                                </NavLink>
                                <NavLink to="/tools">TOOLS</NavLink>
                                <NavLink withDropdown="resources">
                                    RESOURCES
                                </NavLink>
                                <NavLink to="/about">ABOUT US</NavLink>
                                <NavLink to="/support">SUPPORT</NavLink>
                                <NavLink to="/contact">CONTACT US</NavLink>
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
                                        src="../../search.svg"
                                        alt="Search"
                                    />
                                </div>
                                <div className="save-icon">
                                    <Link to="/wishlist">
                                        <img
                                            src="../../save.svg"
                                            alt="Save"
                                        />
                                    </Link>
                                </div>
                                <div className="whatsapp-icon">
                                    <img
                                        src="../../whatsapp.png"
                                        alt="WhatsApp"
                                    />
                                </div>

                                {isAuthenticated && (
                                    <div
                                        className="profile-icon"
                                        onMouseEnter={() =>
                                            openDropdown("user")
                                        }
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <img
                                            src="..//profile.png"
                                            alt="Profile"
                                        />
                                        {activeDropdown === "user" && (
                                            <div
                                                className="user-dropdown"
                                                onMouseEnter={
                                                    clearDropdownTimeout
                                                }
                                                onMouseLeave={handleMouseLeave}
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
                                                    onClick={logout}
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
                    onMouseEnter={clearDropdownTimeout}
                    onMouseLeave={handleMouseLeave}
                >
                    <DropdownMenu
                        element={<ProductsList onLinkClick={closeDropdown} />}
                    />
                </div>
            )}

            {activeDropdown === "resources" && (
                <div
                    className="resources-dropdown-container"
                    onMouseEnter={clearDropdownTimeout}
                    onMouseLeave={handleMouseLeave}
                >
                    <DropdownMenu
                        element={<ResourcesList onLinkClick={closeDropdown} />}
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
