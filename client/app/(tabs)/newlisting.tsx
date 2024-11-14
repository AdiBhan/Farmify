import React, { useState } from "react";
import { Text, TextInput, View, Pressable, Image, ScrollView, Platform } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../stylesAuction';
import styles from "../styles";

export default function CreateAuctionScreen() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [endingPrice, setEndingPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const pickPrimaryImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPrimaryImage(result.assets[0].uri);
    }
  };

  const pickGalleryImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map(asset => asset.uri);
      setGalleryImages(prevImages => [...prevImages, ...selectedImages]);
    }
  };

  const handleCreateAuction = () => {
    console.log("Auction Created:", { productName, description, startingPrice, endingPrice, duration, primaryImage, galleryImages });
    router.push("/(tabs)/auction");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <LinearGradient colors={["#f0f7f0", "#ffffff"]} style={styles.gradient}>
          <View style={styles.contentContainer}>
            <Text style={styles.header}>Create New Auction</Text>

            <TextInput
              onChangeText={setProductName}
              value={productName}
              style={formStyles.input}
              placeholder="Name of product"
              placeholderTextColor="#666"
            />

            {/* Primary Image Upload */}
            <Pressable onPress={pickPrimaryImage} style={formStyles.imageButton}>
              <Text style={formStyles.imageButtonText}>Upload Primary Image</Text>
            </Pressable>
            {primaryImage && (
              <View style={formStyles.primaryImageContainer}>
                <Image source={{ uri: primaryImage }} style={formStyles.primaryImage} />
              </View>
            )}

            {/* Gallery Images Upload */}
            <Pressable onPress={pickGalleryImages} style={formStyles.imageButton}>
              <Text style={formStyles.imageButtonText}>Upload Gallery Images</Text>
            </Pressable>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={formStyles.galleryContainer}>
              {galleryImages.map((imgUri, index) => (
                <Image key={index} source={{ uri: imgUri }} style={formStyles.galleryImage} />
              ))}
            </ScrollView>

            <TextInput
              onChangeText={setDescription}
              value={description}
              style={formStyles.input}
              placeholder="Description of product"
              placeholderTextColor="#666"
              multiline
            />

            <TextInput
              onChangeText={setStartingPrice}
              value={startingPrice}
              style={formStyles.input}
              placeholder="Starting price"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />

            <TextInput
              onChangeText={setEndingPrice}
              value={endingPrice}
              style={formStyles.input}
              placeholder="Ending price"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />

            <TextInput
              onChangeText={setDuration}
              value={duration}
              style={formStyles.input}
              placeholder="Duration (e.g., 7 days)"
              placeholderTextColor="#666"
            />

            <Pressable
              onPress={handleCreateAuction}
              style={[styles.button, styles.primaryButton]}
            >
              <Text style={styles.primaryButtonText}>Create Auction</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </ThemedView>
    </ScrollView>
  );
}

// Additional styles specific to form elements
const formStyles = {
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 28,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    color: "#333333",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  primaryImageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  primaryImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  galleryContainer: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  galleryImage: {
    width: 100,
    height: 100,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  imageButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 28,
    alignItems: "center",
    marginVertical: 16,
  },
  imageButtonText: {
    color: "white",
    fontSize: 16,
  },
};


