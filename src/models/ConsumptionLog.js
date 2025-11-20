const mongoose = require('mongoose');

const consumptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      minlength: [2, 'Item name must be at least 2 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Dairy',
        'Vegetables',
        'Fruits',
        'Grains',
        'Protein',
        'Bakery',
        'Beverages',
        'Condiments',
        'Frozen',
        'Snacks',
        'Other',
      ],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    notes: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'consumption_logs',
  }
);

// Index for faster queries
consumptionSchema.index({ userId: 1, date: -1 });
consumptionSchema.index({ userId: 1, category: 1 });

consumptionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ConsumptionLog', consumptionSchema);
