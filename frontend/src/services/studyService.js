// src/services/studyService.js
import api from './api';

const studyService = {
  // Get study progress
  async getProgress() {
    try {
      const response = await api.get('/study/progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching study progress:', error);
      // Return default data on error
      return {
        streak: 0,
        totalHours: 0,
        sessionsCompleted: 0,
        points: 0,
        consistency: 0,
        badges: [],
        dailyData: [],
        activities: [],
        subjects: []
      };
    }
  },

  // Get study stats
  async getStats() {
    try {
      const response = await api.get('/study/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching study stats:', error);
      return {
        streak: 0,
        totalHours: 0,
        sessionsCompleted: 0,
        points: 0,
        consistency: 0,
        badges: [],
        weeklyData: [0, 0, 0, 0, 0, 0, 0]
      };
    }
  },

  // Log study session
  async logSession(data) {
    try {
      const response = await api.post('/study/log-session', data);
      return response.data;
    } catch (error) {
      console.error('Error logging study session:', error);
      throw error;
    }
  },

  // Update subject progress
  async updateSubject(data) {
    try {
      const response = await api.put('/study/subject', data);
      return response.data;
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  }
};

export default studyService;