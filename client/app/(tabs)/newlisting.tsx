// This file defines the "Create Auction" screen for an auction app, allowing users to upload product details and images, and submit auctions.

import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  Pressable,
  Image,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../stylesAuction";
import styles from "../styles";
import { createClient } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";
import { StyleSheet } from "react-native";
import useUser from "@/stores/userStore";

import * as Animatable from "react-native-animatable";
export default function CreateAuctionScreen() {
  const router = useRouter(); // Navigation object for routing between screens

  // State variables to manage form data and images
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [endingPrice, setEndingPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [primaryImageUrl, setPrimaryImageUrl] = useState(null);
  const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>([]);
  const [productId, setProductId] = useState<string>(Date.now().toString());

  // Extract user data from custom user store
  const { username, id, accountType, buyerId, sellerId } = useUser();

  function formatCurrency(value) {
    /**
     * Helper function converts string to currency representation
     */
    if (!value) return ""; // Handle empty inputs gracefully
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return formatter.format(value);
  }

  // Helper function to convert blobs to Base64
  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Initialize Supabase client for uploading images and data
  const supabase = createClient(
    String(process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL),
    String(process.env.EXPO_PUBLIC_SUPABASE_API_KEY)
  );

  // Upload image to Supabase and return the public URL
  const uploadImageToSupabase = async (imageUri, isGallery = false) => {
    try {
      const timestamp = Date.now();
      const imageName = `${timestamp}.jpg`;
      // Create path based on whether it's a gallery image or primary image
      const filePath = isGallery
        ? `public/gallery/${productId}/${imageName}`
        : `public/primary/${productId}/${imageName}`;

      console.log("Generated file path:", filePath);

      const response = await fetch(imageUri);
      const blobData = await response.blob();
      const base64Data = await blobToBase64(blobData);
      const arrayBuffer = decode(base64Data.split(",")[1]);

      const { data, error } = await supabase.storage
        .from("Products")
        .upload(filePath, arrayBuffer, {
          contentType: "image/jpeg",
        });

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("Products").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Open image picker to select the primary image
  const pickPrimaryImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    try {
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setPrimaryImage(imageUri);
        const publicUrl = await uploadImageToSupabase(imageUri, false);
        setPrimaryImageUrl(publicUrl);
        console.log("Primary image uploaded:", publicUrl);
      }
    } catch (error) {
      console.error("Error handling primary image:", error);
      Alert.alert("Error", "Failed to upload primary image");
    }
  };

  // Open image picker to select multiple gallery images
  const pickGalleryImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    try {
      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        setGalleryImages((prevImages) => [...prevImages, ...selectedImages]);

        // Upload each gallery image to Supabase
        const uploadPromises = selectedImages.map(async (imageUri) => {
          try {
            const publicUrl = await uploadImageToSupabase(imageUri, true);
            return publicUrl;
          } catch (error) {
            console.error("Error uploading gallery image:", error);
            return null;
          }
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        const validUrls = uploadedUrls.filter((url) => url !== null);

        setGalleryImageUrls((prevUrls) => [...prevUrls, ...validUrls]);
        console.log("Gallery images uploaded:", validUrls);
      }
    } catch (error) {
      console.error("Error handling gallery images:", error);
      Alert.alert("Error", "Failed to upload some gallery images");
    }
  };

   // Validation function to ensure input is numeric
   const handleNumericInput = (input, setState) => {
    if (/^\d*\.?\d*$/.test(input)) {
      setState(input);
    } else {
      Alert.alert("Invalid Input", "Please enter only numeric values.");
    }
  };

  // Handle form submission to create an auction
  const handleCreateAuction = async () => {
    try {
      if (
        !productName ||
        !description ||
        !startingPrice ||
        !endingPrice ||
        !duration ||
        !primaryImageUrl
      ) {
        Alert.alert("Error", "Please fill all required fields.");
        return;
      }

      // Convert input strings to numbers for further processing
      const numericQuantity = parseFloat(quantity);
      const numericStartingPrice = parseFloat(startingPrice);
      const numericEndingPrice = parseFloat(endingPrice);
      const numericDuration = parseInt(duration);

      if (
        isNaN(numericQuantity) ||
        isNaN(numericStartingPrice) ||
        isNaN(numericEndingPrice) ||
        isNaN(numericDuration)
      ) {
        Alert.alert("Error", "All fields must be valid numeric values.");
        return;
      }

      const auctionData = {
        name: productName,
        description: description,
        StartPrice: parseFloat(startingPrice),
        EndPrice: parseFloat(endingPrice),
        StartTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        EndTime: new Date(
          Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000
        ).toISOString(),
        ImgUrl: primaryImageUrl,
        Quantity: quantity,
        sellerID: sellerId,
        GalleryUrls: galleryImageUrls,
      };
      console.log("Auction data:", auctionData);

      //Sends data to the backend to create a new auction
      const response = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auctionData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to create auction:", errorText);
        Alert.alert(
          "Error",
          `Failed to create auction: ${response.statusText}`
        );
        return;
      }

      const createdAuction = await response.json();
      console.log("Auction created successfully:", createdAuction);

      Alert.alert("Success", "Auction created successfully!");
      router.push("/(tabs)/auction");
    } catch (error) {
      console.error("Error creating auction:", error);
      Alert.alert("Error", "An error occurred while creating the auction.");
    }
  };

  // Render the form and UI
  return (
    <ScrollView
      contentContainerStyle={[
        formStyles.scrollContainer,
        { paddingBottom: 80 },
      ]}
    >
      <LinearGradient
        colors={[COLORS.primary + "15", COLORS.white, COLORS.background]}
        style={formStyles.gradient}
      >
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          style={formStyles.container}
        >
          {/* Header Section */}
          <View style={formStyles.headerContainer}>
            <Text style={formStyles.header}>Create Auction</Text>
            <Text style={formStyles.subheader}>List your product for sale</Text>
          </View>

          {/* Input Fields */}
          <View style={formStyles.inputGroup}>
            <Text style={formStyles.inputLabel}>Product Details</Text>
            <TextInput
              onChangeText={setProductName}
              value={productName}
              style={formStyles.input}
              placeholder="Product name"
              placeholderTextColor={COLORS.textSecondary}
            />
            <TextInput
              onChangeText={setDescription}
              value={description}
              style={[formStyles.input, formStyles.textArea]}
              placeholder="Describe your product in detail"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={4}
            />
            <TextInput
              onChangeText={(text) => handleNumericInput(text, setQuantity)} // Use the validation function
              value={quantity}
              style={formStyles.input}
              placeholder="Please Enter Quantity available"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Image Upload */}
          <View style={formStyles.inputGroup}>
            <Text style={formStyles.inputLabel}>Images</Text>
            <Pressable
              onPress={pickPrimaryImage}
              style={formStyles.uploadButton}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + "E6"]}
                style={formStyles.uploadButtonGradient}
              >
                <Text style={formStyles.uploadButtonText}>
                  Upload Primary Image
                </Text>
              </LinearGradient>
            </Pressable>

            {primaryImage && (
              <Animatable.View
                animation="fadeIn"
                style={formStyles.primaryImageContainer}
              >
                <Image
                  source={{ uri: primaryImage }}
                  style={formStyles.primaryImage}
                />
              </Animatable.View>
            )}

            <Pressable
              onPress={pickGalleryImages}
              style={[formStyles.uploadButton, formStyles.secondaryButton]}
            >
              <Text style={formStyles.secondaryButtonText}>
                Add Gallery Images
              </Text>
            </Pressable>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={formStyles.galleryContainer}
            >
              {galleryImages.map((imgUri, index) => (
                <Animatable.View
                  key={index}
                  animation="fadeIn"
                  delay={index * 100}
                >
                  <Image
                    source={{ uri: imgUri }}
                    style={formStyles.galleryImage}
                  />
                </Animatable.View>
              ))}
            </ScrollView>
          </View>

          <View style={formStyles.inputGroup}>
            <Text style={formStyles.inputLabel}>Pricing</Text>
            <View style={formStyles.row}>
            <TextInput
                onChangeText={(text) => handleNumericInput(text, setStartingPrice)}
                value={startingPrice}
                style={[formStyles.input, formStyles.halfInput]}
                placeholder="Starting price"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
              />

              <TextInput
                onChangeText={(text) => handleNumericInput(text, setEndingPrice)}
                value={endingPrice}
                style={[formStyles.input, formStyles.halfInput]}
                placeholder="Ending price"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
              />
            </View>
            <TextInput
              onChangeText={(text) => handleNumericInput(text, setDuration)}
              value={duration}
              style={formStyles.input}
              placeholder="Duration (e.g., 7 days)"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleCreateAuction}
            style={formStyles.submitButton}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary + "E6"]}
              style={formStyles.submitButtonGradient}
            >
              <Text style={formStyles.submitButtonText}>Create Auction</Text>
            </LinearGradient>
          </Pressable>
        </Animatable.View>
      </LinearGradient>
    </ScrollView>
  );
}

const formStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  gradient: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  subheader: {
    fontSize: 16,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.text,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  uploadButton: {
    marginBottom: 16,
  },
  uploadButtonGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  uploadButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: COLORS.light,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  primaryImageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  primaryImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  galleryContainer: {
    marginTop: 8,
  },
  galleryImage: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  },
  submitButton: {
    marginTop: 8,
  },
  submitButtonGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
});
