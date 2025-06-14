import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import Skeleton from "react-loading-skeleton";
import DropdownMenu from "./DropdownMenu";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { productService } from "../services/productService";

const ProductsList = ({ onLinkClick }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check localStorage for cached data
        const cachedData = localStorage.getItem("products");
        if (cachedData) {
            setCategories(JSON.parse(cachedData));
            setLoading(false);
            return;
        }

        const fetchProducts = async () => {
            try {
                const { data } = await productService.getAllProducts();
                setCategories(data);
                // Cache data in localStorage with a TTL (e.g., 1 hour)
                localStorage.setItem("products", JSON.stringify(data));
                localStorage.setItem(
                    "productsCacheTime",
                    Date.now().toString()
                );
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Memoize the cleaned categories to prevent unnecessary re-renders
    const formattedCategories = useMemo(() => {
        return categories.map((categoryObj) => {
            const [categoryName, products] = Object.entries(categoryObj)[0];
            const cleanedCategory = categoryName
                .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters, keep spaces
                .trim();
            const formattedProducts = products.map((product) => ({
                ...product,
                cleanedTitle: product.title
                    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
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

    if (loading) {
        return (
            <div aria-live="polite">
                <Skeleton count={5} height={200} />
            </div>
        );
    }

    if (error) {
        return (
            <div role="alert" className="error">
                Error: {error}
            </div>
        );
    }

    return (
        <>
            {formattedCategories.map(
                ({ categoryName, cleanedCategory, products }) => (
                    <ul key={categoryName} className="category-list">
                        <Link
                            to={`/Products/${categoryName}`}
                            onClick={onLinkClick}
                            className="category-link"
                            aria-label={`View all products in ${cleanedCategory}`}
                        >
                            {cleanedCategory}
                        </Link>
                        {products.map((product) => (
                            <li key={product._id || product.title}>
                                <Link
                                    to={`/Products/${categoryName}/${product.slug}`}
                                    onClick={onLinkClick}
                                    className="product-link"
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
                                    <img src="../../search.svg" alt="Search" />
                                </div>
                                <div className="save-icon">
                                    <Link to="/wishlist">
                                        <img src="../../save.svg" alt="Save" />
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
