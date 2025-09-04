import express from 'express';
import {
    getAllContent,
    getContentById,
    getContentBySlug,
    getContentByType,
    getFeaturedContent,
    searchContent,
    createContent,
    updateContent,
    deleteContent,
    getContentTypes,
    getContentStats
} from '../controllers/contentController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllContent);
router.get('/types', getContentTypes);
router.get('/featured', getFeaturedContent);
router.get('/search', searchContent);
router.get('/type/:type', getContentByType);
router.get('/slug/:slug', getContentBySlug);
router.get('/:id', getContentById);

// Protected routes (admin only)
router.post('/', verifyToken, requireRole('admin'), createContent);
router.put('/:id', verifyToken, requireRole('admin'), updateContent);
router.delete('/:id', verifyToken, requireRole('admin'), deleteContent);
router.get('/stats/overview', verifyToken, requireRole('admin'), getContentStats);

export default router;
