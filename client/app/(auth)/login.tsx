import React, { useEffect, useState } from "react";
import { Text, TextInput, View, Pressable, Platform } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useRouter } from "expo-router";
import styles, { colors } from "../styles";
import GoogleAuth from "@/components/GoogleAuth";
import useUser from "../../stores/userStore";
export default function LoginScreen() {
  const {
    email,
    password,
    setEmail,
    setPassword,
    login,
    error,
    setError,
    isLoggedIn,
    setIsLoggedIn,
  } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      // Redirect or navigate to another screen upon successful login
      router.push("/(tabs)/auction");
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    if (!validateForm(email, password)) return;
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      setEmail(email);
      setPassword(password);
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (email, password) => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={["#f0f7f0", "#ffffff"]} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Welcome</Text>
            <Text style={styles.subheader}>Login to your account</Text>
          </View>
          {error ? <Text style={formStyles.errorText}>{error}</Text> : null}
          <View style={styles.buttonContainer}>
            <TextInput
              onChangeText={setEmail}
              style={formStyles.input}
              placeholder="Enter your email address"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              onChangeText={setPassword}
              style={formStyles.input}
              placeholder="Enter your password"
              placeholderTextColor="#666"
              secureTextEntry={true}
            />
            <Pressable
              onPress={handleLogin}
              style={[styles.button, styles.primaryButton]}
            >
              <Text style={styles.primaryButtonText}>
                {" "}
                {isLoading ? "Connecting..." : "Login"}
              </Text>
            </Pressable>
            <GoogleAuth />
            <Link href="/(auth)/register" style={formStyles.link}>
              <Text style={formStyles.linkText}>
                Don't have an account? Register
              </Text>
            </Link>
          </View>
        </View>

        <Pressable
          onPress={() => {
            router.push("/(tabs)/auction" as any);
            setIsLoggedIn(true);
          }}
          style={{
            width: "50%",
            height: 10,
            padding: 30,
            backgroundColor: "lightblue",
            borderRadius: 28,
            marginBottom: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.primaryButtonText}>SKIP FOR DEV</Text>
        </Pressable>
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
  link: {
    marginTop: 24,
    alignItems: "center",
  },
  linkText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    backgroundColor: "#e8f5e9",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c8e6c9",
    color: "#1b5e20",
    fontSize: 14,
    textAlign: "center",
  },
};
