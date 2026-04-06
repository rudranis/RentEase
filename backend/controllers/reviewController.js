import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';
import Notification from '../models/Notification.js';

export const createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment, type } = req.body;

        if (!bookingId || !rating || !comment || !type) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const booking = await Booking.findById(bookingId)
            .populate('renter')
            .populate('owner')
            .populate('listing');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== 'completed') {
            return res.status(400).json({ message: 'Can only review completed bookings' });
        }

        // Check if already reviewed
        let review = await Review.findOne({
            booking: bookingId,
            reviewer: req.userId,
        });

        if (review) {
            return res.status(400).json({ message: 'You already reviewed this booking' });
        }

        let reviewee;
        if (type === 'listing') {
            reviewee = booking.owner._id;
        } else if (type === 'user') {
            reviewee = booking.renter._id;
        } else {
            return res.status(400).json({ message: 'Invalid review type' });
        }

        review = new Review({
            listing: type === 'listing' ? booking.listing._id : undefined,
            booking: bookingId,
            reviewer: req.userId,
            reviewee,
            rating,
            comment,
            type,
        });

        await review.save();

        // Update average ratings
        const reviews = await Review.find({
            reviewee,
            type,
        });

        const avgRating =
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        if (type === 'listing') {
            const listing = await Listing.findById(booking.listing._id);
            listing.ratings.average = Math.round(avgRating * 10) / 10;
            listing.ratings.count = reviews.length;
            await listing.save();
        } else {
            const user = await User.findById(reviewee);
            user.ratings.average = Math.round(avgRating * 10) / 10;
            user.ratings.count = reviews.length;
            await user.save();
        }

        // Send notification
        const user = await User.findById(req.userId);
        await sendEmail(
            booking.owner.email,
            'reviewReceived',
            {
                name: booking.owner.name,
                reviewerName: user.name,
                rating,
                comment,
            }
        );

        await Notification.create({
            user: reviewee,
            type: 'review_received',
            title: 'New review received',
            message: `${user.name} left a ${rating}-star review`,
            data: { reviewId: review._id },
        });

        res.status(201).json({
            message: 'Review posted successfully',
            review,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getListingReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ listing: req.params.listingId })
            .populate('reviewer', 'name avatar')
            .skip(skip)
            .limit(Number(limit))
            .sort('-createdAt');

        const total = await Review.countDocuments({ listing: req.params.listingId });

        res.status(200).json({
            reviews,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUserReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'name avatar')
            .skip(skip)
            .limit(Number(limit))
            .sort('-createdAt');

        const total = await Review.countDocuments({ reviewee: req.params.userId });

        res.status(200).json({
            reviews,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.reviewer.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const reviewee = review.reviewee;

        await Review.findByIdAndDelete(req.params.id);

        // Recalculate ratings
        const reviews = await Review.find({ reviewee });
        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        if (review.type === 'listing') {
            const listing = await Listing.findById(review.listing);
            listing.ratings.average = Math.round(avgRating * 10) / 10;
            listing.ratings.count = reviews.length;
            await listing.save();
        } else {
            const user = await User.findById(reviewee);
            user.ratings.average = Math.round(avgRating * 10) / 10;
            user.ratings.count = reviews.length;
            await user.save();
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
