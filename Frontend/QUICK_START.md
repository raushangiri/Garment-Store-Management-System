# 🚀 FashionHub - Quick Start Guide

Get your FashionHub system up and running in 5 minutes!

---

## ⚡ Prerequisites

- **Node.js** v16+ installed
- **MongoDB Atlas** account (free) OR local MongoDB
- **Terminal/Command Prompt**

---

## 📝 Step-by-Step Setup

### Step 1: Get MongoDB Connection String (2 minutes)

**Option A: MongoDB Atlas (Recommended - FREE)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Log in
3. Click "Build a Database" → Choose FREE tier
4. Create cluster (takes ~3 minutes)
5. Click "Connect" → "Connect your application"
6. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fashionhub?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your actual password
8. Replace `<dbname>` with `fashionhub`

**Option B: Local MongoDB**
```
mongodb://localhost:27017/fashionhub
```

---

### Step 2: Setup Backend (1 minute)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Now edit `backend/.env`:
```env
MONGODB_URI=your-connection-string-here
JWT_SECRET=any-random-secret-key-here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected
🎉 FashionHub Backend Server Running on port 5000
```

---

### Step 3: Setup Frontend (1 minute)

**Open a NEW terminal** (keep backend running)

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

You should see:
```
➜  Local:   http://localhost:5173/
```

---

### Step 4: Create Admin Account (1 minute)

1. Open browser: **http://localhost:5173**

2. You'll see the **Initial Setup** page

3. Fill in the form:
   ```
   Name:     Admin
   Email:    admin@fashionhub.com
   Phone:    +91 99999 99999
   Password: admin123
   ```

4. Click **"Create Admin Account"**

5. Wait for success message

6. You'll be redirected to login

---

### Step 5: Login & Start Using! (30 seconds)

1. Login with:
   ```
   Email:    admin@fashionhub.com
   Password: admin123
   ```

2. You're in! 🎉

---

## ✅ Quick Test

### Test 1: Add a Product

1. Go to **Inventory**
2. Click **"Add Product"**
3. Fill in details:
   - Name: Cotton T-Shirt
   - Barcode: TSH001
   - Price: 599
   - Stock: 100
   - Category: T-Shirts
4. Click **Save**

### Test 2: Create a Sale

1. Go to **Point of Sale**
2. Search for "Cotton T-Shirt"
3. Click **Add to Cart**
4. Click **Generate Invoice**
5. Select payment method
6. Complete sale

### Test 3: Create Sales User

1. Go to **User Management**
2. Click **"Add New User"**
3. Fill in details
4. Set permissions
5. Save

---

## 🎯 Common Issues & Solutions

### Issue: Backend won't start

**Error:** `MongoDB connection failed`

**Solution:**
1. Check MongoDB connection string in `backend/.env`
2. Verify MongoDB Atlas IP whitelist allows your IP
3. Check username/password are correct

---

### Issue: Frontend can't connect to backend

**Error:** `Failed to fetch` or `Network Error`

**Solution:**
1. Make sure backend is running on port 5000
2. Check `VITE_API_URL` in `.env` is correct
3. Test backend: http://localhost:5000/api/health

---

### Issue: Can't create admin user

**Error:** `Admin user already exists`

**Solution:**
Admin was already created. Just login with existing credentials or delete from MongoDB and try again.

---

### Issue: Port 5000 already in use

**Solution:**
```bash
# Change PORT in backend/.env
PORT=5001

# Update frontend .env
VITE_API_URL=http://localhost:5001/api

# Restart both servers
```

---

## 📚 What's Next?

Once your system is running:

1. ✅ **Add Products** - Build your inventory
2. ✅ **Create Sales Users** - Add your team
3. ✅ **Configure Suppliers** - Add supplier details
4. ✅ **Test POS Workflow** - Make a complete sale
5. ✅ **Test Purchase Orders** - Create and receive a PO
6. ✅ **Explore Reports** - View sales analytics

---

## 🌐 Deploy to Production

When ready to go live:

### Backend (Deploy to Render - FREE)

1. Push code to GitHub
2. Go to https://render.com
3. Create Web Service
4. Connect GitHub repo
5. Set environment variables
6. Deploy!

### Frontend (Deploy to Vercel - FREE)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import GitHub repo
4. Set `VITE_API_URL` to production backend URL
5. Deploy!

---

## 🆘 Need Help?

**Check Documentation:**
- [Complete Setup Guide](SETUP_GUIDE.md)
- [API Reference](backend/API_REFERENCE.md)
- [Integration Guide](API_INTEGRATION_GUIDE.md)
- [Architecture](ARCHITECTURE.md)

**Test API Manually:**
```bash
# Check backend health
curl http://localhost:5000/api/health

# Create admin via curl
curl -X POST http://localhost:5000/api/setup/create-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@fashionhub.com","phone":"+91 99999 99999","password":"admin123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fashionhub.com","password":"admin123"}'
```

---

## 🎉 You're All Set!

Your FashionHub Garment Store Management System is ready to use!

**Happy Selling! 🛍️**

---

**Time taken:** 5 minutes ⏱️  
**Difficulty:** Easy ⭐  
**Cost:** FREE (using free tiers) 💰
