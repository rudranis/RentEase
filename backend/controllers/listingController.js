import Listing from '../models/Listing.js';
import User from '../models/User.js';

export const getAllListings = async (req, res) => {
    try {
        const {
            category,
            city,
            minPrice,
            maxPrice,
            deliveryAvailable,
            search,
            page = 1,
            limit = 12,
            sort = '-createdAt',
        } = req.query;

        let filter = { isActive: true };

        if (category) filter.category = category;
        if (city) filter['location.city'] = new RegExp(city, 'i');
        if (deliveryAvailable === 'true') filter.deliveryAvailable = true;

        if (minPrice || maxPrice) {
            filter.pricePerDay = {};
            if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
            if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
        }

        if (search) {
            filter.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
            ];
        }

        const skip = (page - 1) * limit;

        const listings = await Listing.find(filter)
            .populate('owner', 'name avatar ratings')
            .skip(skip)
            .limit(Number(limit))
            .sort(sort);

        const total = await Listing.countDocuments(filter);

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

export const getListingById = async (req, res) => {
    try {
        let listing = await Listing.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('owner', 'name avatar phone bio ratings');

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.status(200).json(listing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const createListing = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            pricePerDay,
            pricePerWeek,
            deposit,
            location,
            deliveryAvailable,
            deliveryRadius,
            deliveryCharge,
            amenities,
            rules,
        } = req.body;

        console.log(`\n🏠 CREATE LISTING REQUEST: ${new Date().toISOString()}`);
        console.log(`   User ID: ${req.userId}`);
        console.log(`   Title: ${title}`);
        console.log(`   Category: ${category}`);
        console.log(`   Price/Day: ${pricePerDay}`);

        const parsedPricePerDay = Number(pricePerDay);
        const parsedDeposit = Number(deposit);
        const parsedPricePerWeek = pricePerWeek ? Number(pricePerWeek) : parsedPricePerDay * 6;

        if (
            !title ||
            !description ||
            !category ||
            Number.isNaN(parsedPricePerDay) ||
            parsedPricePerDay <= 0 ||
            Number.isNaN(parsedDeposit) ||
            parsedDeposit < 0
        ) {
            console.log(`   ❌ Missing required or invalid fields`);
            return res.status(400).json({ message: 'Required fields are missing or invalid' });
        }

        const listingLocation = typeof location === 'string' ? JSON.parse(location) : location;
        if (!listingLocation || !listingLocation.city) {
            console.log(`   ❌ Location city missing`);
            return res.status(400).json({ message: 'Location city is required' });
        }

        const imagePaths = req.files && req.files.length
            ? req.files.map((file) => file.path)
            : req.body.images || [];

        if (!imagePaths || imagePaths.length === 0) {
            console.log(`   ❌ No images provided`);
            return res.status(400).json({ message: 'At least one product image is required' });
        }

        const parsedAmenities =
            typeof amenities === 'string' && amenities.trim()
                ? JSON.parse(amenities)
                : amenities || [];
        const parsedRules =
            typeof rules === 'string' && rules.trim()
                ? JSON.parse(rules)
                : rules || [];

        const listing = new Listing({
            owner: req.userId,
            title,
            description,
            category,
            images: imagePaths,
            pricePerDay: parsedPricePerDay,
            pricePerWeek: parsedPricePerWeek,
            deposit: parsedDeposit,
            location: listingLocation,
            deliveryAvailable: deliveryAvailable === 'true' || deliveryAvailable === true,
            deliveryRadius: deliveryRadius ? Number(deliveryRadius) : 0,
            deliveryCharge: deliveryCharge ? Number(deliveryCharge) : 0,
            amenities: Array.isArray(parsedAmenities) ? parsedAmenities : [],
            rules: Array.isArray(parsedRules) ? parsedRules : [],
        });

        await listing.save();

        console.log(`   ✅ Listing created - ID: ${listing._id}`);

        res.status(201).json({
            message: 'Listing created successfully',
            listing,
        });
    } catch (error) {
        console.error(`   ❌ CREATE LISTING ERROR:`, error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.owner.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to update this listing' });
        }

        const {
            title,
            description,
            category,
            pricePerDay,
            pricePerWeek,
            deposit,
            location,
            deliveryAvailable,
            deliveryRadius,
            deliveryCharge,
            amenities,
            rules,
            isActive,
        } = req.body;

        if (title) listing.title = title;
        if (description) listing.description = description;
        if (category) listing.category = category;
        if (pricePerDay) listing.pricePerDay = pricePerDay;
        if (pricePerWeek) listing.pricePerWeek = pricePerWeek;
        if (deposit) listing.deposit = deposit;
        if (location) listing.location = location;
        if (deliveryAvailable !== undefined) listing.deliveryAvailable = deliveryAvailable;
        if (deliveryRadius) listing.deliveryRadius = deliveryRadius;
        if (deliveryCharge) listing.deliveryCharge = deliveryCharge;
        if (amenities) {
            listing.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        }
        if (rules) {
            listing.rules = typeof rules === 'string' ? JSON.parse(rules) : rules;
        }
        if (isActive !== undefined) listing.isActive = isActive;

        if (req.files && req.files.length > 0) {
            listing.images = req.files.map(file => file.path);
        }

        await listing.save();

        res.status(200).json({
            message: 'Listing updated successfully',
            listing,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.owner.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this listing' });
        }

        await Listing.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getListingsByCategory = async (req, res) => {
    try {
        const { page = 1, limit = 12 } = req.query;
        const skip = (page - 1) * limit;

        const listings = await Listing.find({
            category: req.params.category,
            isActive: true,
        })
            .populate('owner', 'name avatar')
            .skip(skip)
            .limit(Number(limit))
            .sort('-createdAt');

        const total = await Listing.countDocuments({
            category: req.params.category,
            isActive: true,
        });

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

export const searchListings = async (req, res) => {
    try {
        const { q, page = 1, limit = 12 } = req.query;
        const skip = (page - 1) * limit;

        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const listings = await Listing.find({
            $or: [
                { title: new RegExp(q, 'i') },
                { description: new RegExp(q, 'i') },
            ],
            isActive: true,
        })
            .populate('owner', 'name avatar')
            .skip(skip)
            .limit(Number(limit))
            .sort('-createdAt');

        const total = await Listing.countDocuments({
            $or: [
                { title: new RegExp(q, 'i') },
                { description: new RegExp(q, 'i') },
            ],
            isActive: true,
        });

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
