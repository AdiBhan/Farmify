import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import useUser from "@/stores/userStore";

// Import icons from assets
import SettingsIcon from "@/assets/images/settings_icon.webp";
import UploadIcon from "@/assets/images/upload_photo.webp";
import PhotoUploadPage from "@/components/PhotoUpload";

// Define colors directly in the file to avoid dependency issues
const COLORS = {
  primary: "#007AFF",
  secondary: "#5856D6",
  white: "#FFFFFF",
  light: "#F5F5F5",
  gray: "#808080",
  black: "#000000",
  background: "#F9F9F9",
};

export default function SettingsScreen() {
  const router = useRouter();
  const { username, isLoggedIn, accountType, setAccountType } = useUser();
  const [isUploadPage, setisUploadPage] = useState(true);

  
  
  useEffect(() => {
    // Setting account type as buyer for dev testing purposes
    if (accountType == "") {
       setAccountType("Buyer");
    }
  }, [])
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      
      if (typeof window !== "undefined" && !isLoggedIn) {
        router.push("/");
      }
    }, 1000);

    return () => clearTimeout(redirectTimer);
  }, [isLoggedIn, router]);

  const handleSettingsPress = () => {
    console.log('Settings pressed');
  };

  const handleUploadPress = () => {
    console.log('Upload pressed');
    setisUploadPage(prev => !prev)
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingSpinner} />
        <Text style={styles.loadingText}>
          Redirecting...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isUploadPage ? <LinearGradient
        colors={[COLORS.light, COLORS.white]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Settings</Text>
          </View>

          <View style={styles.settingsSection}>


            <TouchableOpacity
                style={styles.settingsItem}
                onPress={handleUploadPress}
            >
              <Ionicons
                  name="camera-outline"
                  size={24}
                  color={COLORS.primary}
                  style={styles.icon}
              />
              <Text style={styles.settingsText}>Update Profile Photo</Text>
            </TouchableOpacity>
            {accountType === "Buyer" ? (
                <>
                  <TouchableOpacity
                      style={styles.settingsItem}
                      onPress={() =>  router.push("/buyerSettings/updateAccountInfo")}
                  >
                    <Ionicons
                        name="person-circle-outline"
                        size={24}
                        color={COLORS.primary}
                        style={styles.icon}
                    />
                    <Text style={styles.settingsText}>Account Information</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={styles.settingsItem}
                      onPress = {() => router.push("/buyerSettings/updateContact")}
                  >
                    <MaterialIcons
                        name="contacts"
                        size={24}
                        color={COLORS.primary}
                        style={styles.icon}
                    />
                    <Text style={styles.settingsText}>Contact Information</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={styles.settingsItem}
                      onPress={() => router.push("/buyerSettings/updatePaymentInfo")}
                  >
                    <FontAwesome5
                        name="credit-card"
                        size={24}
                        color={COLORS.primary}
                        style={styles.icon}
                    />
                    <Text style={styles.settingsText}>Payment Methods</Text>
                  </TouchableOpacity>
                </>
            ) : (
                <>
                  <TouchableOpacity
                      style={styles.settingsItem}
                      onPress={ () => router.push("/sellerSettings/updateAccountInfo")}
                  >
                    <Ionicons
                        name="person-circle-outline"
                        size={24}
                        color={COLORS.primary}
                        style={styles.icon}
                    />
                    <Text style={styles.settingsText}>Account Information</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={styles.settingsItem}
                      onPress={ () => router.push("/sellerSettings/updateBusinessInfo")}
                  >
                    <MaterialIcons
                        name="business"
                        size={24}
                        color={COLORS.primary}
                        style={styles.icon}
                    />
                    <Text style={styles.settingsText}>Business Information</Text>
                  </TouchableOpacity>
                </>
            )}
          </View>
  
        </ScrollView>
      </LinearGradient> : <PhotoUploadPage setisUploadPage={setisUploadPage} />}
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderTopColor: 'transparent',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.gray,
  },
  settingsSection: {
    padding: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  settingsText: {
    fontSize: 16,
    color: COLORS.black,
  },
});