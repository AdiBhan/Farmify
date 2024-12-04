import React from "react";
import { View, Text, Pressable, StyleSheet, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Tracking() {
  const { trackingUrl } = useLocalSearchParams(); // Retrieve the tracking URL from the params
  const router = useRouter();

  if (!trackingUrl) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No tracking link available.</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Delivery</Text>
      <Text style={styles.link} onPress={() => Linking.openURL(trackingUrl)}>
        {trackingUrl}
      </Text>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
