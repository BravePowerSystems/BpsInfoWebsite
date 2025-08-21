import { publicClient, protectedClient } from './apiClient';

export const productService = {
    // Public routes
    getAllProducts: () => {
        return publicClient.get('/products');
    },
    
    getProductById: (id) => {
        return publicClient.get(`/products/${id}`);
    },
    
    getProductsByCategory: (category) => {
        return publicClient.get(`/products/category/${category}`);
    },
    
    getProductByDetails: (category, productName) => {
        return publicClient.get(`/products/details/${category}/${productName}`);
    },
    
    // Protected routes (admin only)
    createProduct: (productData) => {
        return protectedClient.post('/products', productData);
    },
    
    updateProduct: (id, productData) => {
        return protectedClient.put(`/products/${id}`, productData);
    },
    
    deleteProduct: (id) => {
        return protectedClient.delete(`/products/${id}`);
    }
};



