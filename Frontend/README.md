# 👔 FashionHub - Garment Store Management System

A comprehensive, production-ready garment store management portal with role-based access control, MongoDB backend, and modern React frontend.

> **⚠️ IMPORTANT:** This project uses a **standalone Node.js/Express backend with MongoDB**. The `/supabase/` and `/utils/supabase/` directories are legacy system files from Figma Make and should be **IGNORED**. See [IMPORTANT_BACKEND_INFO.md](IMPORTANT_BACKEND_INFO.md) for details.

> **📚 NEW?** Check our [5-Minute Quick Start](QUICK_START_NEW.md) or [Documentation Index](DOCUMENTATION_INDEX.md) to find the right guide!

![License](https://img.shields.io/badge/license-Proprietary-blue)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/mongodb-6.0%2B-green)
![React](https://img.shields.io/badge/react-18.0%2B-blue)

---

## ✨ Features

### 🔐 **Authentication & User Management**
- JWT-based secure authentication
- Role-based access control (Admin & Sales Person)
- Granular permission system
- Password encryption with bcrypt
- Session management

### 📦 **Inventory Management**
- Complete CRUD for products
- Multi-variant tracking (Size, Color, Brand, Gender)
- Barcode scanning integration
- Low stock alerts
- Discount configuration per product
- Category management

### 💰 **Point of Sale (POS)**
- Intuitive cart system
- Barcode scanner integration
- Multiple payment methods (UPI, Cash, Credit/Debit Card)
- QR code generation for UPI payments
- Professional invoice generation
- Customer tracking

### 📝 **Draft Orders**
- Save incomplete orders
- Load and modify drafts
- Convert drafts to invoices
- Multiple draft management

### 🛒 **Purchase Order Management**
- Create and manage purchase orders
- Supplier database
- Auto-generate PO numbers
- Order status tracking
- Automatic stock updates on receipt
- Payment tracking (Unpaid/Partial/Paid)
- Low stock detection with "Place Order" button

### 👥 **User Management (Admin)**
- Create/edit/delete sales users
- Custom permissions per user
- Discount limit configuration
- Activity tracking
- Status management (Active/Inactive)

### 📊 **Reports & Analytics**
- Sales statistics
- Revenue tracking
- Payment method analysis
- Inventory reports
- Low stock alerts

### 🎨 **UI/UX**
- Modern gradient design
- Fully responsive (Mobile, Tablet, Desktop)
- Dark mode support
- Intuitive navigation
- Real-time notifications

---

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Vite** for build tooling
- **Context API** for state management
- **React Router** for navigation
- **Sonner** for notifications
- **Lucide React** for icons
- **date-fns** for date handling
- **QRCode.react** for QR generation

### Backend
- **Node.js** (v16+)
- **Express.js** framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Helmet** for security
- **CORS** protection
- **Rate limiting**
- **Morgan** for logging

---

## 📁 Project Structure

```
fashionhub/
│
├── backend/                      # Backend API
│   ├── config/                   # Database configuration
│   ├── controllers/              # Business logic
│   ├── middleware/               # Auth & error handling
│   ├── models/                   # MongoDB schemas
│   ├── routes/                   # API routes
│   ├── .env.example              # Environment template
│   ├── server.js                 # Main server file
│   ├── seed.js                   # Database seeder
│   └── package.json              # Dependencies
│
├── src/                          # Frontend application
│   ├── app/                      # Main app components
│   │   ├── components/           # React components
│   │   ├── context/              # State management
│   │   └── App.tsx               # Root component
│   ├── services/                 # API integration
│   │   └── api.ts                # API service layer
│   ├── styles/                   # Global styles
│   └── main.tsx                  # Entry point
│
├── public/                       # Static assets
│
├── .env.example                  # Frontend env template
├── package.json                  # Frontend dependencies
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
│
└── Documentation/
    ├── SETUP_GUIDE.md            # Complete setup instructions
    ├── API_INTEGRATION_GUIDE.md  # Frontend-backend integration
    ├── BACKEND_SUMMARY.md        # Backend overview
    ├── ARCHITECTURE.md           # System architecture
    └── README.md                 # This file
```

---

## 🚀 Quick Start

> **🚀 New to FashionHub?** Check out our [5-Minute Quick Start Guide](QUICK_START_NEW.md) for the fastest setup!

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas account)
- npm or yarn

### 1. Clone Repository

```bash
git clone https://github.com/your-username/fashionhub.git
cd fashionhub
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB connection string

# Seed database (creates admin user)
node seed.js

# Start backend server
npm run dev
```

Backend will run on: http://localhost:5000

### 3. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api

# Start frontend
npm run dev
```

Frontend will run on: http://localhost:5173

### 4. Login

**Admin:**
- Email: `admin@fashionhub.com`
- Password: `admin123`

**Sales Person:**
- Email: `sales@fashionhub.com`
- Password: `sales123`

---

## 📚 Documentation

Comprehensive documentation is available:

| Document | Description |
|----------|-------------|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Complete setup instructions |
| [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) | Frontend-backend integration |
| [BACKEND_SUMMARY.md](BACKEND_SUMMARY.md) | Backend API overview |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture diagrams |
| [backend/API_REFERENCE.md](backend/API_REFERENCE.md) | API endpoint reference |
| [backend/README.md](backend/README.md) | Backend-specific guide |

---

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fashionhub

# JWT Configuration
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌐 Deployment

### Backend Deployment

**Recommended: Render (Free)**

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add environment variables

**Other Options:**
- Railway
- Heroku
- DigitalOcean
- AWS/GCP/Azure

### Frontend Deployment

**Recommended: Vercel (Free)**

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set environment variable: `VITE_API_URL=your-backend-url/api`

**Other Options:**
- Netlify
- Cloudflare Pages
- GitHub Pages

---

## 🎯 Core Workflows

### Creating a Sale

1. Login as Admin or Sales Person
2. Go to Point of Sale
3. Add products to cart (scan or search)
4. Enter customer details (optional)
5. Generate invoice
6. Select payment method
7. Complete sale (stock auto-updated)

### Managing Purchase Orders

1. Login as Admin
2. Go to Purchase Orders
3. Create new PO or use "Place Order" from low stock items
4. Select supplier
5. Add items and quantities
6. Submit order
7. Mark as "Received" when goods arrive (stock auto-updated)

### User Management

1. Login as Admin
2. Go to User Management
3. Create new sales user
4. Set permissions (discount limits, refunds, reports)
5. Activate/deactivate users as needed

---

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/login           Login user
GET    /api/auth/me              Get current user
POST   /api/auth/logout          Logout user
```

### Products
```
GET    /api/products             Get all products
POST   /api/products             Create product (Admin)
PUT    /api/products/:id         Update product (Admin)
DELETE /api/products/:id         Delete product (Admin)
PATCH  /api/products/:id/stock   Update stock
GET    /api/products/low-stock   Get low stock products
```

### Sales
```
GET    /api/sales                Get all sales
POST   /api/sales                Create sale
GET    /api/sales/stats          Get statistics (Admin)
```

### Purchase Orders
```
GET    /api/purchase-orders      Get all POs (Admin)
POST   /api/purchase-orders      Create PO (Admin)
PATCH  /api/purchase-orders/:id/receive  Mark received (Admin)
```

[See complete API reference](backend/API_REFERENCE.md)

---

## 🛡️ Security Features

- ✅ JWT authentication with expiration
- ✅ bcrypt password hashing (10 rounds)
- ✅ HTTP security headers (Helmet)
- ✅ CORS protection
- ✅ Rate limiting (100 req/10min)
- ✅ Input validation
- ✅ MongoDB injection protection
- ✅ Role-based access control
- ✅ Secure environment variables

---

## 🧪 Testing

### Test Backend

```bash
# Health check
curl http://localhost:5000/api/health

# Login test
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fashionhub.com","password":"admin123"}'
```

### Test Frontend

1. Visit http://localhost:5173
2. Login with admin credentials
3. Test each feature:
   - Add product
   - Create sale
   - Save draft
   - Create PO
   - Manage users

---

## 🐛 Troubleshooting

### MongoDB Connection Error

**Solution:**
1. Verify connection string in `backend/.env`
2. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
3. Ensure username/password are correct

### CORS Error

**Solution:**
1. Verify `FRONTEND_URL` in backend `.env`
2. Check backend is running
3. Clear browser cache

### Port Already in Use

**Solution:**
```bash
# Kill process on port 5000
lsof -i :5000  # Find PID
kill -9 <PID>  # Kill process
```

[See complete troubleshooting guide](SETUP_GUIDE.md#troubleshooting)

---

## 🎨 Screenshots

*Add screenshots of your application here*

---

## 📝 License

Proprietary - FashionHub Store Management System

---

## 👨‍💻 Development

### Development Commands

**Backend:**
```bash
npm run dev     # Start with nodemon
npm start       # Start production
node seed.js    # Seed database
```

**Frontend:**
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

### Tech Stack Details

- **Frontend Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** React Context API
- **API Client:** Fetch API with custom wrapper
- **Form Handling:** React Hooks
- **Routing:** React Router v6
- **Build Tool:** Vite
- **Backend Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Security:** helmet, cors, rate-limit

---

## 🤝 Contributing

This is a proprietary project. For authorized contributors:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📞 Support

For support and questions:
- Check [Documentation](SETUP_GUIDE.md)
- Review [API Reference](backend/API_REFERENCE.md)
- See [Architecture Guide](ARCHITECTURE.md)

---

## 🎉 Acknowledgments

Built with modern web technologies and best practices for garment retail management.

---

## 🗺️ Roadmap

### Future Enhancements
- [ ] WhatsApp integration for PO sharing
- [ ] Multi-item selection in inventory
- [ ] Email notifications
- [ ] Advanced reporting dashboard
- [ ] Mobile app (React Native)
- [ ] Barcode printing
- [ ] Customer loyalty program
- [ ] Multi-store support
- [ ] Advanced analytics
- [ ] Export to Excel/PDF

---

**Made with ❤️ for FashionHub**