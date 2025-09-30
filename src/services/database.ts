import * as SQLite from 'expo-sqlite';

const DB_NAME = 'fitness_tracker.db';

export interface Habit {
  id: number;
  name: string;
  description: string;
  category: 'Health' | 'Fitness' | 'Mindfulness' | 'Productivity';
  frequency: 'Daily' | 'Weekly' | 'Custom';
  customDays?: string; // JSON array of days [0-6] for custom frequency
  targetCount: number;
  color: string;
  icon: string;
  createdAt: string;
  isActive: boolean;
}

export interface HabitCompletion {
  id: number;
  habitId: number;
  completedAt: string;
  note?: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      await this.createTables();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    // Create habits table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        frequency TEXT NOT NULL,
        customDays TEXT,
        targetCount INTEGER DEFAULT 1,
        color TEXT NOT NULL,
        icon TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        isActive INTEGER DEFAULT 1
      );
    `);

    // Create habit_completions table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS habit_completions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habitId INTEGER NOT NULL,
        completedAt TEXT NOT NULL,
        note TEXT,
        FOREIGN KEY (habitId) REFERENCES habits(id) ON DELETE CASCADE
      );
    `);

    // Create index for better query performance
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_completions_habit
      ON habit_completions(habitId, completedAt);
    `);
  }

  // HABIT CRUD OPERATIONS

  async createHabit(habit: Omit<Habit, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      `INSERT INTO habits (name, description, category, frequency, customDays, targetCount, color, icon, createdAt, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        habit.name,
        habit.description,
        habit.category,
        habit.frequency,
        habit.customDays || null,
        habit.targetCount,
        habit.color,
        habit.icon,
        habit.createdAt,
        habit.isActive ? 1 : 0,
      ]
    );

    return result.lastInsertRowId;
  }

  async getAllHabits(): Promise<Habit[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<Habit>(
      'SELECT * FROM habits WHERE isActive = 1 ORDER BY createdAt DESC'
    );

    return result.map(habit => ({
      ...habit,
      isActive: Boolean(habit.isActive),
    }));
  }

  async getHabitById(id: number): Promise<Habit | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<Habit>(
      'SELECT * FROM habits WHERE id = ?',
      [id]
    );

    if (!result) return null;

    return {
      ...result,
      isActive: Boolean(result.isActive),
    };
  }

  async updateHabit(id: number, updates: Partial<Habit>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return;

    values.push(id);

    await this.db.runAsync(
      `UPDATE habits SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteHabit(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Soft delete
    await this.db.runAsync(
      'UPDATE habits SET isActive = 0 WHERE id = ?',
      [id]
    );
  }

  // HABIT COMPLETION OPERATIONS

  async addCompletion(habitId: number, completedAt: string, note?: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      'INSERT INTO habit_completions (habitId, completedAt, note) VALUES (?, ?, ?)',
      [habitId, completedAt, note || null]
    );

    return result.lastInsertRowId;
  }

  async removeCompletion(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      'DELETE FROM habit_completions WHERE id = ?',
      [id]
    );
  }

  async getCompletions(habitId: number, startDate?: string, endDate?: string): Promise<HabitCompletion[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM habit_completions WHERE habitId = ?';
    const params: any[] = [habitId];

    if (startDate) {
      query += ' AND completedAt >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND completedAt <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY completedAt DESC';

    return await this.db.getAllAsync<HabitCompletion>(query, params);
  }

  async getTodayCompletions(habitId: number): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const today = new Date().toISOString().split('T')[0];

    const result = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM habit_completions
       WHERE habitId = ? AND DATE(completedAt) = ?`,
      [habitId, today]
    );

    return result?.count || 0;
  }

  // DATA EXPORT

  async exportData(): Promise<{ habits: Habit[]; completions: HabitCompletion[] }> {
    if (!this.db) throw new Error('Database not initialized');

    const habits = await this.db.getAllAsync<Habit>('SELECT * FROM habits');
    const completions = await this.db.getAllAsync<HabitCompletion>('SELECT * FROM habit_completions');

    return { habits, completions };
  }
}

export const databaseService = new DatabaseService();