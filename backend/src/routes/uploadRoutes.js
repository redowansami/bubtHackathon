const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, param } = require('express-validator');
const UploadController = require('../controllers/UploadController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// All routes require authentication
router.use(authMiddleware);

/**
 * POST /api/v1/uploads
 * Upload a file
 */
router.post(
  '/',
  upload.single('file'),
  [
    body('associatedType')
      .optional()
      .isIn(['inventory', 'consumption', 'profile', 'receipt'])
      .withMessage('Invalid associated type'),
    body('associatedId')
      .optional()
      .isMongoId()
      .withMessage('Invalid associated ID'),
  ],
  UploadController.uploadFile
);

/**
 * GET /api/v1/uploads
 * Get all uploads for user
 */
router.get('/', UploadController.getUploads);

/**
 * GET /api/v1/uploads/type/:associatedType
 * Get uploads by type
 */
router.get('/type/:associatedType', UploadController.getUploadsByType);

/**
 * GET /api/v1/uploads/stats
 * Get upload statistics
 */
router.get('/stats', UploadController.getUploadStats);

/**
 * PUT /api/v1/uploads/:uploadId/associate
 * Associate upload with item
 */
router.put(
  '/:uploadId/associate',
  [
    param('uploadId')
      .isMongoId()
      .withMessage('Invalid upload ID'),
    body('associatedType')
      .isIn(['inventory', 'consumption', 'profile', 'receipt'])
      .withMessage('Invalid associated type'),
    body('associatedId')
      .isMongoId()
      .withMessage('Invalid associated ID'),
  ],
  UploadController.associateUpload
);

/**
 * DELETE /api/v1/uploads/:uploadId
 * Delete upload
 */
router.delete('/:uploadId', UploadController.deleteUpload);

module.exports = router;
