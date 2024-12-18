import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import axios from "axios";
import useUser from "@/stores/userStore";
import styles from "@/app/stylesSettings";

import { formatPhoneNumber } from "../../../stores/utilities";

export default function UpdateBuyerContact() {
  const router = useRouter();
  const { email: currentEmail, sessionID } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(currentEmail || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        console.log("sessionID", sessionID);
        const response = await axios.get(
          `${
            process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:4000"
          }/api/users/details`,
          { headers: { sessionID } }
        );
        const userData = response.data.data;
        console.log(userData);
        setName(userData.name || "");
        setEmail(userData.email || "");
        setPhoneNumber(userData.phoneNumber || "");
        setAddress(userData.address || "");
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load user data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [sessionID]);

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${
          process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:4000"
        }/api/users/update`,
        { name, email, phoneNumber, address, sessionID },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.message === "User updated successfully") {
        Alert.alert("Success", "Your contact information has been updated.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        throw new Error(
          response.data.message || "Failed to update contact information."
        );
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update contact information.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!name || !email || !phoneNumber || !address) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (phoneNumber.length < 10) {
      setError("Please enter a valid phone number.");
      return false;
    }
    return true;
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={["#f0f7f0", "#ffffff"]} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Update Contact Information</Text>
            <Text style={styles.subheader}>
              Edit your contact details below
            </Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TextInput
              onChangeText={setName}
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
              style={styles.input}
              placeholder="Phone Number (e.g., +1 123-456-7890)"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phoneNumber}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setAddress}
              style={[styles.input, styles.textArea]}
              placeholder="Delivery Address"
              placeholderTextColor="#999"
              multiline
              value={address}
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
    </ThemedView>
  );
}
