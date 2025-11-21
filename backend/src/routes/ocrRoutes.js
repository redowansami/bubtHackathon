const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept image files only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * POST /api/v1/ocr/extract
 * Upload image and extract text via FastAPI OCR
 */
router.post('/extract', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded',
      });
    }

    const filePath = req.file.path;
    const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

    try {
      // Read file and convert to buffer
      const fileStream = fs.createReadStream(filePath);
      const fileBuffer = await new Promise((resolve, reject) => {
        const chunks = [];
        fileStream.on('data', chunk => chunks.push(chunk));
        fileStream.on('end', () => resolve(Buffer.concat(chunks)));
        fileStream.on('error', reject);
      });

      // Send to FastAPI /extract-text endpoint
      const formData = new FormData();
      formData.append('file', fileBuffer, req.file.originalname);

      const response = await axios.post(`${FASTAPI_URL}/extract-text`, formData, {
        headers: formData.getHeaders(),
        timeout: 30000,
      });

      // Cleanup uploaded file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Log response for debugging
      console.log('FastAPI Response:', JSON.stringify(response.data, null, 2));

      // Handle response - could be nested in data property or direct
      const responseData = response.data.data || response.data;
      const extractedText = responseData.extractedText || '';
      const parsedData = responseData.parsedData || {
        itemName: null,
        quantity: null,
        expirationDate: null
      };

      return res.status(200).json({
        success: true,
        message: 'Text extracted and parsed successfully',
        data: {
          extractedText: extractedText,
          parsedData: parsedData,
        },
      });
    } catch (error) {
      // Cleanup file on error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      console.error('FastAPI Error:', error.message);
      return res.status(500).json({
        success: false,
        message: `Failed to extract text: ${error.message}`,
      });
    }
  } catch (error) {
    // Cleanup file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('OCR Error:', error);
    return res.status(500).json({
      success: false,
      message: 'OCR processing failed',
    });
  }
});

module.exports = router;
