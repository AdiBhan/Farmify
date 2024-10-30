import React from "react";
import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";
import { Link, useRouter } from "expo-router";
import GoogleAuth from "@/components/GoogleAuth";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
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
              onPress={() => {
                router.push("/LoginScreen");
                console.log("Sign In pressed");
              }}
            >
              <Text style={styles.primaryButtonText}>Login In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => {
                console.log("Create Account pressed");
                router.push("/LoginScreen");
              }}
            >
              <Text style={styles.secondaryButtonText}>Register Account</Text>
            </TouchableOpacity>
          </View>

          {/* Added GoogleAuth component */}
          <GoogleAuth />
        </View>
      </LinearGradient>
    </ThemedView>
  );
}
