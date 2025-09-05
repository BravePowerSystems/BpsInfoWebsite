import express from 'express';

import { register, login, logout, refreshToken, getProfile, updateProfile, forgotPassword, resetPassword, validateResetToken } from "../controllers/authController.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/validate-reset-token/:token', validateResetToken);

// User profile routes (these might be in userRoutes, but adding here for completeness)
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;