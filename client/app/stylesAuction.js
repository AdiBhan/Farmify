import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

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
  cardBg: 'rgba(255, 255, 255, 0.98)',
  shadow: '#000000',
  accent: '#81c784',
  textSecondary: '#6B7280',
  error: '#DC2626'
};

const shadowStyle = Platform.select({
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

const auctionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  toggleLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "bold",
  },
  blurContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerSurface: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  header: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 24,
    letterSpacing: -0.5,
  },
  welcomeText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    letterSpacing: 0.2,
    marginTop: 4,
  },
  iconButton: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: COLORS.light,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  icon: {
    width: 20,
    height: 20,
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
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    ...shadowStyle,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: COLORS.light,
  },
  itemHeaderText: {
    flex: 1,
  },
  itemTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  itemSeller: {
    color: COLORS.textSecondary,
    fontSize: 14,
    letterSpacing: 0.1,
  },
  itemQuantity: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  description: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  bidInfo: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 4,
    columnGap: 8,
  },
  chip: {
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  chipText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  badge: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border + '40',
  },
  bidButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  bidButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
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
    borderColor: COLORS.primary + '20',
    borderTopColor: COLORS.primary,
    transform: [{ rotate: '45deg' }],
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
  }, headerContainer: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },

  headerContent: {
    paddingHorizontal: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -1,
  },

  itemCard: {
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: COLORS.light,
  },

  itemContent: {
    flex: 1,
    marginLeft: 16,
  },

  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },

  statusActive: {
    backgroundColor: COLORS.primary + '15',
  },

  statusExpired: {
    backgroundColor: COLORS.error + '15',
  },

  statusUpcoming: {
    backgroundColor: COLORS.accent + '15',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },

  priceContainer: {
    flex: 1,
  },

  priceLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },

  priceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },

  timeInfo: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  bidButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
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

  bidButtonExpired: {
    backgroundColor: COLORS.textLight,
  },

  bidButtonUpcoming: {
    backgroundColor: COLORS.accent,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerTopSection: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    width: '100%',
  },
  iconButtonContainer: {
    alignItems: 'center',
    width: 50,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconImage: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
  },
  iconLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  titleMain: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  titleSub: {
    fontSize: 14,  // Slightly larger
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 4,  // Increased letter spacing
    marginTop: 4,
    fontWeight: '500',
  },
  welcomeInfo: {
    flex: 1,
    marginBottom: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },

  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#eaffea',
    backgroundColor: COLORS.light,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  welcomeSection: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statBox: {
    padding: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statBoxBorder: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border + '40',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  }, userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
});

export default auctionStyles;