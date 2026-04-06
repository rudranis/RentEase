import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['apartment', 'bike', 'car', 'tools', 'electronics', 'furniture', 'books', 'sports', 'other'],
        required: true,
    },
    images: [
        {
            type: String,
        },
    ],
    pricePerDay: {
        type: Number,
        required: true,
        min: 0,
    },
    pricePerWeek: {
        type: Number,
        min: 0,
    },
    deposit: {
        type: Number,
        required: true,
        min: 0,
    },
    location: {
        address: String,
        city: {
            type: String,
            required: true,
        },
        state: String,
        pincode: String,
        coordinates: {
            lat: Number,
            lng: Number,
        },
    },
    deliveryAvailable: {
        type: Boolean,
        default: false,
    },
    deliveryRadius: {
        type: Number,
        default: 0,
    },
    deliveryCharge: {
        type: Number,
        default: 0,
    },
    availability: {
        isAvailable: {
            type: Boolean,
            default: true,
        },
        bookedDates: [
            {
                from: Date,
                to: Date,
            },
        ],
    },
    amenities: [String],
    rules: [String],
    isActive: {
        type: Boolean,
        default: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes for performance
listingSchema.index({ owner: 1 });
listingSchema.index({ 'location.city': 1 });
listingSchema.index({ category: 1 });
listingSchema.index({ title: 'text', description: 'text' });
listingSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model('Listing', listingSchema);
