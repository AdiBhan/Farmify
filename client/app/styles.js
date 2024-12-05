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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
    width: '100%',
  },
  header: {
    fontSize: 42,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
    ...Platform.select({
      ios: {
        fontFamily: "System",
      },
      android: {
        fontFamily: "sans-serif-medium",
      },
    }),
  },
  subheader: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    ...Platform.select({
      ios: {
        fontFamily: "System",
      },
      android: {
        fontFamily: "sans-serif",
      },
    }),
  },
  logoContainer: {
    marginBottom: 48,
    padding: 16,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: 25,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 24,
    gap: 12,
  },
  button: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
    overflow: 'hidden',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.textSecondary,
    paddingHorizontal: 16,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    width: "100%",
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  footerText: {
    marginTop: 20,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    letterSpacing: 0.2,
  },
});

export default styles;