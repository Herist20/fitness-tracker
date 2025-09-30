import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const MOCK_HABITS = [
  { id: 1, name: 'Drink 8 glasses of water', completed: 6, total: 8, streak: 5, color: '#06B6D4' },
  { id: 2, name: 'Morning workout', completed: 1, total: 1, streak: 12, color: '#8B5CF6' },
  { id: 3, name: 'Read for 30 minutes', completed: 0, total: 1, streak: 3, color: '#10B981' },
  { id: 4, name: 'Meditate', completed: 1, total: 1, streak: 8, color: '#F59E0B' },
];

export default function HabitsScreen() {
  const [habits, setHabits] = useState(MOCK_HABITS);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit =>
      habit.id === id
        ? { ...habit, completed: habit.completed === habit.total ? 0 : habit.total }
        : habit
    ));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            Daily Habits 🎯
          </Text>
          <Text className="text-lg text-gray-600 dark:text-gray-300 mt-1">
            Build consistency, one day at a time
          </Text>
        </View>

        {/* Progress Overview */}
        <View className="px-6 mb-6">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Today's Progress
              </Text>
              <View className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                <Text className="text-green-700 dark:text-green-300 font-semibold text-sm">
                  75% Complete
                </Text>
              </View>
            </View>

            <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <View className="bg-green-500 h-3 rounded-full" style={{ width: '75%' }} />
            </View>
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              3 of 4 habits completed today
            </Text>
          </View>
        </View>

        {/* Add New Habit Button */}
        <View className="px-6 mb-6">
          <TouchableOpacity className="bg-blue-500 rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center justify-center">
              <Ionicons name="add-circle" size={24} color="white" />
              <Text className="text-white text-lg font-semibold ml-2">
                Add New Habit
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Habits List */}
        <View className="px-6 mb-24">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Your Habits
          </Text>

          <View className="space-y-3">
            {habits.map((habit) => (
              <TouchableOpacity
                key={habit.id}
                onPress={() => toggleHabit(habit.id)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <View
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: habit.color }}
                      />
                      <Text className="font-semibold text-gray-900 dark:text-white flex-1">
                        {habit.name}
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons name="flame" size={16} color="#F59E0B" />
                        <Text className="text-orange-500 font-semibold ml-1">
                          {habit.streak}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 mr-4">
                        <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <View
                            className="h-2 rounded-full"
                            style={{
                              backgroundColor: habit.color,
                              width: `${(habit.completed / habit.total) * 100}%`
                            }}
                          />
                        </View>
                      </View>
                      <Text className="text-gray-500 dark:text-gray-400 text-sm">
                        {habit.completed}/{habit.total}
                      </Text>
                    </View>
                  </View>

                  <View className="ml-4">
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center ${
                        habit.completed === habit.total
                          ? 'bg-green-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      {habit.completed === habit.total && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}