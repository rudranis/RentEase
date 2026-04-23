import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';
import Notification from '../models/Notification.js';

// Lazy initialize Razorpay instance
let razorpay;
const getRazorpayInstance = () => {
    if (!razorpay) {
        const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

        console.log('Razorpay config loaded:', {
            keyId: razorpayKeyId ? 'set' : 'missing',
            keySecret: razorpayKeySecret ? 'set' : 'missing',
        });

        if (razorpayKeyId && razorpayKeySecret) {
            razorpay = new Razorpay({
                key_id: razorpayKeyId,
                key_secret: razorpayKeySecret,
            });
        }
    }
    return razorpay;
};

export const createOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }

        const booking = await Booking.findById(bookingId)
            .populate('renter')
            .populate('owner');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (!booking.otpVerified) {
            return res.status(400).json({ message: 'OTP verification is required before payment' });
        }

        if (booking.renter._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Validate amount
        if (!booking.totalAmount || booking.totalAmount <= 0) {
            return res.status(400).json({
                message: 'Invalid booking amount. Please ensure the listing has valid pricing.',
                totalAmount: booking.totalAmount
            });
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(booking.totalAmount * 100), // Amount in paise
            currency: 'INR',
            receipt: booking._id.toString(),
            notes: {
                bookingId: booking._id.toString(),
                userId: req.userId,
            },
        };

        const rz = getRazorpayInstance();
        if (!rz) {
            return res.status(500).json({ message: 'Payment gateway not configured' });
        }
        console.log('Creating Razorpay order with options:', {
            amount: options.amount,
            currency: options.currency,
            receipt: options.receipt,
        });

        const order = await rz.orders.create(options);

        // Create payment record
        const payment = new Payment({
            booking: bookingId,
            payer: booking.renter._id,
            payee: booking.owner._id,
            amount: booking.totalAmount,
            razorpayOrderId: order.id,
            status: 'created',
        });

        await payment.save();

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            paymentId: payment._id,
        });
    } catch (error) {
        console.error('Razorpay createOrder error:', error);
        const errorMessage =
            error.description ||
            error.error?.description ||
            error.message ||
            'Server error';
        const status = error.statusCode || 500;
        res.status(status).json({ message: errorMessage });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            paymentId,
        } = req.body;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(400).json({ message: 'Missing payment details' });
        }

        // Verify signature
        const text =
            razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        // Update payment record
        const payment = await Payment.findById(paymentId)
            .populate('booking')
            .populate('payer')
            .populate('payee');

        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        payment.razorpayPaymentId = razorpayPaymentId;
        payment.razorpaySignature = razorpaySignature;
        payment.status = 'paid';
        await payment.save();

        // Update booking status
        const booking = await Booking.findById(payment.booking._id)
            .populate('listing')
            .populate('renter')
            .populate('owner');

        booking.paymentStatus = 'paid';
        booking.paymentId = payment._id;
        booking.status = 'confirmed';
        await booking.save();

        // Send confirmation emails
        await sendEmail(
            payment.payer.email,
            'paymentSuccessful',
            {
                renterName: payment.payer.name,
                bookingId: booking._id.toString(),
                listingTitle: booking.listing.title,
                amount: payment.amount,
            }
        );

        await sendEmail(
            payment.payee.email,
            'paymentReceived',
            {
                ownerName: payment.payee.name,
                renterName: payment.payer.name,
                bookingId: booking._id.toString(),
                amount: payment.amount,
            }
        );

        // Create notifications
        await Notification.create({
            user: payment.payer._id,
            type: 'payment_received',
            title: 'Payment successful',
            message: 'Your payment has been processed successfully',
            data: { bookingId: booking._id },
        });

        await Notification.create({
            user: payment.payee._id,
            type: 'payment_received',
            title: 'Payment received',
            message: `You received payment for ${booking.listing.title}`,
            data: { bookingId: booking._id },
        });

        res.status(200).json({
            message: 'Payment verified successfully',
            booking,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const refundPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId)
            .populate('booking')
            .populate('payer')
            .populate('payee');

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        if (payment.payee._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (payment.status !== 'paid') {
            return res.status(400).json({ message: 'Can only refund paid payments' });
        }

        // Create refund via Razorpay
        const rz = getRazorpayInstance();
        if (!rz) {
            return res.status(500).json({ message: 'Payment gateway not configured' });
        }
        const refund = await rz.payments.refund(payment.razorpayPaymentId, {
            amount: Math.round(payment.amount * 100), // Amount in paise
        });

        payment.status = 'refunded';
        payment.refundId = refund.id;
        payment.refundAmount = payment.amount;
        await payment.save();

        // Update booking
        const booking = await Booking.findById(payment.booking._id);
        booking.paymentStatus = 'refunded';
        booking.status = 'cancelled';
        await booking.save();

        // Send refund email
        await sendEmail(
            payment.payer.email,
            'bookingCancelled',
            {
                name: payment.payer.name,
                listingTitle: booking.listing.title,
                reason: 'Refund processed by host',
            }
        );

        res.status(200).json({
            message: 'Refund processed successfully',
            refundId: refund.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getPaymentDetails = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId)
            .populate('booking')
            .populate('payer', 'name email')
            .populate('payee', 'name email');

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
