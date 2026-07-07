// frontend/src/services/habitService.js
import api from './api';

const habitService = {
  async getProgress() {
    try {
      const response = await api.get('/habits/progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching habit progress:', error);
      return {
        streak: 0,
        completedTasks: 0,
        points: 0,
        consistency: 0,
        badges: [],
        habits: [],
        dailyData: [],
        activities: []
      };
    }
  },

  async getStats() {
    try {
      const response = await api.get('/habits/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching habit stats:', error);
      return {
        streak: 0,
        completedTasks: 0,
        points: 0,
        consistency: 0,
        badges: [],
        weeklyData: [0, 0, 0, 0, 0, 0, 0],
        activeHabits: 0
      };
    }
  },

  async getTodayHabits() {
    try {
      const response = await api.get('/habits/today');
      return response.data;
    } catch (error) {
      console.error('Error fetching today habits:', error);
      return { habits: [], totalCompleted: 0, totalHabits: 0, streak: 0 };
    }
  },

  async createHabit(data) {
    try {
      const response = await api.post('/habits/create', data);
      return response.data;
    } catch (error) {
      console.error('Error creating habit:', error);
      throw error;
    }
  },

  async logHabit(habitId, notes = '') {
    try {
      const response = await api.post('/habits/log', { habitId, notes });
      return response.data;
    } catch (error) {
      console.error('Error logging habit:', error);
      throw error;
    }
  }
};

export default habitService;