const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getLowStockProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/low-stock', getLowStockProducts);

router.route('/')
  .get(getProducts)
  .post(authorize('admin'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(authorize('admin'), updateProduct)
  .delete(authorize('admin'), deleteProduct);

router.patch('/:id/stock', updateStock);

module.exports = router;
