# RentEase - Production-Ready Rental Marketplace Platform

A complete MERN (MongoDB, Express, React, Node.js) stack platform for renting any items - from apartments to power tools. Built with modern technologies including Socket.io for real-time chat, Razorpay for payments, and Cloudinary for image uploads.

## 🚀 Features

### For Renters
- ✅ Browse listings by category, city, price, and delivery availability
- ✅ Real-time search across all platforms
- ✅ Secure online payment via Razorpay
- ✅ Real-time chat with owners
- ✅ Leave and view reviews
- ✅ Track bookings and payments
- ✅ Email notifications

### For Owners
- ✅ Post items for rent with images (uploaded to Cloudinary)
- ✅ Manage bookings and payments
- ✅ Accept/reject booking requests
- ✅ Process refunds
- ✅ Real-time notifications
- ✅ Manage multiple listings
- ✅ View reviews and ratings

### Platform Features
- 🔐 JWT authentication with OTP email verification
- 💬 Real-time messaging via Socket.io
- 💳 Razorpay payment integration
- 📧 Automated email notifications (10 types)
- 📸 Cloudinary image uploads
- 🎨 Beautiful UI with TailwindCSS
- 📱 Fully responsive design
- ⚡ Performance optimized

## 📁 Project Structure

```
rental-marketplace/
├── backend/
│   ├── config/           # Database, email, cloudinary setup
│   ├── models/           # 7 MongoDB schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth, upload, error handling
│   ├── utils/           # Email templates, seed data
│   ├── socket/          # Real-time features
│   ├── server.js        # Main server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios setup
│   │   ├── app/         # Redux store
│   │   ├── features/    # Redux slices
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app
│   │   └── main.jsx     # Entry point
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Auth**: JWT + bcrypt
- **Real-time**: Socket.io
- **Payments**: Razorpay
- **Files**: Cloudinary + Multer
- **Emails**: Nodemailer (Gmail SMTP)
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React 18 + Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **HTTP**: Axios
- **Real-time**: Socket.io-client
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion
- **UI**: React Icons, Headless UI

## 🚦 Getting Started

### Prerequisites
- Node.js v16+ 
- MongoDB Account (MongoDB Atlas)
- Cloudinary Account
- Razorpay Account
- Gmail Account (for email verification)


### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables** (backend/.env)
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rent-system
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=30d
   
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=RentEase <your_email@gmail.com>
   
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. **Seed database with root admin only**
   ```bash
   npm run seed
   ```

   This will clear sample data and create a single admin user.
   Default admin credentials:
   - Email: `admin@rentapp.com`
   - Password: `Admin@123`

4. **Start backend server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables** (frontend/.env)
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

3. **Start frontend development server**
   ```bash
   npm run dev
   ```
   Frontend will open at `http://localhost:5173`

## 📨 Email Notifications

The system automatically sends beautiful HTML emails for:
1. Welcome email + OTP verification
2. Booking request received (to owner)
3. Booking confirmed (to renter)
4. Booking rejected (to renter)
5. Booking cancelled (to both)
6. Payment successful (to renter)
7. Payment received (to owner)
8. Password reset
9. New message notification
10. Review received

## 💳 Razorpay Integration

The platform uses Razorpay for secure payments:
- Booking payment validation
- Automatic refund processing
- Transaction history

Test Razorpay with:
- Email: `gaurav.kumar@example.com`
- Password: `AshaStrong@123`

## 🗄️ Database Models

### 1. User
- Authentication with JWT
- Role-based access (user, owner, admin)
- Email verification with OTP
- Profile management

### 2. Listing
- Item details (title, description, images)
- Pricing (per day/week)
- Location with GPS coordinates
- Delivery options
- Availability calendar
- Amenities and rules

### 3. Booking
- Booking lifecycle (pending → confirmed → active → completed)
- Deposit and total amount calculation
- Delivery tracking
- Cancellation handling

### 4. Payment
- Razorpay integration
- Payment status tracking
- Refund management

### 5. Review
- 1-5 star ratings
- Text comments
- Separate reviews for listings and users

### 6. Message
- Real-time chat
- Conversation threads
- Read status tracking

### 7. Notification
- Push-like notifications
- Email triggers
- Read/unread status

## 🔐 Authentication Flow

1. User registers
2. User logs in → JWT token issued
3. Token stored in localStorage
4. Token attached to all API requests
5. Auto-logout on token expiration

## 🌟 API Endpoints

### Auth (`/api/auth`)
- `POST /register` - Register user
- `POST /login` - Login user
- `POST /logout` - Logout
- `POST /forgot-password` - Send reset email
- `POST /reset-password` - Reset password
- `GET /me` - Get current user

### Users (`/api/users`)
- `GET /profile/:id` - Get user profile
- `PUT /profile` - Update profile
- `PUT /profile/avatar` - Upload avatar
- `DELETE /account` - Delete account
- `GET /my-listings` - User's listings
- `GET /my-bookings` - User's bookings

### Listings (`/api/listings`)
- `GET /` - Get all listings (with filters)
- `GET /:id` - Get listing details
- `POST /` - Create new listing (auth required)
- `PUT /:id` - Update listing (owner only)
- `DELETE /:id` - Delete listing (owner only)
- `GET /category/:category` - Get by category
- `GET /search?q=` - Search listings

### Bookings (`/api/bookings`)
- `POST /` - Create booking
- `GET /:id` - Get booking details
- `PUT /:id/status` - Update status (owner)
- `PUT /:id/cancel` - Cancel booking (renter)
- `GET /my/renter` - My bookings as renter
- `GET /my/owner` - My bookings as owner

### Payments (`/api/payments`)
- `POST /create-order` - Create Razorpay order
- `POST /verify` - Verify payment signature
- `POST /refund/:paymentId` - Initiate refund
- `GET /:paymentId` - Payment details

### Reviews (`/api/reviews`)
- `POST /` - Create review (auth required)
- `GET /listing/:listingId` - Get listing reviews
- `GET /user/:userId` - Get user reviews
- `DELETE /:id` - Delete review (author only)

### Messages (`/api/messages`)
- `POST /send` - Send message
- `GET /conversations` - Get all chats
- `GET /conversation/:userId/:listingId` - Get messages
- `PUT /read/:conversationId` - Mark as read
- `DELETE /:id` - Delete message

## 🔌 Socket.io Events

**Client → Server:**
- `join_room` - Join chat room
- `send_message` - Send message
- `typing` - User typing
- `stop_typing` - Stop typing
- `message_read` - Mark as read

**Server → Client:**
- `receive_message` - New message
- `user_typing` - Someone typing
- `user_stop_typing` - Stop typing
- `receive_notification` - System notification
- `online_users` - Live online status

## 🧪 Seed Data

Run `npm run seed` in backend to clear existing content and create one root admin user.

Default root admin credentials:
- Email: `admin@rentapp.com`
- Password: `Admin@123`

If you want to change the admin account, set these environment variables in `backend/.env` before seeding:
- `ROOT_ADMIN_EMAIL`
- `ROOT_ADMIN_PASSWORD`
- `ROOT_ADMIN_PHONE`

## 🎨 Frontend Features

### Pages Implemented
- ✅ Home (Hero, categoriesgrid, featured listings)
- ✅ Login/Register (with email OTP)
- ✅ Listings (filters, pagination, search)
- 🔄 More pages available in codebase

### Components
- ✅ Navbar (with notifications)
- ✅ Footer
- ✅ ListingCard
- ✅ FilterSidebar
- ✅ ChatBox
- ✅ StarRating
- ✅ ProtectedRoute
- ✅ Skeleton Loaders
- ✅ Modal

## 📊 Redux State Management

```javascript
store.js
├── authSlice        // User, token, auth status
├── listingsSlice    // Listings, filters, pagination
├── bookingsSlice    // Bookings, booking management
├── notificationsSlice   // Notifications, unread count
└── chatSlice        // Messages, conversations, online users
```

## 🔒 Security Features

- ✅ JWT token authentication
-✅ bcrypt password hashing
- ✅ Input sanitization (mongo-sanitize)
- ✅ Rate limiting (100 req/15min general, 5 req/15min auth)
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ XSS protection
- ✅ File upload validation (images only, max 5MB)
- ✅ Razorpay signature verification

## 🚀 Deployment

### Backend (Render, AWS, Heroku)
```bash
cd backend
npm install
npm run seed
npm start
```

### Frontend (Vercel, Netlify)
```bash
cd frontend
npm install
npm run build
# Deploy 'dist' folder
```

## 📝 Environment Variables Checklist

- [ ] MongoDB connection string from MongoDB Atlas
- [ ] Cloudinary credentials
- [ ] Razorpay keys
- [ ] Gmail credentials + app password
- [ ] JWT secret (random string)
- [ ] Frontend URL (for CORS)

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Backend running on 5000, Frontend on 5173
# Change in .env if needed
```

**MongoDB connection failed?**
- Check connection string in .env
- Ensure IP is whitelisted in MongoDB Atlas
- Verify network connectivity

**Cloudinary images not uploading?**
- Verify Cloudinary credentials
- Check file size (max 5MB)
- Ensure file is an image

**Emails not sending?**
- Use Gmail app password (not regular password)
- Enable "Less secure apps" if 2FA disabled
- Check SMTP settings

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Built as a complete production-ready MERN starter template.

---

**Happy Renting! 🎉**

Start by running `npm run seed` to initialize the app with a single admin user, then navigate to `http://localhost:5173` to start using the system.
