import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import useUser from '@/stores/userStore';
import styles from "@/app/stylesSettings"
export default function UpdateBusinessInfo() {
  const router = useRouter();
  const { sessionID } = useUser();

  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/seller/business`,
          { headers: { sessionID } }
        );
        console.log(response.data);

        const businessData = response.data.data;
        setBusinessName(businessData.sellerName || "");
        setAddress(businessData.address || "");
        setDescription(businessData.description || "");
      } catch (err) {
        console.error("Failed to fetch business data:", err);
        setError("Failed to load business data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessData();
  }, [sessionID]);

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setError("");
    setIsLoading(true);

    try {
      const payload = {
        SellerName: businessName,
        Address: address,
        Description: description,
      };
      console.log('payload', payload);

      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/seller/business`,
        payload,
        { headers: { sessionID, 'Content-Type': 'application/json' } }
      );

      if (response.data.message === "Business information updated successfully") {
        Alert.alert("Success", "Business information updated successfully.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        throw new Error(response.data.message || "Failed to update business information.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update business information.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!businessName || !address || !description) {
      setError("Please fill in all fields.");
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#f0f7f0", "#ffffff"]} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Update Business Information</Text>
            <Text style={styles.subheader}>Edit your business details below</Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TextInput
              onChangeText={setBusinessName}
              style={styles.input}
              placeholder="Business Name"
              placeholderTextColor="#666"
              value={businessName}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setAddress}
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="#666"
              value={address}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setDescription}
              style={[styles.input, styles.textArea]}
              placeholder="Business Description"
              placeholderTextColor="#666"
              multiline
              value={description}
              editable={!isLoading}
            />

            <Pressable
              onPress={handleUpdate}
              style={[
                styles.button,
                styles.primaryButton,
                isLoading && styles.buttonDisabled,
              ]}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? "Updating..." : "Update"}
              </Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}