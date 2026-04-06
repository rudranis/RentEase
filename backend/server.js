// ✅ Load env FIRST (only once)
import "dotenv/config";

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { createServer } from 'http';
import { Server } from 'socket.io';

import socketHandler from './socket/socketHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import listingRoutes from './routes/listings.js';
import bookingRoutes from './routes/bookings.js';
import paymentRoutes from './routes/payments.js';
import reviewRoutes from './routes/reviews.js';
import messageRoutes from './routes/messages.js';
import User from './models/User.js';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const server = createServer(app);

// ✅ DEBUG (remove later)
console.log("ENV CHECK:");
console.log("CLOUD:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("KEY:", process.env.CLOUDINARY_API_KEY);
console.log("SECRET:", process.env.CLOUDINARY_API_SECRET);

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3001',
    'http://localhost:3001',
];

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// DB connect
const createRootAdmin = async () => {
    try {
        const adminEmail = process.env.ROOT_ADMIN_EMAIL || 'admin@rentapp.com';
        const adminPassword = process.env.ROOT_ADMIN_PASSWORD || 'Admin@123';

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            await User.create({
                name: 'Root Admin',
                email: adminEmail,
                password: adminPassword,
                phone: process.env.ROOT_ADMIN_PHONE || '9999999999',
                role: 'admin',
                isVerified: true,
                bio: 'Root administrator with full access',
            });

            console.log(`Root admin created: ${adminEmail}`);
        } else {
            console.log(`Root admin already exists`);
        }
    } catch (error) {
        console.error('Admin creation failed:', error.message);
    }
};

connectDB().then(createRootAdmin);

// Middleware
app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

// Rate limit (Relaxed for development/testing)
app.use('/api/', rateLimit({ windowMs: 5 * 60 * 1000, max: 1000 }));
app.use('/api/auth/login', rateLimit({ windowMs: 5 * 60 * 1000, max: 100 }));
app.use('/api/auth/register', rateLimit({ windowMs: 5 * 60 * 1000, max: 100 }));

// Attach IO to req
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

// Health
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Socket
socketHandler(io);

// Error handler
app.use(errorHandler);

// 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});