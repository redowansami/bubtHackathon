const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
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
    expirationDays: {
      type: Number,
      required: [true, 'Expiration days is required'],
      min: [1, 'Expiration days must be at least 1'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    costPerUnit: {
      type: Number,
      required: [true, 'Cost per unit is required'],
      min: [0, 'Cost cannot be negative'],
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
    collection: 'inventory',
  }
);

// Index for faster queries
inventorySchema.index({ userId: 1, expiryDate: 1 });
inventorySchema.index({ userId: 1, category: 1 });

inventorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
