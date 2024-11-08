import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import styles, { COLORS } from "../stylesAuction";

// Mock data for sitewide statistics
const statisticsData = [
  { label: "Total Sales", value: "$124,000" },
  { label: "Total Products Sold", value: "5,200" },
  { label: "Average Sale Price", value: "$23.85" },
  { label: "Top-Selling Category", value: "Organic Vegetables" },
  { label: "Most Active Seller", value: "Green Acres" },
  { label: "Top-Rated Product", value: "Farm Fresh Eggs" },
  { label: "Highest Single Sale", value: "$2,300" },
];


export default function SitewideStatistics() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.light, COLORS.white]} style={styles.gradient}>
        <BlurView intensity={80} style={styles.blurContainer}>
          <Text style={styles.header}>Sitewide Sales Statistics</Text>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {statisticsData.map((stat, index) => (
              <View key={index} style={statisticsStyles.statItem}>
                <Text style={statisticsStyles.statLabel}>{stat.label}</Text>
                <Text style={statisticsStyles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </ScrollView>
        </BlurView>
      </LinearGradient>
    </View>
  );
}

const statisticsStyles = StyleSheet.create({
  statItem: {
    ...styles.itemCard,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  statLabel: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  statValue: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "700",
  },
});
