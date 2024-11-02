import React, { useEffect } from "react";
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
import useUser from "@/stores/userStore";

export default function Auction() {
  const router = useRouter();
  const { email, username, password, setEmail, setPassword, login, error, setError, isLoggedIn } = useUser();

  const handleLogin = () => {
    router.push("/LoginScreen");
    console.log("Sign In pressed");
  };

  const handleRegister = () => {
    router.push("/LoginScreen");
    console.log("Create Account pressed");
  };

  useEffect(() => {

    setTimeout(() => {
        if (typeof window !== "undefined" && !isLoggedIn) {
            router.push("/");
          }    
    }, 2000);
   
  }, [isLoggedIn]);  // Adding a dependency ensures `isLoggedIn` is checked on updates

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#f0f7f0", "#ffffff"]} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Farmify</Text>
            <Text>Welcome, {username}</Text>
            <Text>Welcome, {email}</Text>
            <Image
              src={require("../../assets/images/icon.png")}
              style={styles.logo}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
