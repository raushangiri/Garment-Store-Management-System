# FashionHub Backend Architecture

## Overview

The FashionHub backend has been restructured to align with proven Node.js/Express MVC architecture patterns, specifically modeled after the FIRS-Invoice-QR project structure. This provides a clean, maintainable, and scalable codebase.

## Directory Structure

```
/supabase/functions/server/
├── index.tsx                 # Main server entry point
├── kv_store.tsx             # Database abstraction layer (protected)
│
├── config/
│   └── config.tsx           # Centralized configuration
│
├── utils/
│   ├── ApiError.tsx         # Custom error class
│   ├── ApiSuccess.tsx       # Success response formatter
│   └── catchAsync.tsx       # Async error handler wrapper
│
├── middlewares/
│   ├── error.tsx            # Global error handling
│   ├── auth.tsx             # Authentication & authorization
│   └── validate.tsx         # Request validation
│
└── api/
    ├── routes.tsx           # Central route aggregator
    │
    ├── auth/
    │   ├── auth.controller.tsx
    │   ├── auth.service.tsx
    │   └── auth.route.tsx
    │
    ├── inventory/
    │   ├── inventory.controller.tsx
    │   ├── inventory.service.tsx
    │   ├── inventory.route.tsx
    │   └── inventory.validation.tsx
    │
    ├── orders/
    │   ├── orders.controller.tsx
    │   ├── orders.service.tsx
    │   └── orders.route.tsx
    │
    ├── invoices/
    │   ├── invoices.controller.tsx
    │   ├── invoices.service.tsx
    │   └── invoices.route.tsx
    │
    ├── categories/
    │   ├── categories.controller.tsx
    │   ├── categories.service.tsx
    │   └── categories.route.tsx
    │
    ├── brands/
    │   ├── brands.controller.tsx
    │   ├── brands.service.tsx
    │   └── brands.route.tsx
    │
    ├── suppliers/
    │   ├── suppliers.controller.tsx
    │   ├── suppliers.service.tsx
    │   └── suppliers.route.tsx
    │
    ├── purchase-orders/
    │   ├── purchase-orders.controller.tsx
    │   ├── purchase-orders.service.tsx
    │   └── purchase-orders.route.tsx
    │
    ├── reports/
    │   ├── reports.controller.tsx
    │   ├── reports.service.tsx
    │   └── reports.route.tsx
    │
    ├── users/
    │   ├── users.controller.tsx
    │   ├── users.service.tsx
    │   └── users.route.tsx
    │
    └── drafts/
        ├── drafts.controller.tsx
        ├── drafts.service.tsx
        └── drafts.route.tsx
```

## Architecture Principles

### 1. **Separation of Concerns**

Each layer has a specific responsibility:

- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Routes**: Define URL endpoints and middleware
- **Middlewares**: Process requests before reaching controllers
- **Utils**: Provide reusable utility functions

### 2. **Module Structure**

Each feature module follows this pattern:

```
module-name/
├── module-name.controller.tsx    # HTTP handlers
├── module-name.service.tsx       # Business logic
├── module-name.route.tsx         # Route definitions
└── module-name.validation.tsx    # Input validation (optional)
```

### 3. **Error Handling**

Centralized error handling using:
- `ApiError` class for structured errors
- `catchAsync` wrapper for async error catching
- Error middleware for consistent error responses

### 4. **Response Format**

Standardized responses using `ApiSuccess`:

```typescript
{
  success: true,
  code: 200,
  message: "Operation successful",
  data: { ... },
  timestamp: "2026-02-06T..."
}
```

Error responses:

```typescript
{
  success: false,
  code: 400,
  message: "Error description",
  timestamp: "2026-02-06T..."
}
```

## API Endpoints Structure

All endpoints are prefixed with `/make-server-e13962a3/api`

### Authentication (`/auth`)

```
POST   /api/auth/signup           - Create new user
POST   /api/auth/signin           - User login
POST   /api/auth/signout          - User logout (protected)
GET    /api/auth/session          - Get current session (protected)
POST   /api/auth/refresh          - Refresh access token
POST   /api/auth/change-password  - Change password (protected)
```

### Inventory (`/inventory`)

```
GET    /api/inventory              - List all products (paginated)
GET    /api/inventory/:id          - Get product by ID
POST   /api/inventory              - Create new product (admin)
PUT    /api/inventory/:id          - Update product (admin)
DELETE /api/inventory/:id          - Delete product (admin)
GET    /api/inventory/search       - Search products
GET    /api/inventory/low-stock    - Get low stock items (admin)
POST   /api/inventory/:id/barcode  - Update via barcode scan (admin)
```

### Orders (`/orders`)

```
GET    /api/orders                 - List orders (filtered by role)
GET    /api/orders/:id             - Get order details
POST   /api/orders                 - Create new order
PUT    /api/orders/:id             - Update order
DELETE /api/orders/:id             - Delete order
GET    /api/orders/stats           - Order statistics
```

### Invoices (`/invoices`)

```
GET    /api/invoices               - List invoices
GET    /api/invoices/:id           - Get invoice details
POST   /api/invoices               - Generate invoice from order
PUT    /api/invoices/:id/payment   - Record payment
GET    /api/invoices/:id/pdf       - Download invoice PDF
POST   /api/invoices/:id/qr        - Generate UPI QR code
```

### Categories (`/categories`)

```
GET    /api/categories             - List all categories
GET    /api/categories/:id         - Get category details
POST   /api/categories             - Create category (admin)
PUT    /api/categories/:id         - Update category (admin)
DELETE /api/categories/:id         - Delete category (admin)
```

### Brands (`/brands`)

```
GET    /api/brands                 - List all brands
GET    /api/brands/:id             - Get brand details
POST   /api/brands                 - Create brand (admin)
PUT    /api/brands/:id             - Update brand (admin)
DELETE /api/brands/:id             - Delete brand (admin)
```

### Suppliers (`/suppliers`)

```
GET    /api/suppliers              - List all suppliers (admin)
GET    /api/suppliers/:id          - Get supplier details (admin)
POST   /api/suppliers              - Create supplier (admin)
PUT    /api/suppliers/:id          - Update supplier (admin)
DELETE /api/suppliers/:id          - Delete supplier (admin)
```

### Purchase Orders (`/purchase-orders`)

```
GET    /api/purchase-orders        - List purchase orders (admin)
GET    /api/purchase-orders/:id    - Get PO details (admin)
POST   /api/purchase-orders        - Create PO (admin)
PUT    /api/purchase-orders/:id    - Update PO (admin)
DELETE /api/purchase-orders/:id    - Delete PO (admin)
POST   /api/purchase-orders/:id/receive - Receive inventory (admin)
```

### Reports (`/reports`)

```
GET    /api/reports/sales          - Sales reports (admin)
GET    /api/reports/inventory      - Inventory reports (admin)
GET    /api/reports/revenue        - Revenue reports (admin)
GET    /api/reports/user-activity  - User activity reports (admin)
POST   /api/reports/custom         - Generate custom report (admin)
```

### Users (`/users`)

```
GET    /api/users                  - List all users (admin)
GET    /api/users/:id              - Get user details (admin)
POST   /api/users                  - Create user (admin)
PUT    /api/users/:id              - Update user (admin)
DELETE /api/users/:id              - Delete user (admin)
PUT    /api/users/:id/role         - Change user role (admin)
```

### Drafts (`/drafts`)

```
GET    /api/drafts                 - List draft orders
GET    /api/drafts/:id             - Get draft details
POST   /api/drafts                 - Save cart as draft
PUT    /api/drafts/:id             - Update draft
DELETE /api/drafts/:id             - Delete draft
POST   /api/drafts/:id/convert     - Convert draft to order
```

## Middleware Usage

### Authentication

```typescript
import { authenticate, authorize } from "./middlewares/auth.tsx";

// Require authentication
router.get("/profile", authenticate, controller.getProfile);

// Require specific role
router.post("/admin", authenticate, authorize("admin"), controller.adminAction);

// Multiple roles
router.get("/data", authenticate, authorize("admin", "manager"), controller.getData);
```

### Validation

```typescript
import { validate, validatePagination } from "./middlewares/validate.tsx";

// Validate request body
router.post("/create", validate(schema, 'body'), controller.create);

// Validate pagination
router.get("/list", validatePagination, controller.list);
```

### Error Handling

All errors are automatically caught and formatted:

```typescript
import catchAsync from "./utils/catchAsync.tsx";
import ApiError from "./utils/ApiError.tsx";

export const someController = catchAsync(async (c: Context) => {
  // Business logic
  if (!data) {
    throw new ApiError(404, "Resource not found");
  }
  
  return c.json(new ApiSuccess(200, "Success", data).toJSON());
});
```

## Configuration

All configuration is centralized in `/config/config.tsx`:

```typescript
import config from "./config/config.tsx";

// Access configuration
const isDevelopment = config.env === 'development';
const supabaseUrl = config.supabase.url;
```

## Database Access

Use the KV store abstraction:

```typescript
import * as kv from "./kv_store.tsx";

// Set data
await kv.set('user:123', userData);

// Get data
const user = await kv.get('user:123');

// Delete data
await kv.del('user:123');

// Multiple operations
await kv.mset([
  { key: 'user:1', value: user1 },
  { key: 'user:2', value: user2 }
]);

// Get by prefix
const allUsers = await kv.getByPrefix('user:');
```

## Response Patterns

### Success Response

```typescript
import ApiSuccess from "./utils/ApiSuccess.tsx";

return c.json(
  new ApiSuccess(200, "Operation successful", data).toJSON()
);
```

### Error Response

```typescript
import ApiError from "./utils/ApiError.tsx";

throw new ApiError(400, "Invalid input data");
```

### Paginated Response

```typescript
return c.json({
  success: true,
  data: items,
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10
  }
});
```

## Testing

Health check endpoints for testing:

```bash
# Basic health check
GET /make-server-e13962a3/health

# Detailed health check
GET /make-server-e13962a3/health/detailed

# API health check
GET /make-server-e13962a3/api/health
```

## Migration from Old Structure

The previous flat structure has been refactored into:

1. **Controllers**: Extracted request handling logic
2. **Services**: Moved business logic to service layer
3. **Routes**: Organized by feature modules
4. **Middleware**: Centralized authentication, validation, and error handling
5. **Utils**: Reusable utility classes and functions

## Best Practices

1. **Always use `catchAsync`** for async controllers
2. **Throw `ApiError`** for expected errors
3. **Return `ApiSuccess`** for successful responses
4. **Use middleware** for cross-cutting concerns
5. **Keep controllers thin** - move logic to services
6. **Document your endpoints** in this file
7. **Use TypeScript types** for better IDE support
8. **Follow the module pattern** for consistency

## Next Steps

The foundation is complete. To fully implement the backend:

1. Create remaining feature modules (inventory, orders, etc.)
2. Implement each module following the established pattern
3. Add validation schemas where needed
4. Write tests for critical paths
5. Add API documentation (Swagger/OpenAPI)
6. Implement rate limiting if needed
7. Add request logging for audit trails

## Support

For questions or issues:
- Review the FIRS-Invoice-QR reference implementation
- Check middleware documentation
- Examine existing auth module as reference
- Follow the established patterns

---

**Last Updated**: February 6, 2026
**Architecture Version**: 1.0.0
**Based On**: FIRS-Invoice-QR (Node.js/Express) structure adapted for Hono/Deno
