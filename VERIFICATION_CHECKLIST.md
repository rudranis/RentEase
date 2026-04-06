# RentSystem - Verification Checklist ✅

## Pre-Start Verification

### 1. Dependencies Installed

```bash
# Backend
cd backend && npm list | head -20
# Should see: rentease-backend@1.0.0

# Frontend
cd frontend && npm list | head -20
# Should see: rentease-frontend@1.0.0
```

- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed

### 2. Environment Files Present

```bash
# Check backend
ls -la backend/.env
# Should see: .env exists (mode 644)

# Check frontend
ls -la frontend/.env
# Should see: .env exists (mode 644)
```

- [ ] Backend `.env` exists with all variables
- [ ] Frontend `.env` exists with `VITE_API_URL` defined

### 3. Configuration Values

**Backend .env** (Values should match):

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://pict:2005@cluster0.m7zcxfq.mongodb.net/rent-system
JWT_SECRET=mylocalsecretkey2024
```

**Frontend .env** (Values should match):

```
VITE_API_URL=http://localhost:5000/api
FRONTEND_URL=http://localhost:3000
```

- [ ] Backend PORT is 5000
- [ ] Frontend port in vite.config.js is 3000
- [ ] VITE_API_URL points to backend
- [ ] FRONTEND_URL points to frontend

---

## Startup Verification

### Step 1: Start Backend

```bash
cd backend
npm run dev
```

**Expected Console Output**:

```
ENV CHECK:
CLOUD: dfwenbppu
KEY: 519456544958759
SECRET: yBSRfPkeB0pB5ZNOnwwudbUWmVY
MongoDB Connected: cluster0.m7zcxfq.mongodb.net
Root admin already exists
Server running on port 5000
```

**Checklist**:

- [ ] No error messages in console
- [ ] MongoDB connection successful
- [ ] Server listening on port 5000
- [ ] Cloudinary configured
- [ ] Root admin logged

### Step 2: Start Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

**Expected Console Output**:

```
VITE v4.4.9  ready in 1234 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

**Checklist**:

- [ ] No error messages
- [ ] Vite server started
- [ ] Port 3000 is accessible
- [ ] No React errors in console

---

## Functionality Verification

### Test 1: Home Page Load

**URL**: http://localhost:3000

**Expected**:

- [ ] Page loads without errors
- [ ] Navbar visible at top
- [ ] Hero section visible
- [ ] Search bar functional
- [ ] Category buttons visible
- [ ] "Popular Listings" section loads
- [ ] Loading skeleton shows during fetch
- [ ] Listings populate (should be empty initially)
- [ ] Footer visible at bottom

**Browser Console** (F12):

- [ ] No red errors
- [ ] API calls shown in Network tab
- [ ] No CORS errors

---

### Test 2: Registration Flow

**URL**: http://localhost:3000/register

**Expected**:

- [ ] Form loads with all fields
- [ ] Page is responsive (try resizing)
- [ ] Placeholder text visible

**Form Validation Testing**:

**Test 2a: Empty Submit**

```
- [ ] Click "Create Account" without filling
- [ ] Each field shows red error
- [ ] Error messages appear
```

**Test 2b: Invalid Email**

```
- Enter: name="John", email="notanemail", phone="1234567890"
- [ ] Email field shows red border
- [ ] Shows "Valid email is required"
- [ ] Submit disabled
```

**Test 2c: Invalid Phone**

```
- Enter: phone="123" (less than 10 digits)
- [ ] Shows "Valid 10-digit phone number is required"
- [ ] Error clears as user types correct digits
```

**Test 2d: Password Mismatch**

```
- password="Test@123", confirm="Test@124"
- [ ] Shows "Passwords do not match"
- [ ] Button disabled
```

**Test 2e: Avatar Upload**

```
- Click avatar field
- [ ] File picker opens
- [ ] Selecting image shows preview
- [ ] Large file (>5MB) shows error
- [ ] Wrong file type shows error
```

**Test 2f: Valid Registration**

```
- Fill all correctly:
  name="John Doe"
  email="john@example.com"
  phone="9876543210"
  password="Test@123"
  confirm="Test@123"
- [ ] Form submits
- [ ] "Registration successful" toast shown
- [ ] Redirects to login page
```

---

### Test 3: Login Flow

**URL**: http://localhost:3000/login

**Expected**:

- [ ] Form loads with email and password fields
- [ ] "Create Account" button links to register
- [ ] "Forgot Password?" link visible

**Test 3a: Invalid Credentials**

```
- Email: "invalid@test.com"
- Password: "wrong@123"
- [ ] Shows error toast
- [ ] Stays on login page
- [ ] Console shows 401 error
```

**Test 3b: Admin Login (Success)**

```
- Email: admin@rentapp.com
- Password: Admin@2005
- [ ] Shows "Logged in successfully!" toast
- [ ] Redirects to home page
- [ ] Navbar shows user menu
- [ ] localStorage has 'token' and 'user'
```

**Browser Verification** (After login):

```javascript
// In DevTools Console, run:
localStorage.getItem("token"); // Should return JWT token
localStorage.getItem("user"); // Should return user data
const user = JSON.parse(localStorage.getItem("user"));
console.log(user._id); // Should show user ID
```

- [ ] Token exists in localStorage
- [ ] User data saved
- [ ] User has \_id property
- [ ] User has name, email, role

---

### Test 4: Protected Routes

**Test 4a: Logout**

```
- On home page, click user menu → Logout
- [ ] Redirects to login
- [ ] token removed from localStorage
- [ ] user removed from localStorage
```

**Test 4b: Auto-redirect When Logged In**

```
- Logged in, go to /login manually
- [ ] Auto-redirects to home page
- [ ] No login form shown
```

**Test 4c: Auto-redirect When Not Logged In**

```
- Anonymous, go to /profile manually
- [ ] Redirects to login
- [ ] Shows login form
```

---

### Test 5: API Endpoints

**Open DevTools → Network tab**

**Test 5a: GET /api/listings**

```bash
# After page load, look for:
GET http://localhost:5000/api/listings
Status: 200
Response: { listings: [...], pagination: {...} }
```

- [ ] Request successful (200)
- [ ] Response has listings array
- [ ] Response has pagination object

**Test 5b: POST /api/auth/login**

```bash
# After login, look for:
POST http://localhost:5000/api/auth/login
Status: 200
Headers: Authorization=Bearer <token>
Response: { message: "...", token: "...", user: {...} }
```

- [ ] Request successful (200)
- [ ] Response has token
- [ ] Response has user object
- [ ] User has \_id property

**Test 5c: GET /api/auth/me (Protected)**

```bash
# After login, manually call:
# In console:
const token = localStorage.getItem('token')
fetch('http://localhost:5000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(d => console.log(d))

# Should show user data
```

- [ ] Returns 200 status
- [ ] Returns user object
- [ ] Token properly validated

---

### Test 6: Responsive Design

**Mobile View (320px width)**

```
- [ ] Burger menu appears
- [ ] Text readable
- [ ] Buttons clickable
- [ ] Form inputs full width
- [ ] No horizontal scroll
```

**Tablet View (768px width)**

```
- [ ] Grid shows 2 columns
- [ ] Navigation visible
- [ ] Form centered
```

**Desktop View (1024px+ width)**

```
- [ ] Grid shows 3 columns for listings
- [ ] Full navigation bar
- [ ] Proper spacing
```

---

### Test 7: Error Handling

**Test 7a: Network Error**

```
- Stop backend server
- Refresh frontend
- [ ] Shows error state with "Retry" button
- [ ] No console crashes
- [ ] Restart backend + click Retry → works again
```

**Test 7b: Invalid Email Format**

```
- Try register with: "notanemaildomain"
- [ ] Shows validation error
- [ ] Prevents submission
```

**Test 7c: JWT Expired**

```
- Logout and clear localStorage
- Go to /profile
- [ ] Auto-redirects to login
- [ ] Doesn't crash
```

---

### Test 8: Form Features

**Test 8a: Real-time Validation**

```
- Start typing in email field
- [ ] Error appears if invalid
- [ ] Error clears as you fix it
- [ ] No need to re-submit
```

**Test 8b: Avatar Preview**

```
- On register page
- Upload an image
- [ ] Preview shows immediately
- [ ] Circular image thumbnail
```

**Test 8c: Loading States**

```
- During login submission
- [ ] Button changes to "Signing In..."
- [ ] Button disabled
- [ ] Can't submit twice
```

---

## Performance Tests

### Page Load Time

```
- Open DevTools → Performance tab
- Refresh home page
- [ ] Loads in < 3 seconds
- [ ] LCP (Largest Contentful Paint) < 2.5s
```

### API Response Time

```
- Network tab → look at requests
- [ ] GET /listings takes < 500ms
- [ ] POST /login takes < 1000ms
```

### Bundle Size

```bash
npm run build

# Should show:
# frontend/dist/index.html  XX kB
# Total size < 500 kB
```

- [ ] Build completes without errors
- [ ] No bundle size warnings

---

## Security Tests

### Test 1: Token Security

```javascript
const token = localStorage.getItem("token");
console.log(token.split(".").length); // Should be 3 (JWT format)
```

- [ ] Token is valid JWT format
- [ ] Token expires after 7 days
- [ ] Removing token prevents API access

### Test 2: Password Security

```javascript
// Register with password "Test@123"
// Then try login with "test@123" (lowercase)
// Should fail
```

- [ ] Password is case-sensitive
- [ ] Password hashing works (not stored in plain text)

### Test 3: CORS Security

```bash
# Try accessing from different origin:
curl -X GET http://localhost:3000 \
  -H "Origin: http://wrong-domain.com"

# Should be blocked (or at least not send token)
```

- [ ] CORS only allows localhost:3000
- [ ] No credentials sent to wrong origins

---

## Common Issues & Solutions

### Issue: "Cannot POST /api/auth/login"

**Solution**:

- [ ] Backend running on port 5000?
- [ ] `VITE_API_URL` correct?
- [ ] No typo in URL?

### Issue: "CORS error"

**Solution**:

- [ ] Frontend running on 3000?
- [ ] Check backend CORS in server.js
- [ ] See allowed origins match

### Issue: "MongoDB connection failed"

**Solution**:

- [ ] Check MongoDB URI in .env
- [ ] Internet connection working?
- [ ] MongoDB Atlas network access allowed?

### Issue: Form shows red errors immediately

**Solution**:

- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Refresh page (Ctrl+R)
- [ ] Check browser console for errors

### Issue: "User not found" on registration

**Solution**:

- [ ] Check MongoDB is connected
- [ ] Email validation passes?
- [ ] All required fields filled?

---

## Cleanup Commands

```bash
# Clear browser data
localStorage.clear()
sessionStorage.clear()
# Or use DevTools → Application → Clear

# Reset backend
npm run dev  # Recreates root admin if needed

# Check logs
# Backend: Look at terminal output
# Frontend: DevTools → Console

# Kill processes if stuck
# Backend: Ctrl+C in terminal
# Frontend: Ctrl+C in terminal
```

---

## Final Checklist ✅

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Home page loads data
- [ ] Can register new user
- [ ] Can login with admin account
- [ ] Protected routes work
- [ ] Logout clears session
- [ ] Forms validate correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] API calls work (Network tab)
- [ ] No CORS errors
- [ ] No JWT errors
- [ ] Error states display properly
- [ ] Loading states visible
- [ ] Toast notifications work
- [ ] Redirects work correctly

---

## Success! 🎉

If all checks pass, your RentSystem application is:

- ✅ Fully Functional
- ✅ Production Ready
- ✅ Error Handling Works
- ✅ Responsive Design
- ✅ Secure Authentication

---

**Last Updated**: April 5, 2026
**Version**: 1.0 - All Fixes Applied
