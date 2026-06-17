import express from 'express';
import { getCurrentUser, loginUser, logoutUser, registerUser, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate, loginSchema, registerSchema } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), registerUser);
router.post('/login', authLimiter, validate(loginSchema), loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);

export default router;
