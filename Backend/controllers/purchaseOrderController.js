const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Private (Admin only)
exports.getPurchaseOrders = async (req, res, next) => {
  try {
    const orders = await PurchaseOrder.find()
      .populate('supplierId', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single purchase order
// @route   GET /api/purchase-orders/:id
// @access  Private (Admin only)
exports.getPurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id)
      .populate('supplierId', 'name phone email address');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create purchase order
// @route   POST /api/purchase-orders
// @access  Private (Admin only)
exports.createPurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.create(req.body);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update purchase order
// @route   PUT /api/purchase-orders/:id
// @access  Private (Admin only)
exports.updatePurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete purchase order
// @route   DELETE /api/purchase-orders/:id
// @access  Private (Admin only)
exports.deletePurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Purchase order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark purchase order as received
// @route   PATCH /api/purchase-orders/:id/receive
// @access  Private (Admin only)
exports.receivePurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }

    if (order.status === 'received') {
      return res.status(400).json({
        success: false,
        message: 'Purchase order already received'
      });
    }

    // Update product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    order.status = 'received';
    order.receivedDate = new Date();
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
