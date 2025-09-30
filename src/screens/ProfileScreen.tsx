import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const STATS = [
  { label: 'Workouts', value: '47', icon: 'barbell' as const, color: '#8B5CF6' },
  { label: 'Habits', value: '12', icon: 'checkmark-circle' as const, color: '#10B981' },
  { label: 'Streak', value: '15', icon: 'flame' as const, color: '#F59E0B' },
];

const MENU_ITEMS = [
  { id: 1, title: 'Edit Profile', icon: 'person-outline', color: '#3B82F6' },
  { id: 2, title: 'Notifications', icon: 'notifications-outline', color: '#8B5CF6' },
  { id: 3, title: 'Privacy', icon: 'shield-outline', color: '#10B981' },
  { id: 4, title: 'Statistics', icon: 'stats-chart-outline', color: '#F59E0B' },
  { id: 5, title: 'Dark Mode', icon: 'moon-outline', color: '#6B7280' },
  { id: 6, title: 'Help & Support', icon: 'help-circle-outline', color: '#EF4444' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile 👤
          </Text>
          <Text className="text-lg text-gray-600 dark:text-gray-300 mt-1">
            Your fitness journey
          </Text>
        </View>

        {/* Profile Card */}
        <View className="mx-6 mb-6">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <View className="items-center">
              <View className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-24 h-24 items-center justify-center mb-4">
                <Text className="text-white text-2xl font-bold">JD</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                John Doe
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 mb-4">
                john.doe@example.com
              </Text>
              <TouchableOpacity className="bg-blue-500 px-6 py-2 rounded-full">
                <Text className="text-white font-semibold">Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Your Stats
          </Text>
          <View className="flex-row justify-between">
            {STATS.map((stat, index) => (
              <View
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex-1 mx-1 shadow-sm"
              >
                <View className="items-center">
                  <View
                    className="p-3 rounded-xl mb-2"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Ionicons name={stat.icon} size={24} color={stat.color} />
                  </View>
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    {stat.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Achievement Badge */}
        <View className="mx-6 mb-6">
          <View className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center">
              <View className="bg-white/20 p-3 rounded-xl">
                <Ionicons name="trophy" size={24} color="white" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white font-bold text-lg">
                  15-Day Streak! 🔥
                </Text>
                <Text className="text-white/80">
                  Keep up the great work!
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6 mb-24">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Settings
          </Text>

          <View className="space-y-2">
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View
                      className="p-2 rounded-xl mr-4"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <Ionicons name={item.icon as any} size={20} color={item.color} />
                    </View>
                    <Text className="text-lg font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}