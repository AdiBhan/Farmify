// styles/auctionStyles.js
import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

export const COLORS = {
  primary: '#2E7D32',
  secondary: '#4a7c59',
  light: '#f8faf8',
  white: '#ffffff',
  text: '#1a1c1a',
  textLight: '#4b4f4b',
  border: '#e8ebe8',
  success: '#43a047',
  background: '#fcfcfc',
  cardBg: 'rgba(255, 255, 255, 0.95)',
  shadow: '#000000',
  accent: '#81c784'
};

const shadowStyle = Platform.select({
  ios: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: {
    elevation: 4,
  },
});

const auctionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  blurContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: "100%",
  },
  headerContainer: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 8,
  },
  headerSurface: {
    backgroundColor: COLORS.cardBg,
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 16,
    ...shadowStyle,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 28,
    letterSpacing: -0.5,
  },
  welcomeText: {
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  iconButton: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: `${COLORS.primary}08`,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: COLORS.primary,
  },
  auctionContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  itemCard: {
    marginBottom: 20,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    ...shadowStyle,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: `${COLORS.primary}08`,
  },
  itemHeaderText: {
    flex: 1,
  },
  itemTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  itemSeller: {
    color: COLORS.textLight,
    fontSize: 15,
    letterSpacing: 0.1,
  },
  description: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  bidInfo: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  chip: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: `${COLORS.primary}08`,
    borderWidth: 0,
  },
  chipText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  badge: {
    backgroundColor: `${COLORS.primary}15`,
    borderRadius: 10,
    minWidth: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.border}80`,
  },
  bidButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  bidButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingSpinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: `${COLORS.primary}30`,
    borderTopColor: COLORS.primary,
    transform: [{ rotate: '45deg' }],
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export default auctionStyles;