import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// ✅ FIX: Helper to build consistent user response object
// Always return _id (not just id) so frontend user._id works everywhere
const buildUserResponse = (user) => ({
    _id: user._id,          // ✅ FIX: was returning 'id' before, causing user._id to be undefined
    id: user._id,           // keep id for backwards compat
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    avatar: user.avatar || '',
    bio: user.bio || '',
    role: user.role,
    location: user.location || {},
    ratings: user.ratings || { average: 0, count: 0 },
    isVerified: user.isVerified,
    createdAt: user.createdAt,
});

export const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;
        const avatar = req.file?.path || '';

        console.log(`\n📝 REGISTER REQUEST: ${new Date().toISOString()}`);
        console.log(`   Email: ${email}`);
        console.log(`   Name: ${name}`);
        console.log(`   Phone: ${phone}`);

        if (!name || !email || !password || !confirmPassword || !phone) {
            console.log(`   ❌ Missing required fields`);
            const errResponse = { message: 'Name, email, password, confirm password, and phone are required' };
            console.log(`   📤 REGISTER RESPONSE: 400 Bad Request -`, errResponse);
            return res.status(400).json(errResponse);
        }

        if (password !== confirmPassword) {
            console.log(`   ❌ Passwords do not match`);
            const errResponse = { message: 'Passwords do not match' };
            console.log(`   📤 REGISTER RESPONSE: 400 Bad Request -`, errResponse);
            return res.status(400).json(errResponse);
        }

        if (password.length < 6) {
            console.log(`   ❌ Password too short`);
            const errResponse = { message: 'Password must be at least 6 characters' };
            console.log(`   📤 REGISTER RESPONSE: 400 Bad Request -`, errResponse);
            return res.status(400).json(errResponse);
        }

        let user = await User.findOne({ email });
        if (user) {
            console.log(`   ❌ Email already exists - User ID: ${user._id}`);
            const errResponse = { message: 'An account with this email already exists' };
            console.log(`   📤 REGISTER RESPONSE: 400 Bad Request -`, errResponse);
            return res.status(400).json(errResponse);
        }

        console.log(`   ✅ Validation passed, creating user...`);

        const registrationOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user = new User({
            name,
            email,
            password,
            phone,
            avatar,
            isVerified: true,
            verificationOTP: registrationOtp,
            otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
        });

        await user.save();

        console.log(`   ✅ User created successfully - ID: ${user._id}`);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const welcomeLink = `${frontendUrl}`;

        try {
            await sendEmail(email, 'welcome', { name, otp: registrationOtp });
            console.log(`   ✅ Registration OTP email sent to ${email}`);
        } catch (emailError) {
            console.error(`   ⚠️ Registration OTP email failed:`, emailError.message);
            return res.status(500).json({ message: 'Registration succeeded but failed to send OTP email. Please try again later.' });
        }

        const response = {
            message: 'Registration successful. Check your email for the OTP.',
            userId: user._id,
        };

        console.log(`   📤 REGISTER RESPONSE: 201 Created -`, response);
        res.status(201).json(response);
    } catch (error) {
        console.error(`   ❌ REGISTER ERROR:`, error.message);
        const errResponse = { message: 'Server error', error: error.message };
        console.log(`   📤 REGISTER RESPONSE: 500 Server Error -`, errResponse);
        res.status(500).json(errResponse);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(`\n🔐 LOGIN REQUEST: ${new Date().toISOString()}`);
        console.log(`   Email: ${email}`);

        if (!email || !password) {
            console.log(`   ❌ Missing email or password`);
            return res.status(400).json({ message: 'Email and password are required' });
        }

        console.log(`   🔍 Looking up user in database...`);
        let user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log(`   ❌ User not found`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log(`   ✅ User found - ID: ${user._id}`);
        console.log(`   🔑 Verifying password...`);

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            console.log(`   ❌ Password incorrect`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log(`   ✅ Password verified`);
        const token = generateToken(user._id, user.role);
        console.log(`   🎫 Token generated`);

        console.log(`   ✅ LOGIN RESPONSE: 200 OK - User: ${user.name} (${user.role})`);
        res.status(200).json({
            message: 'Login successful',
            token,
            // ✅ FIX: return _id so frontend user._id works in Profile, Chat, etc.
            user: buildUserResponse(user),
        });
    } catch (error) {
        console.error(`   ❌ LOGIN ERROR:`, error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const logout = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if email exists for security
            return res.status(200).json({
                message: 'If that email exists, a reset link has been sent.',
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.verificationOTP = resetTokenHash;
        user.otpExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

        try {
            await sendEmail(email, 'passwordReset', { name: user.name, resetLink });
            return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
        } catch (emailErr) {
            console.error('Password reset email failed:', emailErr.message);
            return res.status(500).json({ message: 'Failed to send reset email. Please try again later.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            verificationOTP: resetTokenHash,
            otpExpiry: { $gt: new Date() },
        }).select('+verificationOTP +otpExpiry');

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        user.password = password;
        user.verificationOTP = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful. Please login.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            // ✅ FIX: return _id consistently
            user: buildUserResponse(user),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};