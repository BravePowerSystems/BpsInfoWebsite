import Enquiry from '../models/enquiryModel.js';

export class EnquiryService {
    static async createEnquiry(enquiryData) {
        const enquiry = new Enquiry(enquiryData);
        return await enquiry.save();
    }

    static async getEnquiries(filterParams) {
        const { status, enquiryType, startDate, endDate } = filterParams;
        
        const filter = {};
        if (status) filter.status = status;
        if (enquiryType) filter.enquiryType = enquiryType;
        if (startDate || endDate) {
            filter.submittedAt = {};
            if (startDate) filter.submittedAt.$gte = new Date(startDate);
            if (endDate) filter.submittedAt.$lte = new Date(endDate);
        }

        return await Enquiry.find(filter).sort({ submittedAt: -1 });
    }

    static async updateEnquiryStatus(enquiryId, status) {
        const enquiry = await Enquiry.findByIdAndUpdate(
            enquiryId,
            { status },
            { new: true, runValidators: true }
        );

        if (!enquiry) {
            throw new Error('Enquiry not found');
        }

        return enquiry;
    }
}