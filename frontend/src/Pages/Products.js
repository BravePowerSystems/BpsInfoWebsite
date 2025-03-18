import React from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import "../scss/pages/Products.scss";
import ProductsData from "./ProductsData";
import CategoryCarousel from "../components/CategoryCarousel";
 function Products() {
    return (
        <div className="products-container">
            <div className="path">
                <Breadcrumbs />
            </div>

            <h1>PRODUCTS</h1>

            {ProductsData.map((categoryObj, index) => {
                const [categoryName, products] = Object.entries(categoryObj)[0];

                return (
                    <CategoryCarousel
                        key={categoryName || index}
                        categoryName={categoryName}
                        products={products}
                    />
                );
            })}
        </div>
    );
}



export default Products;