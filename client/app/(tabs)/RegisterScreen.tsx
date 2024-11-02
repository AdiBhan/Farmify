import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import styles from "./styles";
import GoogleAuth from "@/components/GoogleAuth";
import DropDownPicker from "react-native-dropdown-picker";
import useUser from "@/stores/userStore";

export default function RegisterScreen() {
  const router = useRouter();
  const {
    email,
    password,
    accountType,
    setEmail,
    setPassword,
    setUsername,
    setAccountType,
    register
  } = useUser();

  const [open, setOpen] = useState(false);
  const [items] = useState([
    { label: "Seller", value: "Seller" },
    { label: "Buyer", value: "Buyer" },
  ]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  
  const handleRegister = async () => {
    /**
     * handleRegister() Handles the registration process and navigation
     */
    if (!validateForm()) {
      return;
    }


    setError("");
    setIsLoading(true);

    try {
      await register({
        email,
        password,
        accountType,
      });
      
      // If registration successful, navigate to the next screen
      router.push("/LoginScreen");
    } catch (err) {
      // Handle registration error
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      Alert.alert(
        "Registration Error",
        errorMessage,
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    /**
     * validFormate() checks if user inputted all necessary fields, and filled fields with valid values
     * 
     */

    if (!email || !password || !accountType) {
      setError("Please fill in all required fields");
      return;
    }

    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!email.includes('@')) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!accountType) {
      setError("Please select an account type");
      return false;
    }
    return true;
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={["#f0f7f0", "#ffffff"]} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Register</Text>
            <Text style={styles.subheader}>Create your account</Text>
          </View>

          {error ? (
            <Text style={formStyles.errorText}>{error}</Text>
          ) : null}

          <View style={styles.buttonContainer}>
            <TextInput
              onChangeText={setEmail}
              style={formStyles.input}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setUsername}
              style={formStyles.input}
              placeholder="Enter your username"
              placeholderTextColor="#666"
              autoCapitalize="none"
              editable={!isLoading}
            />

            <TextInput
              onChangeText={setPassword}
              style={formStyles.input}
              placeholder="Enter your password"
              placeholderTextColor="#666"
              secureTextEntry={true}
              value={password}
              editable={!isLoading}
            />

            <DropDownPicker
              open={open}
              value={accountType}
              items={items}
              setOpen={setOpen}
              setValue={(val) => setAccountType(val())}
              placeholder="Select an Account Type"
              style={formStyles.input}
              disabled={isLoading}
            />

            <Pressable
              onPress={handleRegister}
              style={[
                styles.button,
                styles.primaryButton,
                isLoading && styles.buttonDisabled
              ]}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? "Registering..." : "Register"}
              </Text>
            </Pressable>

            <GoogleAuth />
            <Link href="/LoginScreen" style={formStyles.link}>
              <Text style={formStyles.linkText}>
                Already have an account? Login
              </Text>
            </Link>
          </View>
        </View>
      </LinearGradient>
    </ThemedView>
  );
}

const formStyles = ({
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
      android: { elevation: 2 },
    }),
  },
  link: { 
    marginTop: 24, 
    alignItems: "center" 
  },
  linkText: { 
    color: "#2E7D32", 
    fontSize: 16, 
    fontWeight: "500" 
  },
  errorText: {
    backgroundColor: '#e8f5e9', 
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c8e6c9', 
    color: '#1b5e20',
    fontSize: 14,
    textAlign: 'center',
  }
});