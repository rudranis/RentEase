import express from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
    getAllListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
    getListingsByCategory,
    searchListings,
} from '../controllers/listingController.js';

const router = express.Router();

router.get('/', getAllListings);
router.get('/category/:category', getListingsByCategory);
router.get('/search', searchListings);
router.get('/:id', getListingById);
router.post('/', auth, upload.array('images', 10), createListing);
router.put('/:id', auth, upload.array('images', 10), updateListing);
router.delete('/:id', auth, deleteListing);

export default router;
