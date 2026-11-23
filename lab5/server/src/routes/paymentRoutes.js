import { Router } from 'express';
import {
  getPaypalConfig,
  createPaypalPaymentOrder,
  capturePaypalPaymentOrder,
  getPaymentsByOrder
} from '../controllers/paymentsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/config', getPaypalConfig);
router.post('/paypal/order', requireAuth, createPaypalPaymentOrder);
router.post('/paypal/capture', requireAuth, capturePaypalPaymentOrder);
router.get('/order/:orderId', requireAuth, getPaymentsByOrder);

export default router;
