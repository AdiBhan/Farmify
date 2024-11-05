import React, { useState } from "react";
import { View, Text, Image, Pressable, Button, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import styles from "../stylesDetails";

export default function ProductDetails() {
  //implement backend call here later
  const product = {
    id: 1,
    name: "Fresh Farm Tomatoes",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/135/135620.png" },
    currentBid: 5.00,
    timeLeft: "2 hours",
    totalBids: 12,
    seller: "John's Farm",
    description: "Locally grown, organic tomatoes fresh from the vine. Enjoy the taste of summer with these juicy, ripe tomatoes. Perfect for salads, sandwiches, and sauces. Have a look at our other fresh produce listings for more delicious options!",
  }
  const [quantity, setQuantity] = useState(1);

  // Parse `product` if it's passed as a JSON string
  const parsedProduct = typeof product === "string" ? JSON.parse(product) : product;

  // Safeguard: Check that parsedProduct and its properties are defined
  if (!parsedProduct) return <Text>Loading product details...</Text>;

  // Use default value for currentBid in case it’s undefined
  const currentBid = parsedProduct.currentBid ?? 0;

  return (
    <View style={styles.container}>
      <Image source={parsedProduct.image} style={styles.image} />
      <Text style={styles.title}>{parsedProduct.name}</Text>
      <Text style={styles.description}>{parsedProduct.description}</Text>
      <Text style={styles.seller}>Sold by: {parsedProduct.seller}</Text>
      <Text style={styles.seller}>Harvested on: July 16 2019</Text>
      <Text style={styles.currentBid}>Current Price: ${currentBid.toFixed(2)}</Text>

      <View style={styles.quantityContainer}>
        <Pressable onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.button}>
          <Text style={styles.buttonText}>-</Text>
        </Pressable>
        <Text style={styles.quantityText}>{quantity}</Text>
        <Pressable onPress={() => setQuantity(quantity + 1)} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>

      <Pressable style={styles.buyButton} onPress={() => alert("Purchase completed!")}>
        <Text style={styles.buyButtonText}>Buy Now</Text>
      </Pressable>


    </View>
  );
}