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
import * as Animatable from 'react-native-animatable';

// Import icons from assets
import SettingsIcon from "@/assets/images/settings_icon.webp";
import UploadIcon from "@/assets/images/upload_photo.webp";
import PhotoUploadPage from "@/components/PhotoUpload";

const COLORS = {

  primary: '#000000',
  secondary: '#4a7c59',
  light: '#f5f9f6',
  white: '#ffffff',
  text: '#1a1c1a',
  textLight: '#4b4f4b',
  border: '#e8ebe8',
  success: '#43a047',
  background: '#f0f4f1',
  shadow: '#000000',
  accent: '#81c784',
  textSecondary: '#6B7280',
  glass: 'rgba(255, 255, 255, 0.95)',


  gradientLight: '#E8F5E9',
  gradientDark: '#C8E6C9',
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
        {isUploadPage ? (
            <LinearGradient
                colors={[COLORS.primaryLight + '15', COLORS.white, COLORS.background]}
                style={styles.gradient}
            >
              <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
              >
                <Animatable.View
                    animation="fadeInDown"
                    duration={600}
                    style={styles.headerContainer}
                >
                  <LinearGradient
                      colors={[COLORS.glass, COLORS.white]}
                      style={styles.headerCard}
                  >
                    <Text style={styles.headerTitle}>Settings ⚙️</Text>
                    <Text style={styles.headerSubtitle}>Customize your experience </Text>
                  </LinearGradient>
                </Animatable.View>

                <View style={styles.settingsSection}>
                  <Animatable.View animation="fadeInUp" delay={200} duration={600}>
                    <TouchableOpacity
                        style={styles.settingsItem}
                        onPress={handleUploadPress}
                        activeOpacity={0.7}
                    >
                      <LinearGradient
                          colors={[COLORS.white, COLORS.background]}
                          style={styles.settingsItemContent}
                      >
                        <View style={styles.iconContainer}>
                          <Ionicons name="camera-outline" size={22} color={COLORS.primary} />
                        </View>
                        <View style={styles.settingsTextContainer}>
                          <Text style={styles.settingsText}>Update Profile Photo</Text>
                          <Text style={styles.settingsSubtext}>Change your profile picture</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animatable.View>

                  {accountType === "Buyer" ? (
                      <>
                        <Animatable.View animation="fadeInUp" delay={300} duration={600}>
                          <TouchableOpacity
                              style={styles.settingsItem}
                              onPress={() => router.push("/buyerSettings/updateAccountInfo")}
                              activeOpacity={0.7}
                          >
                            <LinearGradient
                                colors={[COLORS.white, COLORS.background]}
                                style={styles.settingsItemContent}
                            >
                              <View style={styles.iconContainer}>
                                <Ionicons name="person-circle-outline" size={22} color={COLORS.primary} />
                              </View>
                              <View style={styles.settingsTextContainer}>
                                <Text style={styles.settingsText}>Account Information</Text>
                                <Text style={styles.settingsSubtext}>Manage your profile details</Text>
                              </View>
                            </LinearGradient>
                          </TouchableOpacity>
                        </Animatable.View>

                        <Animatable.View animation="fadeInUp" delay={400} duration={600}>
                          <TouchableOpacity
                              style={styles.settingsItem}
                              onPress={() => router.push("/buyerSettings/updateContact")}
                              activeOpacity={0.7}
                          >
                            <LinearGradient
                                colors={[COLORS.white, COLORS.background]}
                                style={styles.settingsItemContent}
                            >
                              <View style={styles.iconContainer}>
                                <MaterialIcons name="contacts" size={22} color={COLORS.primary} />
                              </View>
                              <View style={styles.settingsTextContainer}>
                                <Text style={styles.settingsText}>Contact Information</Text>
                                <Text style={styles.settingsSubtext}>Update your contact details</Text>
                              </View>
                            </LinearGradient>
                          </TouchableOpacity>
                        </Animatable.View>

                        <Animatable.View animation="fadeInUp" delay={500} duration={600}>
                          <TouchableOpacity
                              style={styles.settingsItem}
                              onPress={() => router.push("/buyerSettings/updatePaymentInfo")}
                              activeOpacity={0.7}
                          >
                            <LinearGradient
                                colors={[COLORS.white, COLORS.background]}
                                style={styles.settingsItemContent}
                            >
                              <View style={styles.iconContainer}>
                                <FontAwesome5 name="credit-card" size={22} color={COLORS.primary} />
                              </View>
                              <View style={styles.settingsTextContainer}>
                                <Text style={styles.settingsText}>Payment Methods</Text>
                                <Text style={styles.settingsSubtext}>Manage your payment options</Text>
                              </View>
                            </LinearGradient>
                          </TouchableOpacity>
                        </Animatable.View>
                      </>
                  ) : (
                      <>
                        <Animatable.View animation="fadeInUp" delay={300} duration={600}>
                          <TouchableOpacity
                              style={styles.settingsItem}
                              onPress={() => router.push("/sellerSettings/updateAccountInfo")}
                              activeOpacity={0.7}
                          >
                            <LinearGradient
                                colors={[COLORS.white, COLORS.background]}
                                style={styles.settingsItemContent}
                            >
                              <View style={styles.iconContainer}>
                                <Ionicons name="person-circle-outline" size={22} color={COLORS.primary} />
                              </View>
                              <View style={styles.settingsTextContainer}>
                                <Text style={styles.settingsText}>Account Information</Text>
                                <Text style={styles.settingsSubtext}>Manage your seller profile</Text>
                              </View>
                            </LinearGradient>
                          </TouchableOpacity>
                        </Animatable.View>

                        <Animatable.View animation="fadeInUp" delay={400} duration={600}>
                          <TouchableOpacity
                              style={styles.settingsItem}
                              onPress={() => router.push("/sellerSettings/updateBusinessInfo")}
                              activeOpacity={0.7}
                          >
                            <LinearGradient
                                colors={[COLORS.white, COLORS.background]}
                                style={styles.settingsItemContent}
                            >
                              <View style={styles.iconContainer}>
                                <MaterialIcons name="business" size={22} color={COLORS.primary} />
                              </View>
                              <View style={styles.settingsTextContainer}>
                                <Text style={styles.settingsText}>Business Information</Text>
                                <Text style={styles.settingsSubtext}>Update your business details</Text>
                              </View>
                            </LinearGradient>
                          </TouchableOpacity>
                        </Animatable.View>
                      </>
                  )}
                </View>
              </ScrollView>
            </LinearGradient>
        ) : (
            <PhotoUploadPage setisUploadPage={setisUploadPage}/>
        )}
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
  scrollContent: {
    paddingBottom: 32,
  },

  headerContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  headerCard: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: COLORS.glass,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  settingsSection: {
    paddingHorizontal: 16,
    gap: 12,
  },
  settingsItem: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.glass,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingsSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});