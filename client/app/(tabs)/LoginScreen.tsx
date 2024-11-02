import React from "react";
import { Text, TextInput, View, TouchableOpacity, Platform, Pressable } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import styles from "./styles";
import { Image } from "react-native";
import GoogleAuth from "@/components/GoogleAuth";
import useUser from "../../stores/userStore"
import { useStore } from "zustand/react";



export default function LoginScreen() {

  const { email, password, setEmail, setPassword, login, register, logout, isLoggedIn } = useUser();
  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={["#f0f7f0", "#ffffff"]} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Welcome Back</Text>
            <Text style={styles.subheader}>Login to your account</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TextInput
              style={formStyles.input}
              placeholder="Enter your email address"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={formStyles.input}
              placeholder="Enter your password"
              placeholderTextColor="#666"
              secureTextEntry={true}
            />

            <Pressable style={[styles.button, styles.primaryButton]}>
              <Text style={styles.primaryButtonText}>Login</Text>
            </Pressable>

            <GoogleAuth />
            <Link href="/RegisterScreen" style={formStyles.link}>
              <Text style={formStyles.linkText}>
                Don't have an account? Register
              </Text>
            </Link>
          </View>
        </View>
      </LinearGradient>
    </ThemedView>
  );
}

// Additional styles specific to form elements
const formStyles = {
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    
    borderColor: '#E0E0E0',
    fontSize: 16,
    color: '#333333',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
    alignItems: 'center',
  },
  linkText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '500',
  },
};