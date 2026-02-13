const express = require('express');
const router = express.Router();
const {
  getPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  receivePurchaseOrder
} = require('../controllers/purchaseOrderController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect, authorize('admin'));

router.route('/')
  .get(getPurchaseOrders)
  .post(createPurchaseOrder);

router.route('/:id')
  .get(getPurchaseOrder)
  .put(updatePurchaseOrder)
  .delete(deletePurchaseOrder);

router.patch('/:id/receive', receivePurchaseOrder);

module.exports = router;
