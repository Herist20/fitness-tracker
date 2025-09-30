import { HabitCompletion } from '../services/database';

export const calculateStreak = (completions: HabitCompletion[]): number => {
  if (completions.length === 0) return 0;

  // Sort completions by date (newest first)
  const sortedCompletions = [...completions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Get unique completion dates
  const completionDates = Array.from(
    new Set(
      sortedCompletions.map((c) => {
        const date = new Date(c.completedAt);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    )
  ).sort((a, b) => b - a);

  if (completionDates.length === 0) return 0;

  const latestCompletion = completionDates[0];

  // Check if latest completion is today or yesterday
  if (latestCompletion !== today.getTime() && latestCompletion !== yesterday.getTime()) {
    return 0; // Streak broken
  }

  let streak = 1;
  let currentDate = new Date(latestCompletion);

  for (let i = 1; i < completionDates.length; i++) {
    const prevDate = new Date(completionDates[i]);
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - 1);

    if (prevDate.getTime() === expectedDate.getTime()) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
};

export const getTodayCompletionCount = (completions: HabitCompletion[]): number => {
  const today = new Date().toISOString().split('T')[0];
  return completions.filter((c) => c.completedAt.startsWith(today)).length;
};

export const getWeeklyCompletionRate = (completions: HabitCompletion[]): number[] => {
  const today = new Date();
  const weekData: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const count = completions.filter((c) => c.completedAt.startsWith(dateStr)).length;
    weekData.push(count);
  }

  return weekData;
};

export const getCompletionPercentage = (completed: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min(Math.round((completed / target) * 100), 100);
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Health: '#10B981',
    Fitness: '#8B5CF6',
    Mindfulness: '#3B82F6',
    Productivity: '#F59E0B',
  };
  return colors[category] || '#6B7280';
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    Health: 'heart',
    Fitness: 'barbell',
    Mindfulness: 'leaf',
    Productivity: 'briefcase',
  };
  return icons[category] || 'checkmark-circle';
};

export const formatStreakText = (streak: number): string => {
  if (streak === 0) return 'No streak';
  if (streak === 1) return '1 day streak';
  return `${streak} days streak`;
};

export const getMotivationalMessage = (streak: number): string => {
  if (streak === 0) return 'Start your streak today!';
  if (streak < 3) return 'Keep it up!';
  if (streak < 7) return 'You\'re on a roll!';
  if (streak < 30) return 'Amazing progress!';
  if (streak < 100) return 'Unstoppable!';
  return 'Legendary streak!';
};