import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export const COLORS = {
    primary: '#2E7D32',
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
};

// Common shadow style for cards
const cardShadow = Platform.select({
    ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
    },
    android: {
        elevation: 8,
    },
});

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    gradient: {
        flex: 1,
    },
    blurContainer: {
        flex: 1,
    },
    headerContainer: {
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        letterSpacing: 0.5,
    },
});

export const statisticsStyles = StyleSheet.create({
    scrollContent: {
        padding: 16,
        paddingTop: 10,
    },
    statCard: {
        marginBottom: 12,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        ...cardShadow,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    statContent: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: 0.5,
    },
    statInfo: {
        flex: 1,
    }
});

export const settingsStyles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 32,
    },
    settingsSection: {
        paddingHorizontal: 16,
        gap: 12,
    },
    settingsItem: {
        marginBottom: 12,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        ...cardShadow,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    settingsItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.light,
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
        letterSpacing: 0.3,
    },
    settingsSubtext: {
        fontSize: 13,
        color: COLORS.textSecondary,
        letterSpacing: 0.2,
    },
    headerCard: {
        padding: 24,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        ...cardShadow,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    }
});
