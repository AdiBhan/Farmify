import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import useUser from "@/stores/userStore";

export default function TabsLayout() {
    const { username, accountType } = useUser();
    console.log('Account Type:', accountType);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: { borderTopWidth: 1, borderTopColor: '#e2e2e2' },
            }}
        >
            <Tabs.Screen
                name="settings/index"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="auction"
                options={{
                    title: 'Auction',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="hammer-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart" size={size} color={color} />
                    ),
                }}
            />


            {/* Dynamically include "newlisting" or "transactions" */}
            <Tabs.Screen
                name="newlisting"
                options={{
                    title: 'Create Auction',
                    href: accountType === 'Seller' || accountType === '' ? undefined : null, // Only include for Sellers
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="create" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: 'Transactions',
                    href: accountType !== 'Seller' || accountType === undefined ? undefined : null, // Only include for non-Sellers
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cash-outline" size={size} color={color} />
                    ),
                }}
            />

            {/* Hidden tabs from navigation bar */}
            <Tabs.Screen
                name="buyerSettings/updateContact"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="details"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="buyerSettings/updateAccountInfo"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="buyerSettings/updatePaymentInfo"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
