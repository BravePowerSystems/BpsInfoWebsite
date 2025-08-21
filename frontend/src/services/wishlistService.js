import {  protectedClient } from './apiClient';

export const wishlistService = {
    // Get all wishlist items for the logged-in user
    getUserWishlist: () => {
        return protectedClient.get('/wishlist');
    },
    
    // Add a product to the wishlist
    addToWishlist: (productId) => {
        return protectedClient.post('/wishlist', { productId });
    },
    
    // Remove an item from the wishlist
    removeFromWishlist: (wishlistItemId) => {
        return protectedClient.delete(`/wishlist/${wishlistItemId}`);
    }
};