import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { motion } from "framer-motion";
import CategoryCarousel from "../components/CategoryCarousel";
import { fadeInUpVariants } from "../components/HeroSection";
import "../scss/components/CategoryCarousel.scss";
import "../scss/pages/CategoryPage.scss";
import { productService } from "../services/productService";
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
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProducts();
    }, [categoryName]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAllProducts();
            const { data } = response;
            
            if (!data || !Array.isArray(data)) {
                setError('Invalid data format received from server');
                return;
            }
            
            const categoryObj = data.find(
                (item) => Object.keys(item)[0] === categoryName
            );
            
            if (!categoryObj) {
                setError('Category not found');
                return;
            }
            
            setProducts(Object.values(categoryObj)[0]);
        } catch (err) {
            setError('Failed to load products: ' + (err.message || 'Unknown error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading text="Loading products..." />;
    if (error) return <div>Error: {error}</div>;
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
