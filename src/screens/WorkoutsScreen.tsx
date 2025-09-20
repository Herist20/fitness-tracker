import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <Text className="text-3xl font-bold text-gray-900">Workouts</Text>
          <Text className="text-lg text-gray-600 mt-2">
            Log and track your exercises
          </Text>
        </View>

        <TouchableOpacity className="bg-purple-500 rounded-lg p-4 mt-4">
          <Text className="text-white text-center text-lg font-semibold">
            Start New Workout
          </Text>
        </TouchableOpacity>

        <View className="mt-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Recent Workouts
          </Text>
          <View className="bg-gray-100 rounded-lg p-4">
            <Text className="text-gray-600">
              No workouts logged yet. Start your first workout!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}