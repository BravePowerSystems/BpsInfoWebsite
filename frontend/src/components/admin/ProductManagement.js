import React, { useState, useEffect } from "react";
import { productService } from "../../services/productService";
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
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        loadProducts();
        
        // Add event listener for product save events
        const handleProductSave = async (event) => {
            const { product, productData } = event.detail;
            await handleSaveProduct(product, productData);
        };
        
        const element = document.querySelector('.product-management');
        if (element) {
            element.addEventListener('product-save', handleProductSave);
        }
        
        return () => {
            if (element) {
                element.removeEventListener('product-save', handleProductSave);
            }
        };
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAllProducts();
            const { data } = response;

            if (!data || !Array.isArray(data)) {
                console.error("Invalid data format received:", data);
                throw new Error("Invalid data format received from server");
            }

            // Extract all products from the category structure
            let allProducts = [];
            let categoryList = [];

            data.forEach((categoryObj) => {
                const categoryEntries = Object.entries(categoryObj);
                if (categoryEntries.length > 0) {
                    const [categoryName, categoryProducts] = categoryEntries[0];
                    categoryList.push(categoryName);

                    if (Array.isArray(categoryProducts)) {
                        allProducts = [...allProducts, ...categoryProducts];
                    }
                }
            });

            setProducts(allProducts);
            setCategories(["All", ...categoryList.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))]);
        } catch (error) {
            console.error("Failed to load products:", error);
            new Notify({
                status: "error",
                title: "Error",
                text: "Failed to load products: " + (error.message || "Unknown error"),
                effect: "fade",
                speed: 300,
                autoclose: true,
                autotimeout: 3000,
                position: "right top",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = () => {
        onShowProductForm(null, categories.filter(cat => cat !== "All"));
    };

    const handleEditProduct = (product) => {
        onShowProductForm(product, categories.filter(cat => cat !== "All"));
    };

    const handleSaveProduct = async (editingProduct, productData) => {
        try {
            setLoading(true);

            if (editingProduct) {
                // Update existing product
                await productService.updateProduct(editingProduct._id, productData);
                new Notify({
                    status: "success",
                    title: "Success",
                    text: "Product updated successfully",
                    effect: "fade",
                    speed: 300,
                    autoclose: true,
                    autotimeout: 3000,
                    position: "right top",
                });
            } else {
                // Create new product
                await productService.createProduct(productData);
                new Notify({
                    status: "success",
                    title: "Success",
                    text: "Product created successfully",
                    effect: "fade",
                    speed: 300,
                    autoclose: true,
                    autotimeout: 3000,
                    position: "right top",
                });
            }

            // Reload products
            await loadProducts();
        } catch (error) {
            console.error("Failed to save product:", error);
            new Notify({
                status: "error",
                title: "Error",
                text: "Failed to save product",
                effect: "fade",
                speed: 300,
                autoclose: true,
                autotimeout: 3000,
                position: "right top",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                setLoading(true);
                await productService.deleteProduct(productId);
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
                await loadProducts();
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
            } finally {
                setLoading(false);
            }
        }
    };

    const filteredProducts =
        selectedCategory === "All"
            ? products
            : products.filter((product) =>
                product.category && product.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
            );

    return (
        <div className="product-management">
            <div className="product-management-header">
                <h2>Product Management</h2>
                <div className="product-controls">
                    <CategorySelector
                        categories={categories}
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



