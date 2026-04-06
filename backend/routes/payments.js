import express from 'express';
import auth from '../middleware/auth.js';
import {
    createOrder,
    verifyPayment,
    refundPayment,
    getPaymentDetails,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', auth, createOrder);
router.post('/verify', auth, verifyPayment);
router.post('/refund/:paymentId', auth, refundPayment);
router.get('/:paymentId', auth, getPaymentDetails);

export default router;
