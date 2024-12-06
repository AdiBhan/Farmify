import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { router, useRouter, useLocalSearchParams } from "expo-router"; // For navigation
import * as Progress from "react-native-progress"; // For the progress bar
import styles from "../stylesDetails";

const calculateTimeLeft = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = Math.floor((end - now) / 1000);

  if (diff <= 0) {
    return "Auction Ended";
  }

  // Time units in seconds
  const timeUnits = [
    { unit: "day", v: 86400 },
    { unit: "hour", v: 3600 },
    { unit: "minute", v: 60 },
    { unit: "second", v: 1 },
  ];

  // Find the largest time unit that fits
  for (const { unit, v } of timeUnits) {
    const amount = Math.floor(diff / v);
    if (amount > 0) {
      const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
      return formatter.format(amount, unit); // Positive for future
    }
  }
};

const calculateCurrentPrice = (startPrice, endPrice, startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now >= end) return null; // Auction has ended
  if (now <= start) return null; // Auction hasn't started

  const totalDuration = end - start;
  const elapsed = now - start;
  const progress = elapsed / totalDuration;

  return startPrice + (endPrice - startPrice) * progress; // Always returns a number
};

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [amountLeft, setAmountLeft] = useState("");

  const buyerID = "323e4567-e89b-12d3-a456-426614174002";
  const { product: productId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(`Error fetching product details: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        setAmountLeft(data.quantity);

        const price = calculateCurrentPrice(
          data.startPrice,
          data.endPrice,
          data.startTime,
          data.endTime
        );
        setCurrentPrice(price);

        const timeRemaining = calculateTimeLeft(data.endTime);
        setTimeLeft(timeRemaining);
      } catch (error) {
        console.error("Error fetching product details:", error);
        Alert.alert("Error", "Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (product) {
        const updatedPrice = calculateCurrentPrice(
          product.startPrice,
          product.endPrice,
          product.startTime,
          product.endTime
        );
        setCurrentPrice(updatedPrice);

        const updatedTimeLeft = calculateTimeLeft(product.endTime);
        setTimeLeft(updatedTimeLeft);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [product]);

  const handleNavigateToCheckout = () => {
    if (!product || currentPrice === null) {
      Alert.alert("Error", "Cannot proceed to checkout at this time.");
      return;
    }

    router.push({
      pathname: "/(tabs)/checkout",
      params: {
        product: JSON.stringify(product),
        quantity,
        currentPrice,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={36} color="#0000ff" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Wrap content in a ScrollView to mimic the scrollable element */}
      <ScrollView
        style={styles.auctionContainer}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 80, alignItems: 'center' }]}
        showsVerticalScrollIndicator={true}
      >
        <Image
          source={{ uri: product.imgUrl }}
          style={[styles.image, { alignSelf: 'center' }]}
          defaultSource={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI0Oc9tGIzrpArxdS1fwqz1vI8jrVMefimow&s' }}
        />

        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.seller}>Sold by: {product.sellerName}</Text>
        <Text style={styles.description}>About Seller: {product.sellerDescription}</Text>

        <Text style={styles.currentBid}>
          Current Price: ${currentPrice !== null ? currentPrice.toFixed(2) : "N/A"}
        </Text>
        <Text style={styles.timeRemaining}>Products Remaining: {amountLeft}</Text>
        <Text style={styles.timeRemaining}>Time Remaining: {timeLeft}</Text>

        <Progress.Bar
          progress={
            product.endTime && product.startTime
              ? (new Date().getTime() - new Date(product.startTime).getTime()) /
              (new Date(product.endTime).getTime() - new Date(product.startTime).getTime())
              : 0
          }
          width={200}
          color="#2E7D32"
          style={[styles.progressBar, { alignSelf: 'center', marginVertical: 20 }]}
        />

        {/* Optional Gallery Display */}
        {product.galleryUrls && product.galleryUrls.length > 0 && (
          <View style={localStyles.galleryContainer}>
            <Text style={localStyles.galleryTitle}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {product.galleryUrls.map((url, index) => (
                <Image
                  key={index}
                  source={{ uri: url }}
                  style={localStyles.galleryImage}
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={[styles.quantityContainer, { alignSelf: 'center' }]}>
          <Pressable
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.button}
          >
            <Text style={styles.buttonText}>-</Text>
          </Pressable>
          <Text style={styles.quantityText}>{quantity}</Text>
          <Pressable
            onPress={() => setQuantity(quantity + 1)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.buyButton}
          onPress={handleNavigateToCheckout}
          disabled={isSubmitting}
        >
          <Text style={styles.buyButtonText}>
            {isSubmitting ? "Processing..." : "Buy Now"}
          </Text>
        </Pressable>
      </ScrollView>

    </View>
  );
}


const localStyles = StyleSheet.create({
  galleryContainer: {
    width: '100%',
    marginVertical: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});