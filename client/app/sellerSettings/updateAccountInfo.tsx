import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import useUser from "@/stores/userStore";
import styles from "@/app/stylesSettings";
import { formatPhoneNumber } from "@/stores/utilities";
export default function UpdateAccountInfo() {
  const router = useRouter();
  const { sessionID } = useUser();

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${
            process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:4000"
          }/api/seller/account`,
          { headers: { sessionID } }
        );

        const accountData = response.data.data;
        console.log(accountData);
        setEmail(accountData.email || "");
        setPhoneNumber(accountData.phoneNumber || "");
      } catch (err) {
        console.error("Failed to fetch account data:", err);
        setError("Failed to load account data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, [sessionID]);

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setError("");
    setIsLoading(true);

    try {
      const payload = {
        email,
        phoneNumber,
        password: password || undefined, // Send password only if provided
      };

      const response = await axios.put(
        `${
          process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:4000"
        }/api/seller/account`,
        payload,
        { headers: { sessionID, "Content-Type": "application/json" } }
      );

      if (response.data.message === "Account updated successfully") {
        Alert.alert("Success", "Account information updated successfully.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        throw new Error(
          response.data.message || "Failed to update account information."
        );
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update account information.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!email || !phoneNumber || (password && password.length < 6)) {
      setError(
        "Please complete all fields and ensure the password is at least 6 characters long."
      );
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
    <View style={styles.container}>
      <LinearGradient colors={["#f0f7f0", "#ffffff"]} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Update Account Information</Text>
            <Text style={styles.subheader}>
              Edit your account details below
            </Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
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
              placeholder="Phone Number (e.g., +1234567890)"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phoneNumber}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Create New Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
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
