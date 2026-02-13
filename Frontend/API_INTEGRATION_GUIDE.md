# 📡 API Integration Guide

Guide to integrate the FashionHub frontend with the MongoDB backend API.

---

## 🔄 Migration from LocalStorage to API

The frontend is currently using localStorage. To integrate with the backend API, follow these steps:

### Step 1: Environment Setup

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Step 2: Update Context Files

All context files need to be updated to use API calls instead of localStorage. Here's the pattern:

#### Example: StoreContext (Products)

**Before (localStorage):**
```typescript
const [products, setProducts] = useState<Product[]>(() => {
  const saved = localStorage.getItem('fashionhub-products');
  return saved ? JSON.parse(saved) : initialProducts;
});
```

**After (API):**
```typescript
import { productsAPI } from '@/services/api';

const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  loadProducts();
}, []);

const loadProducts = async () => {
  try {
    setLoading(true);
    const response = await productsAPI.getAll();
    setProducts(response.data);
  } catch (err: any) {
    setError(err.message);
    toast.error('Failed to load products');
  } finally {
    setLoading(false);
  }
};

const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const response = await productsAPI.create(product);
    setProducts([...products, response.data]);
    toast.success('Product added successfully');
  } catch (err: any) {
    toast.error(err.message);
    throw err;
  }
};
```

---

## 🔐 Authentication Flow

### Login Process

```typescript
// In AuthContext.tsx

const login = async (email: string, password: string) => {
  try {
    const response = await authAPI.login(email, password);
    
    // Token is automatically stored in localStorage by the API service
    setUser(response.user);
    setIsAuthenticated(true);
    
    return response.user;
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
};
```

### Protected Routes

All API requests automatically include the JWT token from localStorage:

```typescript
// In api.ts
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('fashionhub-token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  
  // Handle response...
};
```

---

## 📦 API Response Format

All API responses follow this format:

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

---

## 🛠️ Context Migration Checklist

Update each context file to use API:

### ✅ AuthContext

```typescript
// Replace localStorage auth with API
- localStorage.getItem('user')
+ authAPI.login()
+ authAPI.logout()
+ authAPI.getMe()
```

### ✅ StoreContext (Products & Sales)

```typescript
// Products
- localStorage.getItem('fashionhub-products')
+ productsAPI.getAll()
+ productsAPI.create()
+ productsAPI.update()
+ productsAPI.delete()
+ productsAPI.updateStock()

// Sales
- localStorage.getItem('fashionhub-sales')
+ salesAPI.getAll()
+ salesAPI.create()
+ salesAPI.getOne()
```

### ✅ PurchaseContext

```typescript
// Purchase Orders
- localStorage.getItem('fashionhub-purchase-orders')
+ purchaseOrdersAPI.getAll()
+ purchaseOrdersAPI.create()
+ purchaseOrdersAPI.update()
+ purchaseOrdersAPI.markAsReceived()

// Suppliers
- localStorage.getItem('fashionhub-suppliers')
+ suppliersAPI.getAll()
+ suppliersAPI.create()
+ suppliersAPI.update()
+ suppliersAPI.delete()
```

### ✅ DraftContext

```typescript
// Drafts
- localStorage.getItem('fashionhub-drafts')
+ draftsAPI.getAll()
+ draftsAPI.create()
+ draftsAPI.update()
+ draftsAPI.delete()
```

### ✅ UserManagementContext

```typescript
// Users
- localStorage.getItem('fashionhub-sales-users')
+ usersAPI.getAll()
+ usersAPI.create()
+ usersAPI.update()
+ usersAPI.delete()
```

---

## 🔄 API Integration Example

### Complete StoreContext with API

```typescript
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { productsAPI, salesAPI } from '@/services/api';
import { toast } from 'sonner';

export interface Product {
  _id?: string;  // MongoDB uses _id
  id?: string;   // Keep for frontend compatibility
  name: string;
  barcode: string;
  price: number;
  stock: number;
  category: string;
  minStock: number;
  // ... other fields
}

interface StoreContextType {
  products: Product[];
  sales: any[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addSale: (sale: any) => Promise<void>;
  // ... other methods
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productsRes, salesRes] = await Promise.all([
        productsAPI.getAll(),
        salesAPI.getAll()
      ]);
      
      // Map _id to id for frontend compatibility
      const mappedProducts = productsRes.data.map((p: any) => ({
        ...p,
        id: p._id
      }));
      
      const mappedSales = salesRes.data.map((s: any) => ({
        ...s,
        id: s._id
      }));
      
      setProducts(mappedProducts);
      setSales(mappedSales);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const response = await productsAPI.create(product);
      const newProduct = { ...response.data, id: response.data._id };
      setProducts([...products, newProduct]);
      toast.success('Product added successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add product');
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const response = await productsAPI.update(id, productData);
      const updatedProduct = { ...response.data, id: response.data._id };
      setProducts(products.map(p => p.id === id ? updatedProduct : p));
      toast.success('Product updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsAPI.delete(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
      throw err;
    }
  };

  const addSale = async (saleData: any) => {
    try {
      const response = await salesAPI.create(saleData);
      const newSale = { ...response.data, id: response.data._id };
      setSales([newSale, ...sales]);
      
      // Refresh products to get updated stock
      const productsRes = await productsAPI.getAll();
      const mappedProducts = productsRes.data.map((p: any) => ({
        ...p,
        id: p._id
      }));
      setProducts(mappedProducts);
      
      toast.success('Sale recorded successfully');
      return newSale;
    } catch (err: any) {
      toast.error(err.message || 'Failed to record sale');
      throw err;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        sales,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        // ... other methods
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
```

---

## 🎯 Testing API Integration

### 1. Test Backend Connection

```bash
# In browser console or using curl
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"FashionHub API is running","timestamp":"..."}
```

### 2. Test Login

```typescript
// In browser console
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@fashionhub.com',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### 3. Test Products API

```typescript
// Get all products
const token = 'your-jwt-token-here';
fetch('http://localhost:5000/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🚨 Common Issues & Solutions

### Issue: CORS Error

**Error:** `Access to fetch has been blocked by CORS policy`

**Solution:**
Backend already has CORS configured. Make sure:
1. Backend `FRONTEND_URL` in `.env` matches your frontend URL
2. Backend is running
3. Clear browser cache

### Issue: 401 Unauthorized

**Error:** `Not authorized to access this route`

**Solution:**
1. Check if token exists in localStorage: `localStorage.getItem('fashionhub-token')`
2. Token might be expired - login again
3. Verify token format in Authorization header

### Issue: Network Error

**Error:** `Failed to fetch` or `Network request failed`

**Solution:**
1. Verify backend is running: http://localhost:5000/api/health
2. Check `VITE_API_URL` in `.env`
3. Check browser console for exact error

### Issue: MongoDB _id vs id

MongoDB uses `_id` but frontend uses `id`. Solution:

```typescript
// Map _id to id
const mappedData = apiResponse.data.map((item: any) => ({
  ...item,
  id: item._id
}));
```

---

## 📝 Migration Steps Summary

1. ✅ Create `.env` with `VITE_API_URL`
2. ✅ Start backend server
3. ✅ Seed database with admin user
4. ✅ Update AuthContext to use `authAPI`
5. ✅ Update StoreContext to use `productsAPI` and `salesAPI`
6. ✅ Update PurchaseContext to use `purchaseOrdersAPI` and `suppliersAPI`
7. ✅ Update DraftContext to use `draftsAPI`
8. ✅ Update UserManagementContext to use `usersAPI`
9. ✅ Test login functionality
10. ✅ Test product CRUD operations
11. ✅ Test sales creation
12. ✅ Test all other features

---

## 🎉 Ready for Production

Once migration is complete:

1. Update `VITE_API_URL` to production backend URL
2. Deploy backend to cloud provider
3. Deploy frontend to Vercel/Netlify
4. Test all functionality in production
5. Monitor logs for any issues

Your FashionHub system is now fully integrated with MongoDB backend! 🚀
