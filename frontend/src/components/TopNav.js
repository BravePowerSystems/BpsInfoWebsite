import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DropdownMenu from "./DropdownMenu";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";
import Sidebar from "./Sidebar";
import { openWhatsAppGeneralEnquiry } from "../utils/whatsappHelper";

const ProductsList = ({ onLinkClick, categories, loading, error }) => {
    // Memoize the cleaned categories to prevent unnecessary re-renders
    const formattedCategories = useMemo(() => {
        return categories.map((categoryObj) => {
            const [categoryName, products] = Object.entries(categoryObj)[0];
            // Improved category cleaning that preserves multiple words and spaces
            const cleanedCategory = categoryName
                .replace(/[-_]/g, " ") // Convert hyphens and underscores to spaces
                .replace(/\s+/g, " ") // Normalize multiple spaces to single space
                .trim();
            const formattedProducts = products.map((product) => ({
                ...product,
                cleanedTitle: product.title
                    .replace(/[-_]/g, " ") // Convert hyphens and underscores to spaces
                    .replace(/\s+/g, " ") // Normalize multiple spaces to single space
                    .trim(),
                slug: product.title.replace(/\s+/g, "-"), // Create URL-friendly slug
            }));
            return {
                categoryName,
                cleanedCategory,
                products: formattedProducts,
            };
        });
    }, [categories]);

    if (loading) return null;
    if (error) return null;

    return (
        <>
            {formattedCategories.map(
                ({ categoryName, cleanedCategory, products }) => (
                    <ul key={categoryName} className="dropdown-category-list">
                        <Link
                            to={`/Products/${categoryName}`}
                            onClick={onLinkClick}
                            className="dropdown-category-link"
                            aria-label={`View all products in ${cleanedCategory}`}
                        >
                            {cleanedCategory}
                        </Link>
                        {products.map((product) => (
                            <li key={product._id || product.title}>
                                <Link
                                    to={`/Products/${categoryName}/${product.slug}`}
                                    onClick={onLinkClick}
                                    className="dropdown-product-link"
                                    aria-label={`View ${product.cleanedTitle}`}
                                >
                                    {product.cleanedTitle}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )
            )}
        </>
    );
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
    const { categories: productCategories, loading: productsLoading, error: productsError } = useProducts();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const openSidebar = () => setSidebarOpen(true);
    const closeSidebar = () => setSidebarOpen(false);

    // Remove the local product fetching logic since it's now handled by ProductsContext

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
                                <NavLink withDropdown="resources">
                                    RESOURCES
                                </NavLink>
                                <NavLink to="/about">ABOUT US</NavLink>
                                <NavLink to="/faqs">FAQs</NavLink>

                                
                                
                                    <a href="/#contact" className="contact-us-link">CONTACT US</a>
                                

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
                                 {!isAdmin && (
                                <div className="save-icon">
                                    <Link to="/wishlist">
                                        <img src="../../save.svg" alt="Save" />
                                    </Link>
                                </div>
                                )}
                               {!isAdmin && (
                                    <div className="whatsapp-icon">
                                        <a
                                            onClick={() => openWhatsAppGeneralEnquiry()}
                                            title="Contact us on WhatsApp"
                                            style={{ 
                                                cursor: 'pointer', 
                                                textDecoration: 'none',
                                                background: 'none',
                                                border: 'none',
                                                padding: 0
                                            }}
                                        >
                                            <img
                                                src="../../whatsapp.png"
                                                alt="WhatsApp"
                                            />
                                        </a>
                                    </div>
                                )}

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

                                <div className="hamburger-menu" onClick={openSidebar}>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {activeDropdown === "products" && !productsLoading && !productsError && (
                <div
                    className={`products-dropdown-container ${isAuthenticated ? (isAdmin ? 'is-admin' : 'is-user') : 'logged-out'}`}
                    onMouseEnter={clearDropdownTimeout}
                    onMouseLeave={handleMouseLeave}
                >
                    <DropdownMenu
                        element={<ProductsList onLinkClick={closeDropdown} categories={productCategories} loading={productsLoading} error={productsError} />}
                    />
                </div>
            )}

            {activeDropdown === "resources" && (
                <div
                    className={`resources-dropdown-container ${isAuthenticated ? (isAdmin ? 'is-admin' : 'is-user') : 'logged-out'}`}
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
            <Sidebar open={sidebarOpen} onClose={closeSidebar} />
        </>
    );
}