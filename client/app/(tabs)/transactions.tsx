import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  Platform,
  TouchableOpacity,
} from "react-native";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from "expo-linear-gradient";
import useUser from "@/stores/userStore";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import styles, { COLORS } from "../stylesAuction";
import SettingsIcon from "@/assets/images/settings_icon.webp";
import UploadIcon from "@/assets/images/upload_photo.webp";
const FilledStarIcon = "https://cdn-icons-png.flaticon.com/512/1828/1828884.png";
const EmptyStarIcon = "https://cdn-icons-png.flaticon.com/512/1828/1828970.png";

const initialTransactions = [
  {
    id: 1,
    name: "Fresh Farm Tomatoes",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/135/135620.png" },
    purchaseDate: "2024-10-01",
    amount: 5,
    seller: "John's Farm",
    cost: 25.0,
    rating: 4,
  },
  {
    id: 2,
    name: "Organic Lettuce Bundle",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/3076/3076000.png" },
    purchaseDate: "2024-09-21",
    amount: 3,
    seller: "Local Foodz",
    cost: 10.5,
    rating: null,
  },
];
const Header = ({ onSettingsPress, onUploadPress }) => (
  <Animatable.View
    animation="fadeIn"
    style={styles.headerContainer}
  >
    <View style={styles.headerSurface}>
      <View style={styles.headerTop}>
        <IconButton
          icon={SettingsIcon}
          onPress={onSettingsPress}
        />
        <Text style={styles.header}>
          Past Purchases
        </Text>
        <IconButton
          icon={UploadIcon}
          onPress={onUploadPress}
        />
      </View>

    </View>
  </Animatable.View>
);

const IconButton = ({ icon, onPress }) => (
  <TouchableOpacity
    style={styles.iconButton}
    onPress={onPress}
  >
    <Image
      source={icon}
      style={styles.icon}
    />
  </TouchableOpacity>
);

const StarRating = ({ rating, setTempRating }) => (
  <View style={transactionStyles.starContainer}>
    {[...Array(5)].map((_, index) => (
      <TouchableOpacity key={index} onPress={() => setTempRating(index + 1)}>
        <Image
          source={{ uri: rating > index ? FilledStarIcon : EmptyStarIcon }}
          style={transactionStyles.starIcon}
        />
      </TouchableOpacity>
    ))}
  </View>
);

const TransactionItem = ({ transaction, onRate }) => {
  const [tempRating, setTempRating] = useState(transaction.rating || 0);

  const handleRatePress = () => {
    console.log("Rate button pressed");
    onRate(transaction.id, tempRating);
  };

  return (
    <View style={transactionStyles.itemCard}>
      {/* Left section: Image and details */}
      <Image source={transaction.image} style={transactionStyles.itemImage} />
      <View style={transactionStyles.detailsContainer}>
        <Text style={transactionStyles.itemName}>{transaction.name}</Text>
        <Text style={transactionStyles.itemDate}>Date: {transaction.purchaseDate}</Text>
        <Text style={transactionStyles.itemDate}>Seller: {transaction.seller}</Text>
        <Text style={transactionStyles.itemAmount}>Amount: {transaction.amount}</Text>
        <Text style={transactionStyles.itemCost}>Cost: ${transaction.cost.toFixed(2)}</Text>
      </View>

      {/* Right section: Rating and button */}
      <View style={transactionStyles.ratingContainer}>
        <StarRating rating={tempRating} setTempRating={setTempRating} />
        <TouchableOpacity onPress={handleRatePress} style={transactionStyles.rateButton}>
          <Text style={transactionStyles.rateButtonText}>
            {transaction.rating ? "Update Rating" : "Rate Listing"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default function Transactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState(initialTransactions);

  const handleRate = (transactionId, rating) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId ? { ...transaction, rating } : transaction
      )
    );
    console.log(`Transaction ID: ${transactionId} updated with Rating: ${rating}`);
  };

  const handleSettingsPress = () => {
    console.log('Settings pressed');
  };

  const handleUploadPress = () => {
    console.log('Upload pressed');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.light, COLORS.white]} style={styles.gradient}>
        <BlurView intensity={80} style={styles.blurContainer}>
          <Header

            onSettingsPress={handleSettingsPress}
            onUploadPress={handleUploadPress}
          />

          <ScrollView style={styles.auctionContainer} contentContainerStyle={styles.scrollContent}>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} onRate={handleRate} />
            ))}
          </ScrollView>
        </BlurView>
      </LinearGradient>
    </View>
  );
}

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

const transactionStyles = StyleSheet.create({
  itemCard: {
    flexDirection: 'row',  // Set layout to row
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    ...shadowStyle,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,  // Allows details to take available space
    justifyContent: 'flex-start',
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: COLORS.text,
  },
  itemDate: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  itemAmount: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  itemCost: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  ratingContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',  // Aligns rating and button to the right
    paddingLeft: 16,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starIcon: {
    width: 18,
    height: 18,
    marginRight: 2,
  },
  rateButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  rateButtonText: {
    color: COLORS.white,
    fontSize: 14,
  },
});
