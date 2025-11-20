const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      enum: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    },
    associatedType: {
      type: String,
      enum: ['inventory', 'consumption', 'profile', 'receipt'],
      default: 'receipt',
    },
    associatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    tags: [String],
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'uploads',
  }
);

// Index for faster queries
uploadSchema.index({ userId: 1, uploadedAt: -1 });
uploadSchema.index({ userId: 1, associatedType: 1 });

module.exports = mongoose.model('Upload', uploadSchema);
