const express = require('express');
const router = express.Router();
const {
  getSales,
  getSale,
  createSale,
  getSalesStats
} = require('../controllers/saleController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/stats', authorize('admin'), getSalesStats);

router.route('/')
  .get(getSales)
  .post(createSale);

router.route('/:id')
  .get(getSale);

module.exports = router;
