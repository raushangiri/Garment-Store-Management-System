const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
exports.getSales = async (req, res, next) => {
  try {
    // Build query based on user role
    let query = {};
    
    // If user is salesPerson, only show their sales
    if (req.user.role === 'salesPerson') {
      query.salesPersonId = req.user.id;
    }

    const sales = await Sale.find(query)
      .populate('salesPersonId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
exports.getSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('salesPersonId', 'name email');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
exports.createSale = async (req, res, next) => {
  try {
    const { items, ...saleData } = req.body;

    // Validate stock availability
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productName} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`
        });
      }
    }

    // Create sale
    const sale = await Sale.create({
      ...saleData,
      items,
      salesPersonId: req.user.id,
      salesPersonName: req.user.name
    });

    // Update stock for each item
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      data: sale
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales statistics
// @route   GET /api/sales/stats
// @access  Private (Admin only)
exports.getSalesStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Sale.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]);

    const paymentMethodStats = await Sale.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$total' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: stats[0] || { totalSales: 0, totalRevenue: 0, averageOrderValue: 0 },
        byPaymentMethod: paymentMethodStats
      }
    });
  } catch (error) {
    next(error);
  }
};