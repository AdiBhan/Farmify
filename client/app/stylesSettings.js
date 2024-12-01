import {Platform, StyleSheet} from "react-native";

const COLORS = {
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#4CAF50',
  secondary: '#81C784',
  background: '#F8FAF8',
  white: '#ffffff',
  text: '#1A1C1A',
  textSecondary: '#6B7280',
  border: '#E8EBE8',
  error: '#DC2626',
  shadow: '#000000',
  success: '#43A047',
  gradientStart: '#2E7D32',
  gradientEnd: '#43A047',
  cardBackground: 'rgba(255, 255, 255, 0.95)',
  glassShadow: 'rgba(46, 125, 50, 0.15)',
};

const shadowStyles = {
  small: Platform.select({
    ios: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
  }),
};

const stylesSettings = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  headerContainer: {
    marginBottom: 32,
    padding: 24,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 24,
    ...shadowStyles.large,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    color: COLORS.textSecondary,
    letterSpacing: 0.4,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 22,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 12,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  inputGroup: {
    marginBottom: 28,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 16,
    ...shadowStyles.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: 'rgba(232, 235, 232, 0.6)',
    ...shadowStyles.small,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 24,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    ...shadowStyles.large,
    overflow: 'hidden',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonDisabled: {
    backgroundColor: `${COLORS.textSecondary}80`,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: COLORS.primary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusedInput: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
  },
});
export default stylesSettings;