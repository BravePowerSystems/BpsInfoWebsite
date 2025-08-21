import { EnquiryService } from '../services/enquiryService.js';

export const createEnquiryController = async (req, res) => {
    try {
        let enquiryData = { ...req.body };
        if (req.user && req.user._id) {
            enquiryData.userId = req.user._id;
        }
        const enquiry = await EnquiryService.createEnquiryService(enquiryData);
        
        res.status(201).json({
            success: true,
            message: 'Enquiry submitted successfully',
            data: enquiry
        });
    } catch (error) {
        console.error('Enquiry creation error:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to submit enquiry',
            error: error.message
        });
    }
};

export const getEnquiriesController = async (req, res) => {
    try {
        console.log('getEnquiriesController called with query:', req.query);
        console.log('User making request:', req.user ? { id: req.user._id, role: req.user.role } : 'No user');
        
        const enquiries = await EnquiryService.getEnquiriesService(req.query);
        
        console.log('Enquiries found:', enquiries.length);
        console.log('First enquiry sample:', enquiries[0] ? { id: enquiries[0]._id, firstName: enquiries[0].firstName } : 'No enquiries');

        res.status(200).json({
            success: true,
            count: enquiries.length,
            data: enquiries
        });
    } catch (error) {
        console.error('Enquiry fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enquiries',
            error: error.message
        });
    }
};

export const updateEnquiryStatusController = async (req, res) => {
    try {
        console.log('updateEnquiryStatusController called with:', {
            id: req.params.id,
            status: req.body.status,
            user: req.user ? { id: req.user._id, role: req.user.role } : 'No user'
        });
        
        const enquiry = await EnquiryService.updateEnquiryStatusService(
            req.params.id,
            req.body.status
        );
        
        console.log('Status updated successfully:', enquiry._id, 'to', enquiry.status);
        
        // req.body.status is the status of the enquiry. for example, if the status is 'new', then the enquiry is new and not yet responded to. if the status is 'in-progress', then the enquiry is being responded to. if the status is 'completed', then the enquiry has been responded to. if the status is 'archived', then the enquiry has been responded to and is no longer active.
        res.status(200).json({
            success: true,
            message: 'Enquiry status updated successfully',
            data: enquiry
        });
    } catch (error) {
        console.error('Enquiry update error:', error);
        res.status(error.message === 'Enquiry not found' ? 404 : 400).json({
            success: false,
            message: error.message === 'Enquiry not found' 
                ? 'Enquiry not found' 
                : 'Failed to update enquiry status',
            error: error.message
        });
    }
};

export const updateEnquiryResponseMessageController = async (req, res) => {
    try {
        const enquiry = await EnquiryService.updateEnquiryResponseMessageService(
            req.params.id,
            req.body.responseMessage
        );
        res.status(200).json({
            success: true,
            message: 'Enquiry response message updated successfully',
            data: enquiry
        });
    } catch (error) {
        console.error('Enquiry response update error:', error);
        res.status(error.message === 'Enquiry not found' ? 404 : 400).json({
            success: false,
            message: error.message === 'Enquiry not found'
                ? 'Enquiry not found'
                : 'Failed to update enquiry response message',
            error: error.message
        });
    }
};

export const getUserEnquiriesController = async (req, res) => {
    try {
        const userId = req.user._id;
        const enquiries = await EnquiryService.getEnquiriesService({ userId });
        res.status(200).json({
            success: true,
            count: enquiries.length,
            data: enquiries
        });
    } catch (error) {
        console.error('User enquiry fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch your enquiries',
            error: error.message
        });
    }
};

export const getUserWishlistForEnquiryController = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'userId is required' });
        }
        const wishlist = await EnquiryService.getUserWishlistWithProductsService(userId);
        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        console.error('Wishlist fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch wishlist', error: error.message });
    }
};
