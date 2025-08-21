import { privateClientMethods } from './apiClient';

export const wishlistService = {
    // All routes are protected (user must be authenticated)
    getWishlist: () => {
        return privateClientMethods.get('/wishlist');
    },
    
    addToWishlist: (productId) => {
        return privateClientMethods.post('/wishlist', { productId });
    },
    
    removeFromWishlist: (wishlistItemId) => {
        return privateClientMethods.delete(`/wishlist/${wishlistItemId}`);
    }
};