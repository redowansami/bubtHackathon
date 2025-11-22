import React, { useState, useRef } from 'react';
import uploadService from '../../services/uploadService';
import './FileUpload.css';

const FileUpload = ({
  onUploadSuccess,
  onUploadError,
  associatedType = 'receipt',
  associatedId = null,
  multiple = false,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  forOCR = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles = [];
    for (let file of files) {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Allowed types: ${allowedTypes.join(', ')}`);
        continue;
      }

      // Check file size
      if (file.size > maxFileSize) {
        setError(
          `File too large: ${file.name}. Max size: ${(maxFileSize / 1024 / 1024).toFixed(0)}MB`
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setError(null);
      setSuccess(null);
      
      // Auto-upload if single file or if immediate upload is needed
      if (!multiple && validFiles.length === 1) {
        handleUpload(validFiles);
      }
    }
  };

  const handleUpload = async (filesToUpload = selectedFiles) => {
    if (filesToUpload.length === 0) {
      setError('No files selected');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const uploadedFiles = [];
      
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        
        // Calculate and set progress
        const progress = Math.round(((i + 1) / filesToUpload.length) * 100);
        setUploadProgress(progress);

        let result;

        if (forOCR) {
          // Use OCR endpoint for image processing
          result = await uploadService.uploadForOCR(file);
        } else {
          // Use standard upload endpoint
          result = await uploadService.uploadFile(
            file,
            associatedType,
            associatedId
          );
        }

        if (result.success) {
          uploadedFiles.push({
            file: file.name,
            data: result.data,
            message: result.message,
          });
        } else {
          throw new Error(`${file.name}: ${result.message}`);
        }
      }

      setSuccess(`✅ Successfully uploaded ${uploadedFiles.length} file(s)`);
      setSelectedFiles([]);
      setUploadProgress(0);

      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(uploadedFiles);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to upload files';
      setError(errorMsg);
      
      if (onUploadError) {
        onUploadError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files || []);
    setSelectedFiles(files);
    
    // Trigger file validation
    const event = { target: { files } };
    handleFileSelect(event);
  };

  return (
    <div className="file-upload-container">
      <div
        className="file-upload-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleFileSelect}
          accept={allowedTypes.join(',')}
          className="file-input"
          id="file-input"
        />

        <label htmlFor="file-input" className="file-upload-label">
          <div className="upload-icon">📁</div>
          <h3>Drag and drop your files here</h3>
          <p>or click to select</p>
          <p className="file-requirements">
            Max file size: {(maxFileSize / 1024 / 1024).toFixed(0)}MB
          </p>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="selected-files">
          <h4>Selected Files ({selectedFiles.length})</h4>
          <ul>
            {selectedFiles.map((file, idx) => (
              <li key={idx}>
                <span className="file-icon">📄</span>
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024).toFixed(0)}KB)</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p className="progress-text">{uploadProgress}% uploaded</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span>❌</span> {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          <span>✅</span> {success}
        </div>
      )}

      <div className="button-group">
        {selectedFiles.length > 0 && (
          <>
            <button
              className="btn btn-upload"
              onClick={() => handleUpload()}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Uploading...' : `🚀 Upload ${selectedFiles.length} File(s)`}
            </button>
            <button
              className="btn btn-cancel"
              onClick={() => {
                setSelectedFiles([]);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              disabled={isLoading}
            >
              ✕ Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
