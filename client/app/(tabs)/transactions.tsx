import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import useUser from "@/stores/userStore";
import { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import styles, { COLORS } from "../stylesAuction";
import SettingsIcon from "@/assets/images/settings_icon.webp";
import UploadIcon from "@/assets/images/upload_photo.webp";

// URLs for star icons used in the rating system
const FilledStarIcon = "https://cdn-icons-png.flaticon.com/512/1828/1828884.png";
const EmptyStarIcon = "https://cdn-icons-png.flaticon.com/512/1828/1828970.png";

// Header component for the page, includes a title and icons for settings and upload
const Header = ({ onSettingsPress, onUploadPress }) => (
  <Animatable.View animation="fadeIn" style={styles.headerContainer}>
    <View style={styles.headerSurface}>
      <View style={styles.headerTop}>
        <IconButton icon={SettingsIcon} onPress={onSettingsPress} />
        <Text style={styles.header}>Past Purchases</Text>
        <IconButton icon={UploadIcon} onPress={onUploadPress} />
      </View>
    </View>
  </Animatable.View>
);

// Reusable button component for displaying icons
const IconButton = ({ icon, onPress }) => (
  <TouchableOpacity style={styles.iconButton} onPress={onPress}>
    <Image source={icon} style={styles.icon} />
  </TouchableOpacity>
);

// StarRating component to display and update transaction ratings
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

// Component to render individual transaction details and allow rating
const TransactionItem = ({ transaction, onRate }) => {
  const [tempRating, setTempRating] = useState(transaction.rating || 0);

  const handleRatePress = () => {
    console.log(`Rating ${tempRating} for transaction ID: ${transaction.id}`);
    onRate(transaction.id, tempRating);
  };

  return (
    <View style={transactionStyles.itemCard}>
      <Image
        source={{ uri: transaction.product.imgUrl }}
        style={transactionStyles.itemImage}
        onError={(error) => console.error("Error loading transaction image:", error)}
      />
      <View style={transactionStyles.detailsContainer}>
        <Text style={transactionStyles.itemName}>{transaction.product.name}</Text>
        <Text style={transactionStyles.itemDate}>
          Date: {new Date(transaction.timeStamp).toLocaleDateString()}
        </Text>
        <Text style={transactionStyles.itemDate}>
          Seller: {transaction.product.sellerName}
        </Text>
        <Text style={transactionStyles.itemAmount}>Amount: {transaction.amount}</Text>
        <Text style={transactionStyles.itemCost}>
          Cost: ${transaction.price.toFixed(2)}
        </Text>
      </View>
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

// Main Transactions component
export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMyTransactions, setShowMyTransactions] = useState(false);
  const { username, id, accountType, buyerId, sellerId } = useUser();
  const router = useRouter();

  // Fetch transactions from the backend
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/bids");
      const data = await response.json();

      // Sort transactions by timestamp (most recent first)
      const sortedData = data.sort(
        (a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)
      );

      setTransactions(sortedData);
      setFilteredTransactions(sortedData); // Default to showing all transactions
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle between "My Transactions" and "All Transactions"
  const handleToggleChange = (value) => {
    setShowMyTransactions(value);
    console.log('transactions', transactions);
    if (value) {
      const myTransactions = transactions.filter(
        (transaction) => transaction.buyer.buyerID === buyerId
      );
      setFilteredTransactions(myTransactions);
    } else {
      setFilteredTransactions(transactions);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={36} color="#0000ff" />
        <Text style={styles.loadingText}>Loading past purchases...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.light, COLORS.white]} style={styles.gradient}>
        <BlurView intensity={80} style={styles.blurContainer}>
          <Header onSettingsPress={() => console.log("Settings pressed")} onUploadPress={() => console.log("Upload pressed")} />

          {/* Toggle Switch */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>
              {showMyTransactions ? "Showing My Transactions" : "Showing All Transactions"}
            </Text>
            <Switch
              value={showMyTransactions}
              onValueChange={handleToggleChange}
              trackColor={{ false: COLORS.lightGray, true: COLORS.accent }}
              thumbColor={showMyTransactions ? COLORS.accent : COLORS.gray}
            />
          </View>

          <ScrollView style={styles.auctionContainer} contentContainerStyle={styles.scrollContent}>
            {filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onRate={async (transactionId, rating) => {
                  try {
                    await fetch(`http://localhost:4000/api/bids/${transactionId}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ rating }),
                    });

                    setFilteredTransactions((prev) =>
                      prev.map((t) =>
                        t.id === transactionId ? { ...t, rating } : t
                      )
                    );
                  } catch (error) {
                    console.error("Error updating rating:", error);
                  }
                }}
              />
            ))}
          </ScrollView>
        </BlurView>
      </LinearGradient>
    </View>
  );
}

const transactionStyles = StyleSheet.create({
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "flex-start",
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
    justifyContent: "center",
    alignItems: "flex-end",
    paddingLeft: 16,
  },
  starContainer: {
    flexDirection: "row",
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
