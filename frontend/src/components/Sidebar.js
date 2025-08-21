import React, { useState, useEffect, useMemo } from "react";
import "../scss/components/Sidebar.scss";
import { Link } from "react-router-dom";
import { productService } from "../services/productService";


const PRODUCT_SECTIONS = [
    { key: "Transmitters", label: "Transmitters" },
    { key: "Controllers", label: "Controllers" },
    { key: "IOT-and-PLC-Modules", label: "IOT & PLC Modules" },
];

export default function Sidebar({ open, onClose }) {
    // --- Products logic ---
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Custom accordion state
    const [productsOpen, setProductsOpen] = useState(false);
    const [sectionOpen, setSectionOpen] = useState({}); // {Transmitters: true, ...}

    useEffect(() => {
        
        const fetchProducts = async () => {
            try {
                const { data } = await productService.getAllProducts();
                setCategories(data);
            } catch (err) {
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Map categories to a lookup for easy access
    const categoryMap = useMemo(() => {
        const map = {};
        categories.forEach((categoryObj) => {
            const [categoryName, products] = Object.entries(categoryObj)[0];
            map[categoryName] = products.map((product) => ({
                ...product,
                cleanedTitle: product.title.replace(/[^a-zA-Z0-9\s]/g, "").trim(),
                slug: product.title.replace(/\s+/g, "-"),
            }));
        });
        return map;
    }, [categories]);

    // --- Resources logic (static, as in ResourcesList) ---
    const resourcesItems = [
        {
            title: "RESOURCES",
            content: (
                <ul>
                    <li>
                        <Link to="/blog" onClick={onClose}>BLOG</Link>
                    </li>
                    <li>
                        <Link to="/case-studies" onClick={onClose}>CASE STUDIES</Link>
                    </li>
                </ul>
            ),
        },
    ];

    // Custom Accordion rendering for sidebar
    const renderProductSections = () => (
        <div className="sidebar-custom-accordion">
            {PRODUCT_SECTIONS.map(({ key, label }) => {
                const isOpen = !!sectionOpen[key];
                const products = categoryMap[key] || [];
                return (
                    <div className={`sidebar-accordion-item${isOpen ? " open" : ""}`} key={key}>
                        <button
                            className="sidebar-accordion-header"
                            aria-expanded={isOpen}
                            onClick={() => setSectionOpen((prev) => ({ ...prev, [key]: !isOpen }))}
                        >
                            <span>{label}</span>
                            <span className={`sidebar-accordion-arrow${isOpen ? " open" : ""}`}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </button>
                        <div className="sidebar-accordion-content" style={{ maxHeight: isOpen ? '1000px' : 0, overflow: 'hidden', transition: 'max-height 0.3s' }}>
                            <ul>
                                {products.map((product) => (
                                    <li key={product._id || product.title}>
                                        <Link
                                            to={`/Products/${key}/${product.slug}`}
                                            onClick={() => {
                                                if (onClose) onClose();
                                            }}
                                            className="product-link"
                                        >
                                            {product.cleanedTitle}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className={`sidebar-overlay${open ? " open" : ""}`} onClick={onClose}>
            <aside className={`sidebar${open ? " open" : ""}`} onClick={e => e.stopPropagation()}>
                <button className="sidebar__close" onClick={onClose} aria-label="Close sidebar">&times;</button>
                <nav className="sidebar__nav">
                    <ul>
                        <li><Link to="/" onClick={onClose}>Home</Link></li>
                        <li>
                            <div className={`sidebar-accordion-item${productsOpen ? " open" : ""}`}>
                                <button
                                    className="sidebar-accordion-header"
                                    aria-expanded={productsOpen}
                                    onClick={() => setProductsOpen((prev) => !prev)}
                                >
                                    <span>Products</span>
                                    <span className={`sidebar-accordion-arrow${productsOpen ? " open" : ""}`}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </button>
                                <div className="sidebar-accordion-content" style={{ maxHeight: productsOpen ? '2000px' : 0, overflow: 'hidden', transition: 'max-height 0.3s' }}>
                                    {loading ? null : error ? (
                                        <div className="error">{error}</div>
                                    ) : (
                                        renderProductSections()
                                    )}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="sidebar-accordion-item">
                                <button
                                    className="sidebar-accordion-header"
                                    aria-expanded={resourcesItems[0].open}
                                    onClick={() => {
                                        // Only one resources accordion, so just toggle a boolean
                                        setSectionOpen((prev) => ({ ...prev, resources: !prev.resources }));
                                    }}
                                >
                                    <span>Resources</span>
                                    <span className={`sidebar-accordion-arrow${sectionOpen.resources ? " open" : ""}`}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </button>
                                <div className="sidebar-accordion-content" style={{ maxHeight: sectionOpen.resources ? '500px' : 0, overflow: 'hidden', transition: 'max-height 0.3s' }}>
                                    {resourcesItems[0].content}
                                </div>
                            </div>
                        </li>
                        <li><Link to="/about" onClick={onClose}>About Us</Link></li>
                        <li><Link to="/faqs" onClick={onClose}>FAQs</Link></li>
                        <li><Link to="/contact" onClick={onClose}>Contact Us</Link></li>
                    </ul>
                </nav>
            </aside>
        </div>
    );
} 