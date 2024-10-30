import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,

} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import styles from "./styles";
import GoogleAuth from "@/components/GoogleAuth";
import DropDownPicker from 'react-native-dropdown-picker';

export default function RegisterScreen() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Producer', value: 'Producer'},
    {label: 'Consumer', value: 'Consumer'}
  ]);

  

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={["#f0f7f0", "#ffffff"]} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Register</Text>
            <Text style={styles.subheader}>Create your account</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TextInput
              style={formStyles.input}
              placeholder="Enter your email"
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
       
            <TextInput
              style={formStyles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#666"
              secureTextEntry={true}
            />
           <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder="Select an Account Type"
      style={formStyles.input}
    />
            
            <TouchableOpacity style={[styles.button, styles.primaryButton]}>
              <Text style={styles.primaryButtonText}>Register</Text>
            </TouchableOpacity>

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
};
