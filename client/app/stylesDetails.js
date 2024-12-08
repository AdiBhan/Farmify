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
    paddingHorizontal: 20, // Adjusted padding
    paddingVertical: 20,
    alignItems: "stretch", // Changed from "center" to "stretch"
    scrollbarWidth: "auto",
    overflow: "scroll",
    paddingBottom: 16,
    width: "100%",
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#fff",
    scrollbarWidth: "auto",
    overflow: "scroll",
    paddingBottom: 16,
    width: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // width: "60%", // Removed
  },
  image: {
    width: "100%", // Changed from fixed width to full width
    height: 180,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: COLORS.primary + '08',
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
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
    fontSize: 14,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginTop: 4,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    flex: 1,
    // width: "90%", // Removed
    color: COLORS.text,
    lineHeight: 24,
    marginVertical: 10,
    textAlign: "center",
    letterSpacing: 0.1,
  },
  boxContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  seller: {
    fontSize: 17,
    color: COLORS.textLight,
    marginBottom: 10,
    textAlign: "center",
  },
  currentBid: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  about: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 0,
    marginTop: 10,
    textAlign: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  auctionContainer: {
    flex: 1,
    // width: "98%", // Removed
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
    backgroundColor: '#c8c8c8',
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
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
    marginTop: 5,
    marginBottom: 10,
    ...shadowStyle,
    alignSelf: 'center', // Center the button if needed
  },
  buyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

export default productDetailsStyles;
