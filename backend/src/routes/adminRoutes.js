import express from 'express';
import { getAdminSettings, getAdminSummary, getUsers, updateAdminSettings } from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/settings', getAdminSettings);
router.use(protect, adminOnly);
router.get('/summary', getAdminSummary);
router.get('/users', getUsers);
router.put('/settings', updateAdminSettings);

export default router;
