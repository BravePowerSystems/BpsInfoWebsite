import React from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import "../scss/pages/Products.scss";
import ProductsData from "./ProductsData";
import CategoryCarousel from "../components/CategoryCarousel";
import {  motion } from "motion/react";

function Products() {
    return (
        <motion.div
            className="products-container"
            
        >
            <motion.div className="path" >
                <Breadcrumbs />
            </motion.div>
            <motion.h1 >PRODUCTS</motion.h1>

            {ProductsData.map((categoryObj, index) => {
                const [categoryName, products] = Object.entries(categoryObj)[0];
                return (
                    <motion.div
                        className="category-products"
                        key={index}
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
