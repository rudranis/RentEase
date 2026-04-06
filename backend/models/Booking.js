import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
    },
    renter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    totalDays: {
        type: Number,
        required: true,
        min: 1,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    deposit: {
        type: Number,
        default: 0,
    },
    deliveryRequired: {
        type: Boolean,
        default: false,
    },
    deliveryAddress: String,
    deliveryCharge: {
        type: Number,
        default: 0,
    },
    bookingOTP: {
        type: String,
        select: false,
    },
    otpExpiry: {
        type: Date,
        select: false,
    },
    otpVerified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending',
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    cancellationReason: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes
bookingSchema.index({ renter: 1 });
bookingSchema.index({ owner: 1 });
bookingSchema.index({ listing: 1 });
bookingSchema.index({ status: 1 });

export default mongoose.model('Booking', bookingSchema);
