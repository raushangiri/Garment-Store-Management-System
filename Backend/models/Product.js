const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  barcode: {
    type: String,
    required: [true, 'Please provide barcode'],
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    trim: true
  },
  minStock: {
    type: Number,
    default: 10,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex', 'Kids'],
    default: 'Unisex'
  },
  image: {
    type: String
  },
  discountEnabled: {
    type: Boolean,
    default: false
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  maxDiscountForSales: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  maxDiscountForAdmin: {
    type: Number,
    default: 20,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', barcode: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
