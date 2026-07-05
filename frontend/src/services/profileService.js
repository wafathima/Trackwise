// src/services/profileService.js
import api from './api';

const profileService = {
  // Get user profile data
  async getProfile() {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(data) {
    try {
      const response = await api.put('/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error.message);
      throw error;
    }
  },

  // Upload profile image
  async uploadProfileImage(file) {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      const response = await api.post('/profile/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // Longer timeout for file upload
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading profile image:', error.message);
      throw error;
    }
  },

  // Get user stats
  async getUserStats() {
    try {
      const response = await api.get('/profile/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error.message);
      // Return default stats instead of throwing
      return {
        studyStreak: 0,
        workoutStreak: 0,
        habitStreak: 0,
        totalHours: 0,
        completedTasks: 0,
        achievementPoints: 0,
        rank: 'Bronze',
        level: 'Beginner',
        badges: 0,
        consistency: 0
      };
    }
  },

  // Get user achievements
  async getAchievements() {
    try {
      const response = await api.get('/profile/achievements');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error.message);
      // Return default achievements
      return [
        { icon: 'Trophy', title: 'Study Master', desc: 'Completed 100 study sessions', earned: false, color: '#B8892B' },
        { icon: 'Medal', title: 'Fitness Champion', desc: '30-day workout streak', earned: false, color: '#4A6C8C' },
        { icon: 'Star', title: 'Habit Builder', desc: 'Maintained 5 habits for 30 days', earned: false, color: '#3F6B52' },
        { icon: 'Target', title: 'Goal Setter', desc: 'Achieved 50 weekly goals', earned: false, color: '#A63D40' },
        { icon: 'Flame', title: 'Streak Warrior', desc: '100-day streak on any activity', earned: false, color: '#B8892B' },
        { icon: 'Heart', title: 'Wellness Guru', desc: 'Completed all wellness challenges', earned: false, color: '#4A6C8C' }
      ];
    }
  },

  // Get recent activities
  async getRecentActivities() {
    try {
      const response = await api.get('/profile/activities');
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error.message);
      return [{ icon: 'BookOpen', action: 'No recent activities', time: '', color: '#3F6B52' }];
    }
  },

  // Get weekly progress
  async getWeeklyProgress() {
    try {
      const response = await api.get('/profile/weekly-progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly progress:', error.message);
      return {
        study: [0, 0, 0, 0, 0, 0, 0],
        workout: [0, 0, 0, 0, 0, 0, 0],
        habits: [0, 0, 0, 0, 0, 0, 0]
      };
    }
  },

  // Delete account
  async deleteAccount() {
    try {
      const response = await api.delete('/profile/delete-account');
      return response.data;
    } catch (error) {
      console.error('Error deleting account:', error.message);
      throw error;
    }
  },

  // Reset data
  async resetData() {
    try {
      const response = await api.post('/profile/reset-data');
      return response.data;
    } catch (error) {
      console.error('Error resetting data:', error.message);
      throw error;
    }
  }
};

export default profileService;