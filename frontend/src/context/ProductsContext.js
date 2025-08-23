import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';

const ProductsContext = createContext(null);

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load products on mount
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productService.getAllProducts();
            setProducts(response.data);
            setCategories(response.data);
        } catch (err) {
            console.error('Error loading products:', err);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (productData) => {
        try {
            setError(null);
            const response = await productService.createProduct(productData);
            // Reload products to get the updated list
            await loadProducts();
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to create product';
            setError(errorMessage);
            throw err;
        }
    };

    const updateProduct = async (productId, productData) => {
        try {
            setError(null);
            const response = await productService.updateProduct(productId, productData);
            // Reload products to get the updated list
            await loadProducts();
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to update product';
            setError(errorMessage);
            throw err;
        }
    };

    const deleteProduct = async (productId) => {
        try {
            setError(null);
            await productService.deleteProduct(productId);
            // Reload products to get the updated list
            await loadProducts();
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to delete product';
            setError(errorMessage);
            throw err;
        }
    };

    const getProductById = (productId) => {
        return products.find(product => product._id === productId);
    };

    const getProductsByCategory = (categoryName) => {
        const category = categories.find(cat => {
            const [catName] = Object.entries(cat)[0];
            return catName === categoryName;
        });
        return category ? Object.values(category)[0] : [];
    };

    const refreshProducts = () => {
        loadProducts();
    };

    const contextValue = {
        products,
        categories,
        loading,
        error,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getProductsByCategory,
        refreshProducts
    };

    return (
        <ProductsContext.Provider value={contextValue}>
            {children}
        </ProductsContext.Provider>
    );
};
