import { EnquiryService } from '../services/enquiryService.js';

export const createEnquiry = async (req, res) => {
    try {
        const enquiry = await EnquiryService.createEnquiry(req.body);
        
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

export const getEnquiries = async (req, res) => {
    try {
        const enquiries = await EnquiryService.getEnquiries(req.query);

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

export const updateEnquiryStatus = async (req, res) => {
    try {
        const enquiry = await EnquiryService.updateEnquiryStatus(
            req.params.id,
            req.body.status
        );

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
