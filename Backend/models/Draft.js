const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide draft name'],
    trim: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    size: String,
    color: String,
    discount: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  customerName: String,
  customerPhone: String,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Draft', draftSchema);
