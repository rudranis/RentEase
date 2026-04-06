import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import { sendEmail } from '../utils/sendEmail.js';
import Notification from '../models/Notification.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const createBooking = async (req, res) => {
    try {
        const {
            listingId,
            startDate,
            endDate,
            deliveryRequired,
            deliveryAddress,
            notes,
        } = req.body;

        if (!listingId || !startDate || !endDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const listing = await Listing.findById(listingId).populate('owner');

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (totalDays <= 0) {
            return res.status(400).json({ message: 'Invalid date range' });
        }

        const totalAmount =
            totalDays * listing.pricePerDay +
            (deliveryRequired ? listing.deliveryCharge : 0);

        const renter = await User.findById(req.userId);
        if (!renter) {
            return res.status(404).json({ message: 'Renter account not found' });
        }

        const bookingOTP = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const booking = new Booking({
            listing: listingId,
            renter: req.userId,
            owner: listing.owner._id,
            startDate: start,
            endDate: end,
            totalDays,
            totalAmount,
            deposit: listing.deposit,
            deliveryRequired,
            deliveryAddress,
            deliveryCharge: deliveryRequired ? listing.deliveryCharge : 0,
            notes,
            bookingOTP,
            otpExpiry,
            otpVerified: false,
        });

        await booking.save();

        // Update booked dates in listing
        listing.availability.bookedDates.push({ from: start, to: end });
        await listing.save();

        // Send OTP to renter for booking confirmation
        await sendEmail(
            renter.email,
            'bookingOtp',
            {
                name: renter.name,
                otp: bookingOTP,
                listingTitle: listing.title,
                startDate,
                endDate,
                amount: totalAmount,
            }
        );

        // Send booking request email to owner
        await sendEmail(
            listing.owner.email,
            'bookingRequest',
            {
                ownerName: listing.owner.name,
                renterName: renter.name,
                listingTitle: listing.title,
                startDate,
                endDate,
                amount: totalAmount,
            }
        );

        // Create notification
        await Notification.create({
            user: listing.owner._id,
            type: 'booking_request',
            title: `New booking request for ${listing.title}`,
            message: `A user wants to book your ${listing.title}`,
            data: { bookingId: booking._id, listingId },
        });

        res.status(201).json({
            message: 'Booking request created. An OTP has been sent to your email to confirm the booking.',
            booking,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const verifyBookingOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const booking = await Booking.findById(req.params.id).select('+bookingOTP +otpExpiry');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.renter.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (!otp) {
            return res.status(400).json({ message: 'OTP is required' });
        }

        if (booking.bookingOTP !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > booking.otpExpiry) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new booking.' });
        }

        booking.otpVerified = true;
        booking.bookingOTP = undefined;
        booking.otpExpiry = undefined;
        await booking.save();

        res.status(200).json({
            message: 'OTP verified successfully. You may proceed to payment.',
            booking,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('listing')
            .populate('renter', 'name email phone avatar')
            .populate('owner', 'name email phone avatar');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const booking = await Booking.findById(req.params.id)
            .populate('listing')
            .populate('renter')
            .populate('owner');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.owner._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

        // Send notifications based on status
        if (status === 'confirmed') {
            await sendEmail(
                booking.renter.email,
                'bookingConfirmed',
                {
                    renterName: booking.renter.name,
                    listingTitle: booking.listing.title,
                    ownerName: booking.owner.name,
                    ownerPhone: booking.owner.phone,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    bookingId: booking._id.toString(),
                }
            );

            await Notification.create({
                user: booking.renter._id,
                type: 'booking_confirmed',
                title: 'Booking confirmed!',
                message: `Your booking for ${booking.listing.title} has been confirmed`,
                data: { bookingId: booking._id },
            });
        } else if (status === 'rejected') {
            await sendEmail(
                booking.renter.email,
                'bookingRejected',
                {
                    renterName: booking.renter.name,
                    listingTitle: booking.listing.title,
                    reason: req.body.reason || '',
                }
            );

            await Notification.create({
                user: booking.renter._id,
                type: 'booking_cancelled',
                title: 'Booking rejected',
                message: `Your booking for ${booking.listing.title} has been rejected`,
                data: { bookingId: booking._id },
            });
        }

        res.status(200).json({
            message: 'Booking status updated',
            booking,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('listing')
            .populate('renter')
            .populate('owner');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.renter._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.status === 'completed' || booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot cancel this booking' });
        }

        booking.status = 'cancelled';
        booking.cancellationReason = req.body.reason || '';
        await booking.save();

        // Remove from booked dates
        const listing = await Listing.findById(booking.listing._id);
        listing.availability.bookedDates = listing.availability.bookedDates.filter(
            date =>
                !(
                    new Date(date.from).getTime() === new Date(booking.startDate).getTime() &&
                    new Date(date.to).getTime() === new Date(booking.endDate).getTime()
                )
        );
        await listing.save();

        // Send notifications
        await sendEmail(
            booking.owner.email,
            'bookingCancelled',
            {
                name: booking.owner.name,
                listingTitle: booking.listing.title,
                reason: booking.cancellationReason,
            }
        );

        res.status(200).json({
            message: 'Booking cancelled successfully',
            booking,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getMyBookingsAsRenter = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const skip = (page - 1) * limit;

        let filter = { renter: req.userId };
        if (status) filter.status = status;

        const bookings = await Booking.find(filter)
            .populate('listing')
            .populate('owner', 'name avatar phone')
            .skip(skip)
            .limit(Number(limit))
            .sort('-createdAt');

        const total = await Booking.countDocuments(filter);

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

export const getMyBookingsAsOwner = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const skip = (page - 1) * limit;

        let filter = { owner: req.userId };
        if (status) filter.status = status;

        const bookings = await Booking.find(filter)
            .populate('listing')
            .populate('renter', 'name avatar phone')
            .skip(skip)
            .limit(Number(limit))
            .sort('-createdAt');

        const total = await Booking.countDocuments(filter);

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
