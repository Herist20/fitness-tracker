import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HabitsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <Text className="text-3xl font-bold text-gray-900">Habits</Text>
          <Text className="text-lg text-gray-600 mt-2">
            Build healthy routines
          </Text>
        </View>

        <TouchableOpacity className="bg-green-500 rounded-lg p-4 mt-4">
          <Text className="text-white text-center text-lg font-semibold">
            Add New Habit
          </Text>
        </TouchableOpacity>

        <View className="mt-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Your Habits
          </Text>
          <View className="bg-gray-100 rounded-lg p-4">
            <Text className="text-gray-600">
              No habits yet. Start by adding your first habit!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}