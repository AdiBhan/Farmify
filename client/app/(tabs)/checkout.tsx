import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Linking,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useUser from "@/stores/userStore";
import { formatCurrency,formatPhoneNumber } from "../../stores/utilities";
import { MaterialIcons } from "@expo/vector-icons";

export default function Checkout() {
  const { username, id, accountType, buyerId, sellerId } = useUser();
  console.log(buyerId);
  console.log(username);
  const { product, quantity, currentPrice } = useLocalSearchParams();
  const parsedProduct = JSON.parse(product);
  const parsedCurrentPrice = parseFloat(currentPrice) || 0;
  const parsedQuantity = parseInt(quantity, 10) || 1;
  let totalPrice = parsedCurrentPrice * parsedQuantity;
  const [trackingUrl, setTrackingUrl] = useState(null);
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup"); // Default to pickup
  const [deliveryDetails, setDeliveryDetails] = useState({
    dropoff_address: "",
    dropoff_business_name: "",
    dropoff_phone_number: "",
    dropoff_instructions: "",
  });
  const [tipAmount, setTipAmount] = useState("");
  const [sellerAddress, setSellerAddress] = useState(""); // Store seller's address

  // Replace with actual buyer ID
  const { product: productId } = useLocalSearchParams(); // Retrieve product ID from search parameters

  useEffect(() => {
    // Fetch product details to include seller's address
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/products/${parsedProduct.id}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch product details: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging line
        console.log("Seller Address:", data.SellerAddress); // Debug seller address
        setSellerAddress(data.SellerAddress || "Address not available"); // Handle empty address
      } catch (error) {
        console.error("Error fetching product details:", error);
        Alert.alert(
          "Error",
          "Failed to load product details. Please try again."
        );
      }
    };

    fetchProductDetails();
  }, [parsedProduct.id]);

  const handleGenerateDelivery = async () => {
    if (deliveryMethod !== "delivery") {
      Alert.alert("Error", "Delivery is not selected.");
      return;
    }
    const parsedTip = parseFloat(tipAmount) * 100 || 0; // Ensure tip is a valid number
    const orderValue = parseFloat(totalPrice.toFixed(2)) * 100; // Ensures a float with 2 decimal places

    const deliveryRequest = {
      externalDeliveryId: `D-${Date.now()}`, // Unique ID for each delivery
      pickupAddress: parsedProduct.sellerAddress,
      pickupBusinessName: parsedProduct.sellerName,
      pickupPhoneNumber: "+16505555555", // Example phone number
      pickupInstructions: "Enter gate code 1234 on the callbox.",
      pickupReferenceTag: `Order number ${Date.now()}`,
      dropoffAddress:
        deliveryDetails.dropoff_address.trim(),
      dropoffBusinessName:
        deliveryDetails.dropoff_business_name.trim() ,
      dropoffPhoneNumber:
        `+1${deliveryDetails.dropoff_phone_number.trim()}`,
      dropoffInstructions:
        deliveryDetails.dropoff_instructions.trim() || "Leave at door",
      orderValue: orderValue, // Add total order value
      tip: parsedTip || 0,
    };

    try {
      setIsSubmitting(true);
      const response = await fetch(
        "http://localhost:4000/api/deliveries/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deliveryRequest),
        }
      );

      const result = await response.json();
      console.log("Delivery Created:", result);

      if (response.ok) {
        setTrackingUrl(result.tracking_url);
        Alert.alert("Success", "Delivery created successfully!");
      } else {
        if (result.field_errors) {
          result.field_errors.forEach((error) =>
            console.error(`Field: ${error.field}, Error: ${error.message}`)
          );
        }
        Alert.alert(
          "Error",
          "Failed to create delivery. Check the console for details."
        );
      }
    } catch (error) {
      console.error("Error creating delivery:", error);
      Alert.alert("Error", "Failed to create delivery.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePurchase = async () => {
    if (!product || currentPrice === null) {
      window.alert("Error: Cannot place a bid at this time.");
      return;
    }

    try {
      // Step 2: Create PayPal order
      const orderRequest = {
        ClientId: parsedProduct.ppid,
        ClientSecret: parsedProduct.pPsecret,
        Amount: currentPrice * quantity + tipAmount,
        Currency: "USD", // Adjust currency as needed
        Name: parsedProduct.name,
      };
      console.log("order req", orderRequest);

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
        window.alert("Failed to initiate payment. Please try again.");
        return;
      }

      const { orderId, approvalLink } = await createOrderResponse.json();

      // Step 3: Open PayPal in a separate window
      const paypalWindow = window.open(
        approvalLink,
        "PayPalPayment",
        "width=400,height=800,top=100,left=100,toolbar=no,menubar=no,scrollbars=no,resizable=no"
      );

      // Step 4: Poll for window closure and handle payment completion
      const pollTimer = setInterval(() => {
        if (paypalWindow.closed) {
          clearInterval(pollTimer);

          // Step 5: Capture the order
          capturePayPalOrder(
            orderId,
            parsedProduct.ppid,
            parsedProduct.pPsecret
          );
        }
      }, 500);
    } catch (error) {
      console.error("Error during purchase process:", error);
      window.alert("An unexpected error occurred. Please try again.");
    }
  };

  // Helper function to capture the PayPal order
  const capturePayPalOrder = async (orderId, clientId, clientSecret) => {
    try {
      console.log("Capture Order:", clientId, clientSecret, orderId);
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
        window.alert("Payment captured successfully!");
        console.log("Payment captured successfully!");
        createBid(); // Proceed with bid creation logic here
        router.push("/transactions"); // Redirect to transactions page
      } else {
        const errorData = await captureOrderResponse.json();
        console.error("Failed to capture PayPal order:", errorData);
        window.alert(
          "Payment failed. Please try again. Don't worry, your money was instantly returned!"
        );
      }
    } catch (error) {
      console.error("Error capturing payment:", error);
      window.alert(
        "An unexpected error occurred while capturing payment. Don't worry, your money was instantly returned! Please try again."
      );
    }
  };

  // Helper function to create the bid
  const createBid = async () => {
    const bidData = {
      buyerId,
      amount: quantity,
      auctionID: parsedProduct.id,
      price: currentPrice,
      deliveryStatus: true,
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

      if (response.ok) {
        Alert.alert("Success", "Your bid has been placed successfully!");
        //window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error creating bid:", errorData);
        Alert.alert("Error", "Failed to place bid. Please try again.");
      }
    } catch (error) {
      console.error("Error creating bid:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while placing your bid."
      );
    }
  };

 return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Checkout</Text>

        {/* Product Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: parsedProduct.imgUrl }} style={styles.image} />
        </View>

        {/* Product Details */}
        <Text style={styles.description}>{parsedProduct.name}</Text>
        <Text style={styles.seller}>Sold by: {parsedProduct.sellerName}</Text>
        <Text style={styles.currentBid}>
          Current Price: ${parsedCurrentPrice.toFixed(2)}
        </Text>
        <Text style={styles.quantity}>Quantity: {parsedQuantity}</Text>
        <Text style={styles.totalPrice}>
          Total Price: ${totalPrice.toFixed(2)}
        </Text>

        {/* Delivery Method Selection */}
        <Text style={styles.subtitle}>Choose Delivery Method:</Text>
        <View style={styles.radioContainer}>
          <Pressable
            style={[
              styles.radio,
              deliveryMethod === "pickup" && styles.radioSelected,
            ]}
            onPress={() => setDeliveryMethod("pickup")}
          >
            <MaterialIcons name="store" size={24} color="#2E7D32" />
            <Text style={styles.radioText}>Pickup</Text>
          </Pressable>
          <Pressable
            style={[
              styles.radio,
              deliveryMethod === "delivery" && styles.radioSelected,
            ]}
            onPress={() => setDeliveryMethod("delivery")}
          >
            <MaterialIcons name="local-shipping" size={24} color="#2E7D32" />
            <Text style={styles.radioText}>Delivery</Text>
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
                setDeliveryDetails({
                  ...deliveryDetails,
                  dropoff_business_name: text,
                })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="numeric"
              value={deliveryDetails.dropoff_phone_number}
              onChangeText={(text) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  dropoff_phone_number: text,
                })
              }
            />
            <TextInput
            style={styles.input}
            placeholder="Tip Amount (Optional)"
            keyboardType="numeric"
            value={tipAmount.toString()}
            onChangeText={(text) => setTipAmount(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Instructions (Optional)"
              value={deliveryDetails.dropoff_instructions}
              onChangeText={(text) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  dropoff_instructions: text,
                })
              }
            />
          </View>
        )}

        {/* Purchase Button */}
        <Pressable style={styles.buyButton} onPress={handlePurchase}>
          <Text style={styles.buyButtonText}>Pay Now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    padding: 36,
    flexGrow: 1,
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 15,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    color: "#444",
  },
  seller: {
    fontSize: 16,
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
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  radio: {
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    width: "45%",
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  radioSelected: {
    borderColor: "#2E7D32",
    backgroundColor: "#dff0df",
  },
  radioText: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
  },
  deliveryForm: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  buyButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
