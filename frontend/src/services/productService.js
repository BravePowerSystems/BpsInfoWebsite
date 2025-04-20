import { publicClient, protectedClient } from './apiClient';

export const productService = {
    // Public routes (no auth needed)
    getAllProducts: () => {
        return publicClient.get('/products');
    },

    getProductByDetails: (category, productName) => {
        return publicClient.get(`/products/${category}/${productName}`);
    },

    // Protected routes (auth needed)
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