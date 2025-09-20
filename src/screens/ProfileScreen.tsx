import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <Text className="text-3xl font-bold text-gray-900">Profile</Text>
          <Text className="text-lg text-gray-600 mt-2">
            Your fitness journey
          </Text>
        </View>

        <View className="bg-gray-100 rounded-full w-32 h-32 self-center mt-4 items-center justify-center">
          <Ionicons name="person" size={60} color="#6B7280" />
        </View>

        <View className="mt-8 space-y-4">
          <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 rounded-lg p-4">
            <Ionicons name="person-outline" size={24} color="#6B7280" />
            <Text className="text-lg text-gray-800 ml-3">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 rounded-lg p-4">
            <Ionicons name="settings-outline" size={24} color="#6B7280" />
            <Text className="text-lg text-gray-800 ml-3">Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 rounded-lg p-4">
            <Ionicons name="stats-chart-outline" size={24} color="#6B7280" />
            <Text className="text-lg text-gray-800 ml-3">Statistics</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 rounded-lg p-4">
            <Ionicons name="help-circle-outline" size={24} color="#6B7280" />
            <Text className="text-lg text-gray-800 ml-3">Help & Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}