import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
import { getCategoryColor, getWeeklyCompletionRate, getMotivationalMessage } from '../utils/habitUtils';
import ProgressRing from '../components/ProgressRing';
import CompletionCalendar from '../components/CompletionCalendar';
import EditHabitModal from '../components/EditHabitModal';
import { useHabitStore } from '../store/habitStore';
import type { HabitsStackParamList } from '../navigation/HabitsStackNavigator';

const { width } = Dimensions.get('window');

type HabitDetailRouteProp = RouteProp<HabitsStackParamList, 'HabitDetail'>;
type HabitDetailNavigationProp = NativeStackNavigationProp<HabitsStackParamList, 'HabitDetail'>;

export default function HabitDetailScreen() {
  const route = useRoute<HabitDetailRouteProp>();
  const navigation = useNavigation<HabitDetailNavigationProp>();
  const { deleteHabit, loadHabits } = useHabitStore();
  const { habit } = route.params;
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [showEditModal, setShowEditModal] = useState(false);

  const weeklyData = getWeeklyCompletionRate(habit.completions);
  const chartData = weeklyData.map((count, index) => ({
    x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    y: count,
  }));

  const totalCompletions = habit.completions.length;
  const bestStreak = habit.streak; // Simplified, could calculate historical best
  const completionRate = habit.completions.length > 0
    ? Math.round((habit.completions.filter((c: any) => {
        const date = new Date(c.completedAt);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays < 30;
      }).length / 30) * 100)
    : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingVertical: 16,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>Habit Details</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => setShowEditModal(true)}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="create-outline" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Delete Habit',
                `Are you sure you want to delete "${habit.name}"?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      await deleteHabit(habit.id);
                      await loadHabits();
                      navigation.goBack();
                    },
                  },
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Habit Info Card */}
        <View style={{ padding: 24 }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 3,
              borderLeftWidth: 6,
              borderLeftColor: getCategoryColor(habit.category),
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  backgroundColor: `${getCategoryColor(habit.category)}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}
              >
                <Ionicons
                  name={habit.icon as any}
                  size={32}
                  color={getCategoryColor(habit.category)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 4 }}>
                  {habit.name}
                </Text>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>{habit.description}</Text>
              </View>
            </View>

            <View
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: `${getCategoryColor(habit.category)}10`,
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: getCategoryColor(habit.category), textAlign: 'center' }}>
                🔥 {getMotivationalMessage(habit.streak)}
              </Text>
            </View>

            {/* Today's Progress */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <ProgressRing
                size={120}
                strokeWidth={12}
                progress={habit.completionPercentage}
                color={getCategoryColor(habit.category)}
                showPercentage={true}
              />
              <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 12 }}>
                {habit.todayCount} of {habit.targetCount} completed today
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Ionicons name="flame" size={32} color="#F59E0B" />
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 8 }}>
                {habit.streak}
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Current Streak</Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Ionicons name="trophy" size={32} color="#F59E0B" />
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 8 }}>
                {bestStreak}
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Best Streak</Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Ionicons name="checkmark-done" size={32} color="#10B981" />
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 8 }}>
                {totalCompletions}
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Total Done</Text>
            </View>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>
                Weekly Activity
              </Text>
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: `${getCategoryColor(habit.category)}15`,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: getCategoryColor(habit.category) }}>
                  {completionRate}% completion
                </Text>
              </View>
            </View>

            <VictoryChart
              width={width - 88}
              height={200}
              padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
            >
              <VictoryAxis
                style={{
                  axis: { stroke: '#E5E7EB' },
                  tickLabels: { fontSize: 10, fill: '#6B7280' },
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  axis: { stroke: '#E5E7EB' },
                  tickLabels: { fontSize: 10, fill: '#6B7280' },
                  grid: { stroke: '#F3F4F6', strokeDasharray: '5,5' },
                }}
              />
              <VictoryBar
                data={chartData}
                style={{
                  data: {
                    fill: getCategoryColor(habit.category),
                    width: 25,
                  },
                }}
                cornerRadius={{ top: 8 }}
              />
            </VictoryChart>
          </View>
        </View>

        {/* Completion Calendar */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Ionicons name="calendar" size={24} color={getCategoryColor(habit.category)} />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginLeft: 8 }}>
                Completion History
              </Text>
            </View>
            <CompletionCalendar
              completions={habit.completions}
              color={getCategoryColor(habit.category)}
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Habit Modal */}
      <EditHabitModal
        visible={showEditModal}
        habit={habit}
        onClose={async () => {
          setShowEditModal(false);
          await loadHabits();
        }}
      />
    </SafeAreaView>
  );
}