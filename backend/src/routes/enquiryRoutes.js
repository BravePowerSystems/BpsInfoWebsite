import express from 'express';
import { createEnquiryController, getEnquiriesController, updateEnquiryStatusController, getUserEnquiriesController, updateEnquiryResponseMessageController, getUserWishlistForEnquiryController } from '../controllers/enquiryController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - anyone can submit an enquiry
router.post('/', createEnquiryController);

// Protected routes - only admin can access
router.get('/', verifyToken, requireRole('admin'), getEnquiriesController);
router.patch('/:id/status', verifyToken, requireRole('admin'), updateEnquiryStatusController);
router.patch('/:id/response', verifyToken, requireRole('admin'), updateEnquiryResponseMessageController);

// Protected route - user can get their own enquiries
router.get('/my', verifyToken, getUserEnquiriesController);

// Admin can fetch a user's wishlist for a given enquiry
router.get('/wishlist', verifyToken, requireRole('admin'), getUserWishlistForEnquiryController);

export default router;