import User from '../models/User.js';

// ✅ Helper: consistent user shape returned from all endpoints
const buildUserResponse = (user) => ({
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    avatar: user.avatar || '',
    bio: user.bio || '',
    role: user.role,
    location: user.location || {},
    ratings: user.ratings || { average: 0, count: 0 },
    createdAt: user.createdAt,
});

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ✅ FIX: return as 'user' key; Profile.jsx uses response.data.user
        res.status(200).json({
            user: buildUserResponse(user),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, phone, bio, location } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name.trim();
        if (phone !== undefined) user.phone = phone;
        if (bio !== undefined) user.bio = bio;
        if (location) user.location = { ...user.location, ...location };

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: buildUserResponse(user),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // req.file.path is the Cloudinary URL when using CloudinaryStorage
        user.avatar = req.file.path;
        await user.save();

        res.status(200).json({
            message: 'Avatar uploaded successfully',
            avatar: user.avatar,
            user: buildUserResponse(user),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(req.userId);

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUserListings = async (req, res) => {
    try {
        const { page = 1, limit = 12 } = req.query;
        const Listing = (await import('../models/Listing.js')).default;
        const skip = (page - 1) * limit;

        const listings = await Listing.find({ owner: req.userId })
            .skip(skip)
            .limit(Number(limit))
            .sort('-createdAt');

        const total = await Listing.countDocuments({ owner: req.userId });

        // ✅ FIX: return as 'listings' key; MyListings.jsx uses response.data.listings
        res.status(200).json({
            listings,
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

export const getUserBookings = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const Booking = (await import('../models/Booking.js')).default;
        const skip = (page - 1) * limit;

        const bookings = await Booking.find({ renter: req.userId })
            .populate('listing')
            .populate('owner', 'name avatar phone')
            .skip(skip)
            .limit(Number(limit))
            .sort('-createdAt');

        const total = await Booking.countDocuments({ renter: req.userId });

        res.status(200).json({
            bookings,
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