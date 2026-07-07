// src/services/teacherService.js
import api from './api';

const teacherService = {
  // Get teacher profile
  async getTeacherProfile() {
    try {
      const response = await api.get('/teacher/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      throw error;
    }
  },

  // Get teacher stats
  async getTeacherStats() {
    try {
      const response = await api.get('/teacher/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
      // Return default stats
      return {
        totalStudents: 0,
        activeStudents: 0,
        classes: ['10th', '11th', '12th'],
        subjects: ['Mathematics', 'Physics'],
        averageScore: 0,
        passRate: 0,
        totalHours: 0,
        assignmentsGiven: 0,
        assignmentsGraded: 0,
        studentsImproved: 0,
        totalAchievements: 0,
        avgRating: 0,
        classPerformance: { '10th': 0, '11th': 0, '12th': 0 },
        weeklyClasses: [0, 0, 0, 0, 0, 0, 0],
        subjectDistribution: { 'Mathematics': 0, 'Physics': 0 }
      };
    }
  },

  // Get students
  async getStudents(classId = null) {
    try {
      let url = '/teacher/students';
      if (classId && classId !== 'all') {
        url += `?class=${classId}`;
      }
      const response = await api.get(url);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  },

  // Get student details
  async getStudentDetails(studentId) {
    try {
      const response = await api.get(`/teacher/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student details:', error);
      throw error;
    }
  },

  // Get classes
  async getClasses() {
    try {
      const response = await api.get('/teacher/classes');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching classes:', error);
      return ['10th', '11th', '12th'];
    }
  },

  // Get class performance
  async getClassPerformance(classId) {
    try {
      const response = await api.get(`/teacher/classes/${classId}/performance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching class performance:', error);
      return null;
    }
  },

  async getResources(classId = null) {
    try {
      let url = '/teacher/resources';
      if (classId && classId !== 'all') {
        url += `?class=${classId}`;
      }
      const response = await api.get(url);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching resources:', error);
      // Return mock data
      return [
        { id: 1, title: "Algebra Notes Chapter 1", type: "notes", class: "10th", date: "2024-01-15", downloads: 45 },
        { id: 2, title: "Physics Question Paper - Set 1", type: "paper", class: "10th", date: "2024-01-12", downloads: 32 },
        { id: 3, title: "Chemistry Study Material", type: "material", class: "10th", date: "2024-01-10", downloads: 28 }
      ];
    }
  },

async uploadResource(formData) {
  try {
    const response = await api.post('/teacher/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading resource:', error);
    throw error;
  }
},

  // Create quiz
  async createQuiz(data) {
    try {
      const response = await api.post('/teacher/quizzes', data);
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  // Get quizzes - with fallback mock data
  async getQuizzes(classId = null) {
    try {
      let url = '/teacher/quizzes';
      if (classId && classId !== 'all') {
        url += `?class=${classId}`;
      }
      const response = await api.get(url);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      // Return mock data
      return [
        { id: 1, title: "Algebra Quiz 1", class: "10th", questions: 10, duration: "30 mins", status: "active", avgScore: 78 },
        { id: 2, title: "Physics Quiz 1", class: "10th", questions: 8, duration: "20 mins", status: "completed", avgScore: 82 }
      ];
    }
  },

  // Create assessment
  async createAssessment(data) {
    try {
      const response = await api.post('/teacher/assessments', data);
      return response.data;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  },

  // Get assessments - with fallback mock data
  async getAssessments(classId = null) {
    try {
      let url = '/teacher/assessments';
      if (classId && classId !== 'all') {
        url += `?class=${classId}`;
      }
      const response = await api.get(url);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching assessments:', error);
      // Return mock data
      return [
        { id: 1, title: "Mid Term Assessment", class: "10th", type: "written", date: "2024-02-01", status: "upcoming" },
        { id: 2, title: "Practical Assessment", class: "10th", type: "practical", date: "2024-01-28", status: "completed" }
      ];
    }
  },

  // Conduct test
  async conductTest(data) {
    try {
      const response = await api.post('/teacher/tests', data);
      return response.data;
    } catch (error) {
      console.error('Error conducting test:', error);
      throw error;
    }
  },

  // Get tests
  async getTests(classId = null) {
    try {
      let url = '/teacher/tests';
      if (classId && classId !== 'all') {
        url += `?class=${classId}`;
      }
      const response = await api.get(url);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching tests:', error);
      return [];
    }
  },

  // Generate report
  async generateReport(data) {
    try {
      const response = await api.post('/teacher/reports', data);
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  // Get recent activities
  async getRecentActivities() {
    try {
      const response = await api.get('/teacher/activities');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  },

  // Get top students
  async getTopStudents() {
    try {
      const response = await api.get('/teacher/top-students');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching top students:', error);
      return [];
    }
  },

  async downloadResource(resourceId) {
  try {
    const response = await api.get(`/study/resources/${resourceId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading resource:', error);
    throw error;
  }
},
};


export default teacherService;