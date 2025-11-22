import React, { useState, useEffect } from 'react';
import uploadService from '../../services/uploadService';
import './UploadedFiles.css';

const UploadedFiles = ({ associatedType = null, showStats = false, onFileSelect = null }) => {
  const [uploads, setUploads] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      await fetchUploads();
      if (showStats) {
        await fetchStats();
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [associatedType, showStats]);

  const fetchUploads = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let result;
      if (associatedType) {
        result = await uploadService.getUploadsByType(associatedType);
      } else {
        result = await uploadService.getUploads();
      }

      if (result.success) {
        setUploads(result.data || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch uploads');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await uploadService.getUploadStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleDelete = async (uploadId) => {
    if (!window.confirm('Are you sure you want to delete this upload?')) {
      return;
    }

    try {
      const result = await uploadService.deleteUpload(uploadId);
      if (result.success) {
        setUploads(uploads.filter(u => u._id !== uploadId));
        setError(null);
        alert('✅ Upload deleted successfully');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete upload');
    }
  };

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="uploaded-files-container">
      <div className="header">
        <h3>📁 Uploaded Files</h3>
        <button className="refresh-btn" onClick={fetchUploads} disabled={isLoading}>
          {isLoading ? '⏳ Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {showStats && stats && (
        <div className="stats-section">
          <h4>📊 Upload Statistics</h4>
          <div className="stats-grid">
            {Object.entries(stats.stats || {}).map(([type, count]) => (
              <div key={type} className="stat-item">
                <div className="stat-label">{type}</div>
                <div className="stat-value">{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="error-alert">
          <span>❌</span> {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {isLoading ? (
        <div className="loading-state">
          <p>⏳ Loading uploads...</p>
        </div>
      ) : uploads.length === 0 ? (
        <div className="empty-state">
          <p>📭 No uploads yet</p>
          <p className="sub-text">Upload files to get started</p>
        </div>
      ) : (
        <div className="files-list">
          {uploads.map((upload) => (
            <div
              key={upload._id}
              className={`file-item ${selectedFile?._id === upload._id ? 'selected' : ''}`}
              onClick={() => handleSelectFile(upload)}
            >
              <div className="file-info">
                <div className="file-header">
                  <span className="file-name-icon">📄</span>
                  <div className="file-details">
                    <h5 className="file-name">{upload.fileName}</h5>
                    <div className="file-meta">
                      <span className="file-size">{formatFileSize(upload.fileSize)}</span>
                      <span className="file-type">{upload.mimeType}</span>
                      {upload.associatedType && (
                        <span className="file-type-badge">{upload.associatedType}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="file-date">
                  <span title={formatDate(upload.uploadedAt)}>
                    {formatDate(upload.uploadedAt)}
                  </span>
                </div>
              </div>

              <div className="file-actions">
                <a
                  href={uploadService.getFileUrl(upload.filePath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn preview"
                  title="Preview"
                >
                  👁️
                </a>
                <button
                  className="action-btn download"
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement('a');
                    link.href = uploadService.getFileUrl(upload.filePath);
                    link.download = upload.fileName;
                    link.click();
                  }}
                  title="Download"
                >
                  ⬇️
                </button>
                <button
                  className="action-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(upload._id);
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadedFiles;
