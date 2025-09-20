import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completedDates: string[];
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  date: string;
  duration: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

interface AppState {
  user: User | null;
  habits: Habit[];
  workouts: Workout[];

  setUser: (user: User | null) => void;
  addHabit: (habit: Habit) => void;
  removeHabit: (id: string) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  addWorkout: (workout: Workout) => void;
  removeWorkout: (id: string) => void;
}

const useStore = create<AppState>((set) => ({
  user: null,
  habits: [],
  workouts: [],

  setUser: (user) => set({ user }),

  addHabit: (habit) =>
    set((state) => ({ habits: [...state.habits, habit] })),

  removeHabit: (id) =>
    set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),

  updateHabit: (id, updatedHabit) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, ...updatedHabit } : h
      ),
    })),

  addWorkout: (workout) =>
    set((state) => ({ workouts: [...state.workouts, workout] })),

  removeWorkout: (id) =>
    set((state) => ({ workouts: state.workouts.filter((w) => w.id !== id) })),
}));

export default useStore;