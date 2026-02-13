# 🚀 FashionHub - Complete Setup Guide

Complete setup instructions for the FashionHub Garment Store Management System with MongoDB backend.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Database Setup](#database-setup)
5. [Testing the Application](#testing-the-application)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Either:
  - Local MongoDB installation OR
  - MongoDB Atlas account (Free) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** package manager
- **Git** (optional)

---

## 🗄️ Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit the `.env` file with your configuration:

**For MongoDB Atlas (Cloud - RECOMMENDED):**

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fashionhub?retryWrites=true&w=majority

# Generate a strong random secret (you can use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Your frontend URL
FRONTEND_URL=http://localhost:5173
```

**For Local MongoDB:**

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/fashionhub

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

### Step 4: Get MongoDB Connection String

#### Option A: MongoDB Atlas (Cloud - FREE)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Create a new cluster (FREE tier available)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Replace `<dbname>` with `fashionhub`

Example:
```
mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/fashionhub?retryWrites=true&w=majority
```

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/fashionhub`

### Step 5: Seed Database (Create Admin User)

```bash
node seed.js
```

This will create:
- ✅ Admin user: `admin@fashionhub.com` / `admin123`
- ✅ Sales user: `sales@fashionhub.com` / `sales123`
- ✅ Sample suppliers

### Step 6: Start Backend Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              🎉 FashionHub Backend Server 🎉                  ║
║                                                               ║
║  Status: ✅ Running                                           ║
║  Port: 5000                                                   ║
║  Environment: development                                     ║
║  API Docs: http://localhost:5000/api/health                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
📊 Database Name: fashionhub
```

### Step 7: Test Backend API

Visit: http://localhost:5000/api/health

You should see:
```json
{
  "success": true,
  "message": "FashionHub API is running",
  "timestamp": "2024-..."
}
```

---

## 💻 Frontend Setup

### Step 1: Navigate to Project Root

```bash
cd ..  # Go back to project root from backend folder
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

### Step 3: Configure Frontend Environment

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit the `.env` file:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 5: Open Application

Visit: http://localhost:5173

---

## 🎯 Testing the Application

### Default Login Credentials

**Admin Account:**
- Email: `admin@fashionhub.com`
- Password: `admin123`
- Access: Full system access

**Sales Person Account:**
- Email: `sales@fashionhub.com`
- Password: `sales123`
- Access: POS only

### Test Workflow

1. **Login as Admin**
   - Navigate to http://localhost:5173
   - Enter admin credentials
   - You should see the complete dashboard

2. **Add Products**
   - Go to Inventory
   - Click "Add Product"
   - Fill in product details
   - Save

3. **Create a Sale**
   - Go to Point of Sale
   - Add products to cart
   - Generate invoice
   - Complete payment

4. **Test User Management**
   - Go to User Management
   - Create a new sales user
   - Set permissions
   - Save

5. **Test Draft Orders**
   - Go to POS
   - Add items to cart
   - Click "Save Draft"
   - View drafts and load them back

---

## 🌐 Deployment

### Backend Deployment Options

#### Option 1: Deploy to Render (FREE)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Add Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL=your-frontend-url`

#### Option 2: Deploy to Railway (FREE)

1. Create account on [Railway](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy

#### Option 3: Deploy to Heroku

```bash
cd backend
heroku create fashionhub-api
heroku config:set MONGODB_URI=your-connection-string
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production
git push heroku main
```

### Frontend Deployment Options

#### Option 1: Deploy to Vercel (FREE - RECOMMENDED)

```bash
npm install -g vercel
vercel
```

Or connect GitHub repository to Vercel dashboard.

Environment variable:
- `VITE_API_URL=https://your-backend-url.com/api`

#### Option 2: Deploy to Netlify (FREE)

```bash
npm run build
netlify deploy --prod --dir=dist
```

Environment variable:
- `VITE_API_URL=https://your-backend-url.com/api`

---

## 🐛 Troubleshooting

### Backend Issues

#### MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
1. Check if MongoDB is running (local)
2. Verify connection string in `.env`
3. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)
4. Verify username/password in connection string

#### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Or change PORT in .env
PORT=5001
```

#### JWT Secret Error

**Error:** `secretOrPrivateKey must have a value`

**Solution:**
Generate a random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Add to `.env` as `JWT_SECRET`

### Frontend Issues

#### API Connection Error

**Error:** `Failed to fetch` or `Network Error`

**Solution:**
1. Verify backend is running: http://localhost:5000/api/health
2. Check `VITE_API_URL` in `.env`
3. Check CORS settings in backend
4. Clear browser cache

#### Build Error

**Error:** Module not found

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

#### Seeding Error

**Error:** `E11000 duplicate key error`

**Solution:**
Users already exist. Either:
1. Skip seeding
2. Delete existing users in MongoDB
3. Use different emails

---

## 📞 Support

### Useful Commands

**Backend:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Seed database
node seed.js
```

**Frontend:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Logs

**Backend Logs:**
- Check terminal where backend is running
- MongoDB connection status
- API request logs

**Frontend Logs:**
- Check browser console (F12)
- Network tab for API requests

---

## ✅ Checklist

Before going live:

- [ ] Backend is connected to MongoDB
- [ ] Admin user is created
- [ ] Frontend can connect to backend API
- [ ] Login works for both admin and sales
- [ ] Products can be created
- [ ] Sales can be processed
- [ ] Draft orders work
- [ ] User management works
- [ ] Changed default passwords
- [ ] Generated strong JWT secret
- [ ] Configured CORS for production domain
- [ ] Set NODE_ENV=production for backend
- [ ] Database backups configured

---

## 🎉 You're All Set!

Your FashionHub Store Management System is now ready to use!

**Next Steps:**
1. Login as admin
2. Add your products
3. Create sales users
4. Start processing sales
5. Generate reports

Happy Selling! 🛍️
