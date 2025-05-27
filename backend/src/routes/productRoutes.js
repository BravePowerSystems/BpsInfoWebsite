import express from 'express';
import { getProducts, getProductByDetails } from '../controllers/productController.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:category/:productName', getProductByDetails);  

export default router;
