import { Tabs } from 'expo-router';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import React from 'react';

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { borderTopWidth: 1, borderTopColor: '#e2e2e2' },
        }}>
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
            <Tabs.Screen
                name="details"
                options={{
                    title: "Product Details",
                    tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="production-quantity-limits" size={size} color={color}/>
                    ),
            }}
        />
            <Tabs.Screen
                name="newlisting"
                options={{
                    title: 'Create Auction',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="create" size={size} color={color} />
                    ),
                }}
            />
       

            {/* Hidden tabs from navigation bar*/}
            <Tabs.Screen
                name="transactions"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="buyerSettings/updateContact"
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
};