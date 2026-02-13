const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect, authorize('admin'));

router.route('/')
  .get(getSuppliers)
  .post(createSupplier);

router.route('/:id')
  .get(getSupplier)
  .put(updateSupplier)
  .delete(deleteSupplier);

module.exports = router;
