import React from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { useParams } from "react-router-dom";
import ProductsData from "./ProductsData";
import "../scss/pages/Product.scss";
import Accordion from "../components/Accordion";

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

    const ProductItem = productsArray.find((item) => item.title === cleanName);

    return (
        <div className="product">
            <section className="product-info">
                <Breadcrumbs />
                <h2 className="product-name">
                    {productName.replace(/[^a-zA-Z0-9]/g, " ")}
                </h2>
                <img
                    src="../../images/gasFlowPulseTransmitter.png"
                    alt=""
                    className="product-image"
                />
                <div>
                    <h4>Description</h4>
                    <p className="product-description">
                        {ProductItem.description}
                    </p>
                </div>
                <div class="buttons">
                    <button className="wishlist ">Add to wishlist</button>
                    <button className="enquire ">Enquire</button>
                    <button className="share ">Share</button>
                </div>
            </section>
            <section className="product-features">
                <Accordion items={featureItems} />
            </section>
        </div>
    );
}
