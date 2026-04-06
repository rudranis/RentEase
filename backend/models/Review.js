import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['listing', 'user'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ listing: 1 });
reviewSchema.index({ booking: 1 });

export default mongoose.model('Review', reviewSchema);
