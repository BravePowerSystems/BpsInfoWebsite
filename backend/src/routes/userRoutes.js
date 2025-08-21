import express from 'express';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import { getProfile, updateProfile } from '../controllers/authController.js';

const router = express.Router();

router.get("/admin", verifyToken, requireRole('admin'), (req, res) => {
    res.json({message: "Welcome Admin!"});
});

router.get("/user", verifyToken, requireRole('user'), (req, res) => {
    res.json({message: "Welcome User!"});
});

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

export default router;
