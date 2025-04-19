import express from 'express';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/admin", verifyToken, requireRole('admin'), (req, res) => {
    res.json({message: "Welcome Admin!"});
});

router.get("/user", verifyToken, requireRole('user'), (req, res) => {
    res.json({message: "Welcome User!"});
});

export default router;
