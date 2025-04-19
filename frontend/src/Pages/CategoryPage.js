import React from "react";
import { useParams } from "react-router-dom";
import ProductsData from "./ProductsData";
import Breadcrumbs from "../components/Breadcrumbs";

import { motion } from "motion/react";
import CategoryCarousel from "../components/CategoryCarousel";
import { fadeInUpVariants } from "../components/HeroSection";
import "../scss/components/CategoryCarousel.scss";
import "../scss/pages/CategoryPage.scss";

const motionConfig = {
    categoryPage: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.4 },
    },
    path: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.6 },
    },
    categoryProducts: {
        variants: fadeInUpVariants,
        initial: "hidden",
        animate: "visible",
        transition: { duration: 0.8, delay: 0.8 },
    },
};

function CategoryPage() {
    const { categoryName } = useParams();

    const categoryKeys = ProductsData.map((item) => Object.keys(item)[0]);
    const isValidCategory = categoryKeys.includes(categoryName);

    if (!isValidCategory) {
        return <h1>Category not found</h1>;
    }

    const categoryObj = ProductsData.find(
        (item) => Object.keys(item)[0] === categoryName
    );

    const products = categoryObj ? Object.values(categoryObj)[0] : [];

    return (
        <motion.div
            className="category-page"
            {...motionConfig.categoryPage}
        >
            <motion.div
                {...motionConfig.path}
            >
                <Breadcrumbs />
            </motion.div>
            <motion.div className="category-products"
            {...motionConfig.categoryProducts}>
                <CategoryCarousel
                    key={categoryName}
                    categoryName={categoryName}
                    products={products}
                />
            </motion.div>
        </motion.div>
    );
}

export default CategoryPage;
