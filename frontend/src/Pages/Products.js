import React from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import "../scss/pages/Products.scss";
import ProductsData from "./ProductsData";
import CategoryCarousel from "../components/CategoryCarousel";
import {  motion } from "motion/react";

  export const ContainerVariants = {
      hidden: {
          opacity: 0,
      },
      visible: {
          opacity: 1,
          transition: {
              duration: 1,
              when: "beforeChildren",
              staggerChildren: 0.4,
          },
      },
  };

  export const childrenVariants = {
      hidden: {
          opacity: 0,
      },
      visible: {
          opacity: 1,
          
      },
  };
 function Products() {
   
    return (
        <motion.div className="products-container"
        initial="hidden" animate="visible" variants={ContainerVariants}>
            <motion.div className="path"
            variants={childrenVariants}>
                <Breadcrumbs />
            </motion.div>
            <motion.h1
            variants={childrenVariants}>PRODUCTS</motion.h1>
            {ProductsData.map((categoryObj, index) => {
                const [categoryName, products] = Object.entries(categoryObj)[0];
                return (
                    <motion.div
                    variants={childrenVariants}>    
                    <CategoryCarousel
                        key={categoryName || index}
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