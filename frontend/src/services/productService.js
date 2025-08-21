import { publicClientMethods, privateClientMethods } from './apiClient';

export const productService = {
    // Public routes
    getAllProducts: () => {
        return publicClientMethods.get('/products');
    },
    
    getProductById: (id) => {
        return publicClientMethods.get(`/products/${id}`);
    },
    
    getProductsByCategory: (category) => {
        return publicClientMethods.get(`/products/category/${category}`);
    },
    
    getProductDetails: (category, productName) => {
        return publicClientMethods.get(`/products/details/${category}/${productName}`);
    },
    
    // Protected routes (admin only)
    createProduct: (productData) => {
        return privateClientMethods.post('/products', productData);
    },
    
    updateProduct: (id, productData) => {
        return privateClientMethods.put(`/products/${id}`, productData);
    },
    
    deleteProduct: (id) => {
        return privateClientMethods.delete(`/products/${id}`);
    }
};



