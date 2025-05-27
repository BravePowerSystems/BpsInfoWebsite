import { publicClient, protectedClient } from './apiClient';

export const productService = {
    // Public routes (no auth needed)
    getAllProducts: async () => {
        const response = await publicClient.get('/products');
        return response; // Return just the data
    },

    getProductByDetails: async (category, productName) => {
        const response = await publicClient.get(`/products/${category}/${productName}`);
        console.log('Response from API:', response.data);
        console.log('Product data:', response.data.data);
        return response.data; // Return the product data from the response
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
