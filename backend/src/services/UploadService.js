const UploadRepository = require('../repositories/UploadRepository');
const fs = require('fs');
const path = require('path');
const { MESSAGES } = require('../config/constants');

class UploadService {
  /**
   * Upload file
   */
  async uploadFile(userId, file, associatedType = 'receipt', associatedId = null) {
    try {
      if (!file) {
        return {
          success: false,
          message: 'No file provided',
          statusCode: 400,
        };
      }

      // Validate file type
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedMimes.includes(file.mimetype)) {
        return {
          success: false,
          message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
          statusCode: 400,
        };
      }

      // Validate file size (max 5MB)
      const maxFileSize = 5 * 1024 * 1024;
      if (file.size > maxFileSize) {
        return {
          success: false,
          message: 'File size exceeds 5MB limit',
          statusCode: 400,
        };
      }

      // Save file upload record to database
      const uploadRecord = await UploadRepository.create({
        userId,
        filePath: file.path,
        fileName: file.filename,
        fileSize: file.size,
        mimeType: file.mimetype,
        associatedType,
        associatedId: associatedId || null,
      });

      return {
        success: true,
        message: 'File uploaded successfully',
        statusCode: 201,
        data: {
          id: uploadRecord._id,
          fileName: uploadRecord.fileName,
          fileSize: uploadRecord.fileSize,
          uploadedAt: uploadRecord.uploadedAt,
          filePath: uploadRecord.filePath,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || MESSAGES.ERROR,
        statusCode: 500,
      };
    }
  }

  /**
   * Get all uploads for user
   */
  async getUploads(userId) {
    try {
      const uploads = await UploadRepository.findByUserId(userId);

      return {
        success: true,
        message: 'Uploads fetched successfully',
        statusCode: 200,
        data: uploads,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || MESSAGES.ERROR,
        statusCode: 500,
      };
    }
  }

  /**
   * Get uploads by type
   */
  async getUploadsByType(userId, associatedType) {
    try {
      const uploads = await UploadRepository.findByAssociatedType(userId, associatedType);

      return {
        success: true,
        message: 'Uploads fetched successfully',
        statusCode: 200,
        data: uploads,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || MESSAGES.ERROR,
        statusCode: 500,
      };
    }
  }

  /**
   * Delete upload
   */
  async deleteUpload(userId, uploadId) {
    try {
      const upload = await UploadRepository.findById(uploadId);

      if (!upload || upload.userId.toString() !== userId) {
        return {
          success: false,
          message: 'Upload not found',
          statusCode: 404,
        };
      }

      // Delete physical file
      if (fs.existsSync(upload.filePath)) {
        fs.unlinkSync(upload.filePath);
      }

      // Delete database record
      await UploadRepository.deleteById(uploadId);

      return {
        success: true,
        message: 'Upload deleted successfully',
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || MESSAGES.ERROR,
        statusCode: 500,
      };
    }
  }

  /**
   * Associate upload with item
   */
  async associateUpload(userId, uploadId, associatedType, associatedId) {
    try {
      const upload = await UploadRepository.findById(uploadId);

      if (!upload || upload.userId.toString() !== userId) {
        return {
          success: false,
          message: 'Upload not found',
          statusCode: 404,
        };
      }

      const updatedUpload = await UploadRepository.updateById(uploadId, {
        associatedType,
        associatedId,
      });

      return {
        success: true,
        message: 'Upload associated successfully',
        statusCode: 200,
        data: updatedUpload,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || MESSAGES.ERROR,
        statusCode: 500,
      };
    }
  }

  /**
   * Get upload statistics
   */
  async getUploadStats(userId) {
    try {
      const stats = await UploadRepository.getCountByType(userId);
      const recentUploads = await UploadRepository.getRecent(userId, 5);

      return {
        success: true,
        message: 'Upload stats fetched successfully',
        statusCode: 200,
        data: {
          stats,
          recentUploads,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || MESSAGES.ERROR,
        statusCode: 500,
      };
    }
  }
}

module.exports = new UploadService();
