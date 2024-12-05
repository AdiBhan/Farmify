import React, {useEffect, useState} from "react";
import {View, Text, Image, TouchableOpacity, Platform} from "react-native";
import styles from "../app/styles";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { router } from "expo-router";
import useUser from "@/stores/userStore";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuth(): JSX.Element | null {
    if (Platform.OS === 'android') {
        WebBrowser.maybeCompleteAuthSession();
    }
    if (!Google || !WebBrowser) {
        console.error('Required dependencies not loaded');
        return null;
    }
    const [loading, setLoading] = useState(false);
    const {
        setEmail,
        setIsLoggedIn,
        username,
        setUsername,
        setProfileImgURL,
        
    } = useUser();

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "843265692538-4eaeqvtfmrj67jpf4jf46pmrpr2d54r4.apps.googleusercontent.com",
        webClientId: "843265692538-4eaeqvtfmrj67jpf4jf46pmrpr2d54r4.apps.googleusercontent.com",
        redirectUri: Platform.OS === 'android'
            ? "com.googleusercontent.apps.843265692538-4eaeqvtfmrj67jpf4jf46pmrpr2d54r4:/oauth2redirect"
            : "http://localhost:8081/oauth2redirect",
        scopes: ['profile', 'email'],
        useProxy: false
    });



    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            async function handleAuth() {
                await getUserInfo(authentication.accessToken);
              
            }
            handleAuth();
        }
    }, [response]);

    const getUserInfo = async (accessToken: string) => {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            const userInfo = await response.json();
            console.log('User Info:', userInfo);

            if (!userInfo?.email) {
                console.error('No email found in user info');
                return;
            }

            // Set email and username from Google user info
            setEmail(userInfo.email);

            // Safer username extraction
            let username = userInfo.given_name;
            if (!username && userInfo.email) {
                username = userInfo.email.split('@')[0];
            }
            if (!username) {
                username = 'User'; // Default fallback
            }

            // Set profile image first and wait for it to complete
            if (userInfo.picture) {
                console.log("Setting profile image URL to:", userInfo.picture);
                setProfileImgURL(userInfo.picture);
            }
            setUsername(username);
            setIsLoggedIn(true);

            // Wait for state updates to complete
            await new Promise(resolve => setTimeout(resolve, 500));

            // Log the current state before navigation
            console.log("Before navigation - Profile URL:", userInfo.picture);

            // Only navigate after everything is set
            router.push("/(tabs)/auction");

        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleGoogleAuth = async () => {
        try {
            setLoading(true);
            await promptAsync({
                windowFeatures: {
                    width: 500,
                    height: 600
                }
            });
        } catch (error) {
            console.error('Google authentication error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.divider} />
            </View>

            <TouchableOpacity
                style={[styles.socialButton, loading && styles.socialButtonDisabled]}
                onPress={handleGoogleAuth}
                disabled={loading}
            >
                <Image
                    source={{
                        uri: "https://cdn.icon-icons.com/icons2/800/PNG/512/_google_icon-icons.com_65791.png",
                    }}
                    defaultSource={require('@/assets/images/icon.png')} 
                    onError={(error) => console.error('Error loading Google icon:', error)}
                    style={styles.socialIcon}
                />
                
                <Text style={styles.socialButtonText}>
                    {loading ? 'Loading...' : 'Continue with Google'}
                </Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                By continuing, you agree to our Terms and Privacy Policy**
            </Text>
        </>
    );
}