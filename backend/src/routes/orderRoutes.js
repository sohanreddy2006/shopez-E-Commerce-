import express from 'express';
import { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').post(createOrder);
router.get('/my-orders', getMyOrders);
router.get('/admin/all', adminOnly, getAllOrders);
router.route('/:id').get(getOrderById);
router.put('/:id/status', adminOnly, updateOrderStatus);

export default router;
