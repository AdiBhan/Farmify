import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Checkout() {
  const { product, quantity, currentPrice } = useLocalSearchParams();
  const parsedProduct = JSON.parse(product);
  const parsedCurrentPrice = parseFloat(currentPrice) || 0;
  const parsedQuantity = parseInt(quantity, 10) || 1;
  const totalPrice = parsedCurrentPrice * parsedQuantity;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup"); // Default to pickup
  const [deliveryDetails, setDeliveryDetails] = useState({
    dropoff_address: "",
    dropoff_business_name: "",
    dropoff_phone_number: "",
    dropoff_instructions: "",
  });

  const router = useRouter();

  const handlePayment = async () => {
    setIsSubmitting(true);

    // Include delivery details if delivery is selected
    const deliveryInfo =
      deliveryMethod === "delivery" ? deliveryDetails : null;

    try {
      const orderRequest = {
        ClientId: parsedProduct.ppid,
        ClientSecret: parsedProduct.pPsecret,
        Amount: totalPrice,
        Currency: "USD",
        Name: parsedProduct.name,
        DeliveryInfo: deliveryInfo,
      };

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
        setIsSubmitting(false);
        return;
      }

      const { orderId, approvalLink } = await createOrderResponse.json();

      const paypalWindow = window.open(
        approvalLink,
        "PayPalPayment",
        "width=800,height=600"
      );

      if (!paypalWindow) {
        Alert.alert("Error", "Failed to open PayPal window. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const pollTimer = setInterval(() => {
        if (paypalWindow.closed) {
          clearInterval(pollTimer);
          capturePayPalOrder(orderId, parsedProduct.ppid, parsedProduct.pPsecret);
        }
      }, 500);
    } catch (error) {
      console.error("Error during payment process:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

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
        createBid();
      } else {
        const errorData = await captureOrderResponse.json();
        console.error("Failed to capture PayPal order:", errorData);
        Alert.alert("Error", "Payment capture failed. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error capturing payment:", error);
      Alert.alert("Error", "An unexpected error occurred while capturing payment.");
      setIsSubmitting(false);
    }
  };

  const createBid = async () => {
    const bidData = {
      buyerID: "323e4567-e89b-12d3-a456-426614174002",
      amount: parsedQuantity,
      auctionID: parsedProduct.id,
      price: parsedCurrentPrice,
      deliveryStatus: deliveryMethod === "delivery",
      deliveryDetails: deliveryMethod === "delivery" ? deliveryDetails : null,
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
        Alert.alert("Success", "Your order has been placed successfully!");
        router.replace("/tabs");
      } else {
        const errorData = await response.json();
        console.error("Error creating bid:", errorData);
        Alert.alert("Error", "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error creating bid:", error);
      Alert.alert("Error", "An unexpected error occurred while placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Image source={{ uri: parsedProduct.imgUrl }} style={styles.image} />
      <Text style={styles.description}>{parsedProduct.name}</Text>
      <Text style={styles.seller}>Sold by: {parsedProduct.sellerName}</Text>
      <Text style={styles.currentBid}>
        Current Price: ${parsedCurrentPrice.toFixed(2)}
      </Text>
      <Text style={styles.quantity}>Quantity: {parsedQuantity}</Text>
      <Text style={styles.totalPrice}>Total Price: ${totalPrice.toFixed(2)}</Text>

      {/* Delivery Method Selection */}
      <Text style={styles.subtitle}>Choose Delivery Method:</Text>
      <View style={styles.radioContainer}>
        <Pressable
          style={[styles.radio, deliveryMethod === "pickup" && styles.radioSelected]}
          onPress={() => setDeliveryMethod("pickup")}
        >
          <Text>Pickup</Text>
        </Pressable>
        <Pressable
          style={[styles.radio, deliveryMethod === "delivery" && styles.radioSelected]}
          onPress={() => setDeliveryMethod("delivery")}
        >
          <Text>Delivery</Text>
        </Pressable>
      </View>

      {/* Delivery Form */}
      {deliveryMethod === "delivery" && (
        <View style={styles.deliveryForm}>
          <TextInput
            style={styles.input}
            placeholder="Dropoff Address"
            value={deliveryDetails.dropoff_address}
            onChangeText={(text) =>
              setDeliveryDetails({ ...deliveryDetails, dropoff_address: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Business Name (Optional)"
            value={deliveryDetails.dropoff_business_name}
            onChangeText={(text) =>
              setDeliveryDetails({ ...deliveryDetails, dropoff_business_name: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={deliveryDetails.dropoff_phone_number}
            onChangeText={(text) =>
              setDeliveryDetails({ ...deliveryDetails, dropoff_phone_number: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Instructions (Optional)"
            value={deliveryDetails.dropoff_instructions}
            onChangeText={(text) =>
              setDeliveryDetails({ ...deliveryDetails, dropoff_instructions: text })
            }
          />
        </View>
      )}

      <Pressable
        style={styles.buyButton}
        onPress={handlePayment}
        disabled={isSubmitting}
      >
        <Text style={styles.buyButtonText}>
          {isSubmitting ? "Processing..." : "Pay Now"}
        </Text>
      </Pressable>

      {isSubmitting && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
    padding: 30,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  seller: {
    fontSize: 14,
    marginBottom: 10,
    color: "#666",
  },
  currentBid: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 16,
    marginBottom: 5,
  },
  totalPrice: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  radio: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  radioSelected: {
    borderColor: "#2E7D32",
    backgroundColor: "#c8f0c8",
  },
  deliveryForm: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});
