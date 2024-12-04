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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Checkout() {
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
  const [sellerAddress, setSellerAddress] = useState(""); // Store seller's address

  const buyerID = "323e4567-e89b-12d3-a456-426614174002"; // Replace with actual buyer ID
  const { product: productId } = useLocalSearchParams(); // Retrieve product ID from search parameters

  useEffect(() => {
    // Fetch product details to include seller's address
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/products/${parsedProduct.id}`
        );
    
        if (!response.ok) {
          throw new Error(`Failed to fetch product details: ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log("API Response:", data); // Debugging line
        console.log("Seller Address:", data.SellerAddress); // Debug seller address
        setSellerAddress(data.SellerAddress || "Address not available"); // Handle empty address
      } catch (error) {
        console.error("Error fetching product details:", error);
        Alert.alert("Error", "Failed to load product details. Please try again.");
      }
    };    

    fetchProductDetails();
  }, [parsedProduct.id]);

  const handleGenerateDelivery = async () => {
    if (deliveryMethod !== "delivery") {
      Alert.alert("Error", "Delivery is not selected.");
      return;
    }
    const deliveryRequest = {
      externalDeliveryId: `D-${Date.now()}`, // Unique ID for each delivery
      pickupAddress: "1079 Commonwealth Ave, Boston, MA 02215",
      pickupBusinessName: "Your Business Name", 
      pickupPhoneNumber: "+16505555555", // Example phone number
      pickupInstructions: "Enter gate code 1234 on the callbox.",
      pickupReferenceTag: `Order number ${Date.now()}`,
      dropoffAddress: deliveryDetails.dropoff_address.trim() || "3 ashford ct, Allston, MA 02134",
      dropoffBusinessName: deliveryDetails.dropoff_business_name.trim() || "Test",
      dropoffPhoneNumber: deliveryDetails.dropoff_phone_number.trim() || "+15628443147",
      dropoffInstructions: deliveryDetails.dropoff_instructions.trim() || "Leave at door",
    };

    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:4000/api/deliveries/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deliveryRequest),
      });
  
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
        Alert.alert("Error", "Failed to create delivery. Check the console for details.");
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
      Alert.alert("Error", "Cannot place a bid at this time.");
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

      {/* Display Seller's Address for Pickup */}
      {deliveryMethod === "pickup" && (
        <View style={styles.pickupInfo}>
          <Text style={styles.pickupTitle}>Pickup Location:</Text>
          <Text style={styles.pickupDetails}>{sellerAddress}</Text>
        </View>
      )}

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
        onPress={async () => {
          setIsSubmitting(true);
          try {
            await handlePurchase(); // Call PayPal payment first
            await handleGenerateDelivery(); // then Call generate delivery   
          } catch (error) {
            console.error("Error during payment or delivery:", error);
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
          } finally {
            setIsSubmitting(false); // Reset the loading state
          }
        }}
        disabled={isSubmitting}
      >
        <Text style={styles.buyButtonText}>
          {isSubmitting ? "Processing..." : "Pay Now"}
        </Text>
      </Pressable>

      {trackingUrl && (
      <Pressable
      style={styles.buyButton}
        onPress={() => router.push({ pathname: "/tracking", params: { trackingUrl } })}
      >
        <Text style={styles.buyButtonText}>Track Delivery</Text>
      </Pressable>
    )}


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
