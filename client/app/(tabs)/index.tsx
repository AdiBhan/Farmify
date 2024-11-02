import React from "react";
import {
  Image,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";
import { useRouter } from "expo-router";
import GoogleAuth from "@/components/GoogleAuth";

export default function HomeScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/LoginScreen");
    console.log("Sign In pressed");
  };

  const handleRegister = () => {
    router.push("/LoginScreen");
    console.log("Create Account pressed");
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#f0f7f0", "#ffffff"]} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Farmify</Text>
            <Text style={styles.subheader}>Cultivate Success Together</Text>
          </View>

          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleLogin}
            >
              <Text style={styles.primaryButtonText}>Login In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleRegister}
            >
              <Text style={styles.secondaryButtonText}>Register Account</Text>
            </TouchableOpacity>
          </View>

          <GoogleAuth />
        </View>
      </LinearGradient>
    </View>
  );
}