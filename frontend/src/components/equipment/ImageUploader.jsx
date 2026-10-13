import React, { useState } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

export const ImageUploader = ({
  files,
  setFiles,
  existingImages = [],
  setExistingImages,
  maxFiles = 5
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, maxFiles));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles].slice(0, maxFiles));
    }
  };

  const removeSelectedFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    if (setExistingImages) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const addImageUrl = () => {
    if (urlInput.trim() && setExistingImages) {
      setExistingImages((prev) => [...prev, urlInput.trim()]);
      setUrlInput('');
    }
  };

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border)'}`,
          backgroundColor: dragActive ? 'var(--primary-subtle)' : 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '1rem'
        }}
        onClick={() => document.getElementById('machinery-file-input').click()}
      >
        <input
          id="machinery-file-input"
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <UploadCloud size={24} />
        </div>
        <p style={{ fontWeight: 600, fontSize: '0.925rem', marginBottom: '0.25rem' }}>
          Click to upload or drag & drop machinery photos
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Supports JPG, PNG, WEBP (Max 5 images, up to 10MB each)
        </p>
      </div>

      {/* Or Paste Direct Image URL */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <input
          type="url"
          className="form-input"
          placeholder="Or paste an image web link (URL)"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          style={{ fontSize: '0.85rem' }}
        />
        <button
          type="button"
          onClick={addImageUrl}
          className="btn btn-secondary btn-sm"
          style={{ flexShrink: 0 }}
        >
          Add URL
        </button>
      </div>

      {/* Image Previews */}
      {(existingImages.length > 0 || files.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
          {/* Existing images */}
          {existingImages.map((img, index) => (
            <div
              key={`existing-${index}`}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                aspectRatio: '1',
                border: '1px solid var(--border)'
              }}
            >
              <img
                src={img}
                alt={`Preview ${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {/* New files */}
          {files.map((file, index) => (
            <div
              key={`file-${index}`}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                aspectRatio: '1',
                border: '1px solid var(--primary)'
              }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`New Preview ${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => removeSelectedFile(index)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
