import React, { useState, useEffect } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import "../scss/pages/Products.scss";
import CategoryCarousel from "../components/CategoryCarousel";
import { motion } from "motion/react";
import { fadeInUpVariants } from "../components/HeroSection";
import { productService } from "../services/productService";
import { Loading } from "./Product";

const motionConfig = {
    path: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.2 },
    },
    h1: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.4 },
    },
    categoryProducts: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.6 },
    },
};

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAllProducts();
            if (!response || !response.data) {
                throw new Error('Invalid response from server');
            }
            setProducts(response.data);
        } catch (err) {
            setError('Failed to load products: ' + (err.message || 'Unknown error'));
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />
    if (error) return <div>Error: {error}</div>;

    return (
        <motion.div className="products-container">
            <motion.div className="path" {...motionConfig.path}>
                <Breadcrumbs />
            </motion.div>
            <motion.h1 {...motionConfig.h1}>PRODUCTS</motion.h1>

            {products.map((categoryObj, index) => {
                const [categoryName, categoryProducts] = Object.entries(categoryObj)[0];
                return (
                    <motion.div
                        className="category-products"
                        key={index}
                        {...motionConfig.categoryProducts}
                    >
                        <CategoryCarousel
                            categoryName={categoryName}
                            products={categoryProducts}
                        />
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

export default Products;
