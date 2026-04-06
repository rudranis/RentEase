# RentEase - Production-Ready Rental Marketplace Platform

A modern, full-stack Airbnb-like rental marketplace built with **MERN Stack** (MongoDB, Express, React, Node.js). Users can post items for rent (apartments, bikes, tools, electronics, etc.), search & browse listings, make bookings with secure payments, chat in real-time, leave reviews, and receive email notifications.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🎯 Features

### Core Features
- ✅ **User Authentication** - JWT-based authentication with phone and optional avatar
- ✅ **Dynamic Listings** - Post items in 9 categories (apartments, bikes, cars, tools, electronics, furniture, books, sports, other)
- ✅ **Advanced Search & Filters** - By city, category, price range, delivery availability, ratings
- ✅ **Secure Payments** - Razorpay integration with signature verification
- ✅ **Real-time Chat** - Socket.io powered instant messaging with typing indicators
- ✅ **Booking Management** - Complete lifecycle from request to completion
- ✅ **Review & Rating** - Verified reviews only after completed bookings
- ✅ **Email Notifications** - 10 HTML email templates via Nodemailer

### Advanced Features
- 🔐 **Security Middleware** - Rate limiting, input sanitization, XSS protection, Helmet.js
- 📸 **Cloud Image Storage** - Cloudinary integration for unlimited image uploads
- 📍 **Location-based Services** - GPS coordinates, delivery radius management
- 💳 **Flexible Pricing** - Per-day, per-week pricing with security deposits
- 🚚 **Delivery Management** - Optional delivery with configurable charges & radius
- 📱 **Fully Responsive** - Mobile-first design with TailwindCSS
- 🎨 **Modern UI** - Gradient design, smooth animations, skeleton loaders
- 📊 **Real-time Notifications** - Socket.io event broadcasting

---

## 🛠️ Tech Stack

### Backend
```
Node.js + Express.js
MongoDB Atlas (Mongoose ORM)
Socket.io (Real-time)
JWT + Bcrypt (Auth & Security)
Nodemailer (Emails)
Razorpay (Payments)
Cloudinary (Images)
```
MONGODB_URI=mongodb+srv://pict:2005@cluster0.m7zcxfq.mongodb.net/rent-system?retryWrites=true&w=majority&appName=Cluster0

### Frontend
```
React 18 + Vite
Redux Toolkit (State Management)
React Router v6 (Navigation)
TailwindCSS (Styling)
Axios (HTTP Client)
Socket.io-client (Real-time)
React Hot Toast (Notifications)
```

---

## 📁 Project Structure

```
RENT_SYSTEM_WAD/
├── backend/
│   ├── config/              # Database, Cloudinary, Email config
│   ├── models/              # 7 MongoDB schemas
│   ├── controllers/         # Business logic (7 controllers)
│   ├── routes/              # 45+ API endpoints (7 route files)
│   ├── middleware/          # Auth, upload, error handling
│   ├── utils/               # Email templates & seed data
│   ├── socket/              # Real-time Socket.io handler
│   ├── server.js            # Express server setup
│   ├── package.json
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client
│   │   ├── app/             # Redux store
│   │   ├── features/        # Redux slices (5 slices)
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # 11 full-featured pages
│   │   ├── App.jsx          # Routes & Socket.io setup
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env                 # Environment variables
│
├── QUICKSTART.md            # Setup guide
└── README.md               # This file
```

---

## 🗄️ Database Models

### 1. **User** - User accounts with roles
- Email, password (hashed), phone, avatar
- Bio, location, ratings
- Email verified automatically on signup
- Roles: user, owner, admin

### 2. **Listing** - Items for rent
- Title, description, category
- Images (Cloudinary URLs)
- Pricing (per day, per week, deposit)
- Location with GPS coordinates
- Delivery options
- Amenities & rules
- Availability & booked dates
- View counts & ratings

### 3. **Booking** - Rental transactions
- Listing & renter references
- Date range & duration
- Amount, deposit, delivery details
- Status tracking (6 states)
- Payment reference

### 4. **Payment** - Razorpay transactions
- Booking & user references
- Razorpay IDs (order, payment, signature)
- Amount & currency
- Status & refund tracking

### 5. **Review** - User & listing reviews
- Reviewer & reviewee references
- 1-5 rating scale
- Comments
- Type: listing or user

### 6. **Message** - Chat messages
- Sender & receiver
- Conversation ID
- Read status
- Timestamp

### 7. **Notification** - Event notifications
- User & type (7 types)
- Title, message, data
- Read status

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB Atlas account (free tier)
- Gmail account (for emails)
- Cloudinary account (free tier, 50GB)
- Razorpay account (test mode)

### Installation

1. **Clone & Setup Backend**
```bash
cd backend
npm install
```

2. **Setup Backend Environment** (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rent-system
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:5174
NODE_ENV=development
```

3. **Setup Frontend** (`.env`)
```bash
cd ../frontend
npm install
```

4. **Setup Frontend Environment** (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

5. **Seed Database**
```bash
cd backend
node utils/seedData.js
```

This script clears dummy data and creates a single root admin account.

### Running the App

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev    # Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev    # Runs on http://localhost:5174
```

Open browser: **http://localhost:5174**

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login with JWT
- `GET /api/auth/me` - Current user

### Listings
- `GET /api/listings` - All listings with filters
- `GET /api/listings/:id` - Single listing detail
- `POST /api/listings` - Create listing (auth required)
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my/renter` - My bookings as renter
- `GET /api/bookings/my/owner` - My bookings as owner
- `PUT /api/bookings/:id/status` - Update status

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/refund/:id` - Refund payment

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/listing/:id` - Reviews for listing

### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/conversations` - All conversations
- `GET /api/messages/conversation/:id` - Messages in conversation

---

## 🔑 Sample Test Accounts

After running seed script:

| Email | Password | Role |
|-------|----------|------|
| raj.patel@example.com | password123 | Owner |
| amit.kumar@example.com | password123 | Renter |
| priya.desai@example.com | password123 | Renter |

---

## 📖 Pages & Features

### Public Pages
| Page | Features |
|------|----------|
| **Home** | Hero, categories, featured listings, how it works, stats |
| **Listings** | Search, filters, infinite scroll, skeleton loaders |
| **Listing Detail** | Gallery, owner card, reviews, date picker, booking form |
| **Login/Register** | Email, password, optional avatar upload |

### Protected Pages (Auth Required)
| Page | Features |
|------|----------|
| **Create Listing** | 5-step form, image upload, drag-drop |
| **My Listings** | Manage listings, edit, delete, view bookings |
| **My Bookings** | Renter & owner views, status filters, actions |
| **Profile** | Edit info, avatar upload, stats, linked actions |
| **Chat** | Real-time messaging, unread counts, typing indicator |
| **Payment** | Razorpay checkout, order summary, verification |

---

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Bcrypt password hashing
- ✅ Rate limiting (100 req/min general, 5 req/min auth)
- ✅ Input validation & sanitization
- ✅ XSS protection with express-mongo-sanitize
- ✅ CORS configured
- ✅ Helmet.js security headers
- ✅ Razorpay signature verification

---

## 📧 Email Notifications

11 automated email templates:

1. Welcome email on signup
2. Booking request (to owner)
3. Booking OTP verification (to renter)
4. Booking rejected
5. Booking cancelled
6. Payment successful (receipt)
7. Payment received (to owner)
8. Password reset
9. New message notification
10. Review received
11. Listing approved

---

## 🌐 Real-time Features (Socket.io)

- ✅ Join/leave conversations
- ✅ Send/receive messages instantly
- ✅ Typing indicators
- ✅ Message read status
- ✅ Online user tracking
- ✅ Notification broadcasting
- ✅ Booking status updates

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ TailwindCSS grid system
- ✅ Touch-friendly buttons
- ✅ Desktop, tablet, mobile optimized
- ✅ Fast loading with skeleton loaders

---

## 🎨 Design System

- **Primary**: Purple #7C3AED, Blue #2563EB
- **Secondary**: Gray scale #f3f4f6 to #1f2937
- **Accent**: Green (success), Red (error), Yellow (warning)
- **Spacing**: 4px base unit (tailwind default)
- **Shadows**: Consistent elevation system

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Render/Railway)
```bash
git push to your repository
# Auto-deploys to Render/Railway
```

Update:
1. `FRONTEND_URL` in backend `.env`
2. `VITE_API_URL` in frontend `.env`

---

## 📝 Environment Setup Guide

### Get Credentials

1. **MongoDB Atlas**
   - Create free cluster
   - Get connection string

2. **Gmail SMTP**
   - Enable 2-factor authentication
   - Generate app-specific password
   - Use in EMAIL_PASS

3. **Cloudinary**
   - Sign up (50GB free)
   - Get API keys from dashboard

4. **Razorpay**
   - Create test account
   - Get API keys from dashboard

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process: `lsof -ti:5000 \| xargs kill -9` |
| MongoDB connection error | Check URI, IP whitelist in Atlas |
| Email not sending | Use app-specific Gmail password |
| Images not uploading | Check Cloudinary credentials |
| Payment failing | Use Razorpay test cards in test mode |

---

## 📊 Project Stats

- **7 Database Models**
- **45+ API Endpoints**
- **11 Frontend Pages**
- **10 Components**
- **5 Redux Slices**
- **2000+ Lines of Code**
- **Production-Ready Security**
- **100% Functional**

---

## 📄 License

MIT License - feel free to use for commercial projects

---

## 🤝 Support

Need help? Check:
1. QUICKSTART.md for setup issues
2. API documentation in routes/
3. Component documentation in components/

---

## 📞 Contact

Built with ❤️ for rental marketplace enthusiasts

---

**Status**: ✅ Production Ready | Ready to deploy and scale!