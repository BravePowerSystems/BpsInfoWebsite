import React from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import "../scss/pages/Products.scss";
import ProductsData from "./ProductsData";
import CategoryCarousel from "../components/CategoryCarousel";
import {  motion } from "motion/react";
import { fadeInUpVariants } from "../components/HeroSection";
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
    return (
        <motion.div
            className="products-container"
            
        >
            <motion.div className="path"{...motionConfig.path}>
                <Breadcrumbs />
            </motion.div >
            <motion.h1 {...motionConfig.h1}>PRODUCTS</motion.h1>

            {ProductsData.map((categoryObj, index) => {
                const [categoryName, products] = Object.entries(categoryObj)[0];
                return (
                    <motion.div
                        className="category-products"
                        key={index}
                        {...motionConfig.categoryProducts}
                    >
                        <CategoryCarousel
                            categoryName={categoryName}
                            products={products}
                        />
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

export default Products;
