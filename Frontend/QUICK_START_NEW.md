# 🚀 FashionHub - Quick Start Guide

Get FashionHub up and running in 5 minutes!

## 🎯 Prerequisites

Before you start, ensure you have:

- ✅ **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- ✅ **MongoDB** - Choose one:
  - Local MongoDB installation
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free cloud database)
- ✅ **npm** or **yarn** (comes with Node.js)
- ✅ **Git** (optional)

---

## ⚡ 5-Minute Setup

### Step 1: MongoDB Setup (2 minutes)

#### Option A: MongoDB Atlas (Recommended for beginners)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a new cluster (Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@...`)

#### Option B: Local MongoDB

```bash
# macOS (with Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# Download and install from https://www.mongodb.com/try/download/community
```

Your local connection string: `mongodb://localhost:27017/fashionhub`

---

### Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env
```

Now edit `backend/.env` with your connection:

```env
PORT=5000
NODE_ENV=development

# PASTE YOUR MONGODB CONNECTION STRING HERE
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fashionhub

# Change this secret key (any random string)
JWT_SECRET=my-super-secret-key-12345

# JWT expiration
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Create default admin user:**

```bash
node seed.js
```

You should see:
```
✅ Admin user created: admin@fashionhub.com
✅ Sales user created: sales@fashionhub.com
```

**Start the backend:**

```bash
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════╗
║      🎉 FashionHub Backend Server 🎉      ║
║  Status: ✅ Running                       ║
║  Port: 5000                               ║
╚═══════════════════════════════════════════╝
```

✅ **Backend is running at:** http://localhost:5000

---

### Step 3: Frontend Setup (1 minute)

Open a **NEW terminal window** (keep backend running):

```bash
# Go back to project root
cd ..

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start frontend
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ **Frontend is running at:** http://localhost:5173

---

### Step 4: Login & Test! (30 seconds)

1. Open browser: http://localhost:5173
2. Login with:
   - **Email:** `admin@fashionhub.com`
   - **Password:** `admin123`

🎉 **You're in!** Welcome to FashionHub!

---

## 🧪 Quick Test

### Test Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "FashionHub API is running",
  "timestamp": "2026-02-06T..."
}
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fashionhub.com","password":"admin123"}'
```

You should get a JWT token back!

---

## 📁 Project Structure

```
fashionhub/
├── backend/              ← Node.js/Express backend
│   ├── server.js         ← Main server file
│   ├── .env              ← Your configuration
│   └── ...
├── src/                  ← React frontend
│   ├── app/
│   └── ...
└── .env                  ← Frontend config
```

---

## 🔑 Default Credentials

### Admin (Full Access)
- **Email:** `admin@fashionhub.com`
- **Password:** `admin123`
- **Role:** Administrator
- **Access:** All features

### Sales Person (Limited Access)
- **Email:** `sales@fashionhub.com`
- **Password:** `sales123`
- **Role:** Sales Person
- **Access:** Point of Sale only

---

## 🎯 What's Next?

### Explore Features:

1. **📦 Add Products** (Admin)
   - Dashboard → Inventory → Add Product
   - Try adding a t-shirt with different sizes/colors

2. **💰 Make a Sale** (Admin/Sales)
   - Point of Sale → Search product → Add to cart
   - Generate invoice → Complete payment

3. **📝 Save Draft** (Admin/Sales)
   - Add items to cart → Save as Draft
   - Load draft later to complete

4. **🛒 Create Purchase Order** (Admin)
   - Purchase Orders → Create PO
   - Select supplier → Add items → Submit

5. **👥 Add Sales Users** (Admin)
   - User Management → Create User
   - Set permissions and discount limits

6. **📊 View Reports** (Admin)
   - Reports → Sales statistics
   - Revenue charts and trends

---

## ⚠️ Important Notes

### ❌ Ignore These Directories:
- `/supabase/` - Legacy system files from Figma Make
- `/utils/supabase/` - Not used in FashionHub

### ✅ Active Backend:
- **Location:** `/backend/`
- **Type:** Node.js + Express + MongoDB
- **Port:** 5000 (default)
- **API Base:** `http://localhost:5000/api`

See [IMPORTANT_BACKEND_INFO.md](IMPORTANT_BACKEND_INFO.md) for details.

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to MongoDB"

**Solution:**
- **Atlas:** Check IP whitelist (add `0.0.0.0/0` to allow all IPs)
- **Local:** Ensure MongoDB is running: `brew services start mongodb-community`
- Verify connection string in `backend/.env`

### Problem: "Port 5000 already in use"

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# OR change port in backend/.env
PORT=5001
```

### Problem: "CORS error in browser"

**Solution:**
- Ensure backend is running on http://localhost:5000
- Verify `FRONTEND_URL=http://localhost:5173` in `backend/.env`
- Restart backend server

### Problem: "Token invalid"

**Solution:**
- Logout and login again
- Ensure `JWT_SECRET` is set in `backend/.env`
- Check token expiration

### Problem: "Module not found"

**Solution:**
```bash
# Backend
cd backend
npm install

# Frontend
cd ..
npm install
```

---

## 🔄 Development Workflow

### Daily Workflow:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Browser:**
```
http://localhost:5173
```

### Making Changes:

1. **Backend changes:** Edit files in `/backend/`
   - Server auto-restarts with nodemon
   
2. **Frontend changes:** Edit files in `/src/`
   - Hot reload automatically updates browser

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [README.md](README.md) | Main documentation |
| [IMPORTANT_BACKEND_INFO.md](IMPORTANT_BACKEND_INFO.md) | Backend architecture |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Detailed setup guide |
| [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) | API integration |
| [backend/API_REFERENCE.md](backend/API_REFERENCE.md) | API endpoints |

---

## 🎊 You're All Set!

FashionHub is now running! 🚀

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:5000  
**Login:** `admin@fashionhub.com` / `admin123`

Happy coding! 💻✨

---

## 🆘 Need Help?

- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
- Review [backend/README.md](backend/README.md) for backend details
- See [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) for API usage

**Common Issues:**
- MongoDB connection → Check `.env` file
- CORS errors → Restart backend server
- Port conflicts → Change port in `.env`
- Token errors → Logout and login again

---

Last Updated: February 2026  
Version: 1.0.0
