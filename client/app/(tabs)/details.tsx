import React, { useState } from "react";
import { View, Text, Image, Pressable, TextInput, Alert, StyleSheet } from "react-native";

export default function ProductDetails() {
  const product = {
    id: 1,
    name: "Fresh Farm Tomatoes",
    image: { uri: "https://cdn-icons-png.flaticon.com/512/135/135620.png" },
    currentBid: 5.0,
    timeLeft: "2 hours",
    totalBids: 12,
    seller: "John's Farm",
    description: "Locally grown, organic tomatoes fresh from the vine.",
  };

  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState(""); // Buyer name input
  const [price, setPrice] = useState(product.currentBid);

  // Function to handle creating a bid
  const handleCreateBid = async () => {
    console.log("Creating bid...");
    console.log("Buyer Name:", buyerName);
    console.log("Quantity:", quantity);
    console.log("Price:", price);

    if (!buyerName) {
      Alert.alert("Error", "Buyer name is required.");
      return;
    }

    const bidData = {
      Amount: price * quantity,
      BuyerID: 123, // Replace with actual BuyerID
      AuctionID: product.id,
    };

    console.log("Bid Data:", bidData);

    try {
      const response = await fetch("http://localhost:4000/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bidData),
      });

      console.log("Response Status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Bid Result:", result);
        Alert.alert("Success", "Bid placed successfully!");
      } else {
        const error = await response.text();
        console.log("Error Response:", error);
        Alert.alert("Error", `Failed to place bid: ${error}`);
      }
    } catch (error) {
      console.log("Catch Error:", error);
      Alert.alert("Error", `An error occurred: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.seller}>Sold by: {product.seller}</Text>
      <Text style={styles.currentBid}>Current Price: ${product.currentBid.toFixed(2)}</Text>

      <View style={styles.quantityContainer}>
        <Pressable onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.button}>
          <Text style={styles.buttonText}>-</Text>
        </Pressable>
        <Text style={styles.quantityText}>{quantity}</Text>
        <Pressable onPress={() => setQuantity(quantity + 1)} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={buyerName}
        onChangeText={setBuyerName}
      />

      <Pressable style={styles.buyButton} onPress={handleCreateBid}>
        <Text style={styles.buyButtonText}>Buy Now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  seller: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  currentBid: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#ddd",
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 16,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  buyButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
