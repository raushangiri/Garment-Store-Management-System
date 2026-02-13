# ⚠️ IMPORTANT: Backend Architecture Information

## Backend Structure

**FashionHub uses a standalone Node.js/Express backend with MongoDB.**

### Active Backend (Use This!)
```
/backend/
├── server.js              # Main Express server
├── config/               # Database configuration
├── controllers/          # Business logic
├── middleware/           # Auth & error handling
├── models/               # MongoDB schemas
├── routes/               # API routes
├── package.json          # Backend dependencies
└── .env                  # Environment variables (MongoDB, JWT, etc.)
```

### Backend Stack
- **Node.js** + **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **bcrypt** password hashing
- Port: `5000` (default)
- API Base: `http://localhost:5000/api`

## ⚠️ Ignore Supabase Files

The following directories/files are **NOT USED** and should be **IGNORED**:
- `/supabase/` - Legacy files from Figma Make system, NOT part of FashionHub
- `/utils/supabase/` - Legacy utility files, NOT used

### Why do these files exist?
These are protected system files from the Figma Make environment and cannot be deleted. They are NOT part of the FashionHub application architecture.

## How to Run Backend

### 1. Setup Environment
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB connection string
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Database (Optional)
```bash
node seed.js
```

This creates default users:
- Admin: `admin@fashionhub.com` / `admin123`
- Sales: `sales@fashionhub.com` / `sales123`

### 4. Start Server
```bash
# Development mode with auto-reload
npm run dev

# OR Production mode
npm start
```

### 5. Test Backend
```bash
# Health check
curl http://localhost:5000/api/health

# Login test
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fashionhub.com","password":"admin123"}'
```

## Environment Variables

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fashionhub
# OR for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/fashionhub

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# CORS (Frontend URL)
FRONTEND_URL=http://localhost:5173
```

## Frontend Configuration

The frontend is already configured to use the Node.js backend.

**File:** `/src/services/api.ts`
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

Create `.env` in project root:
```env
VITE_API_URL=http://localhost:5000/api
```

## Architecture Pattern

FashionHub follows the **MVC (Model-View-Controller)** pattern:

### Models (`/backend/models/`)
- MongoDB schemas using Mongoose
- Define data structure and validation
- Examples: User, Product, Sale, PurchaseOrder

### Controllers (`/backend/controllers/`)
- Business logic and request handling
- Interact with models
- Return JSON responses

### Routes (`/backend/routes/`)
- Define API endpoints
- Apply middleware (auth, validation)
- Connect routes to controllers

### Middleware (`/backend/middleware/`)
- `auth.js` - JWT verification & role checking
- `errorHandler.js` - Centralized error handling

## API Documentation

Complete API reference available in:
- `/backend/API_REFERENCE.md` - Full endpoint documentation
- `/API_INTEGRATION_GUIDE.md` - Frontend integration guide

## Database Structure

FashionHub uses **MongoDB** with the following collections:

- **users** - System users (admin, salesperson)
- **products** - Inventory items with variants
- **sales** - Transaction records
- **purchaseorders** - Purchase orders from suppliers
- **suppliers** - Supplier database
- **drafts** - Saved draft orders

## Common Issues

### 1. MongoDB Connection Failed
**Solution:** Check MongoDB URI in `backend/.env`
- For MongoDB Atlas: Whitelist your IP (0.0.0.0/0)
- For local MongoDB: Ensure service is running

### 2. Port 5000 Already in Use
**Solution:** Kill the process or change port
```bash
# Find process
lsof -i :5000

# Kill it
kill -9 <PID>

# OR change port in backend/.env
PORT=5001
```

### 3. CORS Error in Frontend
**Solution:** Verify `FRONTEND_URL` in backend `.env` matches your frontend URL

### 4. JWT Token Invalid
**Solution:** Ensure `JWT_SECRET` is set in backend `.env`

## Development Workflow

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   npm run dev
   ```

3. **Access Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Health: http://localhost:5000/api/health

## Summary

✅ **USE:** `/backend/` directory - Node.js/Express backend with MongoDB  
❌ **IGNORE:** `/supabase/` and `/utils/supabase/` - Legacy system files  
🔑 **KEY:** All API calls go to `http://localhost:5000/api`  
📝 **ENV:** Configure MongoDB URI, JWT secret, and CORS in `backend/.env`

---

**Last Updated:** February 2026  
**Backend Stack:** Node.js + Express + MongoDB + JWT  
**Frontend Stack:** React + TypeScript + Tailwind CSS + Vite
