const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
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
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI']
  },
  cardLast4: String,
  upiTransactionId: String,
  customerName: String,
  customerPhone: String,
  salesPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  salesPersonName: String
}, {
  timestamps: true
});

// Auto-generate invoice number
saleSchema.pre('save', async function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const count = await this.constructor.countDocuments();
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    this.invoiceNumber = `INV-${year}${month}-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Sale', saleSchema);
