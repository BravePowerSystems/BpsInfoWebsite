import Enquiry from '../models/enquiryModel.js';
import WishlistItem from '../models/Wishlist.js';
import Product from '../models/Product.js';

export class EnquiryService {
    static async createEnquiryService(enquiryData) {
        const enquiry = new Enquiry(enquiryData);
        return await enquiry.save();
    }

    static async getEnquiriesService(filterParams) {
        console.log('getEnquiriesService called with filterParams:', filterParams);
        
        const { status, enquiryType, startDate, endDate, userId } = filterParams;
        
        const filter = {};
        if (status) filter.status = status;
        if (enquiryType) filter.enquiryType = enquiryType;
        if (userId) filter.userId = userId;
        if (startDate || endDate) {
            filter.submittedAt = {};
            if (startDate) filter.submittedAt.$gte = new Date(startDate);
            if (endDate) filter.submittedAt.$lte = new Date(endDate);
        }

        console.log('Final filter applied:', JSON.stringify(filter, null, 2));
        
        const enquiries = await Enquiry.find(filter).sort({ submittedAt: -1 });
        console.log('Raw enquiries found:', enquiries.length);
        
        return enquiries;
    }

    static async updateEnquiryStatusService(enquiryId, status) {
        console.log('updateEnquiryStatusService called with:', { enquiryId, status });
        
        const enquiry = await Enquiry.findByIdAndUpdate(
            enquiryId,
            { status },
            { new: true, runValidators: true }
        );

        console.log('Database update result:', enquiry);

        if (!enquiry) {
            throw new Error('Enquiry not found');
        }

        return enquiry;
    }

    static async updateEnquiryResponseMessageService(enquiryId, responseMessage) {
        const enquiry = await Enquiry.findByIdAndUpdate(
            enquiryId,
            { responseMessage },
            { new: true, runValidators: true }
        );
        if (!enquiry) {
            throw new Error('Enquiry not found');
        }
        return enquiry;
    }

    static async getUserWishlistWithProductsService(userId) {
        if (!userId) return [];
        const wishlistItems = await WishlistItem.find({ userId }).populate('productId');
        // Map to product details
        return wishlistItems.map(item => {
            const product = item.productId;
            return {
                id: product._id,
                title: product.title,
                modelNumber: product.modelNumber,
                imageUrl: product.imageUrl,
                category: product.category
            };
        });
    }
}