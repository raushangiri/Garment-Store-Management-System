# 🚀 Quick Commands Reference

## Start Project

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend (in project root)
npm install  
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## Seed Data

### Add Sample Products (20 items)
```bash
cd backend
node seedProducts.js
```

### Create Initial Admin (via UI)
1. Visit http://localhost:5173
2. Fill setup form
3. Login with created credentials

---

## Test Sales Person Reports

### 1. Create Sales User with Reports Access
```
Admin Dashboard
  → User Management
  → Add New User
  → Name: Sales Person 1
  → Email: sales1@fashionhub.com
  → Password: sales123
  → ✓ Can View Reports
  → Save
```

### 2. Test as Sales Person
```bash
Logout → Login as sales1@fashionhub.com
→ Reports tab visible ✅
→ Make sales in POS
→ Check Reports (only your sales shown)
```

### 3. Test as Admin
```bash
Logout → Login as admin
→ Reports → Select sales person from dropdown
→ View individual performance
→ View Sales Person Performance table
```

---

## MongoDB Collections

```javascript
// Users collection
use fashionhub
db.grocary_admin_users.find().pretty()

// Products collection  
db.products.find().pretty()

// Sales collection
db.sales.find().pretty()

// Check sales with person info
db.sales.find({}, { 
  invoiceNumber: 1, 
  salesPersonName: 1,
  total: 1 
}).pretty()
```

---

## API Endpoints

### Setup (No Auth)
```bash
# Check setup status
curl http://localhost:5000/api/setup/status

# Create admin
curl -X POST http://localhost:5000/api/setup/create-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@fashionhub.com","phone":"+91 99999 99999","password":"admin123"}'
```

### Auth
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fashionhub.com","password":"admin123"}'
```

### Products (with token)
```bash
# Get all products
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Common Tasks

### Reset Everything
```javascript
// In MongoDB shell
use fashionhub
db.grocary_admin_users.deleteMany({})
db.products.deleteMany({})
db.sales.deleteMany({})

// In browser
localStorage.clear()

// Restart servers and visit http://localhost:5173
```

### Add More Products
Edit `backend/seedProducts.js` and add to `sampleProducts` array, then run:
```bash
node backend/seedProducts.js
```

### Check User Permissions
```javascript
// In MongoDB
db.grocary_admin_users.find(
  { email: "sales1@fashionhub.com" },
  { permissions: 1, name: 1 }
).pretty()
```

### View Sales by Person
```javascript
// In MongoDB
db.sales.aggregate([
  {
    $group: {
      _id: "$salesPersonName",
      totalSales: { $sum: 1 },
      totalRevenue: { $sum: "$total" }
    }
  }
])
```

---

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
PORT=5000
NODE_ENV=development
JWT_SECRET=testsecretkey
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(err => console.log('❌ Error:', err))"

# Check port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### Frontend can't connect
```bash
# Test backend
curl http://localhost:5000/api/health

# Check .env
cat .env
```

### Reports not showing for sales person
1. Check user permissions in User Management
2. Verify "Can View Reports" is checked
3. Logout and login again
4. Reports tab should appear

### Sales person filter not working
1. Check sales have `salesPersonId` field:
   ```javascript
   db.sales.findOne({}, { salesPersonId: 1, salesPersonName: 1 })
   ```
2. If missing, those are old sales
3. Make new sales to see proper tracking

---

## File Structure

```
project/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── setupController.js ← Bootstrap admin
│   │   └── ...
│   ├── models/
│   │   ├── User.js ← grocary_admin_users collection
│   │   ├── Sale.js ← Has salesPersonId/Name
│   │   └── ...
│   ├── routes/
│   │   ├── setup.js ← Public routes
│   │   └── ...
│   ├── seed.js ← Old seeder
│   ├── seedProducts.js ← New product seeder
│   └── server.js
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Reports.tsx ← Sales person filtering
│   │   │   ├── PaymentModal.tsx ← Saves person info
│   │   │   ├── Sidebar.tsx ← Dynamic reports tab
│   │   │   ├── Setup.tsx ← Bootstrap UI
│   │   │   └── ...
│   │   └── context/
│   │       ├── AuthContext.tsx ← API integration
│   │       ├── StoreContext.tsx ← API integration
│   │       └── ...
│   └── services/
│       └── api.ts ← API service layer
└── Documentation/
    ├── QUICK_START.md
    ├── FIXES_COMPLETE.md
    └── ...
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start backend | `cd backend && npm run dev` |
| Start frontend | `npm run dev` |
| Seed products | `cd backend && node seedProducts.js` |
| Clear data | `localStorage.clear()` in browser console |
| Check health | `curl http://localhost:5000/api/health` |
| View logs | Check terminal running servers |
| Reset setup | Delete admin from MongoDB + `localStorage.clear()` |

---

**Happy Coding! 🎉**
