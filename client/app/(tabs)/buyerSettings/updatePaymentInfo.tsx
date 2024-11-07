import React, { useEffect, useState } from "react";
import { Text, TextInput, View, Pressable, FlatList, Alert, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import useUser from "@/stores/userStore";

export default function UpdatePaymentInfo() {
  const router = useRouter();
  const { getCreditCards, addCreditCard, updateCreditCard, deleteCreditCard } = useUser();

  const [creditCards, setCreditCards] = useState([]);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedCard, setSelectedCard] = useState(null); // Card currently being edited
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        setIsLoading(true);
        const cards = await getCreditCards();
        setCreditCards(cards);
      } catch (err) {
        console.error("Failed to fetch credit cards:", err);
        setError("Failed to load payment information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreditCards();
  }, []);

  const handleAddOrUpdateCard = async () => {
    if (!validateForm()) return;

    setError("");
    setIsLoading(true);

    try {
      if (selectedCard) {
        // Update existing card
        await updateCreditCard(selectedCard.id, { cardNumber, expiryDate, cvv });
        Alert.alert("Success", "Credit card updated successfully.");
      } else {
        // Add new card
        await addCreditCard({ cardNumber, expiryDate, cvv });
        Alert.alert("Success", "Credit card added successfully.");
      }

      // Refresh the card list after adding/updating
      const updatedCards = await getCreditCards();
      setCreditCards(updatedCards);
      resetForm();
    } catch (err) {
      console.error("Failed to add/update credit card:", err);
      setError("Failed to add/update credit card.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      setIsLoading(true);
      await deleteCreditCard(cardId);
      Alert.alert("Success", "Credit card deleted successfully.");
      setCreditCards(creditCards.filter(card => card.id !== cardId));
    } catch (err) {
      console.error("Failed to delete credit card:", err);
      setError("Failed to delete credit card.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      setError("Please fill in all fields.");
      return false;
    }
    if (cardNumber.length !== 16) {
      setError("Card number must be 16 digits.");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError("Expiry date must be in MM/YY format.");
      return false;
    }
    if (cvv.length !== 3) {
      setError("CVV must be 3 digits.");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setSelectedCard(null);
  };

  const handleEditCard = (card) => {
    setSelectedCard(card);
    setCardNumber(card.cardNumber);
    setExpiryDate(card.expiryDate);
    setCvv(card.cvv);
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={["#f0f7f0", "#ffffff"]} style={styles.gradient}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Manage Payment Information</Text>
            <Text style={styles.subheader}>Add, edit, or delete your credit cards</Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={setCardNumber}
              style={styles.input}
              placeholder="Card Number (16 digits)"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              value={cardNumber}
              maxLength={16}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setExpiryDate}
              style={styles.input}
              placeholder="Expiry Date (MM/YY)"
              placeholderTextColor="#666"
              value={expiryDate}
              maxLength={5}
              editable={!isLoading}
            />
            <TextInput
              onChangeText={setCvv}
              style={styles.input}
              placeholder="CVV (3 digits)"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              value={cvv}
              maxLength={3}
              editable={!isLoading}
            />

            <Pressable
              onPress={handleAddOrUpdateCard}
              style={[styles.button, styles.primaryButton, isLoading && styles.buttonDisabled]}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {selectedCard ? (isLoading ? "Updating..." : "Update Card") : (isLoading ? "Adding..." : "Add Card")}
              </Text>
            </Pressable>
          </View>

          <FlatList
            data={creditCards}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cardContainer}>
                <Text style={styles.cardText}>**** **** **** {item.cardNumber.slice(-4)}</Text>
                <Text style={styles.cardText}>Expires: {item.expiryDate}</Text>
                <View style={styles.cardActions}>
                  <Pressable onPress={() => handleEditCard(item)}>
                    <Text style={styles.editText}>Edit</Text>
                  </Pressable>
                  <Pressable onPress={() => handleDeleteCard(item.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        </View>
      </LinearGradient>
    </ThemedView>
  );
}

// Styles for UpdatePaymentInfo Component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  gradient: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  headerContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  subheader: {
    fontSize: 16,
    color: "#808080",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: "#000000",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  buttonDisabled: {
    backgroundColor: "#808080",
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 5,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editText: {
    color: "#007AFF",
    fontSize: 16,
  },
  deleteText: {
    color: "red",
    fontSize: 16,
  },
});
