import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back! 👋
          </Text>
          <Text className="text-lg text-gray-600 dark:text-gray-300 mt-1">
            Ready for today's workout?
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between">
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex-1 mr-2 shadow-sm">
              <View className="flex-row items-center">
                <View className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
                  <Ionicons name="flame" size={20} color="#3B82F6" />
                </View>
                <View className="ml-3">
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white">127</Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">Calories</Text>
                </View>
              </View>
            </View>

            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex-1 ml-2 shadow-sm">
              <View className="flex-row items-center">
                <View className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl">
                  <Ionicons name="time" size={20} color="#10B981" />
                </View>
                <View className="ml-3">
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white">45</Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">Minutes</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Today's Summary Card */}
        <View className="mx-6 mb-6">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Today's Progress
              </Text>
              <Ionicons name="analytics" size={24} color="#3B82F6" />
            </View>

            <View className="space-y-4">
              <View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600 dark:text-gray-300">Daily Goal</Text>
                  <Text className="text-gray-900 dark:text-white font-semibold">65%</Text>
                </View>
                <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <View className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }} />
                </View>
              </View>

              <View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600 dark:text-gray-300">Water Intake</Text>
                  <Text className="text-gray-900 dark:text-white font-semibold">6/8 cups</Text>
                </View>
                <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <View className="bg-cyan-500 h-2 rounded-full" style={{ width: '75%' }} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activities */}
        <View className="mx-6 mb-24">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Activities
          </Text>

          <View className="space-y-3">
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-center">
                <View className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                  <Ionicons name="barbell" size={20} color="#8B5CF6" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="font-semibold text-gray-900 dark:text-white">
                    Upper Body Workout
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    45 minutes • 2 hours ago
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </View>
            </View>

            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-center">
                <View className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="font-semibold text-gray-900 dark:text-white">
                    Morning Meditation
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    10 minutes • This morning
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}