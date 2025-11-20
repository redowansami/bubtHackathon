const UploadService = require('../services/UploadService');
const { validationResult } = require('express-validator');
const { MESSAGES, HTTP_BAD_REQUEST } = require('../config/constants');

class UploadController {
  /**
   * Upload file
   */
  async uploadFile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(HTTP_BAD_REQUEST).json({
          success: false,
          message: MESSAGES.VALIDATION_ERROR,
          errors: errors.array(),
        });
      }

      const userId = req.user.id;
      const file = req.file;
      const { associatedType, associatedId } = req.body;

      const result = await UploadService.uploadFile(
        userId,
        file,
        associatedType || 'receipt',
        associatedId || null
      );

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Upload Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get all uploads
   */
  async getUploads(req, res) {
    try {
      const userId = req.user.id;

      const result = await UploadService.getUploads(userId);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get Uploads Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get uploads by type
   */
  async getUploadsByType(req, res) {
    try {
      const userId = req.user.id;
      const { associatedType } = req.params;

      const result = await UploadService.getUploadsByType(userId, associatedType);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get Uploads By Type Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Delete upload
   */
  async deleteUpload(req, res) {
    try {
      const userId = req.user.id;
      const { uploadId } = req.params;

      const result = await UploadService.deleteUpload(userId, uploadId);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.error('Delete Upload Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Associate upload with item
   */
  async associateUpload(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(HTTP_BAD_REQUEST).json({
          success: false,
          message: MESSAGES.VALIDATION_ERROR,
          errors: errors.array(),
        });
      }

      const userId = req.user.id;
      const { uploadId } = req.params;
      const { associatedType, associatedId } = req.body;

      const result = await UploadService.associateUpload(
        userId,
        uploadId,
        associatedType,
        associatedId
      );

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Associate Upload Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get upload statistics
   */
  async getUploadStats(req, res) {
    try {
      const userId = req.user.id;

      const result = await UploadService.getUploadStats(userId);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get Upload Stats Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }
}

module.exports = new UploadController();
