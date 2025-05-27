import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useModal } from "../context/ModalContext";
import Breadcrumbs from "../components/Breadcrumbs";
import "../scss/pages/Product.scss";
import Accordion from "../components/Accordion";
import { motion } from "motion/react";
import CategoryCarousel from "../components/CategoryCarousel";
import { fadeInUpVariants } from "../components/HeroSection";
import { productService } from "../services/productService";

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
    const loadProduct = async () => {
        try {
            // Load specific product
            const response = await productService.getProductByDetails(
                categoryName,
                productName
            );
            const productData = response.data;
            setProduct(productData);

            // Load all products to get related products from same category
            const allProductsResponse = await productService.getAllProducts();
            const allProducts = allProductsResponse.data;
            const categoryObj = allProducts.find(
                (item) => Object.keys(item)[0] === categoryName
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

    useEffect(() => {
        loadProduct();
    }, [categoryName, productName]);

    console.log(categoryName, productName);

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
                    <div className="specifications">
                        {product.specifications.map((spec, index) => (
                            <div key={index} className="spec-item">
                                <span className="spec-name">{spec.name}:</span>
                                <span className="spec-value">{spec.value}</span>
                            </div>
                        ))}
                    </div>
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <h1>Product not found</h1>;

    const featureItems = generateFeatureItems(product);

    const handleEnquireClick = () => {
        openProductModal(product.title);
    };

    const handleWishlistAdd = () => {
        // Add to wishlist logic
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
                        src="/GasFlowPulseTransmitter.png"
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
                        <button
                            className="wishlist"
                            onClick={handleWishlistAdd}
                        >
                            Add to wishlist
                        </button>
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
