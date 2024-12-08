import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setisUploadPage(prev => !prev)}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Upload Photo</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.uploadArea}>
          {previewUrl ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: previewUrl }}
                style={styles.imagePreview}
              />
              <View style={styles.imageActions}>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => {
                    setSelectedImage(null);
                    setPreviewUrl(null);
                  }}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.useAsProfileButton}
                  onPress={handleUseAsProfile}
                  disabled={isUploading}
                >
                  <Text style={styles.useAsProfileText}>
                    {isUploading ? 'Uploading...' : 'Use as Profile'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.uploadPrompt}>
              <Text style={styles.uploadText}>Tap to choose a photo</Text>
              <Text style={styles.supportedFormats}>Supports: JPG, PNG, GIF</Text>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={styles.fileInput}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Upload Photo</Text>
              </label>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: '#f0f4f1',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1c1a',
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#2E7D32',
    fontSize: 16,
  },
  uploadArea: {
    backgroundColor: '#f5f9f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8ebe8',
    minHeight: 300,
  },
  uploadPrompt: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#4b4f4b',
    marginBottom: 8,
  },
  supportedFormats: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  imagePreviewContainer: {
    width: '100%',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  removeButton: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  useAsProfileButton: {
    flex: 1,
    marginLeft: 8,
    padding: 12,
    backgroundColor: '#43a047',
    borderRadius: 8,
    alignItems: 'center',
  },
  useAsProfileText: {
    color: '#fff',
    fontWeight: '600',
  },
  fileInput: {
    display: 'none',
  },
  uploadButton: {
    padding: 12,
    backgroundColor: '#81c784',
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default PhotoUploadScreen;
