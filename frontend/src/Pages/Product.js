import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useModal } from "../context/ModalContext";
import Breadcrumbs from "../components/Breadcrumbs";
import "../scss/pages/Product.scss";
import Accordion from "../components/Accordion";
import { motion } from "framer-motion";
import CategoryCarousel from "../components/CategoryCarousel";
import { fadeInUpVariants } from "../components/HeroSection";
import { productService } from "../services/productService";
import { wishlistService } from "../services/wishlistService";
import { productNotifications } from "../utils/notificationHelper";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";
import SpecificationsAccordion from "../components/SpecificationsAccordion";
import UnauthorizedPage from "./UnauthorizedPage";
import Loading from "../components/Loading";
import ShareButton from "../components/ShareButton";
// Loading component is now imported from ../components/Loading
const motionConfig = {
    product: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.2 },
    },
};

export default function Product() {
    const { openProductModal } = useModal();
    const { categoryName, productName } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, isAdmin } = useAuth();
    const { categories } = useProducts();
    const location = useLocation(); // Add this line to get the current location
    const [showUnauthorized, setShowUnauthorized] = useState(false);

    // Get related products from the context
    const relatedProducts = useMemo(() => {
        if (!categories || !Array.isArray(categories) || !categoryName) {
            return [];
        }
        
        const formattedCategory = categoryName.replace(/-/g, ' ');
        const categoryObj = categories.find(
            (item) => Object.keys(item)[0].toLowerCase() === formattedCategory.toLowerCase()
        );
        
        if (categoryObj) {
            return Object.values(categoryObj)[0];
        }
        
        return [];
    }, [categories, categoryName]);

    // Function to update meta tags for social sharing
    const updateMetaTags = (product) => {
        if (!product) return;
        
        // Generate absolute image URL
        const generateImageUrl = (imageUrl) => {
            if (!imageUrl) return 'https://bps-info-website.vercel.app/bpsCompanyIcon.png';
            
            if (imageUrl.startsWith('http')) {
                return imageUrl;
            }
            
            const baseUrl = 'https://bps-info-website.vercel.app';
            const absoluteUrl = imageUrl.startsWith('/') 
                ? `${baseUrl}${imageUrl}`
                : `${baseUrl}/${imageUrl}`;
            
            // Test if image is accessible
            const img = new Image();
            img.onload = () => console.log('Image loaded successfully:', absoluteUrl);
            img.onerror = () => console.log('Image failed to load:', absoluteUrl);
            img.src = absoluteUrl;
            
            return absoluteUrl;
        };

        const productUrl = `https://bps-info-website.vercel.app/Products/${product.category?.replace(/\s+/g, '-').toLowerCase() || 'products'}/${product.slug || product.title?.replace(/\s+/g, '-').toLowerCase()}`;
        const productImage = generateImageUrl(product.imageUrl);
        const productDescription = product.description?.substring(0, 160) || 'Check out this product from Brave Power Systems';

        // Update document title
        document.title = `${product.title} - Brave Power Systems`;

        // Update or create meta tags
        const updateMetaTag = (property, content) => {
            let meta = document.querySelector(`meta[property="${property}"]`) || 
                      document.querySelector(`meta[name="${property}"]`);
            
            if (!meta) {
                meta = document.createElement('meta');
                if (property.startsWith('og:')) {
                    meta.setAttribute('property', property);
                } else {
                    meta.setAttribute('name', property);
                }
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Update Open Graph tags
        updateMetaTag('og:type', 'product');
        updateMetaTag('og:title', product.title);
        updateMetaTag('og:description', productDescription);
        updateMetaTag('og:image', productImage);
        updateMetaTag('og:url', productUrl);
        updateMetaTag('og:site_name', 'Brave Power Systems');
        
        // Update Twitter Card tags
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', product.title);
        updateMetaTag('twitter:description', productDescription);
        updateMetaTag('twitter:image', productImage);
        
        // Update description
        updateMetaTag('description', productDescription);
        
        // Debug logging
        console.log('Meta Tags Updated:');
        console.log('Product Title:', product.title);
        console.log('Product Image:', productImage);
        console.log('Product URL:', productUrl);
        console.log('Product Description:', productDescription);
        
        // Log the actual meta tags
        const ogImage = document.querySelector('meta[property="og:image"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        console.log('OG Image Meta:', ogImage?.getAttribute('content'));
        console.log('OG Title Meta:', ogTitle?.getAttribute('content'));
    };

    useEffect(() => {
        if (!categoryName || !productName) {
            setProduct(null);
            setLoading(false);
            return;
        }
        
        const loadProduct = async () => {
            try {
                setLoading(true);
                // Convert dashes to spaces and make case-insensitive
                const formattedCategory = categoryName ? categoryName.replace(/-/g, ' ') : "";
                const formattedProduct = productName ? productName.replace(/-/g, ' ') : "";
                
                // Load specific product
                const response = await productService.getProductByDetails(
                    formattedCategory,
                    formattedProduct
                );
                
                if (!response || !response.data) {
                    throw new Error('Invalid response from server');
                }
                
                const productData = response.data;
                setProduct(productData);
                
                // Update meta tags for social sharing
                updateMetaTags(productData);
            } catch (err) {
                setError("Failed to load product");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        loadProduct();
    }, [categoryName, productName]);

    // Generate accordion items based on product data
    const generateFeatureItems = (product) => {
        return [
            {
                title: "Gas Flow pulse transmitter",
                content: product.description,
            },
            {
                title: "Specifications",
                content: (
                    <SpecificationsAccordion specifications={product.specifications} />
                ),
            },
            {
                title: "Applications",
                content: (
                    <ul className="applications-list">
                        {Array.isArray(product.applications) && product.applications.length > 0 ? (
                            product.applications.map((app, index) => (
                                <li key={index}>{app}</li>
                            ))
                        ) : (
                            <li>No applications information available</li>
                        )}
                    </ul>
                ),
            },
            {
                title: "Download",
                content: (
                    <div className="downloads-list">
                        {Array.isArray(product.downloads) && product.downloads.length > 0 ? (
                            product.downloads.map((download, index) => (
                                <a
                                    key={index}
                                    href={download.url}
                                    className="download-item"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {download.name} ({download.type})
                                </a>
                            ))
                        ) : (
                            <p>No downloads available</p>
                        )}
                    </div>
                ),
            },
        ];
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <h1>Product not found</h1>;
    if (showUnauthorized) {
        return <UnauthorizedPage type="authentication" currentPath={location.pathname} />;
    }

    const featureItems = generateFeatureItems(product);

    const handleEnquireClick = () => {
        openProductModal(product.title);
    };

    const handleWishlistAdd = async () => {
        if (!user) {
            setShowUnauthorized(true);
            return;
        }
        
        try {
            await wishlistService.addToWishlist(product._id);
            productNotifications.addedToWishlist(product.title);
        } catch (error) {
            // Check if it's already in wishlist
            if (error.response && error.response.status === 409) {
                productNotifications.alreadyInWishlist();
            } else {
                console.error('Error adding to wishlist:', error);
                productNotifications.wishlistError();
            }
        }
    };

    return (
        <div className="product-page">
            <motion.div className="product" {...motionConfig.product}>
                <section className="product-info">
                    <Breadcrumbs />
                    <h2 className="product-name">{product.title}</h2>
                    <div className="model-number">
                        Model: {product.modelNumber}
                    </div>
                    <img
                        src={product.imageUrl || "/placeholder-product.png"}
                        alt={product.title}
                        className="product-image"
                    />
                    <div className="product-description-container">
                        <h4>Description</h4>
                        <p className="product-description">
                            {product.description}
                        </p>
                    </div>
                    <div className="buttons">
                        {/* Only show wishlist button for regular users, not admins */}
                        {!isAdmin && (
                            <button
                                className="wishlist"
                                onClick={handleWishlistAdd}
                            >
                                Add to wishlist
                            </button>
                        )}
                        <button
                            onClick={handleEnquireClick}
                            className="enquire"
                        >
                            Enquire Now
                        </button>
                        <ShareButton 
                            product={product}
                            variant="outline"
                            size="medium"
                            showText={true}
                        />
                    </div>
                </section>
                <section className="product-features">
                    <Accordion items={featureItems} />
                </section>
            </motion.div>
            <div className="related-products">
                <h2 className="related-products-title">Related Products</h2>
                <CategoryCarousel
                    key={categoryName}
                    categoryName={categoryName}
                    products={relatedProducts}
                />
            </div>
        </div>
    );
}
