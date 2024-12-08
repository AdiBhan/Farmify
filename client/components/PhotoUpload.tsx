import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import useUser from "@/stores/userStore";
import { useRouter } from 'expo-router';
const PhotoUploadScreen = ({ setisUploadPage }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { sessionID, setProfileImgUrl } = useUser();
  const router = useRouter();

  const supabase = createClient(
    String(process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL),
    String(process.env.EXPO_PUBLIC_SUPABASE_API_KEY)
  );

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));


    }
  };

  const updateProfileImageInBackend = async (profileImgUrl) => {
    try {
      // Adjust this to retrieve the session ID

      const response = await fetch("http://localhost:4000/api/users/updateProfileImage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionID,
          profileImgUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Profile image updated successfully:", data);
      } else {
        console.error("Failed to update profile image:", data.message);
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };


  const handleUseAsProfile = async () => {
    if (!selectedImage) return;
    setIsUploading(true);

    try {
      console.log('Starting upload process...');

      const timestamp = Date.now();
      const filePath = `public/${timestamp}.jpg`;

      const { data, error } = await supabase.storage
        .from('Profiles')
        .upload(filePath, selectedImage, {
          contentType: selectedImage.type,
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('Profiles')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);
      setProfileImgUrl(publicUrl);

      await updateProfileImageInBackend(publicUrl);

      router.push("/(tabs)/auction");
      alert('Profile photo uploaded successfully!\nURL: ' + publicUrl);



      setisUploadPage(prev => !prev);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={styles.safeArea}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button
            style={styles.backButton}
            onClick={() => setisUploadPage(prev => !prev)}
          >
            ← Back
          </button>
          <span style={styles.headerText}>Upload Photo</span>
          <div style={{ width: 40 }} />
        </div>

        <div style={styles.uploadArea}>
          {previewUrl ? (
            <div style={styles.imagePreviewContainer}>
              <img
                src={previewUrl}
                style={styles.imagePreview}
                alt="Preview"
              />
              <div style={styles.imageActions}>
                <button
                  style={styles.removeButton}
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl(null);
                  }}
                >
                  <span style={styles.removeButtonText}>Remove</span>
                </button>
                <button
                  style={styles.useAsProfileButton}
                  onClick={handleUseAsProfile}
                  disabled={isUploading}
                >
                  <span style={styles.useAsProfileText}>
                    {isUploading ? 'Uploading...' : 'Use as Profile'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.uploadPrompt}>
              <div style={{ fontSize: 48, color: '#666' }}>☁️</div>
              <p style={styles.uploadText}>Tap to choose a photo</p>
              <p style={styles.supportedFormats}>
                Supports: JPG, PNG, GIF
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={styles.fileInput}
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                style={styles.uploadButton}
              >
                <span style={styles.uploadButtonText}>Upload Photo</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export const COLORS = {
  primary: '#2E7D32',
  secondary: '#4a7c59',
  light: '#f5f9f6',
  white: '#ffffff',
  text: '#1a1c1a',
  textLight: '#4b4f4b',
  border: '#e8ebe8',
  success: '#43a047',
  background: '#f0f4f1',
  cardBg: 'rgba(255, 255, 255, 0.98)',
  shadow: '#000000',
  accent: '#81c784',
  textSecondary: '#6B7280',
  error: '#DC2626'
};


const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    minHeight: '100vh',
  },
  container: {
    flex: 1,
    width: '90%',
    height: '100%',
    padding: '16px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    width: '100%',
  },
  headerText: {
    fontSize: '20px',
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: COLORS.primary,
  },
  uploadArea: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    border: `2px dashed ${COLORS.border}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  uploadPrompt: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  uploadText: {
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: '12px',
  },
  supportedFormats: {
    fontSize: '12px',
    color: COLORS.textSecondary,
    marginTop: '8px',
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '80%',
    borderRadius: '8px',
    objectFit: 'contain',
  },
  imageActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '16px',
    position: 'absolute',
    bottom: '20px',
  },
  removeButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: COLORS.error,
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  removeButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  useAsProfileButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: COLORS.success,
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  useAsProfileText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  fileInput: {
    display: 'none',
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    backgroundColor: COLORS.accent,
    borderRadius: '12px',
    marginTop: '16px',
    cursor: 'pointer',
  },
  uploadButtonText: {
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.white,
  },
};
export default PhotoUploadScreen;