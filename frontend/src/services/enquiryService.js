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
    }
};