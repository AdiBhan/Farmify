import React, { useEffect, useState } from "react";
import { Text, TextInput, View, Pressable, Platform, Alert } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import useUser from "@/stores/userStore";

export default function UpdateContactScreen() {
  const router = useRouter();
  const {
    getUserDetails,
    updateContactInfo,
    error,
    setError,
  } = useUser();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load user details initially
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserDetails();
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
  }, []);

  const handleUpdate = async () => {
    if (!validateForm(name, email, phoneNumber, address)) return;
    setError("");
    setIsLoading(true);

    try {
      await updateContactInfo({ name, email, phoneNumber, address });
      Alert.alert("Success", "Your contact information has been updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update contact information.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (name: string, email: string, phoneNumber: string, address: string) => {
    if (!name || !email || !phoneNumber || !address) {
      setError("All fields are required.");
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
            <Text style={styles.subheader}>Edit your contact details below</Text>
          </View>
          
          {error ? <Text style={formStyles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TextInput
              onChangeText={setName}
              value={name}
              style={formStyles.input}
              placeholder="Name"
              placeholderTextColor="#666"
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setEmail}
              value={email}
              style={formStyles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              style={formStyles.input}
              placeholder="Phone Number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setAddress}
              value={address}
              style={[formStyles.input, formStyles.textArea]}
              placeholder="Address"
              placeholderTextColor="#666"
              multiline
              editable={!isLoading}
            />

            <Pressable
              onPress={handleUpdate}
              style={[styles.button, styles.primaryButton]}
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  errorText: {
    backgroundColor: "#f8d7da",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f5c6cb",
    color: "#721c24",
    fontSize: 14,
    textAlign: "center",
  },
};
