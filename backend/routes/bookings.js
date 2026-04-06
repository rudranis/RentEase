import express from 'express';
import auth from '../middleware/auth.js';
import {
    createBooking,
    verifyBookingOtp,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    getMyBookingsAsRenter,
    getMyBookingsAsOwner,
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', auth, createBooking);
router.post('/:id/verify-otp', auth, verifyBookingOtp);
router.get('/:id', auth, getBookingById);
router.put('/:id/status', auth, updateBookingStatus);
router.put('/:id/cancel', auth, cancelBooking);
router.get('/my/renter', auth, getMyBookingsAsRenter);
router.get('/my/owner', auth, getMyBookingsAsOwner);

export default router;
