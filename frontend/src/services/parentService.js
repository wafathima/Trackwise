// src/services/parentService.js
import api from './api';

const parentService = {
  // Get parent dashboard data
  async getDashboardData() {
    try {
      const response = await api.get('/parent/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching parent dashboard:', error);
      throw error;
    }
  },

  // Get all children
  async getChildren() {
    try {
      const response = await api.get('/parent/children');
      return response.data;
    } catch (error) {
      console.error('Error fetching children:', error);
      throw error;
    }
  },

  // Get child details
  async getChildDetails(childId) {
    try {
      const response = await api.get(`/parent/children/${childId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching child details:', error);
      throw error;
    }
  },

  // Get child progress
  async getChildProgress(childId) {
    try {
      const response = await api.get(`/parent/children/${childId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching child progress:', error);
      throw error;
    }
  },

  // Get family stats
  async getFamilyStats() {
    try {
      const response = await api.get('/parent/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching family stats:', error);
      throw error;
    }
  },

  // Get parent profile
  async getParentProfile() {
    try {
      const response = await api.get('/parent/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching parent profile:', error);
      throw error;
    }
  },

  // Generate report
  async generateReport(childId, data) {
    try {
      const response = await api.post(`/parent/children/${childId}/report`, data);
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  // Get recent activities
  async getRecentActivities() {
    try {
      const response = await api.get('/parent/activities');
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  },

  // Link child to parent
  async linkChild(childId) {
    try {
      const response = await api.post('/parent/link-child', { childId });
      return response.data;
    } catch (error) {
      console.error('Error linking child:', error);
      throw error;
    }
  }
};

export default parentService;