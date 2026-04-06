import express from 'express';
import auth from '../middleware/auth.js';
import {
    createReview,
    getListingReviews,
    getUserReviews,
    deleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', auth, createReview);
router.get('/listing/:listingId', getListingReviews);
router.get('/user/:userId', getUserReviews);
router.delete('/:id', auth, deleteReview);

export default router;
