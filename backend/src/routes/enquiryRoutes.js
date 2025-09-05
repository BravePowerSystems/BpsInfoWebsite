import express from 'express';
import { createEnquiryController, getEnquiriesController, updateEnquiryStatusController, getUserEnquiriesController, updateEnquiryResponseMessageController, getUserWishlistForEnquiryController } from '../controllers/enquiryController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createEnquiryController);

router.get('/', verifyToken, requireRole('admin'), getEnquiriesController);
router.patch('/:id/status', verifyToken, requireRole('admin'), updateEnquiryStatusController);
router.patch('/:id/response', verifyToken, requireRole('admin'), updateEnquiryResponseMessageController);
router.get('/my', verifyToken, getUserEnquiriesController);
router.get('/wishlist', verifyToken, requireRole('admin'), getUserWishlistForEnquiryController);

export default router;