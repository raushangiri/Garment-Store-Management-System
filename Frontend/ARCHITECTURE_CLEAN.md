# 🏗️ FashionHub - System Architecture

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FASHIONHUB                            │
│                   Garment Store Management                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─── Frontend (React + Vite)
                              │    Port: 5173
                              │    Location: /src/
                              │
                              ├─── Backend (Node.js + Express)
                              │    Port: 5000
                              │    Location: /backend/
                              │
                              └─── Database (MongoDB)
                                   Port: 27017
                                   ODM: Mongoose
```

---

## 🔄 Three-Tier Architecture

```
┌──────────────────────┐
│   PRESENTATION       │     React 18 + TypeScript
│   LAYER              │     Tailwind CSS v4
│   (Frontend)         │     Vite Build Tool
└──────────┬───────────┘
           │ HTTP/REST API
           │ JWT Token
           ↓
┌──────────────────────┐
│   APPLICATION        │     Node.js + Express.js
│   LAYER              │     JWT Authentication
│   (Backend)          │     Role-based Access
└──────────┬───────────┘
           │ Mongoose ODM
           │ CRUD Operations
           ↓
┌──────────────────────┐
│   DATA               │     MongoDB
│   LAYER              │     Collections:
│   (Database)         │     - users
│                      │     - products
│                      │     - sales
│                      │     - purchaseorders
│                      │     - suppliers
│                      │     - drafts
└──────────────────────┘
```

---

## 🎯 Request Flow

### Example: User Login

```
1. USER ENTERS CREDENTIALS
   ↓
2. FRONTEND (React)
   • Validates input
   • Calls API service: authAPI.login(email, password)
   • Location: /src/services/api.ts
   ↓
3. HTTP REQUEST
   • Method: POST
   • URL: http://localhost:5000/api/auth/login
   • Body: { email, password }
   • Headers: { "Content-Type": "application/json" }
   ↓
4. BACKEND - ROUTE
   • File: /backend/routes/auth.js
   • Route: POST /api/auth/login
   • Forwards to controller
   ↓
5. BACKEND - CONTROLLER
   • File: /backend/controllers/authController.js
   • Function: login()
   • Validates credentials
   • Queries database
   ↓
6. DATABASE - QUERY
   • Collection: users
   • Operation: findOne({ email })
   • Verifies password with bcrypt
   ↓
7. BACKEND - RESPONSE
   • Generates JWT token
   • Returns: { success, token, user }
   ↓
8. FRONTEND - HANDLE RESPONSE
   • Stores token in localStorage
   • Updates auth context
   • Redirects to dashboard
   ↓
9. USER SEES DASHBOARD
```

---

## 📁 Backend Structure (MVC Pattern)

```
/backend/
│
├── server.js                 # Entry point
│   ├── Initialize Express
│   ├── Connect to MongoDB
│   ├── Register middleware
│   └── Register routes
│
├── config/
│   └── database.js           # MongoDB connection
│
├── middleware/
│   ├── auth.js              # JWT verification
│   └── errorHandler.js      # Error handling
│
├── models/                   # DATA LAYER
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Sale.js              # Sale schema
│   ├── PurchaseOrder.js     # PO schema
│   ├── Supplier.js          # Supplier schema
│   └── Draft.js             # Draft schema
│
├── controllers/              # BUSINESS LOGIC
│   ├── authController.js    # Auth operations
│   ├── productController.js # Product CRUD
│   ├── saleController.js    # Sale operations
│   ├── purchaseOrderController.js
│   ├── supplierController.js
│   ├── draftController.js
│   └── userController.js
│
└── routes/                   # API ENDPOINTS
    ├── auth.js              # /api/auth/*
    ├── products.js          # /api/products/*
    ├── sales.js             # /api/sales/*
    ├── purchaseOrders.js    # /api/purchase-orders/*
    ├── suppliers.js         # /api/suppliers/*
    ├── drafts.js            # /api/drafts/*
    └── users.js             # /api/users/*
```

---

## 🎨 Frontend Structure

```
/src/
│
├── main.tsx                  # Entry point
│
├── app/
│   ├── App.tsx              # Root component
│   │
│   ├── components/          # UI COMPONENTS
│   │   ├── LoginPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Inventory.tsx
│   │   ├── PointOfSale.tsx
│   │   ├── PurchaseOrders.tsx
│   │   ├── Reports.tsx
│   │   ├── UserManagement.tsx
│   │   ├── Settings.tsx
│   │   └── ui/             # Reusable components
│   │
│   └── context/            # STATE MANAGEMENT
│       ├── AuthContext.tsx
│       ├── StoreContext.tsx
│       ├── DraftContext.tsx
│       ├── PurchaseContext.tsx
│       └── UserManagementContext.tsx
│
├── services/
│   └── api.ts              # API CLIENT
│       ├── authAPI
│       ├── productsAPI
│       ├── salesAPI
│       ├── purchaseOrdersAPI
│       ├── suppliersAPI
│       ├── draftsAPI
│       └── usersAPI
│
└── styles/
    ├── index.css           # Global styles
    ├── theme.css           # Theme tokens
    └── fonts.css           # Font imports
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│   LOGIN     │
└──────┬──────┘
       │
       ↓
┌─────────────────────┐
│ VALIDATE CREDENTIALS│
│  (authController)   │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│  GENERATE JWT TOKEN │
│    (jsonwebtoken)   │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│  STORE IN FRONTEND  │
│   (localStorage)    │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│  ATTACH TO REQUESTS │
│ Authorization:      │
│ Bearer <token>      │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│  VERIFY TOKEN       │
│  (auth middleware)  │
└──────┬──────────────┘
       │
       ├─── VALID → Allow request
       │
       └─── INVALID → 401 Unauthorized
```

---

## 🛡️ Role-Based Access Control

```
┌─────────────────────────────────────────────┐
│              USER ROLES                      │
└─────────────────────────────────────────────┘
           │
           ├─── ADMIN
           │    ├─── Full access to all features
           │    ├─── Dashboard
           │    ├─── Inventory (CRUD)
           │    ├─── Point of Sale
           │    ├─── Purchase Orders
           │    ├─── Suppliers
           │    ├─── Reports & Analytics
           │    ├─── User Management
           │    ├─── Settings
           │    └─── Drafts
           │
           └─── SALESPERSON
                ├─── Limited access
                ├─── Point of Sale ONLY
                ├─── View products
                ├─── Create sales
                ├─── Generate invoices
                └─── Manage drafts

MIDDLEWARE CHECKS:
• protect() → Verify JWT token
• authorize('admin') → Check role
• checkPermission('canGiveDiscount') → Check permissions
```

---

## 📊 Data Flow Examples

### Creating a Sale (POS)

```
FRONTEND                BACKEND                DATABASE
   │                       │                      │
   │ 1. Add to cart        │                      │
   │ 2. Generate invoice   │                      │
   │ 3. Select payment     │                      │
   │                       │                      │
   │ POST /api/sales       │                      │
   ├──────────────────────>│                      │
   │                       │ 4. Validate data     │
   │                       │ 5. Create sale doc   │
   │                       ├─────────────────────>│
   │                       │                      │ 6. Insert sale
   │                       │                      │ 7. Update stock
   │                       │<─────────────────────┤
   │                       │ 8. Return sale       │
   │<──────────────────────┤                      │
   │ 9. Show invoice       │                      │
   │ 10. Print/Download    │                      │
```

### Low Stock Alert & Purchase Order

```
ADMIN DASHBOARD         BACKEND                DATABASE
   │                       │                      │
   │ View inventory        │                      │
   │                       │                      │
   │ GET /api/products     │                      │
   ├──────────────────────>│                      │
   │                       │ Query products       │
   │                       ├─────────────────────>│
   │                       │<─────────────────────┤
   │<──────────────────────┤ Return products      │
   │                       │                      │
   │ See low stock items   │                      │
   │ Click "Place Order"   │                      │
   │                       │                      │
   │ POST /api/purchase-orders                    │
   ├──────────────────────>│                      │
   │                       │ Create PO            │
   │                       ├─────────────────────>│
   │                       │<─────────────────────┤
   │<──────────────────────┤ Return PO            │
   │                       │                      │
   │ View PO details       │                      │
   │ Mark as "Received"    │                      │
   │                       │                      │
   │ PATCH /api/purchase-orders/:id/receive       │
   ├──────────────────────>│                      │
   │                       │ Update PO status     │
   │                       │ Increment stock      │
   │                       ├─────────────────────>│
   │                       │<─────────────────────┤
   │<──────────────────────┤                      │
   │ Stock updated ✅      │                      │
```

---

## 🔌 API Communication

### Frontend API Service

```typescript
// /src/services/api.ts

const API_URL = 'http://localhost:5000/api';

const fetchWithAuth = async (url, options) => {
  const token = localStorage.getItem('fashionhub-token');
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });
  
  return response.json();
};

// Usage:
productsAPI.getAll() → GET /api/products
salesAPI.create(data) → POST /api/sales
```

### Backend Route Handler

```javascript
// /backend/routes/products.js

router.get('/', protect, async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
});
```

---

## 🗄️ Database Schema

### Collections Structure

```
MongoDB: fashionhub
│
├── users
│   ├── _id: ObjectId
│   ├── name: String
│   ├── email: String (unique)
│   ├── password: String (hashed)
│   ├── role: String (admin/salesperson)
│   ├── permissions: Object
│   ├── discountLimit: Number
│   └── status: String (active/inactive)
│
├── products
│   ├── _id: ObjectId
│   ├── name: String
│   ├── sku: String (unique)
│   ├── category: String
│   ├── brand: String
│   ├── size: String
│   ├── color: String
│   ├── gender: String
│   ├── price: Number
│   ├── cost: Number
│   ├── quantity: Number
│   ├── lowStockThreshold: Number
│   └── discount: Object
│
├── sales
│   ├── _id: ObjectId
│   ├── invoiceNumber: String (auto)
│   ├── items: Array
│   ├── customer: Object
│   ├── paymentMethod: String
│   ├── paymentStatus: String
│   ├── totalAmount: Number
│   ├── discount: Number
│   ├── taxAmount: Number
│   ├── createdBy: ObjectId (ref: User)
│   └── createdAt: Date
│
├── purchaseorders
│   ├── _id: ObjectId
│   ├── orderNumber: String (auto)
│   ├── supplier: ObjectId (ref: Supplier)
│   ├── items: Array
│   ├── totalAmount: Number
│   ├── status: String (pending/received)
│   ├── paymentStatus: String
│   └── createdAt: Date
│
├── suppliers
│   ├── _id: ObjectId
│   ├── name: String
│   ├── email: String
│   ├── phone: String
│   ├── address: String
│   └── gstNumber: String
│
└── drafts
    ├── _id: ObjectId
    ├── draftName: String
    ├── items: Array
    ├── customer: Object
    ├── totalAmount: Number
    ├── createdBy: ObjectId (ref: User)
    └── createdAt: Date
```

---

## 🚫 What NOT to Use

### ❌ Ignore These Files/Directories

```
/supabase/                     # Legacy Figma Make system
│   └── functions/
│       └── server/
│           ├── index.tsx      # NOT USED
│           └── kv_store.tsx   # NOT USED
│
/utils/
│   └── supabase/
│       └── info.tsx           # NOT USED
```

**Why?** These are protected system files from Figma Make environment. They are NOT part of FashionHub architecture.

---

## ✅ What to Use

### ✅ Active Backend

```
/backend/                      # ← USE THIS!
│   ├── server.js             # Main entry point
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── .env                  # Configuration
```

**Stack:** Node.js + Express + MongoDB  
**Port:** 5000  
**API:** http://localhost:5000/api

---

## 🎯 Summary

```
TECHNOLOGY STACK:
├── Frontend:  React 18 + TypeScript + Tailwind CSS v4
├── Backend:   Node.js + Express.js + JWT
├── Database:  MongoDB + Mongoose ODM
├── Auth:      JWT with bcrypt password hashing
└── Security:  Helmet, CORS, Rate Limiting

ARCHITECTURE PATTERN:
├── Three-tier (Presentation → Application → Data)
└── MVC pattern in backend

API STYLE:
├── RESTful API
├── JSON request/response
└── JWT Bearer token authentication

DATA FLOW:
Frontend → HTTP Request → Backend Route → Controller → Model → Database
Database → Model → Controller → JSON Response → Frontend

DEPLOYMENT:
├── Frontend:  Vite build → Static hosting (Vercel/Netlify)
├── Backend:   Node server → Cloud platform (Render/Railway)
└── Database:  MongoDB Atlas (Cloud) or Local MongoDB
```

---

## 📞 Need Help?

- [README.md](README.md) - Main documentation
- [IMPORTANT_BACKEND_INFO.md](IMPORTANT_BACKEND_INFO.md) - Backend details
- [QUICK_START_NEW.md](QUICK_START_NEW.md) - Quick setup guide
- [backend/API_REFERENCE.md](backend/API_REFERENCE.md) - API documentation

---

**Last Updated:** February 6, 2026  
**Architecture:** Three-Tier + MVC Pattern  
**Backend:** Node.js + Express + MongoDB
