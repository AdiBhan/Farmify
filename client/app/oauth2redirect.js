import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function OAuth2Redirect() {
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            // Redirect to the appropriate page once the router is ready
            router.replace("/(tabs)/auction");
        }
    }, [router.isReady]); // Wait for `isReady` to be true

    return null; // Render nothing as this is a placeholder
}
