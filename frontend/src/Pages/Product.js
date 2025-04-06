import React, { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { useParams } from "react-router-dom";
import ProductsData from "./ProductsData";
import "../scss/pages/Product.scss";
import Accordion from "../components/Accordion";
import ProductModal from "../components/ProductModal";
import {motion} from "motion/react";
import CategoryCarousel from "../components/CategoryCarousel.js";
const featureItems = [
    {
        title: "Gas Flow pulse transmitter",
        content:
            "Gas flow pulse transmitter is a gas flow transmitter that uses pulse technology to detect gas flow.",
    },
    {
        title: "Specifications",
        content: "", // Custom React component
    },
    {
        title: "Applications",
        content:
            "Gas flow pulse transmitter is used in various applications such as gas flow monitoring, gas leak detection, and gas flow control.",
    },
    {
        title: "Download",
        content: "",
    },
];

export default function Product() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { categoryName, productName} = useParams();
    const CategoryItem = ProductsData.find(
        (item) => Object.keys(item)[0] === categoryName
    );

    if (!CategoryItem) {
        console.error(`Category "${categoryName}" not found`);
        return null;
    }
    const productsArray = CategoryItem[categoryName];

    const cleanName = productName.replace(/[^a-zA-Z0-9]/g, " ");

    const ProductItem = productsArray.find(
        (item) => item.title.replace(/[^a-zA-Z0-9]/g, " ") === cleanName
    );

    if (!ProductItem) {
        console.error(`Product "${cleanName}" not found`);
        return null;
    }

    const handleEnquireClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };



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
        <div className="product-page">
            <motion.div
                
                className="product"
            >
                <section className="product-info">
                    <Breadcrumbs />
                    <h2 className="product-name">{cleanName}</h2>
                    <img
                        src="../../images/gasFlowPulseTransmitter.png"
                        alt=""
                        className="product-image"
                    />
                    <div className="product-description-container">
                        <h4>Description</h4>
                        <p className="product-description">
                            {ProductItem.description}
                        </p>
                    </div>
                    <div className="buttons">
                        <button className="wishlist">Add to wishlist</button>
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
                {isModalOpen && (
                    <ProductModal
                        productName={cleanName}
                        onClose={handleModalClose}
                    />
                )}
            </motion.div>
            <motion.div className="related-products">
                <h2 className="related-products-title">
                    Related Products
                </h2>
            <CategoryCarousel
                key={categoryName}
                categoryName={categoryName}
                products={products}
            />
            </motion.div>

        </div>
        
    );
}
