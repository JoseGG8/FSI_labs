import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/ordersController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, createOrder);
router.get('/me', requireAuth, getMyOrders);
router.get('/', requireAuth, requireRole('administrador'), getAllOrders);
router.get('/:id', requireAuth, getOrderById);
router.patch('/:id/status', requireAuth, requireRole('administrador'), updateOrderStatus);

export default router;
