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

export default function Auction() {
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
           </View>
           </View>
      </LinearGradient>
    </View>
  );
}