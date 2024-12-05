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
import * as Animatable from "react-native-animatable";

export default function HomeScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/(auth)/login");
    console.log("Sign In pressed");
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
    console.log("Create Account pressed");
  };

  return (
      <View style={styles.container}>
        <LinearGradient
            colors={["#E8F5E9", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
          <View style={styles.contentContainer}>
            <Animatable.View animation="fadeIn" duration={1000} style={styles.headerContainer}>
              <Text style={styles.header}>Farmify🌽</Text>
              <Text style={styles.subheader}>Cultivate Success Together</Text>
            </Animatable.View>

            <Animatable.View animation="zoomIn" duration={800} style={styles.logoContainer}>
              <Image
                  source={require("../assets/images/icon.webp")}
                  defaultSource={{uri: 'https://plus.unsplash.com/premium_photo-1666901328734-3c6eb9b6b979'}}
                  style={styles.logo}
              />
            </Animatable.View>

            <Animatable.View animation="fadeInUp" delay={400} style={styles.buttonContainer}>
              <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleLogin}
              >
                <LinearGradient
                    colors={['#43A047', '#2E7D32']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>Login In</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={handleRegister}
              >
                <Text style={styles.secondaryButtonText}>Register Account</Text>
              </TouchableOpacity>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" delay={600}>
              <GoogleAuth />
            </Animatable.View>
          </View>
        </LinearGradient>
      </View>
  );
}