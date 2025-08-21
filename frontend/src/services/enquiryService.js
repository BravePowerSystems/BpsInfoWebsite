import { publicClientMethods, privateClientMethods } from './apiClient';

export const enquiryService = {
    // Public routes
    submitEnquiry: (enquiryData) => {
        return publicClientMethods.post('/enquiries', enquiryData);
    },
    
    // Protected routes (admin only)
    getAllEnquiries: () => {
        return privateClientMethods.get('/enquiries');
    },
    
    updateEnquiryStatus: (id, status) => {
        return privateClientMethods.patch(`/enquiries/${id}/status`, { status });
    },
    
    // Protected routes (user only)
    getMyEnquiries: () => {
        return privateClientMethods.get('/enquiries/my');
    },
    
    getWishlistEnquiries: (userId) => {
        return privateClientMethods.get(`/enquiries/wishlist?userId=${userId}`);
    },
    
    respondToEnquiry: (id, responseMessage) => {
        return privateClientMethods.patch(`/enquiries/${id}/response`, { responseMessage });
    }
};