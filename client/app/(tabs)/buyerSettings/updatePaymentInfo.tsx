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

export default function UpdateBuyerPayment() {
  const router = useRouter();
  const { sessionID } = useUser();

  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${
          process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:4000"
        }/api/users/update-payment`,
        { cardholderName, cardNumber, expiryDate, cvv, sessionID },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.message === "Payment information updated successfully") {
        Alert.alert("Success", "Your payment information has been updated.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        throw new Error(
          response.data.message || "Failed to update payment information."
        );
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update payment information.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!/^\d{16}$/.test(cardNumber)) {
      setError("Please enter a valid 16-digit card number.");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError("Please enter a valid expiry date (MM/YY).");
      return false;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setError("Please enter a valid 3- or 4-digit CVV.");
      return false;
    }
    return true;
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={["#f0f7f0", "#ffffff"]} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Update Payment Information</Text>
            <Text style={styles.subheader}>
              Edit your payment details below
            </Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TextInput
              onChangeText={setCardholderName}
              style={styles.input}
              placeholder="Cardholder Name"
              placeholderTextColor="#999"
              value={cardholderName}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setCardNumber}
              style={styles.input}
              placeholder="Card Number (16 digits)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={cardNumber}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setExpiryDate}
              style={styles.input}
              placeholder="Expiry Date (MM/YY)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={expiryDate}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setCvv}
              style={styles.input}
              placeholder="CVV (3 or 4 digits)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={cvv}
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
