// src/services/quizService.js
import api from './api';

const quizService = {
  // Get all quizzes
  async getQuizzes() {
    try {
      const response = await api.get('/study/quizzes');
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    }
  },

  // Get quiz by ID
  async getQuizById(quizId) {
    try {
      const response = await api.get(`/study/quizzes/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
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
  },

  // Submit quiz answer
  async submitAnswer(quizId, questionId, answer) {
    try {
      const response = await api.post(`/study/quizzes/${quizId}/answer`, {
        questionId,
        answer
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  },

  // Get quiz results
  async getQuizResults(quizId) {
    try {
      const response = await api.get(`/study/quizzes/${quizId}/results`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      throw error;
    }
  }
};

export default quizService;