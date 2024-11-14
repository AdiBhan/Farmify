import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { createClient } from '@supabase/supabase-js'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PhotoUploadScreen = ({ navigation , setisUploadPage }) => {


 console.log(process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL,  " ", process.env.EXPO_PUBLIC_SUPABASE_API_KEY);
  const supabase = createClient(
        String(process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL),
        String(process.env.EXPO_PUBLIC_SUPABASE_API_KEY)
      );
  const [selectedImage, setSelectedImage] = useState(null);



  const [isUploading, setIsUploading] = useState(false);


  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:4000';

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Sorry, we need camera roll permissions to upload photos.'
        );
        return false;
      }
      return true;
    }
  };

  const pickImage = async () => {
    if (await requestPermissions()) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    }
  };

  const takePhoto = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Sorry, we need camera permissions to take photos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    }
  };
  const handleUseAsProfile = async () => {
    if (!selectedImage) return;
    setIsUploading(true);
    
    try {
      console.log('Starting upload process...');
      
      // Generate unique file path with extension
      const timestamp = Date.now();
      const filePath = `public/${timestamp}.jpg`;
      console.log('Generated file path:', filePath);
  
      // Convert image to base64 first
      console.log('Converting image...');
      const response = await fetch(selectedImage);
      const blobData = await response.blob();
      
      // Create a File object from the blob
      const file = new File([blobData], filePath, {
        type: 'image/jpeg',
      });
      
      console.log('File created:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
  
      // Upload to Supabase
      console.log('Attempting upload to Supabase...');
      const { data, error } = await supabase.storage
        .from('Profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          contentType: 'image/jpeg',
          upsert: true
        });
  
      if (error) {
        console.error('Upload error:', error);
        throw error;
      }
  
      console.log('Upload successful, getting public URL...');
  
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('Profiles')
        .getPublicUrl(filePath);
  
      console.log('Public URL:', publicUrl);
  
      Alert.alert(
        'Success', 
        'Profile photo uploaded successfully!\nURL: ' + publicUrl
      );
      
      setisUploadPage(prev => !prev);
  
    } catch (error) {
      console.error('Full error details:', {
        message: error.message,
        code: error.statusCode,
        details: error?.details || 'No details available'
      });
      
      Alert.alert(
        'Error',
        'Upload failed: ' + (error.message || 'Unknown error')
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#F5F5F5', '#FFFFFF']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setisUploadPage( prev => !prev)}
          >
            <Ionicons name="chevron-back" size={24} color="#666" />
         
          </TouchableOpacity>
          <Text style={styles.headerText}>Upload Photo</Text>
          <View style={{width: 40}} /> 
        </View>

        <View style={styles.uploadArea}>
          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
              <View style={styles.imageActions}>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FFF" />
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.useAsProfileButton}
                  onPress={handleUseAsProfile}
                >
                  <Ionicons name="person-circle-outline" size={20} color="#FFF" />
                  <Text style={styles.useAsProfileText}>Use as Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.uploadPrompt}>
              <Ionicons name="cloud-upload-outline" size={48} color="#666" />
              <Text style={styles.uploadText}>Tap to choose a photo</Text>
              <Text style={styles.supportedFormats}>
                Supports: JPG, PNG, GIF
              </Text>
            </View>
          )}
        </View>

        {!selectedImage && (
          <View style={styles.actionButtons}>
      
            <TouchableOpacity
              style={[styles.button, styles.cameraButton]}
              onPress={takePhoto}
            >
              <Ionicons name="camera-outline" size={24} color="#666" />
              <Text style={styles.buttonText}>Take Photo!!!!!!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.uploadButton]}
              onPress={pickImage}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="#FFF" />
              <Text style={[styles.buttonText, styles.uploadButtonText]}>
                Upload Photo
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    width: '100%',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  uploadArea: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  uploadPrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  supportedFormats: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '80%',
    borderRadius: 8,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
    position: 'absolute',
    bottom: 20,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF4444',
    borderRadius: 8,
    gap: 8,
  },
  removeButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  useAsProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    gap: 8,
  },
  useAsProfileText: {
    color: '#FFF',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  uploadButtonText: {
    color: '#FFF',
  },
});

export default PhotoUploadScreen;