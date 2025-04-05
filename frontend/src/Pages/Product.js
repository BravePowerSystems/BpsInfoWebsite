import React, { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { useParams } from "react-router-dom";
import ProductsData from "./ProductsData";
import "../scss/pages/Product.scss";
import Accordion from "../components/Accordion";
import EnquirePopup from "../components/EnquirePopup";
import AnimatedOverlay from "../components/AnimatedOverlay";
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
    const [isPopupOpen, setPopupOpen] = useState(false);
    const { productName, categoryName } = useParams();
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
        setPopupOpen(true);
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
    };

    return (
        <AnimatedOverlay delay={1} duration={1.5}>
            <div className="product">
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
                {isPopupOpen && (
                    <EnquirePopup
                        productName={cleanName}
                        onClose={handleClosePopup}
                    />
                )}
            </div>
        </AnimatedOverlay>
    );
}
