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
  },

  // Get all study resources
  async getResources(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] && params[key] !== 'all' && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const url = `/study/resources${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('Fetching resources from:', url);
      
      const response = await api.get(url);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching resources:', error);
      // Return fallback data for testing
      return [
        {
          id: 1,
          title: 'Sample Algebra Notes',
          type: 'notes',
          class: '10th',
          subject: 'Mathematics',
          uploadedByName: 'Demo Teacher',
          createdAt: new Date().toISOString(),
          downloads: 5,
          rating: 4.5,
          description: 'This is a sample resource created when no resources exist.',
          tags: ['algebra', 'sample']
        }
      ];
    }
  },

  // Get resource by ID
  async getResourceById(id) {
    try {
      const response = await api.get(`/study/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }
  },

  // Download resource
  async downloadResource(id) {
    try {
      const response = await api.get(`/study/resources/${id}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading resource:', error);
      throw error;
    }
  },

  // View resource (open in new tab)
  async viewResource(id) {
    try {
      const response = await api.get(`/study/resources/${id}/view`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error viewing resource:', error);
      throw error;
    }
  },

  // Get quizzes
  async getQuizzes() {
    try {
      console.log('Fetching quizzes...');
      const response = await api.get('/study/quizzes');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    }
  },

  // Start a quiz
  async startQuiz(quizId) {
    try {
      const response = await api.post(`/study/quizzes/${quizId}/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting quiz:', error);
      throw error;
    }
  }
};

export default studyService;