
import express from 'express';
import { 
    getUserWishlist,
    addToWishlist,
    removeFromWishlist
} from '../controllers/wishlistController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(verifyToken);

// Get user's wishlist
router.get('/', getUserWishlist);

// Add item to wishlist
router.post('/', addToWishlist);

// Remove item from wishlist
router.delete('/:wishlistItemId', removeFromWishlist);

export default router;

