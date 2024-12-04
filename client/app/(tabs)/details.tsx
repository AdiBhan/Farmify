import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
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
  const [product, setProduct] = useState(null); // Store product details
  const [loading, setLoading] = useState(true); // Indicate if data is being loaded
  const [quantity, setQuantity] = useState(1); // Track bid quantity
  const [isSubmitting, setIsSubmitting] = useState(false); // Indicate if a purchase request is in progress
  const [currentPrice, setCurrentPrice] = useState(null); // Store the current price of the auction
  const [timeLeft, setTimeLeft] = useState(""); // Store the remaining time for the auction
  const [amountLeft, setAmountLeft] = useState(""); // Store the remaining time for the auction

  const buyerID = "323e4567-e89b-12d3-a456-426614174002"; // Replace with actual buyer ID
  const { product: productId } = useLocalSearchParams(); // Retrieve product ID from search parameters

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(`Error fetching product details: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        console.log(data);
        setAmountLeft(data.quantity);
        // Calculate initial values
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
        // Update current price and time left at regular intervals
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
    }, 1000);

    return () => clearInterval(interval);
  }, [product]);

  const handlePurchase = async () => {
    if (!product || currentPrice === null) {
      Alert.alert("Error", "Cannot place a bid at this time.");
      return;
    }

    if (quantity <= 0) {
      Alert.alert("Error", "Quantity must be at least 1.");
      return;
    }

    try {

      // Step 2: Create PayPal order
      const orderRequest = {
        ClientId: product.ppid,
        ClientSecret: product.pPsecret,
        Amount: currentPrice * quantity,
        Currency: "USD", // Adjust currency as needed
        Name: product.name,
      };
      console.log(orderRequest);

      const createOrderResponse = await fetch(
        "http://localhost:4000/api/paypal/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderRequest),
        }
      );

      if (!createOrderResponse.ok) {
        const errorData = await createOrderResponse.json();
        console.error("Error creating PayPal order:", errorData);
        Alert.alert("Error", "Failed to initiate payment. Please try again.");
        return;
      }

      const { orderId, approvalLink } = await createOrderResponse.json();

      // Step 3: Open PayPal in a separate window
      const paypalWindow = window.open(
        approvalLink,
        "PayPalPayment",
        "width=800,height=600"
      );

      if (!paypalWindow) {
        Alert.alert("Error", "Failed to open PayPal window. Please try again.");
        return;
      }

      // Step 4: Poll for window closure and handle payment completion
      const pollTimer = setInterval(() => {
        if (paypalWindow.closed) {
          clearInterval(pollTimer);

          // Step 5: Capture the order
          capturePayPalOrder(orderId, product.ppid, product.pPsecret);
          window.alert("Payment Successful!");

        }
      }, 500);
    } catch (error) {
      console.error("Error during purchase process:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  // Helper function to capture the PayPal order
  const capturePayPalOrder = async (orderId, clientId, clientSecret) => {
    try {
      const captureOrderResponse = await fetch(
        "http://localhost:4000/api/paypal/capture-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ClientId: clientId,
            ClientSecret: clientSecret,
            OrderId: orderId,
          }),
        }
      );

      if (captureOrderResponse.ok) {
        Alert.alert("Success", "Payment captured successfully!");
        // Proceed with bid creation logic here
        createBid();
      } else {
        const errorData = await captureOrderResponse.json();
        console.error("Failed to capture PayPal order:", errorData);
        Alert.alert("Error", "Payment capture failed. Please try again.");
      }
    } catch (error) {
      console.error("Error capturing payment:", error);
      Alert.alert("Error", "An unexpected error occurred while capturing payment.");
    }
  };

  // Helper function to create the bid
  const createBid = async () => {
    const bidData = {
      buyerID,
      amount: quantity,
      auctionID: product.id,
      price: currentPrice,
      deliveryStatus: true,
    };

    try {
      const response = await fetch("http://localhost:4000/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bidData),
      });

      if (response.ok) {
        Alert.alert("Success", "Your bid has been placed successfully!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error creating bid:", errorData);
        Alert.alert("Error", "Failed to place bid. Please try again.");
      }
    } catch (error) {
      console.error("Error creating bid:", error);
      Alert.alert("Error", "An unexpected error occurred while placing your bid.");
    }
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
      <Image source={{ uri: product.imgUrl }} style={styles.image} />
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
        style={styles.progressBar}
      />

      <View style={styles.quantityContainer}>
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
        onPress={handlePurchase}
        disabled={isSubmitting}
      >
        <Text style={styles.buyButtonText}>
          {isSubmitting ? "Processing..." : "Buy Now"}
        </Text>
      </Pressable>
    </View>
  );
}
