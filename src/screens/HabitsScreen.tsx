import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  RefreshControl,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useHabitStore } from '../store/habitStore';
import AddHabitModal from '../components/AddHabitModal';
import HabitCard from '../components/HabitCard';
import type { HabitsStackParamList } from '../navigation/HabitsStackNavigator';

const CATEGORIES = ['All', 'Health', 'Fitness', 'Mindfulness', 'Productivity'];

type NavigationProp = NativeStackNavigationProp<HabitsStackParamList, 'HabitsList'>;

export default function HabitsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    habits,
    isLoading,
    selectedCategory,
    searchQuery,
    initDatabase,
    loadHabits,
    completeHabit,
    uncompleteHabit,
    deleteHabit,
    setSelectedCategory,
    setSearchQuery,
    exportData,
  } = useHabitStore();

  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initDatabase();
    };
    init();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  const handleComplete = async (habitId: number, todayCount: number, targetCount: number) => {
    if (todayCount >= targetCount) {
      await uncompleteHabit(habitId);
    } else {
      await completeHabit(habitId);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportData();
      await Share.share({
        message: `Fitness Tracker - Habit Data Export\n\n${data}`,
        title: 'Export Habit Data',
      });
    } catch (error) {
      Alert.alert('Export Failed', 'Could not export data. Please try again.');
    }
  };

  // Filter habits
  const filteredHabits = habits.filter((habit) => {
    const matchesCategory =
      !selectedCategory || selectedCategory === 'All' || habit.category === selectedCategory;
    const matchesSearch =
      !searchQuery || habit.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate today's stats
  const todayCompleted = habits.filter((h) => h.todayCount >= h.targetCount).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((todayCompleted / totalHabits) * 100) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>
              My Habits
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
              {todayCompleted} of {totalHabits} completed today ({completionRate}%)
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={handleExport}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons name="share-outline" size={24} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowAddModal(true)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#3B82F6',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search habits..."
            placeholderTextColor="#9CA3AF"
            style={{ flex: 1, marginLeft: 12, fontSize: 15, color: '#111827' }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {CATEGORIES.map((category) => {
            const isSelected = category === 'All' ? !selectedCategory : selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category === 'All' ? null : category)}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: isSelected ? '#3B82F6' : 'white',
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: isSelected ? '#3B82F6' : '#E5E7EB',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: isSelected ? 'white' : '#6B7280',
                  }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Habits List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {filteredHabits.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Ionicons name="list-outline" size={64} color="#E5E7EB" />
            <Text style={{ fontSize: 16, color: '#9CA3AF', marginTop: 16 }}>
              {searchQuery || selectedCategory ? 'No habits found' : 'No habits yet'}
            </Text>
            <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8 }}>
              {searchQuery || selectedCategory ? 'Try a different filter' : 'Tap + to add your first habit'}
            </Text>
          </View>
        ) : (
          filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onPress={() => {
                navigation.navigate('HabitDetail', { habit });
              }}
              onComplete={() => handleComplete(habit.id, habit.todayCount, habit.targetCount)}
              onDelete={() => {
                Alert.alert(
                  'Delete Habit',
                  `Are you sure you want to delete "${habit.name}"?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => deleteHabit(habit.id),
                    },
                  ]
                );
              }}
            />
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Habit Modal */}
      <AddHabitModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
    </SafeAreaView>
  );
}