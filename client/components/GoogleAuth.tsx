import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import styles from "../app/(tabs)/styles";
import { Linking } from "react-native";

export default function GoogleAuth(): JSX.Element {
    const [showWebView, setShowWebView] = useState(false);

    const handleGoogleAuth = () => {
        Linking.openURL("http://localhost:4000/login");
    }

    return (
        <>
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.divider} />
            </View>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleAuth}>
                <Image
                    source={{
                        uri: "https://cdn.icon-icons.com/icons2/800/PNG/512/_google_icon-icons.com_65791.png",
                    }}
                    style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

    

            <Text style={styles.footerText}>
                By continuing, you agree to our Terms and Privacy Policy**
            </Text>
        </>
    );
}
