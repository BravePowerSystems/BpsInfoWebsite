import React from "react";
import { useParams } from "react-router-dom";
import ProductsData from "./ProductsData";
import Breadcrumbs from "../components/Breadcrumbs";
import CategoryCarousel from "../components/CategoryCarousel";
import "../scss/components/CategoryCarousel.scss";
import "../scss/pages/CategoryPage.scss";
import { motion } from "motion/react";
import { ContainerVariants, childrenVariants } from "../Pages/Products";

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
            initial="hidden"
            animate="visible"
            variants={ContainerVariants}
        >
            <motion.div variants={childrenVariants}>
                <Breadcrumbs />
            </motion.div>
            <motion.div
                className="category-products"
                variants={childrenVariants}
            >
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
