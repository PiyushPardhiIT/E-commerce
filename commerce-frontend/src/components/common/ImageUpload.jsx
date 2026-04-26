import { useState } from 'react';
import { showError } from '../../utils/toast';

// Replace hardcoded values with:
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const ImageUpload = ({ onImageUploaded, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image must be less than 5MB');
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    // Upload to Cloudinary
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'ecommerce/products');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        onImageUploaded(data.secure_url);
        setPreview(data.secure_url);
      } else {
        showError('Upload failed');
      }
    } catch {
      showError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">

      {/* Preview */}
      {preview && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden
                        border border-gray-200 bg-gray-50">
          <img
            src={preview}
            alt="Product preview"
            className="w-full h-full object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50
                            flex items-center justify-center">
              <div className="text-white text-sm font-medium">
                Uploading...
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Button */}
      <label className={`flex items-center justify-center w-full h-12
                         border-2 border-dashed rounded-xl cursor-pointer
                         transition-colors ${
        uploading
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
          : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
      }`}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <div className="flex items-center gap-2 text-sm text-blue-600">
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-600
                              border-t-transparent rounded-full animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <span>📷</span>
              <span>{preview ? 'Change Image' : 'Upload Image'}</span>
            </>
          )}
        </div>
      </label>

      <p className="text-xs text-gray-400 text-center">
        JPG, PNG, WEBP up to 5MB
      </p>
    </div>
  );
};

export default ImageUpload;