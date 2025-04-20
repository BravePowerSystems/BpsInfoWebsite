import express from 'express';
import { getProducts, getProductByDetails } from '../controllers/productController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:category/:productName', getProductByDetails);

// Protected routes (if needed)
// router.post('/', verifyToken, requireRole('admin'), createProduct);
// router.put('/:id', verifyToken, requireRole('admin'), updateProduct);
// router.delete('/:id', verifyToken, requireRole('admin'), deleteProduct);

export default router;