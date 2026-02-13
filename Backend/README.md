# FashionHub Backend API

Complete Node.js/Express backend with MongoDB for FashionHub Garment Store Management System.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and update with your MongoDB connection:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
PORT=5000
NODE_ENV=development

# Replace with your MongoDB connection string
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/fashionhub?retryWrites=true&w=majority

# Change this to a random secret key
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Your frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Create Default Admin User

After starting the server, you need to create an admin user manually in MongoDB or use this seed script:

Create `backend/seed.js`:

```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const createAdmin = async () => {
  try {
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@fashionhub.com',
      phone: '+91 99999 99999',
      password: 'admin123',
      role: 'admin',
      status: 'active'
    });
    console.log('✅ Admin user created:', admin.email);
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();
```

Run: `node seed.js`

### 4. Start Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `PATCH /api/products/:id/stock` - Update stock
- `GET /api/products/low-stock` - Get low stock products

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get single sale
- `POST /api/sales` - Create sale
- `GET /api/sales/stats` - Get sales statistics (Admin only)

### Purchase Orders
- `GET /api/purchase-orders` - Get all purchase orders (Admin only)
- `GET /api/purchase-orders/:id` - Get single purchase order (Admin only)
- `POST /api/purchase-orders` - Create purchase order (Admin only)
- `PUT /api/purchase-orders/:id` - Update purchase order (Admin only)
- `DELETE /api/purchase-orders/:id` - Delete purchase order (Admin only)
- `PATCH /api/purchase-orders/:id/receive` - Mark as received (Admin only)

### Suppliers
- `GET /api/suppliers` - Get all suppliers (Admin only)
- `GET /api/suppliers/:id` - Get single supplier (Admin only)
- `POST /api/suppliers` - Create supplier (Admin only)
- `PUT /api/suppliers/:id` - Update supplier (Admin only)
- `DELETE /api/suppliers/:id` - Delete supplier (Admin only)

### Drafts
- `GET /api/drafts` - Get all drafts
- `GET /api/drafts/:id` - Get single draft
- `POST /api/drafts` - Create draft
- `PUT /api/drafts/:id` - Update draft
- `DELETE /api/drafts/:id` - Delete draft

### Users (Sales Persons)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get single user (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## 🔐 Authentication

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📦 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // For list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

## 🗄️ Database Models

### User
- Admin and Sales Person roles
- Permission-based access control
- Bcrypt password hashing

### Product
- Garment-specific fields (size, color, brand, gender)
- Discount configuration
- Stock tracking

### Sale
- Auto-generated invoice numbers
- Multiple payment methods
- Automatic stock deduction

### Purchase Order
- Auto-generated order numbers
- Supplier tracking
- Automatic stock increment on receipt

### Supplier
- Complete contact information
- GST tracking

### Draft
- Save incomplete orders
- User tracking

## 🔒 Security Features

- Helmet for HTTP headers security
- CORS protection
- Rate limiting (100 requests per 10 minutes)
- JWT authentication
- Password hashing with bcrypt
- Input validation
- Role-based access control

## 📝 Default Credentials

**Admin:**
- Email: `admin@fashionhub.com`
- Password: `admin123`

**Sales Person (if seeded):**
- Email: `sales@fashionhub.com`
- Password: `sales123`

## 🛠️ Deployment

### Deploy to Heroku

```bash
heroku create fashionhub-api
heroku config:set MONGODB_URI=your-connection-string
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
git push heroku main
```

### Deploy to Railway/Render

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

## 📞 Support

For issues or questions, contact the development team.

## 📄 License

Proprietary - FashionHub Store Management System
