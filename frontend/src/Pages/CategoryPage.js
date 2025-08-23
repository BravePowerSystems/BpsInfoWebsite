import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { motion } from "framer-motion";
import CategoryCarousel from "../components/CategoryCarousel";
import { fadeInUpVariants } from "../components/HeroSection";
import "../scss/components/CategoryCarousel.scss";
import "../scss/pages/CategoryPage.scss";
import { useProducts } from "../context/ProductsContext";
import Loading from "../components/Loading";

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
    const { categories, loading, error } = useProducts();

    // Find the specific category and its products
    const { products, categoryFound } = useMemo(() => {
        if (!categories || !Array.isArray(categories)) {
            return { products: [], categoryFound: false };
        }
        
        const categoryObj = categories.find(
            (item) => Object.keys(item)[0] === categoryName
        );
        
        if (!categoryObj) {
            return { products: [], categoryFound: false };
        }
        
        return { 
            products: Object.values(categoryObj)[0], 
            categoryFound: true 
        };
    }, [categories, categoryName]);

    if (loading) return <Loading text="Loading products..." />;
    if (error) return <div>Error: {error}</div>;
    if (!categoryFound) return <div>Category not found</div>;
    if (!products.length) return <div>No products found in this category</div>;

    return (
        <motion.div
            className="category-page"
            {...motionConfig.categoryPage}
        >
            <motion.div {...motionConfig.path}>
                <Breadcrumbs />
            </motion.div>
            <motion.div 
                className="category-products"
                {...motionConfig.categoryProducts}
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
