import express from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
    getProfile,
    updateProfile,
    uploadAvatar,
    deleteAccount,
    getUserListings,
    getUserBookings,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/profile/:id', getProfile);
router.put('/profile', auth, updateProfile);
router.put('/profile/avatar', auth, upload.single('avatar'), uploadAvatar);
router.delete('/account', auth, deleteAccount);
router.get('/my-listings', auth, getUserListings);
router.get('/my-bookings', auth, getUserBookings);

export default router;
