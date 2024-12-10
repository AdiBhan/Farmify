import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import detailStyles from "../stylesDetails";
import * as Animatable from "react-native-animatable";
import { commonStyles, COLORS } from "@/app/stylesPages";
import { useFocusEffect } from "expo-router"; // For navigation

export default function SitewideStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true; // To prevent state updates if the component is unmounted

      const fetchStatistics = async () => {
        try {
          if (isActive && loading) {
            setLoading(true); // Show loading indicator only during the initial fetch
          }
          const response = await fetch("http://localhost:4000/api/stats"); // Replace with your backend API URL
          if (!response.ok) {
            throw new Error(`Error fetching statistics: ${response.status}`);
          }
          const data = await response.json();
          console.log('data', data);
          if (isActive) {
            setStatistics(data);
          }
        } catch (err) {
          console.error("Error fetching statistics:", err);
          if (isActive) {
            setError("Failed to load statistics.");
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      // Initial fetch when the screen is focused
      fetchStatistics();

      // Set up interval for periodic updates (e.g., every 30 seconds)
      const intervalId = setInterval(() => {
        fetchStatistics();
      }, 30000); // 30000 milliseconds = 30 seconds

      // Cleanup function to clear the interval when the screen is unfocused
      return () => {
        isActive = false;
        clearInterval(intervalId);
      };
    }, [loading])
  );


  if (loading) {
    return (
      <View style={commonStyles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={commonStyles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const statisticsData = [
    { label: "Total Bids", value: statistics.totalBids ?? "N/A" },
    {
      label: "Average Sale Price",
      value: `$${(statistics.averageSalePrice ?? 0).toFixed(2)}`,
    },
    {
      label: "Average Rating",
      value: `${(statistics.averageRating ?? 0).toFixed(1)} ⭐`,
    },
    {
      label: "Most Active Seller",
      value: statistics.mostActiveSeller?.sellerName ?? "N/A",
    },
    { label: "Total Listings", value: statistics.totalListings ?? "N/A" },
    { label: "Active Listings", value: statistics.activeListings ?? "N/A" },
    {
      label: "Highest Sale Price",
      value: `$${(statistics.highestSalePrice ?? 0).toFixed(2)}`,
    },
    {
      label: "Total Revenue",
      value: `$${(statistics.totalRevenue ?? 0).toFixed(2)}`,
    },
    {
      label: "Highest Rated Seller",
      value: statistics.highestRatedSeller
        ? `${statistics.highestRatedSeller.sellerName
        } (${statistics.highestRatedSeller.sellerRating.toFixed(2)})`
        : "N/A",
    },
    {
      label: "Listings Without Bids",
      value: statistics.listingsWithoutBids ?? "N/A",
    },
    {
      label: "Average Bids Per Listing",
      value: (statistics.averageBidsPerListing ?? 0).toFixed(2),
    },
    {
      label: "Most Expensive Active Listing",
      value: statistics.mostExpensiveActiveListing
        ? `${statistics.mostExpensiveActiveListing.name
        } ($${statistics.mostExpensiveActiveListing.startPrice.toFixed(2)})`
        : "N/A",
    },
    {
      label: "Most Frequent Bid Hour",
      value: `${statistics.mostFrequentBidHour ?? "N/A"}:00`,
    },
    {
      label: "Top-Selling Product",
      value: statistics.topSellingProduct
        ? `Product ID ${statistics.topSellingProduct.productID} (${statistics.topSellingProduct.totalSold} sold)`
        : "N/A",
    },
  ];

  return (
    <View style={commonStyles.container}>
      <LinearGradient
        colors={[COLORS.primary + "15", COLORS.white]}
        style={commonStyles.gradient}
      >
        <BlurView intensity={50} style={commonStyles.blurContainer}>
          <Animatable.View
            animation="fadeIn"
            duration={600}
            style={commonStyles.headerContainer}
          >
            <View style={detailStyles.headerWrapper}>
              {/* Top Section */}
              <View style={detailStyles.headerTopSection}>
                <View style={detailStyles.titleContainer}>
                  <Text style={detailStyles.titleMain}>Farmify🌽</Text>
                  <Text style={detailStyles.titleSub}>Market</Text>
                </View>
              </View>
            </View>
            <Text style={commonStyles.headerTitle}>Market Statistics</Text>
            <Text style={commonStyles.subtitle}>
              Comprehensive Performance Insights
            </Text>
            <View style={styles.divider} />
          </Animatable.View>

          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: 120 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {statisticsData.map((stat, index) => (
              <Animatable.View
                key={index}
                animation="fadeInUp"
                delay={index * 100}
                duration={600}
              >
                <View style={styles.statCard}>
                  <View style={styles.statContent}>
                    <View style={styles.statInfo}>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                      <Text style={styles.statValue}>{stat.value}</Text>
                    </View>
                  </View>
                </View>
              </Animatable.View>
            ))}
          </ScrollView>
        </BlurView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingTop: 10,
  },
  statCard: {
    borderRadius: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statContent: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: "center",
    marginTop: 20,
  },
  divider: {
    marginTop: 12,
    marginBottom: 24,
    height: 1,
    backgroundColor: "#E0E0E0",
    opacity: 0.6,
    alignSelf: "stretch", // Full width
  },
});
