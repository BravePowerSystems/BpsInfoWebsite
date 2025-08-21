import express from 'express';
import { 
    getAllProducts, 
    getProductById, 
    getProductsByCategory,
    getProductByDetails,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);
router.get('/details/:category/:productName', getProductByDetails);

// Admin only routes
router.post('/', verifyToken, requireRole('admin'), createProduct);
router.put('/:id', verifyToken, requireRole('admin'), updateProduct);
router.delete('/:id', verifyToken, requireRole('admin'), deleteProduct);

export default router;





