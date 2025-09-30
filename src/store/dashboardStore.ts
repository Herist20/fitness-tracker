import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Activity {
  id: string;
  type: 'workout' | 'habit' | 'health';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
}

export interface DashboardStats {
  habitsCompleted: number;
  totalHabits: number;
  caloriesBurned: number;
  workoutStreak: number;
  weeklyProgress: number[];
}

interface DashboardState {
  stats: DashboardStats;
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  setStats: (stats: DashboardStats) => void;
  setActivities: (activities: Activity[]) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const STORAGE_KEYS = {
  DASHBOARD_STATS: 'dashboard_stats',
  DASHBOARD_ACTIVITIES: 'dashboard_activities',
};

const generateMockData = (): { stats: DashboardStats; activities: Activity[] } => {
  const stats: DashboardStats = {
    habitsCompleted: 6,
    totalHabits: 8,
    caloriesBurned: 347,
    workoutStreak: 12,
    weeklyProgress: [85, 92, 78, 95, 88, 91, 97],
  };

  const activities: Activity[] = [
    {
      id: '1',
      type: 'workout',
      title: 'Morning Run',
      description: '5.2 km in 28 minutes',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: 'fitness',
      color: '#8B5CF6',
    },
    {
      id: '2',
      type: 'habit',
      title: 'Drink Water',
      description: 'Completed 8/8 glasses',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      icon: 'water',
      color: '#06B6D4',
    },
    {
      id: '3',
      type: 'workout',
      title: 'Upper Body Strength',
      description: '45 minutes strength training',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      icon: 'barbell',
      color: '#EF4444',
    },
    {
      id: '4',
      type: 'habit',
      title: 'Morning Meditation',
      description: '15 minutes mindfulness',
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
      icon: 'leaf',
      color: '#10B981',
    },
    {
      id: '5',
      type: 'health',
      title: 'Weight Check',
      description: 'Logged daily weight',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      icon: 'analytics',
      color: '#F59E0B',
    },
  ];

  return { stats, activities };
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: {
    habitsCompleted: 0,
    totalHabits: 0,
    caloriesBurned: 0,
    workoutStreak: 0,
    weeklyProgress: [],
  },
  activities: [],
  isLoading: false,
  error: null,
  lastUpdated: null,

  setStats: (stats) => set({ stats }),

  setActivities: (activities) => set({ activities }),

  addActivity: (activityData) => {
    const activity: Activity = {
      ...activityData,
      id: Date.now().toString(),
    };

    set((state) => ({
      activities: [activity, ...state.activities].slice(0, 10), // Keep only latest 10
    }));

    get().saveData();
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  loadData: async () => {
    try {
      set({ isLoading: true, error: null });

      const [statsData, activitiesData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.DASHBOARD_STATS),
        AsyncStorage.getItem(STORAGE_KEYS.DASHBOARD_ACTIVITIES),
      ]);

      if (statsData && activitiesData) {
        const stats = JSON.parse(statsData);
        const activities = JSON.parse(activitiesData).map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp),
        }));

        set({ stats, activities, lastUpdated: new Date() });
      } else {
        // Load mock data for first time
        const mockData = generateMockData();
        set({
          stats: mockData.stats,
          activities: mockData.activities,
          lastUpdated: new Date(),
        });
        get().saveData();
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      set({ error: 'Failed to load dashboard data' });

      // Fallback to mock data
      const mockData = generateMockData();
      set({
        stats: mockData.stats,
        activities: mockData.activities,
        lastUpdated: new Date(),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  saveData: async () => {
    try {
      const { stats, activities } = get();

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.DASHBOARD_STATS, JSON.stringify(stats)),
        AsyncStorage.setItem(STORAGE_KEYS.DASHBOARD_ACTIVITIES, JSON.stringify(activities)),
      ]);
    } catch (error) {
      console.error('Error saving dashboard data:', error);
    }
  },

  refreshData: async () => {
    // Simulate API call with updated data
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockData = generateMockData();

    // Add some randomness to simulate real data changes
    mockData.stats.caloriesBurned += Math.floor(Math.random() * 50);
    mockData.stats.habitsCompleted = Math.min(
      mockData.stats.totalHabits,
      mockData.stats.habitsCompleted + Math.floor(Math.random() * 2)
    );

    set({
      stats: mockData.stats,
      activities: mockData.activities,
      lastUpdated: new Date(),
    });

    get().saveData();
  },
}));