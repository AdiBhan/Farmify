import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { View, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

const COLORS = {
    primary: '#2E7D32',
    primaryLight: '#4CAF50',
    background: '#FFFFFF',
    inactive: '#94A3B8',
    white: '#FFFFFF',
};

export default function TabsLayout() {
    const tabBarIcon = (Icon: any, name: string) => {
        return ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                <Icon name={name} size={size - 2} color={focused ? COLORS.white : COLORS.inactive} />
            </View>
        );
    };

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.inactive,
                tabBarStyle: styles.tabBar,
                tabBarBackground: () => (
                    <BlurView intensity={80} style={StyleSheet.absoluteFill}>
                        <LinearGradient
                            colors={[COLORS.white, 'rgba(255,255,255,0.8)']}
                            style={StyleSheet.absoluteFill}
                        />
                    </BlurView>
                ),
                tabBarItemStyle: styles.tabBarItem,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarShowLabel: true,
            }}
        >
            <Tabs.Screen
                name="settings/index"
                options={{
                    title: 'Settings',
                    tabBarIcon: tabBarIcon(Ionicons, 'settings-outline'),
                }}
            />
            <Tabs.Screen
                name="auction"
                options={{
                    title: 'Auction',
                    tabBarIcon: tabBarIcon(Ionicons, 'hammer-outline'),
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
                    tabBarIcon: tabBarIcon(Ionicons, 'stats-chart'),
                }}
            />
            <Tabs.Screen
                name="details"
                options={{
                    title: "Details",
                    tabBarIcon: tabBarIcon(MaterialIcons, 'production-quantity-limits'),
                }}
            />
            <Tabs.Screen
                name="newlisting"
                options={{
                    title: 'Create',
                    tabBarIcon: tabBarIcon(MaterialIcons, 'create'),
                }}
            />

            {/* Hidden tabs - keep as is */}
            <Tabs.Screen name="transactions" options={{ href: null }} />
            <Tabs.Screen name="buyerSettings/updateContact" options={{ href: null }} />
            <Tabs.Screen name="buyerSettings/updateAccountInfo" options={{ href: null }} />
            <Tabs.Screen name="buyerSettings/updatePaymentInfo" options={{ href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 24 : 16,
        left: 16,
        right: 16,
        height: 64,
        borderRadius: 32,
        borderTopWidth: 0,
        backgroundColor: 'transparent',
        elevation: 0,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    tabBarItem: {
        height: 64,
        padding: 8,
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    activeIconContainer: {
        backgroundColor: COLORS.primary,
        transform: [{ scale: 1.1 }],
        ...Platform.select({
            ios: {
                shadowColor: COLORS.primary,
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
            },
            android: {
                elevation: 8,
            },
        }),
    },
});