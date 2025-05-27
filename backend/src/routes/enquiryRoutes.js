import express from 'express';
import { createEnquiry, getEnquiries, updateEnquiryStatus } from '../controllers/enquiryController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - anyone can submit an enquiry
router.post('/', createEnquiry);

// Protected routes - only admin can access
router.get('/', verifyToken, requireRole('admin'), getEnquiries);
router.patch('/:id/status', verifyToken, requireRole('admin'), updateEnquiryStatus);

export default router;