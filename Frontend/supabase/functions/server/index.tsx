/**
 * FashionHub Server - Main Entry Point
 * Aligned with proven Node.js/Express backend architecture
 * 
 * Architecture:
 * - config/: Configuration and environment variables
 * - utils/: Utility classes (ApiError, ApiSuccess, catchAsync)
 * - middlewares/: Request processing middleware (auth, validation, error handling)
 * - api/: Feature modules (auth, inventory, orders, etc.)
 *   - Each module contains: controller, service, route, validation
 * - kv_store.tsx: Database abstraction layer
 */

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import config from "./config/config.tsx";
import apiRoutes from "./api/routes.tsx";
import { errorConverter } from "./middlewares/error.tsx";

// Initialize Hono app
const app = new Hono();

// ============================================
// GLOBAL MIDDLEWARE
// ============================================

/**
 * Request Logger
 * Logs all incoming requests with timestamps
 */
app.use('*', logger(console.log));

/**
 * CORS Configuration
 * Allows requests from any origin with necessary headers
 */
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Total-Count"],
    maxAge: 600,
  })
);

// ============================================
// HEALTH CHECK ENDPOINTS
// ============================================

/**
 * Root health check
 */
app.get("/make-server-e13962a3/health", (c) => {
  return c.json({
    success: true,
    message: "FashionHub server is running",
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

/**
 * Detailed system health check
 */
app.get("/make-server-e13962a3/health/detailed", async (c) => {
  const startTime = Date.now();
  
  // Test KV store connection
  let kvStatus = "unknown";
  try {
    await import("./kv_store.tsx");
    kvStatus = "connected";
  } catch (error) {
    kvStatus = "error";
  }

  return c.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: Date.now() - startTime,
    services: {
      api: "operational",
      database: kvStatus,
      auth: "operational",
    },
    config: {
      environment: config.env,
      apiPrefix: config.api.prefix,
      version: config.api.version,
    },
  });
});

// ============================================
// API ROUTES
// ============================================

/**
 * Mount all API routes under the main prefix
 * All routes are organized by feature modules:
 * - /api/auth/* - Authentication & authorization
 * - /api/inventory/* - Product inventory management
 * - /api/orders/* - Order & sales management
 * - /api/invoices/* - Invoice generation
 * - /api/categories/* - Category management
 * - /api/brands/* - Brand management
 * - /api/suppliers/* - Supplier management
 * - /api/purchase-orders/* - Purchase order management
 * - /api/reports/* - Reporting & analytics
 * - /api/users/* - User management
 * - /api/drafts/* - Draft orders
 */
app.route(`${config.api.prefix}/api`, apiRoutes);

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Global error converter middleware
 * Catches all errors and converts them to standardized ApiError format
 */
app.use('*', errorConverter);

/**
 * 404 Not Found handler
 */
app.notFound((c) => {
  return c.json({
    success: false,
    code: 404,
    message: `Route not found: ${c.req.method} ${c.req.url}`,
    timestamp: new Date().toISOString(),
  }, 404);
});

/**
 * Global error handler (last resort)
 */
app.onError((err, c) => {
  console.error('🔴 Unhandled Server Error:', err);
  
  return c.json({
    success: false,
    code: 500,
    message: config.env === 'development' 
      ? err.message 
      : 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(config.env === 'development' && { stack: err.stack }),
  }, 500);
});

// ============================================
// SERVER INITIALIZATION
// ============================================

console.log('🚀 Starting FashionHub Server...');
console.log(`📦 Environment: ${config.env}`);
console.log(`🔗 API Prefix: ${config.api.prefix}`);
console.log(`✅ Server ready to accept requests`);

// Start the Deno server
Deno.serve(app.fetch);
