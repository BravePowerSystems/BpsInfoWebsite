import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import SpecificationsAccordion from "../components/SpecificationsAccordion";
import UnauthorizedPage from "./UnauthorizedPage";
export const Loading = () => {
    return (
        <h1
            style={{
                position: "absolute",
                color: "white",
                width: "100%",
                height: "100%",
                padding:"30vh 40vw"
            }}
        >
            Loading....
        </h1>
    );
};
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
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Add this line to get the current location
    const [showUnauthorized, setShowUnauthorized] = useState(false);

    useEffect(() => {
        if (!categoryName || !productName) {
            setProduct(null);
            setRelatedProducts([]);
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
                const productData = response.data;
                setProduct(productData);

                // Load all products to get related products from same category
                const allProductsResponse = await productService.getAllProducts();
                const allProducts = allProductsResponse.data;
                const categoryObj = allProducts.find(
                    (item) => Object.keys(item)[0].toLowerCase() === formattedCategory.toLowerCase()
                );
                if (categoryObj) {
                    setRelatedProducts(Object.values(categoryObj)[0]);
                }
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
                        {product.applications.map((app, index) => (
                            <li key={index}>{app}</li>
                        ))}
                    </ul>
                ),
            },
            {
                title: "Download",
                content: (
                    <div className="downloads-list">
                        {product.downloads.map((download, index) => (
                            <a
                                key={index}
                                href={download.url}
                                className="download-item"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {download.name} ({download.type})
                            </a>
                        ))}
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
                        <button className="share">Share</button>
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
