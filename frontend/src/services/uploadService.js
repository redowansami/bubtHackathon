import api from './api';

const uploadService = {
  /**
   * Upload a file
   * @param {File} file - File to upload
   * @param {String} associatedType - Type: 'inventory', 'consumption', 'profile', 'receipt'
   * @param {String} associatedId - Optional ID of associated item
   */
  uploadFile: async (file, associatedType = 'receipt', associatedId = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('associatedType', associatedType);
      if (associatedId) {
        formData.append('associatedId', associatedId);
      }

      const response = await api.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data || null,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to upload file',
        data: null,
      };
    }
  },

  /**
   * Upload file for OCR processing
   * @param {File} file - Image file to process
   */
  uploadForOCR: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/ocr/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data || null,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to process image',
        data: null,
      };
    }
  },

  /**
   * Get all uploads for user
   */
  getUploads: async () => {
    try {
      const response = await api.get('/uploads');
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data || [],
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch uploads',
        data: [],
      };
    }
  },

  /**
   * Get uploads by type
   * @param {String} associatedType - Type filter
   */
  getUploadsByType: async (associatedType) => {
    try {
      const response = await api.get(`/uploads/type/${associatedType}`);
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data || [],
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch uploads',
        data: [],
      };
    }
  },

  /**
   * Get upload statistics
   */
  getUploadStats: async () => {
    try {
      const response = await api.get('/uploads/stats');
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data || null,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch stats',
        data: null,
      };
    }
  },

  /**
   * Associate upload with item
   * @param {String} uploadId - Upload ID
   * @param {String} associatedType - Type
   * @param {String} associatedId - Associated item ID
   */
  associateUpload: async (uploadId, associatedType, associatedId) => {
    try {
      const response = await api.put(`/uploads/${uploadId}/associate`, {
        associatedType,
        associatedId,
      });

      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data || null,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to associate upload',
        data: null,
      };
    }
  },

  /**
   * Delete upload
   * @param {String} uploadId - Upload ID
   */
  deleteUpload: async (uploadId) => {
    try {
      const response = await api.delete(`/uploads/${uploadId}`);
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete upload',
      };
    }
  },

  /**
   * Get file URL from server
   * @param {String} filePath - File path from database
   */
  getFileUrl: (filePath) => {
    if (!filePath) return null;
    // Assuming files are served from /uploads endpoint or public folder
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${filePath}`;
  },
};

export default uploadService;
