import React, {useEffect, useState} from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../app/styles";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { router } from "expo-router";
import useUser from "@/stores/userStore";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuth(): JSX.Element {
    const [loading, setLoading] = useState(false);
    const {
        setEmail,
        setIsLoggedIn,
        username,
        setUsername
    } = useUser();

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "843265692538-4eaeqvtfmrj67jpf4jf46pmrpr2d54r4.apps.googleusercontent.com",
        webClientId: "843265692538-4eaeqvtfmrj67jpf4jf46pmrpr2d54r4.apps.googleusercontent.com",
        redirectUri: "http://localhost:8081/oauth2redirect",
        scopes: ['profile', 'email'],
        useProxy: false
    });

    
    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            getUserInfo(authentication.accessToken);
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

            // Set email and username from Google user info
            setEmail(userInfo.email);
            // Use given_name as username, or fall back to email prefix if name not available
            const username = userInfo.given_name || userInfo.email.split('@')[0];
            setUsername(username);
            setIsLoggedIn(true);
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