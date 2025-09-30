import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const WORKOUT_CATEGORIES = [
  { id: 1, name: 'Upper Body', icon: 'barbell', color: '#8B5CF6', exercises: 8 },
  { id: 2, name: 'Lower Body', icon: 'fitness', color: '#10B981', exercises: 12 },
  { id: 3, name: 'Cardio', icon: 'heart', color: '#EF4444', exercises: 6 },
  { id: 4, name: 'Core', icon: 'body', color: '#F59E0B', exercises: 10 },
];

const RECENT_WORKOUTS = [
  { id: 1, name: 'Push Day', duration: '45 min', calories: 320, date: 'Today' },
  { id: 2, name: 'Leg Day', duration: '60 min', calories: 450, date: 'Yesterday' },
  { id: 3, name: 'HIIT Cardio', duration: '30 min', calories: 280, date: '2 days ago' },
];

export default function WorkoutsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            Workouts 💪
          </Text>
          <Text className="text-lg text-gray-600 dark:text-gray-300 mt-1">
            Time to get stronger!
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between">
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex-1 mr-2 shadow-sm">
              <View className="flex-row items-center">
                <View className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl">
                  <Ionicons name="barbell" size={20} color="#8B5CF6" />
                </View>
                <View className="ml-3">
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white">12</Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">This Week</Text>
                </View>
              </View>
            </View>

            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex-1 ml-2 shadow-sm">
              <View className="flex-row items-center">
                <View className="bg-red-100 dark:bg-red-900/30 p-2 rounded-xl">
                  <Ionicons name="flame" size={20} color="#EF4444" />
                </View>
                <View className="ml-3">
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white">1.2k</Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">Calories</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Start Workout Button */}
        <View className="px-6 mb-6">
          <TouchableOpacity className="bg-purple-500 rounded-2xl p-5 shadow-sm">
            <View className="flex-row items-center justify-center">
              <Ionicons name="play-circle" size={28} color="white" />
              <Text className="text-white text-xl font-bold ml-3">
                Start New Workout
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Workout Categories */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Categories
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {WORKOUT_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-3"
                style={{ width: '48%' }}
              >
                <View className="items-center">
                  <View
                    className="p-3 rounded-2xl mb-3"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={24}
                      color={category.color}
                    />
                  </View>
                  <Text className="font-semibold text-gray-900 dark:text-white mb-1">
                    {category.name}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    {category.exercises} exercises
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Workouts */}
        <View className="px-6 mb-24">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Workouts
          </Text>

          <View className="space-y-3">
            {RECENT_WORKOUTS.map((workout) => (
              <View
                key={workout.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                      {workout.name}
                    </Text>
                    <View className="flex-row items-center">
                      <View className="flex-row items-center mr-4">
                        <Ionicons name="time" size={16} color="#6B7280" />
                        <Text className="text-gray-500 dark:text-gray-400 ml-1 text-sm">
                          {workout.duration}
                        </Text>
                      </View>
                      <View className="flex-row items-center mr-4">
                        <Ionicons name="flame" size={16} color="#EF4444" />
                        <Text className="text-gray-500 dark:text-gray-400 ml-1 text-sm">
                          {workout.calories} cal
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">
                      {workout.date}
                    </Text>
                    <TouchableOpacity className="mt-2">
                      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}