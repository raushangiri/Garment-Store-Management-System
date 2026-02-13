# 📚 FashionHub API Reference

Quick reference for all API endpoints.

**Base URL:** `http://localhost:5000/api`

---

## 🛠️ Setup (Bootstrap)

### GET `/setup/status`
Check if initial admin setup is required
- **Auth Required:** No
- **Public Endpoint**

**Response:**
```json
{
  "success": true,
  "setupRequired": true,
  "message": "No admin user found. Please create initial admin user."
}
```

### POST `/setup/create-admin`
Create initial admin user (only works when no admin exists)
- **Auth Required:** No
- **Public Endpoint**

**Request:**
```json
{
  "name": "Admin User",
  "email": "admin@fashionhub.com",
  "phone": "+91 99999 99999",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin user created successfully! You can now login.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@fashionhub.com",
    "phone": "+91 99999 99999",
    "role": "admin"
  }
}
```

**Error Response (if admin already exists):**
```json
{
  "success": false,
  "message": "Admin user already exists. Please login with existing credentials or contact system administrator."
}
```

---

## 🔐 Authentication

### POST `/auth/login`
Login user and get JWT token

**Request:**
```json
{
  "email": "admin@fashionhub.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin",
    "email": "admin@fashionhub.com",
    "role": "admin",
    "permissions": { ... }
  }
}
```

### GET `/auth/me`
Get current logged-in user
- **Auth Required:** Yes

### POST `/auth/logout`
Logout user
- **Auth Required:** Yes

---

## 📦 Products

### GET `/products`
Get all products
- **Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Cotton T-Shirt",
      "barcode": "TSH001",
      "price": 499,
      "stock": 100,
      "category": "T-Shirts",
      "minStock": 20,
      "size": "M",
      "color": "Blue",
      "brand": "FashionBrand",
      "gender": "Unisex",
      "discountEnabled": true,
      "discountPercent": 10,
      "maxDiscountForSales": 15,
      "maxDiscountForAdmin": 25,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET `/products/:id`
Get single product
- **Auth Required:** Yes

### POST `/products`
Create new product
- **Auth Required:** Yes (Admin only)

**Request:**
```json
{
  "name": "Cotton T-Shirt",
  "barcode": "TSH001",
  "price": 499,
  "stock": 100,
  "category": "T-Shirts",
  "minStock": 20,
  "size": "M",
  "color": "Blue",
  "brand": "FashionBrand",
  "gender": "Unisex",
  "discountEnabled": true,
  "discountPercent": 10,
  "maxDiscountForSales": 15,
  "maxDiscountForAdmin": 25
}
```

### PUT `/products/:id`
Update product
- **Auth Required:** Yes (Admin only)

### DELETE `/products/:id`
Delete product
- **Auth Required:** Yes (Admin only)

### PATCH `/products/:id/stock`
Update product stock
- **Auth Required:** Yes

**Request:**
```json
{
  "quantity": 50,
  "operation": "add"  // or "subtract" or "set"
}
```

### GET `/products/low-stock`
Get products with low stock
- **Auth Required:** Yes

---

## 💰 Sales

### GET `/sales`
Get all sales
- **Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "count": 125,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "invoiceNumber": "INV-2401-00001",
      "items": [
        {
          "productId": "507f1f77bcf86cd799439011",
          "productName": "Cotton T-Shirt",
          "quantity": 2,
          "price": 499,
          "size": "M",
          "color": "Blue",
          "discount": 0
        }
      ],
      "subtotal": 998,
      "tax": 49.90,
      "discount": 0,
      "total": 1047.90,
      "paymentMethod": "UPI",
      "upiTransactionId": "TXN123456789",
      "customerName": "John Doe",
      "customerPhone": "+91 98765 43210",
      "salesPersonName": "Sales Person",
      "createdAt": "2024-01-15T14:30:00.000Z"
    }
  ]
}
```

### GET `/sales/:id`
Get single sale
- **Auth Required:** Yes

### POST `/sales`
Create new sale (automatically reduces stock)
- **Auth Required:** Yes

**Request:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "productName": "Cotton T-Shirt",
      "quantity": 2,
      "price": 499,
      "size": "M",
      "color": "Blue"
    }
  ],
  "subtotal": 998,
  "tax": 49.90,
  "discount": 0,
  "total": 1047.90,
  "paymentMethod": "UPI",
  "upiTransactionId": "TXN123456789",
  "customerName": "John Doe",
  "customerPhone": "+91 98765 43210"
}
```

### GET `/sales/stats`
Get sales statistics
- **Auth Required:** Yes (Admin only)
- **Query Params:** `startDate`, `endDate` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "overall": {
      "totalSales": 125,
      "totalRevenue": 125000,
      "averageOrderValue": 1000
    },
    "byPaymentMethod": [
      { "_id": "UPI", "count": 50, "total": 50000 },
      { "_id": "CASH", "count": 40, "total": 40000 },
      { "_id": "CREDIT_CARD", "count": 35, "total": 35000 }
    ]
  }
}
```

---

## 🛒 Purchase Orders

### GET `/purchase-orders`
Get all purchase orders
- **Auth Required:** Yes (Admin only)

### GET `/purchase-orders/:id`
Get single purchase order
- **Auth Required:** Yes (Admin only)

### POST `/purchase-orders`
Create purchase order
- **Auth Required:** Yes (Admin only)

**Request:**
```json
{
  "supplierId": "507f1f77bcf86cd799439013",
  "supplierName": "Fashion Textiles Ltd",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "productName": "Cotton T-Shirt",
      "quantity": 100,
      "price": 300,
      "size": "M",
      "color": "Blue"
    }
  ],
  "totalAmount": 30000,
  "paidAmount": 15000,
  "status": "pending",
  "paymentStatus": "partial",
  "expectedDelivery": "2024-02-15",
  "notes": "Urgent order"
}
```

### PUT `/purchase-orders/:id`
Update purchase order
- **Auth Required:** Yes (Admin only)

### DELETE `/purchase-orders/:id`
Delete purchase order
- **Auth Required:** Yes (Admin only)

### PATCH `/purchase-orders/:id/receive`
Mark purchase order as received (automatically increases stock)
- **Auth Required:** Yes (Admin only)

---

## 🏢 Suppliers

### GET `/suppliers`
Get all suppliers
- **Auth Required:** Yes (Admin only)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Fashion Textiles Ltd",
      "email": "contact@fashiontextiles.com",
      "phone": "+91 98765 11111",
      "address": "123 Textile Market",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "gstin": "27AABCU9603R1ZM",
      "contactPerson": "Rajesh Kumar",
      "status": "active"
    }
  ]
}
```

### GET `/suppliers/:id`
Get single supplier
- **Auth Required:** Yes (Admin only)

### POST `/suppliers`
Create supplier
- **Auth Required:** Yes (Admin only)

### PUT `/suppliers/:id`
Update supplier
- **Auth Required:** Yes (Admin only)

### DELETE `/suppliers/:id`
Delete supplier
- **Auth Required:** Yes (Admin only)

---

## 📝 Drafts

### GET `/drafts`
Get all draft orders
- **Auth Required:** Yes

### GET `/drafts/:id`
Get single draft
- **Auth Required:** Yes

### POST `/drafts`
Create draft order
- **Auth Required:** Yes

**Request:**
```json
{
  "name": "Customer Order - John",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "productName": "Cotton T-Shirt",
      "quantity": 2,
      "price": 499,
      "size": "M",
      "color": "Blue"
    }
  ],
  "customerName": "John Doe",
  "customerPhone": "+91 98765 43210",
  "notes": "Will confirm tomorrow"
}
```

### PUT `/drafts/:id`
Update draft
- **Auth Required:** Yes

### DELETE `/drafts/:id`
Delete draft
- **Auth Required:** Yes

---

## 👥 Users (Sales Persons)

### GET `/users`
Get all sales users
- **Auth Required:** Yes (Admin only)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Sales Person",
      "email": "sales@fashionhub.com",
      "phone": "+91 98765 43210",
      "role": "salesPerson",
      "status": "active",
      "permissions": {
        "canDiscount": true,
        "canRefund": false,
        "canViewReports": false,
        "maxDiscountPercent": 10
      },
      "lastLogin": "2024-01-15T09:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET `/users/:id`
Get single user
- **Auth Required:** Yes (Admin only)

### POST `/users`
Create sales user
- **Auth Required:** Yes (Admin only)

**Request:**
```json
{
  "name": "New Sales Person",
  "email": "newsales@fashionhub.com",
  "phone": "+91 98765 00000",
  "password": "password123",
  "status": "active",
  "permissions": {
    "canDiscount": true,
    "canRefund": false,
    "canViewReports": false,
    "maxDiscountPercent": 10
  }
}
```

### PUT `/users/:id`
Update user
- **Auth Required:** Yes (Admin only)

### DELETE `/users/:id`
Delete user
- **Auth Required:** Yes (Admin only)

---

## ⚡ Quick Examples

### Login and Get Products

```javascript
// 1. Login
const loginRes = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@fashionhub.com',
    password: 'admin123'
  })
});
const { token } = await loginRes.json();

// 2. Get Products
const productsRes = await fetch('http://localhost:5000/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const products = await productsRes.json();
console.log(products);
```

### Create Sale

```javascript
const saleRes = await fetch('http://localhost:5000/api/sales', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    items: [
      {
        productId: '507f1f77bcf86cd799439011',
        productName: 'Cotton T-Shirt',
        quantity: 2,
        price: 499
      }
    ],
    subtotal: 998,
    tax: 49.90,
    discount: 0,
    total: 1047.90,
    paymentMethod: 'CASH',
    customerName: 'John Doe'
  })
});
const sale = await saleRes.json();
```

---

## 🔒 Authorization Headers

All protected routes require:

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

---

## ⚠️ Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## 📞 Health Check

```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "FashionHub API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```