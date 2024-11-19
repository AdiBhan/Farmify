import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import useUser from '@/stores/userStore';

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
          `${process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/seller/account`,
          { headers: { sessionID } }
        );

        const accountData = response.data.data;
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
        `${process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/seller/account`,
        payload,
        { headers: { sessionID, 'Content-Type': 'application/json' } }
      );

      if (response.data.message === "Account updated successfully") {
        Alert.alert("Success", "Account information updated successfully.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        throw new Error(response.data.message || "Failed to update account information.");
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
      setError("Please complete all fields and ensure the password is at least 6 characters long.");
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
            <Text style={styles.subheader}>Edit your account details below</Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TextInput
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setPhoneNumber}
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={phoneNumber}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setPassword}
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#666"
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  gradient: { flex: 1 },
  contentContainer: { padding: 20, alignItems: "center" },
  headerContainer: { marginTop: 40, alignItems: "center" },
  header: { fontSize: 28, fontWeight: "bold", color: "#000", marginBottom: 5 },
  subheader: { fontSize: 16, color: "#808080" },
  errorText: { color: "red", marginBottom: 10, fontSize: 14, textAlign: "center" },
  buttonContainer: { width: "100%" },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: { width: "100%", paddingVertical: 15, borderRadius: 8, alignItems: "center", justifyContent: "center", marginTop: 20 },
  primaryButton: { backgroundColor: "#007AFF" },
  buttonDisabled: { backgroundColor: "#808080" },
  primaryButtonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
});
