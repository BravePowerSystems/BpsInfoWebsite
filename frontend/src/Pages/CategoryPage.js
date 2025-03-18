import React from "react";
import { useParams } from "react-router-dom";
import ProductsData from "./ProductsData";
import Breadcrumbs from "../components/Breadcrumbs";
import CategoryCarousel from "../components/CategoryCarousel";
import "../scss/components/CategoryCarousel.scss";
import "../scss/pages/CategoryPage.scss";

function CategoryPage() {
    const { categoryName } = useParams();

    const formattedCategoryName = decodeURIComponent(categoryName).replace(
        /[^a-zA-Z0-9]/g,
        " "
    );

    const categoryKeys = ProductsData.map((item) => Object.keys(item)[0]);
    const isValidCategory = categoryKeys.includes(formattedCategoryName);

    if (!isValidCategory) {
        return <h1>Category not found</h1>;
    }

    
    const categoryObj = ProductsData.find(
    (item) => Object.keys(item)[0] === formattedCategoryName
);

const products = categoryObj ? Object.values(categoryObj)[0] : [];


    return (
        <div className="category-page">
            <Breadcrumbs />
            <div className="category-products">
               
                        <CategoryCarousel
                            key={formattedCategoryName}
                            categoryName={formattedCategoryName}
                            products={products}
                        />
                   
            </div>
        </div>
    );
}

export default CategoryPage;


