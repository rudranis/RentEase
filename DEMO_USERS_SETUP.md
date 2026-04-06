# RentSystem - Black Screen Fix & Demo User Setup

## 🔧 What Was Fixed

✅ **Added VITE_SOCKET_URL** to frontend .env
- This was causing the black screen (socket connection error crashing the app)

✅ **Created comprehensive demo users** in seedData.js
- Admin account
- 2 demo owners with sample listings
- 2 demo users for testing

✅ **Improved socket.io error handling** in App.jsx
- Graceful fallback if socket connection fails
- Won't crash the entire app anymore

---

## 🚀 Quick Setup (2 Steps)

### Step 1: Seed Database with Demo Users
```bash
cd backend
npm run seed
```

**Expected Output:**
```
Database cleared
✓ Demo users created
✓ Sample listings created

╔════════════════════════════════════════════════╗
║          DEMO CREDENTIALS READY                ║
╠════════════════════════════════════════════════╣
║ ADMIN USER:                                    ║
║   Email: admin@rentapp.com                     ║
║   Password: Admin@2005                         ║
╠════════════════════════════════════════════════╣
║ DEMO OWNER:                                    ║
║   Email: owner@demo.com                        ║
║   Password: Demo@123                           ║
╠════════════════════════════════════════════════╣
║ DEMO USER 1:                                   ║
║   Email: user@demo.com                         ║
║   Password: Demo@123                           ║
╠════════════════════════════════════════════════╣
║ DEMO USER 2:                                   ║
║   Email: priya@demo.com                        ║
║   Password: Demo@123                           ║
╠════════════════════════════════════════════════╣
║ DEMO OWNER 2:                                  ║
║   Email: amit@demo.com                         ║
║   Password: Demo@123                           ║
╚════════════════════════════════════════════════╝
```

### Step 2: Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (new terminal)
cd frontend
npm run dev
```

---

## 👤 Demo Users You Can Use

### 1️⃣ **Admin Account (Full Access)**
```
Email:    admin@rentapp.com
Password: Admin@2005
Role:     Admin (can see all users, manage app)
```

### 2️⃣ **Demo Owner (Can Create Listings)**
```
Email:    owner@demo.com
Password: Demo@123
Role:     Owner (can create and manage rental listings)
City:     Mumbai
Rating:   4.5/5 (12 reviews)
```

### 3️⃣ **Demo User 1 (Regular User)**
```
Email:    user@demo.com
Password: Demo@123
Role:     User (can browse and book listings)
City:     Mumbai
```

### 4️⃣ **Demo User 2 (Student)**
```
Email:    priya@demo.com
Password: Demo@123
Role:     User (can browse and book listings)
City:     Bangalore
```

### 5️⃣ **Demo Owner 2 (Car Rental)**
```
Email:    amit@demo.com
Password: Demo@123
Role:     Owner (can create and manage listings)
City:     Delhi
Rating:   4.8/5 (25 reviews)
```

---

## ✅ What's Included in Demo Data

### Pre-created Listings:
1. **Modern 2BHK Apartment in Bandra, Mumbai**
   - Price: ₹2,500/day
   - Owner: Rajesh Kumar
   - Amenities: WiFi, AC, Parking, Kitchen

2. **Honda City Car Rental, Delhi**
   - Price: ₹1,500/day
   - Owner: Amit Patel
   - Amenities: AC, Power Steering, Insurance

---

## 🧪 Testing Workflow

### Test 1: Login with Pre-existing User (Instant Access)
1. Go to http://localhost:3000/login
2. Use any demo user credentials (e.g., user@demo.com / Demo@123)
3. Should see home page with listings immediately ✅

### Test 2: Register New User (Test Registration Flow)
1. Go to http://localhost:3000/register
2. Fill form with new data:
   ```
   Name: Test User
   Email: test@example.com
   Phone: 9876543210
   Password: Test@123
   ```
3. Click "Create Account"
4. Should be redirected to login page
5. Login with your new credentials
6. Should see home page ✅

### Test 3: Browse Listings (Owner/User)
1. After login, click "Listings" in navbar
2. Should see demo listings
3. Click on a listing to view details ✅

### Test 4: Create Listing (Owner Only)
1. Login as `owner@demo.com`
2. Go to "Create Listing"
3. Fill in listing details
4. Submit ✅

---

## 🐛 If You Still See Black Screen

### Quick Fixes:

**1. Clear Browser Cache & Data:**
```javascript
// Open DevTools (F12) → Console → Paste and run:
localStorage.clear()
sessionStorage.clear()
location.reload()
```

**2. Check Console for Errors:**
- Open DevTools (F12)
- Go to Console tab
- Look for red error messages
- Share the error with debugging info

**3. Verify Backend is Running:**
```bash
# Check backend terminal shows:
Server running on port 5000
MongoDB Connected: cluster0...
```

**4. Verify Frontend has .env Setup:**
```bash
# Check frontend/.env has:
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**5. Completely Restart:**
```bash
# Stop both servers (Ctrl+C in both terminals)
# Clear all terminals
# In backend: npm run dev
# In frontend: npm run dev
# Open http://localhost:3000 in fresh browser tab
```

---

## 🔍 Debugging Steps

### If Login Shows Black Screen:
```javascript
// In browser console (F12):
localStorage.getItem('token')      // Should be empty on login page
localStorage.getItem('user')       // Should be empty on login page
```

### If After Successful Login Shows Black Screen:
```javascript
// In browser console (F12):
const token = localStorage.getItem('token')
console.log('Token exists:', !!token)
const user = JSON.parse(localStorage.getItem('user') || '{}')
console.log('User data:', user)
```

### Check Network Requests:
1. Open DevTools → Network tab
2. Refresh page
3. Look for failed requests (red X)
4. Click on failed request to see error

### Check Redux State:
1. Install Redux DevTools browser extension
2. Open DevTools → Redux tab
3. Check auth state shows correct data

---

## 📋 Checklist After Setup

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Seed script ran successfully
- [ ] Can login with admin@rentapp.com
- [ ] Can login with owner@demo.com
- [ ] Can login with user@demo.com
- [ ] Home page loads with listings
- [ ] Can register new user
- [ ] New user can login
- [ ] No black screen after login
- [ ] Navbar visible after login
- [ ] Can navigate between pages

---

## 🎯 Next Steps

1. **Try each demo account** to understand different roles
2. **Create a new listing** as owner@demo.com
3. **Browse and search** listings as user@demo.com
4. **Test booking flow** (if implemented)
5. **Test messaging** (real-time socket features)

---

## ❓ Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot POST /api/auth/login" | Backend not running or wrong port |
| "CORS error" | Check VITE_API_URL in .env |
| Socket connection error | Already fixed! (added fallback) |
| Black screen after register | Seed database + refresh browser |
| "Username already exists" | Use different email when registering |
| Form validation errors | All fields required, check formats |

---

## 📞 Need More Help?

Check these files for detailed info:
- `SETUP_GUIDE.md` - Complete setup instructions
- `FIXES_APPLIED.md` - All fixes applied
- `VERIFICATION_CHECKLIST.md` - Testing guide

---

**Setup Status**: ✅ Ready to Use!
**Demo Users**: ✅ Created
**Black Screen Fix**: ✅ Applied
