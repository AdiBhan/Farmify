import { StyleSheet, Platform } from "react-native";
import { COLORS } from "./stylesAuction";

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

const productDetailsStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    alignItems: "center",
    scrollbarWidth: "auto", // Ensures the scrollbar is visible
    overflow: "scroll", // Enables scrolling with the scrollbar on web
    paddingBottom: 16,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#fff",
    // The following CSS-like properties are supported on React Native Web:
    scrollbarWidth: "auto", // Ensures the scrollbar is visible
    overflow: "scroll", // Enables scrolling with the scrollbar on web
    paddingBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%", // Percentage values stay as strings
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: COLORS.primary + '08', // Changed from template literal to concatenation
  },
  title: {
    fontSize: 24,
    fontWeight: "700", // Already correct
    color: COLORS.text,
    marginVertical: 10,
    letterSpacing: -0.3,
    textAlign: "center",
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
  description: {
    fontSize: 16,
    flex: 1,
    width: "90%",
    color: COLORS.text,
    lineHeight: 24,
    marginVertical: 10,
    textAlign: "center",
    letterSpacing: 0.1,
  },
  seller: {
    fontSize: 15,
    color: COLORS.textLight,
    marginBottom: 10,
    textAlign: "center",
  },
  currentBid: {
    fontSize: 18,
    fontWeight: "700", // Changed from "bold" to "700"
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  auctionContainer: {
    flex: 1,
    width: "98%",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.border,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700", // Changed from "bold" to "700"
    color: COLORS.text,
  },
  quantityText: {
    fontSize: 18,
    color: COLORS.text,
    marginHorizontal: 10,
    textAlign: "center",
  },
  buyButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
    ...shadowStyle,
  },
  buyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700", // Already correct
    letterSpacing: 0.2,
  },
});

export default productDetailsStyles;