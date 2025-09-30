import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { VictoryArea, VictoryChart } from 'victory-native';
import { useDashboardStore, Activity } from '../store/dashboardStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PADDING_HORIZONTAL = 24;
const CARD_MARGIN = 8;
const cardWidth = (SCREEN_WIDTH - PADDING_HORIZONTAL * 2 - CARD_MARGIN * 2) / 2;

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
}> = ({ title, value, subtitle, icon, color }) => {
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: cardWidth,
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View
          style={{
            backgroundColor: color,
            width: 44,
            height: 44,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}
        >
          <Ionicons name={icon as any} size={22} color="#FFFFFF" />
        </View>

        <Text
          style={{
            fontSize: 26,
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: 6,
          }}
        >
          {value}
        </Text>

        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: '#000000',
            marginBottom: 3,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: 11,
            color: '#666666',
          }}
        >
          {subtitle}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: `${activity.color}20`,
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Ionicons name={activity.icon as any} size={20} color={activity.color} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 2 }}>
              {activity.title}
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 4 }}>
              {activity.description}
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
              {formatTimeAgo(activity.timestamp)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const SimpleChart: React.FC<{ data: number[] }> = ({ data }) => {
  const chartWidth = SCREEN_WIDTH - PADDING_HORIZONTAL * 2 - 40;
  const chartHeight = Math.min(SCREEN_HEIGHT * 0.25, 200);

  if (!data || data.length === 0) {
    return (
      <View style={{ height: chartHeight + 40, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#9CA3AF' }}>No data available</Text>
      </View>
    );
  }

  const chartData = data.map((value, index) => ({
    x: index + 1,
    y: value || 0,
  }));

  return (
    <View style={{ height: chartHeight + 40 }}>
      <VictoryChart
        width={chartWidth}
        height={chartHeight}
        padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
        style={{
          parent: { touchAction: 'auto' }
        }}
      >
        <VictoryArea
          data={chartData}
          style={{
            data: {
              fill: 'rgba(59, 130, 246, 0.15)',
              stroke: '#3B82F6',
              strokeWidth: 2.5,
            },
          }}
          interpolation="monotoneX"
        />
      </VictoryChart>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: chartWidth, marginTop: -15, paddingHorizontal: 35 }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <Text key={day} style={{ fontSize: 11, color: '#6B7280', fontWeight: '500' }}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
};

const QuickActionButton: React.FC<{
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}> = ({ title, icon, color, onPress }) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        marginHorizontal: 4,
        transform: [{ scale: scaleValue }],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View
          style={{
            backgroundColor: `${color}20`,
            padding: 12,
            borderRadius: 12,
            marginBottom: 8,
          }}
        >
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', textAlign: 'center' }}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const LoadingSkeleton: React.FC = () => (
  <View style={{ paddingHorizontal: 24 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
      {[1, 2].map((i) => (
        <View
          key={i}
          style={{
            width: cardWidth,
            height: 135,
            borderRadius: 20,
            backgroundColor: 'rgba(229, 231, 235, 0.5)',
          }}
        />
      ))}
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {[3, 4].map((i) => (
        <View
          key={i}
          style={{
            width: cardWidth,
            height: 135,
            borderRadius: 20,
            backgroundColor: 'rgba(229, 231, 235, 0.5)',
          }}
        />
      ))}
    </View>
  </View>
);

const AnimatedCard: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};

export default function DashboardScreen() {
  const {
    stats,
    activities,
    isLoading,
    error,
    loadData,
    refreshData,
    addActivity,
  } = useDashboardStore();

  const [refreshing, setRefreshing] = useState(false);

  // Safe defaults for stats
  const safeStats = stats || {
    habitsCompleted: 0,
    totalHabits: 0,
    caloriesBurned: 0,
    workoutStreak: 0,
    weeklyProgress: [],
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'habit':
        addActivity({
          type: 'habit',
          title: 'New Habit Logged',
          description: 'Added via quick action',
          timestamp: new Date(),
          icon: 'checkmark-circle',
          color: '#10B981',
        });
        break;
      case 'workout':
        addActivity({
          type: 'workout',
          title: 'Workout Started',
          description: 'Quick workout session',
          timestamp: new Date(),
          icon: 'barbell',
          color: '#8B5CF6',
        });
        break;
      case 'health':
        addActivity({
          type: 'health',
          title: 'Health Data Logged',
          description: 'Recorded health metrics',
          timestamp: new Date(),
          icon: 'heart',
          color: '#EF4444',
        });
        break;
    }
  };

  // Chart data is already in the correct format from stats.weeklyProgress

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 }}>
                Good Morning! 👋
              </Text>
              <Text style={{ fontSize: 16, color: '#6B7280' }}>{currentDate}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#3B82F6',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>JD</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
            <View
              style={{
                backgroundColor: '#FEE2E2',
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="alert-circle" size={24} color="#DC2626" />
              <Text style={{ color: '#991B1B', marginLeft: 12, flex: 1, fontSize: 14 }}>
                {error}
              </Text>
            </View>
          </View>
        )}

        {/* Quick Stats */}
        {isLoading && !safeStats.habitsCompleted ? (
          <LoadingSkeleton />
        ) : (
          <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <StatCard
                title="Habits Completed"
                value={`${safeStats.habitsCompleted}/${safeStats.totalHabits}`}
                subtitle="Today's progress"
                icon="checkmark-circle"
                color="#10B981"
              />
              <StatCard
                title="Calories Burned"
                value={safeStats.caloriesBurned.toString()}
                subtitle="This session"
                icon="flame"
                color="#EF4444"
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <StatCard
                title="Workout Streak"
                value={`${safeStats.workoutStreak} days`}
                subtitle="Keep it up!"
                icon="fitness"
                color="#8B5CF6"
              />
              <StatCard
                title="Weekly Goal"
                value={`${safeStats.weeklyProgress && safeStats.weeklyProgress.length > 0 ? Math.round(safeStats.weeklyProgress.reduce((a, b) => a + b, 0) / safeStats.weeklyProgress.length) : 0}%`}
                subtitle="Average completion"
                icon="analytics"
                color="#F59E0B"
              />
            </View>
          </View>
        )}

        {/* Progress Chart */}
        <AnimatedCard delay={400}>
          <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 }}>
                Weekly Progress
              </Text>
              <SimpleChart data={safeStats.weeklyProgress || []} />
            </View>
          </View>
        </AnimatedCard>

        {/* Quick Actions */}
        <AnimatedCard delay={500}>
          <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 }}>
              Quick Actions
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <QuickActionButton
                title="Add Habit"
                icon="add-circle"
                color="#10B981"
                onPress={() => handleQuickAction('habit')}
              />
              <QuickActionButton
                title="Start Workout"
                icon="play-circle"
                color="#8B5CF6"
                onPress={() => handleQuickAction('workout')}
              />
              <QuickActionButton
                title="Log Health"
                icon="heart"
                color="#EF4444"
                onPress={() => handleQuickAction('health')}
              />
            </View>
          </View>
        </AnimatedCard>

        {/* Recent Activities */}
        <AnimatedCard delay={600}>
          <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 }}>
              Recent Activity
            </Text>
            {activities.slice(0, 5).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </View>
        </AnimatedCard>

        {/* Bottom spacing for floating tab */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}