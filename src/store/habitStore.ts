import { create } from 'zustand';
import { Habit, HabitCompletion, databaseService } from '../services/database';
import { calculateStreak, getTodayCompletionCount } from '../utils/habitUtils';

export interface HabitWithStats extends Habit {
  todayCount: number;
  streak: number;
  completionPercentage: number;
  completions: HabitCompletion[];
}

interface HabitState {
  habits: HabitWithStats[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string | null;
  searchQuery: string;

  // Actions
  initDatabase: () => Promise<void>;
  loadHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id'>) => Promise<void>;
  updateHabit: (id: number, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
  completeHabit: (habitId: number, note?: string) => Promise<void>;
  uncompleteHabit: (habitId: number) => Promise<void>;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  exportData: () => Promise<string>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
  searchQuery: '',

  initDatabase: async () => {
    try {
      await databaseService.init();
      await get().loadHabits();
    } catch (error) {
      console.error('Database init error:', error);
      set({ error: 'Failed to initialize database' });
    }
  },

  loadHabits: async () => {
    try {
      set({ isLoading: true, error: null });

      const habits = await databaseService.getAllHabits();

      const habitsWithStats = await Promise.all(
        habits.map(async (habit) => {
          const completions = await databaseService.getCompletions(habit.id);
          const todayCount = getTodayCompletionCount(completions);
          const streak = calculateStreak(completions);
          const completionPercentage = Math.min(
            Math.round((todayCount / habit.targetCount) * 100),
            100
          );

          return {
            ...habit,
            todayCount,
            streak,
            completionPercentage,
            completions,
          };
        })
      );

      set({ habits: habitsWithStats, isLoading: false });
    } catch (error) {
      console.error('Load habits error:', error);
      set({ error: 'Failed to load habits', isLoading: false });
    }
  },

  addHabit: async (habitData) => {
    try {
      set({ isLoading: true, error: null });

      await databaseService.createHabit({
        ...habitData,
        createdAt: new Date().toISOString(),
        isActive: true,
      });

      await get().loadHabits();
    } catch (error) {
      console.error('Add habit error:', error);
      set({ error: 'Failed to add habit', isLoading: false });
    }
  },

  updateHabit: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      await databaseService.updateHabit(id, updates);
      await get().loadHabits();
    } catch (error) {
      console.error('Update habit error:', error);
      set({ error: 'Failed to update habit', isLoading: false });
    }
  },

  deleteHabit: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await databaseService.deleteHabit(id);
      await get().loadHabits();
    } catch (error) {
      console.error('Delete habit error:', error);
      set({ error: 'Failed to delete habit', isLoading: false });
    }
  },

  completeHabit: async (habitId, note) => {
    try {
      const completedAt = new Date().toISOString();
      await databaseService.addCompletion(habitId, completedAt, note);
      await get().loadHabits();
    } catch (error) {
      console.error('Complete habit error:', error);
      set({ error: 'Failed to complete habit' });
    }
  },

  uncompleteHabit: async (habitId) => {
    try {
      const habit = get().habits.find((h) => h.id === habitId);
      if (!habit || habit.completions.length === 0) return;

      // Remove the most recent completion for today
      const today = new Date().toISOString().split('T')[0];
      const todayCompletions = habit.completions.filter((c) =>
        c.completedAt.startsWith(today)
      );

      if (todayCompletions.length > 0) {
        const latestCompletion = todayCompletions[todayCompletions.length - 1];
        await databaseService.removeCompletion(latestCompletion.id);
        await get().loadHabits();
      }
    } catch (error) {
      console.error('Uncomplete habit error:', error);
      set({ error: 'Failed to uncomplete habit' });
    }
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  exportData: async () => {
    try {
      const data = await databaseService.exportData();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Export data error:', error);
      throw error;
    }
  },
}));