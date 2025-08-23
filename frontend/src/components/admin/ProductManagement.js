import React, { useState, useEffect, useMemo } from "react";
import { useProducts } from "../../context/ProductsContext";
import { useModal } from "../../context/ModalContext";
import "../../scss/components/admin/ProductManagement.scss";
import ProductCard from "./ProductCard";
import Notify from "simple-notify";
import Loading from "../Loading";

// Custom Category Selector Component
const CategorySelector = ({ categories, selectedCategory, onCategoryChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);
    const handleSelect = (category) => {
        onCategoryChange(category);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.category-selector')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="category-selector">
            <button 
                className="category-selector__trigger"
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className="category-selector__selected">
                    {selectedCategory}
                </span>
                <span className={`category-selector__arrow ${isOpen ? 'rotated' : ''}`}>
                    <img src="/arrow_down.svg" alt="" />
                </span>
            </button>
            
            {isOpen && (
                <div className="category-selector__dropdown">
                    <ul className="category-selector__list" role="listbox">
                        {categories.map((category) => (
                            <li key={category} role="option">
                                <button
                                    className={`category-selector__option ${
                                        selectedCategory === category ? 'selected' : ''
                                    }`}
                                    onClick={() => handleSelect(category)}
                                    role="option"
                                    aria-selected={selectedCategory === category}
                                >
                                    {category}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

function ProductManagement({ onShowProductForm }) {
    const { products, categories, loading, deleteProduct: deleteProductFromContext } = useProducts();
    const { openConfirmationModal, closeConfirmationModal } = useModal();
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Extract all products and category names from the context data
    const { allProducts, categoryNames } = useMemo(() => {
        if (!categories || !Array.isArray(categories)) {
            return { allProducts: [], categoryNames: ["All"] };
        }

        let allProducts = [];
        let categoryList = [];

        categories.forEach((categoryObj) => {
            const categoryEntries = Object.entries(categoryObj);
            if (categoryEntries.length > 0) {
                const [categoryName, categoryProducts] = categoryEntries[0];
                categoryList.push(categoryName);

                if (Array.isArray(categoryProducts)) {
                    allProducts = [...allProducts, ...categoryProducts];
                }
            }
        });

        return {
            allProducts,
            categoryNames: ["All", ...categoryList.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))]
        };
    }, [categories]);

    useEffect(() => {
        // No need for event listeners since product operations are now handled by ProductsContext
    }, []);

    const handleAddProduct = () => {
        onShowProductForm(null, categoryNames.filter(cat => cat !== "All"));
    };

    const handleEditProduct = (product) => {
        onShowProductForm(product, categoryNames.filter(cat => cat !== "All"));
    };

    const handleDeleteProduct = async (productId) => {
        openConfirmationModal(
            "Delete Product",
            "Are you sure you want to delete this product?",
            async () => {
                try {
                    await deleteProductFromContext(productId);
                    closeConfirmationModal();
                    new Notify({
                        status: "success",
                        title: "Success",
                        text: "Product deleted successfully",
                        effect: "fade",
                        speed: 300,
                        autoclose: true,
                        autotimeout: 3000,
                        position: "right top",
                    });
                    // No need to call loadProducts() - the context will automatically update all components
                } catch (error) {
                    console.error("Failed to delete product:", error);
                    new Notify({
                        status: "error",
                        title: "Error",
                        text: "Failed to delete product",
                        effect: "fade",
                        speed: 300,
                        autoclose: true,
                        autotimeout: 3000,
                        position: "right top",
                    });
                }
            },
            () => {
                closeConfirmationModal();
            }
        );
    };

    const filteredProducts =
        selectedCategory === "All"
            ? allProducts
            : allProducts.filter((product) =>
                product.category && product.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
            );

    return (
        <div className="product-management">
            <div className="product-management-header">
                <h2>Product Management</h2>
                <div className="product-controls">
                    <CategorySelector
                        categories={categoryNames}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />
                    <button 
                        id="add-product-button"
                        className="add-product-btn" 
                        onClick={handleAddProduct}
                    >
                        Add New Product
                    </button>
                </div>
            </div>

            {loading ? (
                <Loading text="Loading products..." />
            ) : (
                <div className="product-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onEdit={() => handleEditProduct(product)}
                            onDelete={() => handleDeleteProduct(product._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductManagement;



