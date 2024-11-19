import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import styles from "../stylesDetails";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Replace with actual buyer ID from user authentication
  const buyerID = "323e4567-e89b-12d3-a456-426614174002";

  // Get the product ID from the route params
  const { product: productId } = useLocalSearchParams();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/products/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handlePurchase = async () => {
    if (!product) return;

    const bidData = {
      buyerID,
      amount: quantity, // The quantity selected by the user
      auctionID: product.id,
      price: product.startPrice, // Assuming purchase is at the start price
      deliveryStatus: true, // Adjust as needed for the app's logic
    };
    console.log("Placing bid:", bidData);
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:4000/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bidData),
      });

      if (response.ok) {
        window.alert("Success: Your bid has been placed successfully!");
        window.location.reload();
        Alert.alert("Success", "Your bid has been placed successfully!", [
          { text: "OK", onPress: () => window.location.reload() },
        ]);

      } else {
        const errorData = await response.json();
        console.error("Error creating bid:", errorData);
        Alert.alert("Error", "Failed to place bid. Please try again.");
      }
    } catch (error) {
      console.error("Error creating bid:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
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
      <Text style={styles.currentBid}>Current Price: ${product.startPrice.toFixed(2)}</Text>

      <View style={styles.quantityContainer}>
        <Pressable onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.button}>
          <Text style={styles.buttonText}>-</Text>
        </Pressable>
        <Text style={styles.quantityText}>{quantity}</Text>
        <Pressable onPress={() => setQuantity(quantity + 1)} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.buyButton}
        onPress={handlePurchase}
        disabled={isSubmitting}
      >
        <Text style={styles.buyButtonText}>{isSubmitting ? "Processing..." : "Buy Now"}</Text>
      </Pressable>
    </View>
  );
}
