// frontend/src/services/healthService.js
import api from './api';

const healthService = {
  async getProgress() {
    try {
      const response = await api.get('/health/progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching health progress:', error);
      return {
        streak: 0,
        points: 0,
        consistency: 0,
        badges: [],
        challengesCompleted: 0,
        dailyData: [],
        activities: [],
        goals: []
      };
    }
  },

  async getStats() {
    try {
      const response = await api.get('/health/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching health stats:', error);
      return {
        streak: 0,
        points: 0,
        consistency: 0,
        badges: [],
        weeklyData: [0, 0, 0, 0, 0, 0, 0],
        waterIntake: 0,
        sleepHours: 0
      };
    }
  },

  async logWorkout(data) {
    try {
      const response = await api.post('/health/log-workout', data);
      return response.data;
    } catch (error) {
      console.error('Error logging workout:', error);
      throw error;
    }
  },

  async logWater(amount) {
    try {
      const response = await api.post('/health/log-water', { amount });
      return response.data;
    } catch (error) {
      console.error('Error logging water:', error);
      throw error;
    }
  },

  async logSleep(hours) {
    try {
      const response = await api.post('/health/log-sleep', { hours });
      return response.data;
    } catch (error) {
      console.error('Error logging sleep:', error);
      throw error;
    }
  }
};

export default healthService;