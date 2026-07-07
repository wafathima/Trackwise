// src/services/mentorService.js
import api from './api';

const mentorService = {
  // Get all mentees
  async getMentees() {
    try {
      const response = await api.get('/mentor/mentees');
      return response.data;
    } catch (error) {
      console.error('Error fetching mentees:', error);
      throw error;
    }
  },

  // Get mentee details
  async getMenteeDetails(menteeId) {
    try {
      const response = await api.get(`/mentor/mentees/${menteeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching mentee details:', error);
      throw error;
    }
  },

  // Create study plan for mentee
  async createStudyPlan(menteeId, data) {
    try {
      const response = await api.post(`/mentor/mentees/${menteeId}/plans`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating study plan:', error);
      throw error;
    }
  },

  // Create workout plan for mentee
  async createWorkoutPlan(menteeId, data) {
    try {
      const response = await api.post(`/mentor/mentees/${menteeId}/workouts`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating workout plan:', error);
      throw error;
    }
  },

  // Create communication plan for mentee
  async createCommunicationPlan(menteeId, data) {
    try {
      const response = await api.post(`/mentor/mentees/${menteeId}/communications`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating communication plan:', error);
      throw error;
    }
  },

  // Send message to mentee
  async sendMessage(menteeId, data) {
    try {
      const response = await api.post(`/mentor/mentees/${menteeId}/messages`, data);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Award badge to mentee
  async awardBadge(menteeId, data) {
    try {
      const response = await api.post(`/mentor/mentees/${menteeId}/badges`, data);
      return response.data;
    } catch (error) {
      console.error('Error awarding badge:', error);
      throw error;
    }
  },

  // Get mentor stats
  async getMentorStats() {
    try {
      const response = await api.get('/mentor/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor stats:', error);
      throw error;
    }
  },

  // Get mentor profile data
  async getMentorProfile() {
    try {
      const response = await api.get('/mentor/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor profile:', error);
      throw error;
    }
  }
};

export default mentorService;