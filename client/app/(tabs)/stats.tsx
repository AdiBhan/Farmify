import React from "react";
import {View, Text, ScrollView, StyleSheet, Dimensions, Platform} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import * as Animatable from "react-native-animatable";
import { commonStyles, settingsStyles, COLORS } from '@/app/stylesPages';
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
      <View style={commonStyles.container}>
        <LinearGradient
            colors={[COLORS.primary + '15', COLORS.white]}
            style={commonStyles.gradient}
        >
          <BlurView intensity={50} style={commonStyles.blurContainer}>
            <Animatable.View
                animation="fadeIn"
                duration={600}
                style={commonStyles.headerContainer}
            >
              <Text style={commonStyles.headerTitle}>Statistics</Text>
              <Text style={commonStyles.subtitle}>Market Performance Overview</Text>
            </Animatable.View>

            <ScrollView
                contentContainerStyle={statisticsStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
              {statisticsData.map((stat, index) => (
                  <Animatable.View
                      key={index}
                      animation="fadeInUp"
                      delay={index * 100}
                      duration={600}
                  >
                    <View style={statisticsStyles.statCard}>
                      <View style={statisticsStyles.statContent}>
                        <View style={statisticsStyles.statInfo}>
                          <Text style={statisticsStyles.statLabel}>{stat.label}</Text>
                          <Text style={statisticsStyles.statValue}>{stat.value}</Text>
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
const statisticsStyles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
});