import { publicClient, protectedClient } from './apiClient';

export const enquiryService = {
    // Public route
    createEnquiry: (enquiryData) => {
        return publicClient.post('/enquiries', enquiryData);
    },

    // Protected routes (admin only)
    getEnquiries: () => {
        return protectedClient.get('/enquiries');
    },

    updateEnquiryStatus: (id, status) => {
        return protectedClient.patch(`/enquiries/${id}/status`, { status });
    },

    getUserEnquiries: () => {
        return protectedClient.get('/enquiries/my');
    },

    // Fetch a user's wishlist for an enquiry (admin only)
    getUserWishlist: (userId) => {
        return protectedClient.get(`/enquiries/wishlist?userId=${userId}`);
    },

    // Update the response message for an enquiry (admin only)
    updateEnquiryResponseMessage: (id, responseMessage) => {
        return protectedClient.patch(`/enquiries/${id}/response`, { responseMessage });
    }
};