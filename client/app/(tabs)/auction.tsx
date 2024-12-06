import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import useUser from "@/stores/userStore";
import * as Animatable from "react-native-animatable";
import { BlurView } from "expo-blur";
import styles, { COLORS } from "../stylesAuction";

import { useCallback } from "react";
// Helper icons
import SettingsIcon from "@/assets/images/settings_icon.webp";
import UploadIcon from "@/assets/images/upload_photo.webp";
import { IconButton } from "react-native-paper";

// Helper function to calculate time left for an auction
const calculateTimeLeft = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = Math.floor((end - now) / 1000);

  if (diff <= 0) {
    return "Auction Ended"; // auction is over
  }

  // Time units in seconds
  const timeUnits = [
    { unit: "day", v: 86400 },
    { unit: "hour", v: 3600 },
    { unit: "minute", v: 60 },
    { unit: "second", v: 1 },
  ];

  // Find the largest time unit that fits
  for (const { unit, v } of timeUnits) {
    const amount = Math.floor(diff / v);
    if (amount > 0) {
      const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
      return "Auction ends " + formatter.format(amount, unit); // Positive for future
    }
  }
};

// Helper function to calculate the current price of an auction item
const calculateCurrentPrice = (startPrice, endPrice, startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now >= end) return null; // Auction has ended
  if (now <= start) return null; // Auction hasn't started

  const totalDuration = end - start;
  const elapsed = now - start;
  const progress = elapsed / totalDuration;

  return startPrice + (endPrice - startPrice) * progress; // Always returns a number
};

// Main Auction component
const Auction = () => {
  const [auctionItems, setAuctionItems] = useState([]); // Auction items state
  const [isRefreshing, setIsRefreshing] = useState(false); // Pull-to-refresh state
  const router = useRouter();
  const { username, isLoggedIn, buyerId, sellerId, profile_image_url } = useUser();

  // Fetch auction items when the page is focused
  useFocusEffect(
    useCallback(() => {
      const fetchAuctionItemsOnFocus = async () => {
        try {
          const response = await fetch("http://localhost:4000/api/products");
          const data = await response.json();

          const formattedData = data.map((item) => ({
            id: item.id,
            name: item.name,
            image: { uri: item.imgUrl },
            currentBid: calculateCurrentPrice(
              item.startPrice,
              item.endPrice,
              item.startTime,
              item.endTime
            ),
            timeLeft: calculateTimeLeft(item.endTime),
            totalBids: 0,
            seller: item.sellerName,
            description: item.description,
            startTime: item.startTime,
            endTime: item.endTime,
            quantity: item.quantity || 1,
          }));

          // Sort items by start time (newest first)
          const sortedData = formattedData.sort(
            (a, b) => new Date(b.startTime) - new Date(a.startTime)
          );

          setAuctionItems(sortedData);
        } catch (error) {
          console.error("Error fetching auction items:", error);
        }
      };

      fetchAuctionItemsOnFocus();
    }, [])
  );

  // Handle item press to navigate to details page
  const handleItemPress = (item: any) => {
    if (!item?.id) {
      console.error('Invalid item ID');
      return;
    }

    router.push({
      pathname: "/(tabs)/details",
      params: { product: item.id }
    });
  };

  // Redirect to login if user is not logged in
  if (!isLoggedIn) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingSpinner} />
        <Text style={styles.loadingText}>Redirecting...</Text>
      </View>
    );
  }

  // Render auction items
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.white, COLORS.background]}
        style={styles.gradient}
      >
        <BlurView intensity={50} style={styles.blurContainer}>
          <Header
            username={username}
            profile_image_url={profile_image_url}

          />
          <ScrollView
            style={styles.auctionContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}

          >
            {auctionItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleItemPress(item)}
                style={({ pressed }) => [
                  styles.pressable,
                  { transform: [{ scale: pressed ? 0.98 : 1 }] }
                ]}
              >
                <AuctionItem item={item} onBid={handleItemPress} />
              </Pressable>
            ))}
          </ScrollView>
        </BlurView>
      </LinearGradient>
    </View>
  );
};

// Header component
const Header = ({ username, profile_image_url }) => {
  useEffect(() => {
    console.log("Profile image URL in Header:", profile_image_url);
  }, [profile_image_url]);

  return (

    <Animatable.View animation="fadeIn" duration={600}>
      <LinearGradient
        colors={[COLORS.primary + '15', COLORS.white]}
        style={styles.headerContainer}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerWrapper}>
            {/* Top Section */}
            <View style={styles.headerTopSection}>


              <View style={styles.titleContainer}>
                <Text style={styles.titleMain}>Farmify🌽</Text>
                <Text style={styles.titleSub}>Market</Text>
              </View>



            </View>

            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <View style={styles.welcomeInfo}>
                <Text style={styles.welcomeLabel}>Welcome back,</Text>
                <View style={styles.nameContainer}>
                  <Text style={styles.welcomeName}>{username}</Text>
                  <Image
                    source={{ uri: profile_image_url || 'https://via.placeholder.com/100' }}
                    style={styles.profileImage}
                  />
                </View>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>24</Text>
                  <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={[styles.statBox, styles.statBoxBorder]}>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Bids</Text>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </Animatable.View>
  );
};

// AuctionItem component for displaying individual items
const AuctionItem = ({ item, onBid }) => {
  const isExpired = item.currentBid === null && new Date(item.endTime) < new Date();
  const isNotStarted = item.currentBid === null && new Date(item.startTime) > new Date();

  return (
    <Animatable.View animation="fadeInUp" duration={600} delay={200}>
      <LinearGradient
        colors={[COLORS.white, COLORS.background + '10']}
        style={styles.itemCard}
      >
        <View style={styles.itemHeader}>
          <Image
            source={item.image}
            style={styles.itemImage}
            defaultSource='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s'
          />
          <View style={styles.itemContent}>
            <View style={styles.itemTopRow}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <StatusBadge status={isExpired ? 'expired' : isNotStarted ? 'upcoming' : 'active'} />
            </View>
            <Text style={styles.itemSeller}>by {item.seller}</Text>
            <Text style={styles.itemQuantity}>
              {item.quantity} {item.quantity > 1 ? 'items' : 'item'} available
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.bidInfo}>
          <PriceInfo
            currentBid={item.currentBid}
            timeLeft={item.timeLeft}
            isExpired={isExpired}
            isNotStarted={isNotStarted}
          />
          <BidButton
            onPress={() => onBid(item)}
            isExpired={isExpired}
            isNotStarted={isNotStarted}
          />
        </View>
      </LinearGradient>
    </Animatable.View>
  );
};

const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'expired':
        return styles.statusExpired;
      case 'upcoming':
        return styles.statusUpcoming;
      default:
        return styles.statusActive;
    }
  };

  return (
    <View style={[styles.statusBadge, getStatusStyle()]}>
      <Text style={styles.statusText}>
        {status === 'expired' ? 'Ended' : status === 'upcoming' ? 'Coming Soon' : 'Active'}
      </Text>
    </View>
  );
};

const PriceInfo = ({ currentBid, timeLeft, isExpired, isNotStarted }) => (
  <View style={styles.priceContainer}>
    <Text style={styles.priceLabel}>
      {isExpired ? 'Final Price' : isNotStarted ? 'Starting Price' : 'Current Bid'}
    </Text>
    <Text style={styles.priceAmount}>
      ${currentBid ? currentBid.toFixed(2) : '0.00'}
    </Text>
    <Text style={styles.timeInfo}>
      {timeLeft}
    </Text>
  </View>
);

const BidButton = ({ onPress, isExpired, isNotStarted }) => (
  <TouchableOpacity
    style={[
      styles.bidButton,
      isExpired && styles.bidButtonExpired,
      isNotStarted && styles.bidButtonUpcoming
    ]}
    onPress={onPress}
    disabled={isExpired}
  >
    <Text style={styles.bidButtonText}>
      {isExpired ? 'Auction Ended' : isNotStarted ? 'Notify Me' : 'Place Bid'}
    </Text>
  </TouchableOpacity>
);

export default Auction;