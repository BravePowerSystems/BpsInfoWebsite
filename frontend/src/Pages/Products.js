import React from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import "../scss/pages/Products.scss";
import CategoryCarousel from "../components/CategoryCarousel";
import { motion } from "framer-motion";
import { fadeInUpVariants } from "../components/HeroSection";
import { useProducts } from "../context/ProductsContext";
import Loading from "../components/Loading";

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
    const { categories: products, loading, error } = useProducts();

    if (loading) return <Loading text="Loading products..." />
    if (error) return <div>Error: {error}</div>;

    return (
        <motion.div className="products-container">
            <motion.div className="path" {...motionConfig.path}>
                <Breadcrumbs />
            </motion.div>
            <motion.h1 {...motionConfig.h1}>PRODUCTS</motion.h1>

            {Array.isArray(products) && products.length > 0 ? (
                products.map((categoryObj, index) => {
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
                })
            ) : (
                <motion.div 
                    className="no-products"
                    variants={fadeInUpVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <p>No products available at the moment.</p>
                </motion.div>
            )}
        </motion.div>
    );
}

export default Products;
