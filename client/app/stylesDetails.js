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
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: `${COLORS.primary}08`,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginVertical: 10,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
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
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
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
    fontWeight: "bold",
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
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

export default productDetailsStyles;
