# FashionHub Backend Migration Guide

## Overview

This guide explains the migration from the previous flat backend structure to the new modular, MVC-based architecture aligned with your FIRS-Invoice-QR project structure.

## What Changed?

### Previous Structure
```
/supabase/functions/server/
├── index.tsx    (All routes and logic in one file)
└── kv_store.tsx (Database abstraction)
```

### New Structure
```
/supabase/functions/server/
├── index.tsx                 # Main entry point (routes only)
├── kv_store.tsx             # Database abstraction (unchanged)
├── config/
│   └── config.tsx           # Centralized configuration
├── utils/
│   ├── ApiError.tsx         # Custom error class
│   ├── ApiSuccess.tsx       # Success response formatter
│   └── catchAsync.tsx       # Async error handler
├── middlewares/
│   ├── error.tsx            # Error handling
│   ├── auth.tsx             # Authentication
│   └── validate.tsx         # Validation
└── api/
    ├── routes.tsx           # Route aggregator
    ├── auth/                # Authentication module
    ├── inventory/           # Inventory module (example)
    └── [other modules]/     # Orders, invoices, etc.
```

## Benefits of New Structure

### 1. **Better Organization**
- Each feature has its own module
- Clear separation of concerns
- Easy to find and modify code

### 2. **Scalability**
- Add new features without touching existing code
- Independent module development
- Team members can work on different modules

### 3. **Maintainability**
- Standardized patterns across all modules
- Consistent error handling
- Easier to test and debug

### 4. **Code Reusability**
- Shared utilities and middleware
- DRY (Don't Repeat Yourself) principle
- Centralized configuration

## Migration Steps

### Step 1: Understanding the Module Pattern

Each feature module follows this structure:

```
module-name/
├── module-name.controller.tsx   # HTTP request/response handling
├── module-name.service.tsx      # Business logic and data operations
├── module-name.route.tsx        # Route definitions and middleware
└── module-name.validation.tsx   # Input validation (optional)
```

**Example: Inventory Module**

#### Controller (inventory.controller.tsx)
```typescript
import catchAsync from "../../utils/catchAsync.tsx";
import ApiSuccess from "../../utils/ApiSuccess.tsx";
import * as inventoryService from "./inventory.service.tsx";

export const getAllProducts = catchAsync(async (c: Context) => {
  const products = await inventoryService.getProducts();
  return c.json(new ApiSuccess(200, 'Success', products).toJSON());
});
```

#### Service (inventory.service.tsx)
```typescript
import ApiError from "../../utils/ApiError.tsx";
import * as kv from "../../kv_store.tsx";

export const getProducts = async () => {
  const products = await kv.getByPrefix('product:');
  if (!products) {
    throw new ApiError(404, 'No products found');
  }
  return products;
};
```

#### Route (inventory.route.tsx)
```typescript
import { Hono } from "npm:hono";
import * as controller from "./inventory.controller.tsx";
import { authenticate, authorize } from "../../middlewares/auth.tsx";

const router = new Hono();

router.get("/", controller.getAllProducts);
router.post("/", authenticate, authorize("admin"), controller.createProduct);

export default router;
```

### Step 2: Migrating Existing Routes

**Old Way (Everything in index.tsx):**
```typescript
app.get("/make-server-e13962a3/inventory", async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    return c.json({ success: true, data: products });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});
```

**New Way (Modular approach):**

1. Create service:
```typescript
// api/inventory/inventory.service.tsx
export const getProducts = async () => {
  const products = await kv.getByPrefix('product:');
  if (!products) throw new ApiError(404, 'No products found');
  return products;
};
```

2. Create controller:
```typescript
// api/inventory/inventory.controller.tsx
export const getAllProducts = catchAsync(async (c: Context) => {
  const products = await inventoryService.getProducts();
  return c.json(new ApiSuccess(200, 'Success', products).toJSON());
});
```

3. Create route:
```typescript
// api/inventory/inventory.route.tsx
router.get("/", controller.getAllProducts);
```

4. Register route:
```typescript
// api/routes.tsx
import inventoryRoutes from "./inventory/inventory.route.tsx";
router.route("/inventory", inventoryRoutes);
```

### Step 3: Error Handling Migration

**Old Way:**
```typescript
try {
  // logic
} catch (error) {
  return c.json({ error: error.message }, 500);
}
```

**New Way:**
```typescript
import catchAsync from "../../utils/catchAsync.tsx";
import ApiError from "../../utils/ApiError.tsx";

export const myController = catchAsync(async (c: Context) => {
  // Your logic - errors are automatically caught
  if (!data) {
    throw new ApiError(404, 'Not found');
  }
  return c.json(new ApiSuccess(200, 'Success', data).toJSON());
});
```

### Step 4: Authentication Migration

**Old Way:**
```typescript
app.get("/protected", async (c) => {
  const token = c.req.header('Authorization');
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  // Verify token manually...
});
```

**New Way:**
```typescript
import { authenticate, authorize } from "../../middlewares/auth.tsx";

router.get(
  "/protected",
  authenticate,
  authorize("admin"),
  controller.protectedRoute
);
```

### Step 5: Response Format Migration

**Old Way (Inconsistent):**
```typescript
return c.json({ data: result });
return c.json({ success: true, result });
return c.json({ items: data, count: total });
```

**New Way (Consistent):**
```typescript
import ApiSuccess from "../../utils/ApiSuccess.tsx";

return c.json(new ApiSuccess(200, 'Success', data).toJSON());

// Always returns:
// {
//   success: true,
//   code: 200,
//   message: "Success",
//   data: { ... },
//   timestamp: "2026-02-06T..."
// }
```

## Implementation Checklist

### ✅ Core Infrastructure (Completed)
- [x] Config module
- [x] ApiError utility
- [x] ApiSuccess utility
- [x] catchAsync utility
- [x] Error middleware
- [x] Auth middleware
- [x] Validation middleware
- [x] Route aggregator
- [x] Updated main index.tsx

### ✅ Example Modules (Completed)
- [x] Auth module (complete)
- [x] Inventory module (complete example)

### 📋 Remaining Modules to Create

Following the same pattern as inventory, create:

#### 1. Orders Module (`/api/orders/`)
```
orders.controller.tsx
orders.service.tsx
orders.route.tsx
```
**Endpoints:**
- GET /api/orders - List orders
- GET /api/orders/:id - Get order
- POST /api/orders - Create order
- PUT /api/orders/:id - Update order
- DELETE /api/orders/:id - Delete order

#### 2. Invoices Module (`/api/invoices/`)
```
invoices.controller.tsx
invoices.service.tsx
invoices.route.tsx
```
**Endpoints:**
- GET /api/invoices - List invoices
- POST /api/invoices - Generate invoice
- PUT /api/invoices/:id/payment - Record payment
- POST /api/invoices/:id/qr - Generate QR code

#### 3. Categories Module (`/api/categories/`)
```
categories.controller.tsx
categories.service.tsx
categories.route.tsx
```
**Endpoints:**
- GET /api/categories - List categories
- POST /api/categories - Create category (admin)
- PUT /api/categories/:id - Update category (admin)
- DELETE /api/categories/:id - Delete category (admin)

#### 4. Brands Module (`/api/brands/`)
```
brands.controller.tsx
brands.service.tsx
brands.route.tsx
```

#### 5. Suppliers Module (`/api/suppliers/`)
```
suppliers.controller.tsx
suppliers.service.tsx
suppliers.route.tsx
```

#### 6. Purchase Orders Module (`/api/purchase-orders/`)
```
purchase-orders.controller.tsx
purchase-orders.service.tsx
purchase-orders.route.tsx
```

#### 7. Reports Module (`/api/reports/`)
```
reports.controller.tsx
reports.service.tsx
reports.route.tsx
```

#### 8. Users Module (`/api/users/`)
```
users.controller.tsx
users.service.tsx
users.route.tsx
```

#### 9. Drafts Module (`/api/drafts/`)
```
drafts.controller.tsx
drafts.service.tsx
drafts.route.tsx
```

## Creating a New Module: Step-by-Step

Let's create the Orders module as an example:

### 1. Create the Service

```typescript
// /supabase/functions/server/api/orders/orders.service.tsx
import ApiError from "../../utils/ApiError.tsx";
import * as kv from "../../kv_store.tsx";

export const createOrder = async (orderData: any) => {
  // Validate input
  if (!orderData.items || orderData.items.length === 0) {
    throw new ApiError(400, 'Order must have at least one item');
  }

  // Generate ID
  const id = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Create order object
  const order = {
    id,
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save to database
  await kv.set(`order:${id}`, order);

  return order;
};

export const getOrders = async (userId?: string, role?: string) => {
  const allOrders = await kv.getByPrefix('order:');
  
  // Filter based on role
  if (role === 'salesperson' && userId) {
    return allOrders.filter(o => o.createdBy === userId);
  }
  
  return allOrders;
};

export const getOrderById = async (id: string) => {
  const order = await kv.get(`order:${id}`);
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  
  return order;
};

export const updateOrder = async (id: string, updates: any) => {
  const order = await kv.get(`order:${id}`);
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  
  const updatedOrder = {
    ...order,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(`order:${id}`, updatedOrder);
  
  return updatedOrder;
};

export const deleteOrder = async (id: string) => {
  const order = await kv.get(`order:${id}`);
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  
  await kv.del(`order:${id}`);
  
  return { success: true };
};
```

### 2. Create the Controller

```typescript
// /supabase/functions/server/api/orders/orders.controller.tsx
import type { Context } from "npm:hono";
import * as ordersService from "./orders.service.tsx";
import ApiSuccess from "../../utils/ApiSuccess.tsx";
import catchAsync from "../../utils/catchAsync.tsx";

export const getOrders = catchAsync(async (c: Context) => {
  const userId = c.get('userId');
  const userRole = c.get('userRole');
  
  const orders = await ordersService.getOrders(userId, userRole);
  
  return c.json(
    new ApiSuccess(200, 'Orders retrieved successfully', orders).toJSON()
  );
});

export const getOrderById = catchAsync(async (c: Context) => {
  const { id } = c.req.param();
  
  const order = await ordersService.getOrderById(id);
  
  return c.json(
    new ApiSuccess(200, 'Order retrieved successfully', order).toJSON()
  );
});

export const createOrder = catchAsync(async (c: Context) => {
  const body = await c.req.json();
  const userId = c.get('userId');
  
  const orderData = {
    ...body,
    createdBy: userId,
  };
  
  const order = await ordersService.createOrder(orderData);
  
  return c.json(
    new ApiSuccess(201, 'Order created successfully', order).toJSON(),
    201
  );
});

export const updateOrder = catchAsync(async (c: Context) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  
  const order = await ordersService.updateOrder(id, body);
  
  return c.json(
    new ApiSuccess(200, 'Order updated successfully', order).toJSON()
  );
});

export const deleteOrder = catchAsync(async (c: Context) => {
  const { id } = c.req.param();
  
  await ordersService.deleteOrder(id);
  
  return c.json(
    new ApiSuccess(200, 'Order deleted successfully').toJSON()
  );
});
```

### 3. Create the Routes

```typescript
// /supabase/functions/server/api/orders/orders.route.tsx
import { Hono } from "npm:hono";
import * as ordersController from "./orders.controller.tsx";
import { authenticate, authorize } from "../../middlewares/auth.tsx";

const router = new Hono();

// All routes require authentication
router.use("/*", authenticate);

// Get orders (filtered by role)
router.get("/", ordersController.getOrders);

// Get single order
router.get("/:id", ordersController.getOrderById);

// Create new order
router.post("/", ordersController.createOrder);

// Update order
router.put("/:id", ordersController.updateOrder);

// Delete order (admin only)
router.delete(
  "/:id",
  authorize("admin"),
  ordersController.deleteOrder
);

export default router;
```

### 4. Register the Module

```typescript
// /supabase/functions/server/api/routes.tsx
import ordersRoutes from "./orders/orders.route.tsx";

router.route("/orders", ordersRoutes);
```

## Testing Your Migration

### 1. Health Check
```bash
curl http://localhost:8000/make-server-e13962a3/health
```

### 2. API Health Check
```bash
curl http://localhost:8000/make-server-e13962a3/api/health
```

### 3. Test Authentication
```bash
# Sign up
curl -X POST http://localhost:8000/make-server-e13962a3/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"admin"}'

# Sign in
curl -X POST http://localhost:8000/make-server-e13962a3/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 4. Test Inventory
```bash
# Get products (public)
curl http://localhost:8000/make-server-e13962a3/api/inventory

# Create product (requires admin token)
curl -X POST http://localhost:8000/make-server-e13962a3/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"name":"Test Product","sku":"SKU001","category":"Shirts"}'
```

## Frontend Integration Changes

### Old Frontend Code:
```typescript
const response = await fetch(`${API_URL}/inventory`);
const data = await response.json();
// Response format varies
```

### New Frontend Code:
```typescript
const response = await fetch(`${API_URL}/api/inventory`);
const data = await response.json();

// Consistent response format:
if (data.success) {
  const products = data.data;
} else {
  console.error(data.message);
}
```

### Authentication Header:
```typescript
const response = await fetch(`${API_URL}/api/inventory`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

## Common Patterns

### Pattern 1: List with Pagination
```typescript
export const getItems = catchAsync(async (c: Context) => {
  const pagination = c.get('pagination');
  const items = await service.getItems(pagination);
  return c.json(new ApiSuccess(200, 'Success', items).toJSON());
});
```

### Pattern 2: Create with Validation
```typescript
export const createItem = catchAsync(async (c: Context) => {
  const body = await c.req.json();
  const userId = c.get('userId');
  
  const item = await service.createItem({ ...body, createdBy: userId });
  return c.json(new ApiSuccess(201, 'Created', item).toJSON(), 201);
});
```

### Pattern 3: Update with Authorization
```typescript
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  controller.updateItem
);
```

### Pattern 4: Delete with Soft Delete
```typescript
export const deleteItem = async (id: string) => {
  const item = await kv.get(`item:${id}`);
  if (!item) throw new ApiError(404, 'Not found');
  
  item.deletedAt = new Date().toISOString();
  item.isDeleted = true;
  
  await kv.set(`item:${id}`, item);
  return { success: true };
};
```

## Troubleshooting

### Error: "Module not found"
- Check file paths and imports
- Ensure `.tsx` extensions are included
- Verify module exports are correct

### Error: "User not authenticated"
- Check Authorization header is sent
- Verify token is valid
- Check middleware order in routes

### Error: "Route not found"
- Verify route is registered in `/api/routes.tsx`
- Check route path matches frontend calls
- Ensure API prefix is correct

## Next Steps

1. **Complete remaining modules** using the inventory module as a template
2. **Update frontend** to use new API structure
3. **Add validation schemas** for complex inputs
4. **Implement rate limiting** if needed
5. **Add logging** for audit trails
6. **Write tests** for critical endpoints
7. **Document API** using OpenAPI/Swagger

## Resources

- **BACKEND_ARCHITECTURE.md** - Detailed architecture documentation
- **Inventory Module** - Complete reference implementation
- **Auth Module** - Authentication patterns
- **FIRS-Invoice-QR** - Original reference project

---

**Migration Status**: Foundation Complete ✅  
**Next Action**: Create remaining feature modules following the established pattern  
**Last Updated**: February 6, 2026
