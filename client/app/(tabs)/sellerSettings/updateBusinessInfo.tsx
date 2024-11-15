import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { useSeller } from '../hooks/useSeller'; 
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function UpdateBusinessInfo() {
  const router = useRouter();
  const { getBusinessDetails, updateBusinessInfo } = useSeller();

  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setIsLoading(true);
        const businessData = await getBusinessDetails();
        setBusinessName(businessData.name || "");
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
  }, []);

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setError("");
    setIsLoading(true);

    try {
      await updateBusinessInfo({ businessName, address, description });
      Alert.alert("Success", "Business information updated successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
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
  textArea: { height: 100, textAlignVertical: "top" },
  button: { width: "100%", paddingVertical: 15, borderRadius: 8, alignItems: "center", justifyContent: "center", marginTop: 20 },
  primaryButton: { backgroundColor: "#007AFF" },
  buttonDisabled: { backgroundColor: "#808080" },
  primaryButtonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
});
