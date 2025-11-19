const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
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
        'Sustainability',
        'Waste Reduction',
        'Budget Planning',
        'Meal Planning',
        'Storage Tips',
        'General',
      ],
    },
    type: {
      type: String,
      enum: ['article', 'tip', 'guide', 'recipe', 'video'],
      default: 'article',
    },
    content: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
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
    collection: 'resources',
  }
);

// Index for faster queries
resourceSchema.index({ category: 1 });
resourceSchema.index({ type: 1 });
resourceSchema.index({ isActive: 1 });

resourceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resource', resourceSchema);
