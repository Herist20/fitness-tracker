import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <Text className="text-3xl font-bold text-gray-900">Dashboard</Text>
          <Text className="text-lg text-gray-600 mt-2">
            Track your fitness progress
          </Text>
        </View>

        <View className="bg-blue-100 rounded-lg p-4 mt-4">
          <Text className="text-lg font-semibold text-blue-900">
            Today's Summary
          </Text>
          <Text className="text-gray-700 mt-2">
            Your fitness data will appear here
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}