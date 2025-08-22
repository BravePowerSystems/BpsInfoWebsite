import React, { useState, useEffect, useMemo } from "react";
import "../scss/components/Sidebar.scss";
import { Link } from "react-router-dom";
import { productService } from "../services/productService";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export default function Sidebar({ open, onClose }) {
    // --- Authentication state ---
    const { isAuthenticated } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("login");

    // --- Products logic ---
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Custom accordion state
    const [productsOpen, setProductsOpen] = useState(false);
    const [sectionOpen, setSectionOpen] = useState({}); // {categoryName: true, ...}

    useEffect(() => {
        let isMounted = true;
        const fetchProducts = async () => {
            try {
                const { data } = await productService.getAllProducts();
                if (isMounted) {
                    setCategories(data);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                if (isMounted) {
                    setError("Failed to load products. Please try again later.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchProducts();
        return () => {
            isMounted = false;
        };
    }, []);

    // Map categories to a lookup for easy access
    const categoryMap = useMemo(() => {
        const map = {};
        if (categories && Array.isArray(categories)) {
            categories.forEach((categoryObj) => {
                const [categoryName, products] = Object.entries(categoryObj)[0];
                map[categoryName] = products.map((product) => ({
                    ...product,
                    cleanedTitle: product.title.replace(/[^a-zA-Z0-9\s]/g, "").trim(),
                    slug: product.title.replace(/\s+/g, "-"),
                }));
            });
        }
        return map;
    }, [categories]);

    // Generate dynamic product sections from API data
    const productSections = useMemo(() => {
        if (!categories || !Array.isArray(categories)) return [];
        
        return categories.map((categoryObj) => {
            const [categoryName, products] = Object.entries(categoryObj)[0];
            return {
                key: categoryName,
                label: categoryName,
                products: products || []
            };
        });
    }, [categories]);

    const handleAuthClick = (mode) => {
        setAuthMode(mode);
        setShowAuthModal(true);
    };

    // Custom Accordion rendering for sidebar with modern design
    const renderProductSections = () => (
        <div className="sidebar-custom-accordion">
            {productSections.map(({ key, label, products }) => {
                const isOpen = !!sectionOpen[key];
                const formattedProducts = categoryMap[key] || [];
                return (
                    <motion.div 
                        className={`sidebar-accordion-item${isOpen ? " open" : ""}`} 
                        key={key}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            className="sidebar-accordion-header"
                            aria-expanded={isOpen}
                            onClick={() => setSectionOpen((prev) => ({ ...prev, [key]: !isOpen }))}
                        >
                            <span className="section-title">{label}</span>
                            <motion.span 
                                className="sidebar-accordion-arrow"
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </motion.span>
                        </button>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div 
                                    className="sidebar-accordion-content"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="sidebar-products-grid">
                                        {formattedProducts.map((product) => (
                                            <motion.div
                                                key={product._id || product.title}
                                                className="sidebar-product-item"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2, delay: 0.1 }}
                                            >
                                                                                            <Link
                                                to={`/Products/${key}/${product.slug}`}
                                                onClick={() => {
                                                    if (onClose) onClose();
                                                }}
                                                className="sidebar-product-link"
                                            >
                                                {product.cleanedTitle}
                                            </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );

    return (
        <AnimatePresence>
            {open && (
                <motion.div 
                    className="sidebar-overlay" 
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.aside 
                        className="sidebar"
                        onClick={e => e.stopPropagation()}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="sidebar-header">
                            <button className="sidebar__close" onClick={onClose} aria-label="Close sidebar">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        
                        <nav className="sidebar__nav">
                            <div className="nav-section">
                                <Link to="/" onClick={onClose} className="nav-link home-link">
                                    Home
                                </Link>
                            </div>

                            <div className="nav-section">
                                <div className={`sidebar-accordion-item${productsOpen ? " open" : ""}`}>
                                    <button
                                        className="sidebar-accordion-header main-accordion"
                                        aria-expanded={productsOpen}
                                        onClick={() => setProductsOpen((prev) => !prev)}
                                    >
                                        <span className="section-title">
                                            Products
                                        </span>
                                        <motion.span 
                                            className="sidebar-accordion-arrow"
                                            animate={{ rotate: productsOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </motion.span>
                                    </button>
                                    <AnimatePresence>
                                        {productsOpen && (
                                            <motion.div 
                                                className="sidebar-accordion-content main-content"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                {loading ? (
                                                    <div className="loading-state">
                                                        <div className="loading-spinner"></div>
                                                        <span>Loading products...</span>
                                                    </div>
                                                ) : error ? (
                                                    <div className="error-state">
                                                        <span>⚠️ {error}</span>
                                                    </div>
                                                ) : (
                                                    renderProductSections()
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="nav-section">
                                <div className="sidebar-accordion-item">
                                    <button
                                        className="sidebar-accordion-header"
                                        aria-expanded={sectionOpen.resources}
                                        onClick={() => {
                                            setSectionOpen((prev) => ({ ...prev, resources: !prev.resources }));
                                        }}
                                    >
                                        <span className="section-title">
                                            Resources
                                        </span>
                                        <motion.span 
                                            className="sidebar-accordion-arrow"
                                            animate={{ rotate: sectionOpen.resources ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </motion.span>
                                    </button>
                                    <AnimatePresence>
                                        {sectionOpen.resources && (
                                            <motion.div 
                                                className="sidebar-accordion-content"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <div className="resources-list">
                                                    <Link to="/blog" onClick={onClose} className="resource-link">
                                                        Blog
                                                    </Link>
                                                    <Link to="/case-studies" onClick={onClose} className="resource-link">
                                                        Case Studies
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="nav-section">
                                <Link to="/about" onClick={onClose} className="nav-link">
                                    About Us
                                </Link>
                            </div>

                            <div className="nav-section">
                                <Link to="/faqs" onClick={onClose} className="nav-link">
                                    FAQs
                                </Link>
                            </div>

                            <div className="nav-section">
                                <Link to="/contact" onClick={onClose} className="nav-link">
                                    Contact Us
                                </Link>
                            </div>

                            {!isAuthenticated && (
                                <div className="nav-section auth-section">
                                    <div className="auth-buttons-sidebar">
                                        <button onClick={() => handleAuthClick("login")}>
                                            Login
                                        </button>
                                        <button onClick={() => handleAuthClick("register")}>
                                            Sign Up
                                        </button>
                                    </div>
                                </div>
                            )}
                        </nav>
                    </motion.aside>
                </motion.div>
            )}
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    initialMode={authMode}
                />
            )}
        </AnimatePresence>
    );
} 