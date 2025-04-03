import React from "react";
import { useParams } from "react-router-dom";
import ProductsData from "./ProductsData";
import Breadcrumbs from "../components/Breadcrumbs";
import CategoryCarousel from "../components/CategoryCarousel";
import "../scss/components/CategoryCarousel.scss";
import "../scss/pages/CategoryPage.scss";

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
        <div className="category-page">
            <Breadcrumbs />
            <div className="category-products">
               
                        <CategoryCarousel
                            key={categoryName}
                            categoryName={categoryName}
                            products={products}
                        />
                   
            </div>
        </div>
    );
}

export default CategoryPage;


