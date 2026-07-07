// src/components/TeacherDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  BookOpen, 
  ClipboardList, 
  Award,  
  Users, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Plus,
  X,
  Eye,
  Download,
  ChevronDown,
  ChevronUp,
  Loader
} from 'lucide-react';
import teacherService from '../services/teacherService';

const INK = '#1C2B39';
const PAPER = '#F1EBDA';
const CARD = '#FBF8EF';
const MOSS = '#3F6B52';
const BRASS = '#B8892B';
const REDINK = '#A63D40';
const SLATE = '#4A6C8C';
const GOLD = '#D9B25C';

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'Work Sans', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const TeacherDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [uploadType, setUploadType] = useState('notes');

  // Real data states
  const [classRoster, setClassRoster] = useState([]);
  const [resources, setResources] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [teacherStats, setTeacherStats] = useState({
    totalStudents: 0,
    averagePerformance: 0,
    assignmentsSubmitted: 0,
    attendanceRate: 0,
    totalClasses: 0,
    totalResources: 0
  });
  const [classes, setClasses] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const [uploadForm, setUploadForm] = useState({
  title: '',
  description: '',
  type: 'notes',
  category: 'Study Material',
  class: '',
  subject: '',
  tags: '',
  file: null
});

  const [quizForm, setQuizForm] = useState({
    title: '',
    class: '',
    questions: 10,
    duration: 30
  });

  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    class: '',
    type: 'written',
    date: ''
  });

  const [testForm, setTestForm] = useState({
    title: '',
    class: '',
    dateTime: '',
    duration: 60
  });

  const [reportForm, setReportForm] = useState({
    type: 'class',
    class: '',
    format: 'pdf'
  });

  useEffect(() => {
    fetchAllData();
  }, [selectedClass]);

  
const fetchAllData = async () => {
  setLoading(true);
  try {
    const [
      statsData,
      studentsData,
      resourcesData,
      quizzesData,
      assessmentsData,
      classesData,
      activitiesData
    ] = await Promise.allSettled([
      teacherService.getTeacherStats(),
      teacherService.getStudents(selectedClass === 'all' ? null : selectedClass),
      teacherService.getResources(selectedClass === 'all' ? null : selectedClass),
      teacherService.getQuizzes(selectedClass === 'all' ? null : selectedClass),
      teacherService.getAssessments(selectedClass === 'all' ? null : selectedClass),
      teacherService.getClasses(),
      teacherService.getRecentActivities()
    ]);

    // Stats
    if (statsData.status === 'fulfilled' && statsData.value) {
      setTeacherStats(statsData.value);
    }

    // Students
    if (studentsData.status === 'fulfilled' && studentsData.value) {
      setClassRoster(studentsData.value);
    }

    // Resources - Get all resources, not just filtered ones
    if (resourcesData.status === 'fulfilled' && resourcesData.value) {
      // If the response is an array, use it directly
      if (Array.isArray(resourcesData.value)) {
        setResources(resourcesData.value);
      } else {
        // If it's an object with a data property, use that
        setResources(resourcesData.value.data || []);
      }
    } else {
      setResources([]);
    }

    // Quizzes
    if (quizzesData.status === 'fulfilled' && quizzesData.value) {
      setQuizzes(quizzesData.value);
    }

    // Assessments
    if (assessmentsData.status === 'fulfilled' && assessmentsData.value) {
      setAssessments(assessmentsData.value);
    }

    // Classes
    if (classesData.status === 'fulfilled' && classesData.value) {
      setClasses(classesData.value);
    }

    // Activities
    if (activitiesData.status === 'fulfilled' && activitiesData.value) {
      setRecentActivities(activitiesData.value);
    }

  } catch (error) {
    console.error('Error fetching teacher data:', error);
    setToast({ message: 'Failed to load data. Please refresh.', type: 'error' });
  } finally {
    setLoading(false);
  }
};

  // Toast component
  const Toast = ({ message, type, onClose }) => (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded shadow-lg border"
      style={{ 
        backgroundColor: CARD, 
        borderColor: type === 'success' ? `${MOSS}55` : `${REDINK}55`,
        fontFamily: FONT_BODY 
      }}
    >
      {type === 'success' ? 
        <CheckCircle className="w-4 h-4" style={{ color: MOSS }} /> : 
        <AlertTriangle className="w-4 h-4" style={{ color: REDINK }} />
      }
      <span className="text-sm font-medium" style={{ color: INK }}>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70" style={{ color: `${INK}88` }}>
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );

const handleUpload = async () => {
  // Validate required fields
  if (!uploadForm.title || !uploadForm.class || !uploadForm.subject || !uploadForm.file) {
    setToast({ message: 'Please fill in all required fields and select a file', type: 'error' });
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description || '');
    formData.append('type', uploadForm.type);
    formData.append('category', uploadForm.category || 'Study Material');
    formData.append('class', uploadForm.class);
    formData.append('subject', uploadForm.subject);
    formData.append('tags', uploadForm.tags || '');
    formData.append('file', uploadForm.file);
    
    const response = await teacherService.uploadResource(formData);
    
    setToast({ message: `${uploadType} uploaded successfully!`, type: 'success' });
    setShowUploadModal(false);
    // Reset form
    setUploadForm({ 
      title: '', 
      description: '', 
      type: 'notes', 
      category: 'Study Material', 
      class: '', 
      subject: '', 
      tags: '', 
      file: null 
    });
    // Refresh the resources list
    fetchAllData();
  } catch (error) {
    console.error('Upload error:', error);
    setToast({ 
      message: error.response?.data?.message || 'Failed to upload resource', 
      type: 'error' 
    });
  }
};

// Handle view resource
const handleViewResource = (resource) => {
  try {
    // If it's a PDF or image, open in new tab
    const fileUrl = `http://localhost:8080/uploads/resources/${resource.fileName}`;
    window.open(fileUrl, '_blank');
  } catch (error) {
    console.error('Error viewing resource:', error);
    setToast({ message: 'Failed to view resource', type: 'error' });
  }
};

// Handle download resource
const handleDownloadResource = async (resourceId) => {
  try {
    const blob = await teacherService.downloadResource(resourceId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const resource = resources.find(r => r.id === resourceId);
    link.download = resource?.fileName || 'download.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    setToast({ message: 'Download started!', type: 'success' });
    setTimeout(() => setToast(null), 2000);
  } catch (error) {
    console.error('Error downloading:', error);
    setToast({ message: 'Failed to download resource', type: 'error' });
    setTimeout(() => setToast(null), 2000);
  }
};


  const handleCreateQuiz = async () => {
    try {
      await teacherService.createQuiz(quizForm);
      setToast({ message: 'Quiz created successfully!', type: 'success' });
      setShowQuizModal(false);
      setQuizForm({ title: '', class: '', questions: 10, duration: 30 });
      fetchAllData();
    } catch (error) {
      setToast(error,{ message: 'Failed to create quiz', type: 'error' });
    }
  };

  const handleCreateAssessment = async () => {
    try {
      await teacherService.createAssessment(assessmentForm);
      setToast({ message: 'Assessment created successfully!', type: 'success' });
      setShowAssessmentModal(false);
      setAssessmentForm({ title: '', class: '', type: 'written', date: '' });
      fetchAllData();
    } catch (error) {
      setToast(error,{ message: 'Failed to create assessment', type: 'error' });
    }
  };

  const handleConductTest = async () => {
    try {
      await teacherService.conductTest(testForm);
      setToast({ message: 'Test conducted successfully!', type: 'success' });
      setShowTestModal(false);
      setTestForm({ title: '', class: '', dateTime: '', duration: 60 });
      fetchAllData();
    } catch (error) {
      setToast(error,{ message: 'Failed to conduct test', type: 'error' });
    }
  };

  const handleGenerateReport = async () => {
    try {
      const result = await teacherService.generateReport(reportForm);
      setToast({ message: 'Report generated successfully!', type: 'success' });
      setShowReportModal(false);
      if (result.reportUrl) {
        window.open(result.reportUrl, '_blank');
      }
    } catch (error) {
      setToast(error,{ message: 'Failed to generate report', type: 'error' });
    }
  };

  const toggleStudentExpand = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return MOSS;
    if (score >= 60) return BRASS;
    return REDINK;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: MOSS,
      completed: SLATE,
      upcoming: BRASS,
      published: MOSS,
      draft: `${INK}66`
    };
    return badges[status] || `${INK}66`;
  };

  const stats = {
    totalStudents: teacherStats.totalStudents || classRoster.length,
    averagePerformance: teacherStats.averagePerformance || 0,
    assignmentsSubmitted: teacherStats.assignmentsSubmitted || 0,
    attendanceRate: teacherStats.attendanceRate || 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: PAPER }}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: SLATE }} />
          <p style={{ color: `${INK}70` }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative rounded-md" style={{ backgroundColor: PAPER, color: INK, fontFamily: FONT_BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .sd-fade { animation: sdFade .35s ease; }
        @keyframes sdFade { from { opacity: 0; transform: translateY(4px);} to { opacity: 1; transform: translateY(0);} }
        .sd-settle:focus { outline: none; border-color: ${MOSS} !important; }
      `}</style>

      <div className="absolute inset-0 rounded-md pointer-events-none" aria-hidden="true"
        style={{ backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, ${INK}0A 32px)` }} />

      <div className="absolute left-0 top-0 bottom-0 w-9 rounded-l-md pointer-events-none" aria-hidden="true"
        style={{
          background: `linear-gradient(to right, ${INK}0F, transparent), repeating-linear-gradient(to bottom, transparent 0px, transparent 37px, ${BRASS}66 38px, ${BRASS}66 40px, transparent 41px)`,
          borderRight: `1px solid ${INK}1A`,
        }}>
        <div className="absolute left-1" style={{
          top: '50%', transform: 'translateY(-50%) rotate(180deg)', writingMode: 'vertical-rl',
          fontFamily: FONT_MONO, fontSize: '9px', letterSpacing: '0.2em', color: `${INK}55`,
        }}>
          TEACHER LEDGER
        </div>
      </div>

      <div className="pl-11 pr-5 md:pr-8 py-6 space-y-6">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Header */}
        <div className="rounded-sm border p-6" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-[11px] mb-1" style={{ fontFamily: FONT_MONO, color: BRASS, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Teacher Console
              </p>
              <h3 className="flex items-center gap-2" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.9rem' }}>
                <BookOpen className="w-6 h-6" style={{ color: BRASS }} />
                Class Dashboard 🎓
              </h3>
              <p className="text-sm mt-2" style={{ color: `${INK}80` }}>
                {selectedClass === 'all' ? 'All Classes' : `Class ${selectedClass}`} • {stats.totalStudents} students • {resources.length} resources
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 rounded-sm text-sm border focus:outline-none"
                style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-sm text-xs transition-colors ${
                  activeTab === 'overview' 
                  ? 'font-semibold' 
                  : ''
                }`}
                style={{
                  fontFamily: FONT_MONO,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  backgroundColor: activeTab === 'overview' ? `${BRASS}15` : 'transparent',
                  color: activeTab === 'overview' ? BRASS : `${INK}66`,
                  border: activeTab === 'overview' ? `1px solid ${BRASS}44` : 'none'
                }}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('students')}
                className={`px-4 py-2 rounded-sm text-xs transition-colors ${
                  activeTab === 'students' 
                  ? 'font-semibold' 
                  : ''
                }`}
                style={{
                  fontFamily: FONT_MONO,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  backgroundColor: activeTab === 'students' ? `${BRASS}15` : 'transparent',
                  color: activeTab === 'students' ? BRASS : `${INK}66`,
                  border: activeTab === 'students' ? `1px solid ${BRASS}44` : 'none'
                }}
              >
                Students
              </button>
              <button 
                onClick={() => setActiveTab('resources')}
                className={`px-4 py-2 rounded-sm text-xs transition-colors ${
                  activeTab === 'resources' 
                  ? 'font-semibold' 
                  : ''
                }`}
                style={{
                  fontFamily: FONT_MONO,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  backgroundColor: activeTab === 'resources' ? `${BRASS}15` : 'transparent',
                  color: activeTab === 'resources' ? BRASS : `${INK}66`,
                  border: activeTab === 'resources' ? `1px solid ${BRASS}44` : 'none'
                }}
              >
                Resources
              </button>
              <button 
                onClick={() => setActiveTab('assessments')}
                className={`px-4 py-2 rounded-sm text-xs transition-colors ${
                  activeTab === 'assessments' 
                  ? 'font-semibold' 
                  : ''
                }`}
                style={{
                  fontFamily: FONT_MONO,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  backgroundColor: activeTab === 'assessments' ? `${BRASS}15` : 'transparent',
                  color: activeTab === 'assessments' ? BRASS : `${INK}66`,
                  border: activeTab === 'assessments' ? `1px solid ${BRASS}44` : 'none'
                }}
              >
                Assessments
              </button>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-sm border relative overflow-hidden" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: SLATE }} />
                <div className="flex items-center gap-3 pl-2">
                  <Users className="w-5 h-5" style={{ color: SLATE }} />
                  <div>
                    <p className="text-xl leading-none" style={{ fontFamily: FONT_MONO, color: INK, fontWeight: 600 }}>{stats.totalStudents}</p>
                    <p className="text-[11px] mt-1" style={{ fontFamily: FONT_BODY, color: `${INK}77` }}>Total Students</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-sm border relative overflow-hidden" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: MOSS }} />
                <div className="flex items-center gap-3 pl-2">
                  <Award className="w-5 h-5" style={{ color: MOSS }} />
                  <div>
                    <p className="text-xl leading-none" style={{ fontFamily: FONT_MONO, color: INK, fontWeight: 600 }}>{stats.averagePerformance}%</p>
                    <p className="text-[11px] mt-1" style={{ fontFamily: FONT_BODY, color: `${INK}77` }}>Avg Performance</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-sm border relative overflow-hidden" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: BRASS }} />
                <div className="flex items-center gap-3 pl-2">
                  <CheckCircle className="w-5 h-5" style={{ color: BRASS }} />
                  <div>
                    <p className="text-xl leading-none" style={{ fontFamily: FONT_MONO, color: INK, fontWeight: 600 }}>{stats.assignmentsSubmitted}/{stats.totalStudents}</p>
                    <p className="text-[11px] mt-1" style={{ fontFamily: FONT_BODY, color: `${INK}77` }}>Assignments Submitted</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-sm border relative overflow-hidden" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: REDINK }} />
                <div className="flex items-center gap-3 pl-2">
                  <Calendar className="w-5 h-5" style={{ color: REDINK }} />
                  <div>
                    <p className="text-xl leading-none" style={{ fontFamily: FONT_MONO, color: INK, fontWeight: 600 }}>{stats.attendanceRate}%</p>
                    <p className="text-[11px] mt-1" style={{ fontFamily: FONT_BODY, color: `${INK}77` }}>Attendance Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-5 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
              <p className="text-[11px] mb-4" style={{ fontFamily: FONT_MONO, color: BRASS, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Quick Actions
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <button 
                  onClick={() => { setUploadType('notes'); setShowUploadModal(true); }}
                  className="p-3 rounded-sm text-xs font-medium transition hover:opacity-80 border flex items-center gap-2 justify-center"
                  style={{ backgroundColor: `${BRASS}08`, borderColor: `${BRASS}33`, color: BRASS }}
                >
                  <Upload className="w-4 h-4" /> Upload Notes
                </button>
                <button 
                  onClick={() => { setUploadType('paper'); setShowUploadModal(true); }}
                  className="p-3 rounded-sm text-xs font-medium transition hover:opacity-80 border flex items-center gap-2 justify-center"
                  style={{ backgroundColor: `${SLATE}08`, borderColor: `${SLATE}33`, color: SLATE }}
                >
                  <FileText className="w-4 h-4" /> Question Papers
                </button>
                <button 
                  onClick={() => { setUploadType('material'); setShowUploadModal(true); }}
                  className="p-3 rounded-sm text-xs font-medium transition hover:opacity-80 border flex items-center gap-2 justify-center"
                  style={{ backgroundColor: `${MOSS}08`, borderColor: `${MOSS}33`, color: MOSS }}
                >
                  <BookOpen className="w-4 h-4" /> Study Material
                </button>
                <button 
                  onClick={() => setShowQuizModal(true)}
                  className="p-3 rounded-sm text-xs font-medium transition hover:opacity-80 border flex items-center gap-2 justify-center"
                  style={{ backgroundColor: `${GOLD}08`, borderColor: `${GOLD}33`, color: GOLD }}
                >
                  <ClipboardList className="w-4 h-4" /> Create Quiz
                </button>
                <button 
                  onClick={() => setShowAssessmentModal(true)}
                  className="p-3 rounded-sm text-xs font-medium transition hover:opacity-80 border flex items-center gap-2 justify-center"
                  style={{ backgroundColor: `${BRASS}08`, borderColor: `${BRASS}33`, color: BRASS }}
                >
                  <Plus className="w-4 h-4" /> Create Assessment
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-5 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
              <p className="text-[11px] mb-4" style={{ fontFamily: FONT_MONO, color: BRASS, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Recent Activity
              </p>
              <div className="space-y-3">
                {recentActivities.length > 0 ? (
                  recentActivities.slice(0, 3).map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-sm" style={{ backgroundColor: PAPER }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: `${SLATE}15`, color: SLATE }}>
                          {activity.student?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: INK }}>{activity.student || 'Student'}</p>
                          <p className="text-xs" style={{ color: `${INK}60` }}>{activity.action || 'Activity'}</p>
                        </div>
                      </div>
                      <span className="text-xs" style={{ fontFamily: FONT_MONO, color: `${INK}50` }}>{activity.time || 'Recently'}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-center py-4" style={{ color: `${INK}60` }}>No recent activities</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="p-4 rounded-sm border flex flex-wrap items-center justify-between gap-4" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
              <div className="flex items-center gap-4">
                <label className="text-sm" style={{ color: `${INK}70` }}>Class:</label>
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-2 rounded-sm text-sm border focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                >
                  <option value="all">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 rounded-sm text-xs flex items-center gap-2"
                style={{ backgroundColor: BRASS, color: CARD, fontFamily: FONT_MONO, letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                <Download className="w-4 h-4" /> Generate Report
              </button>
            </div>

            {classRoster.length > 0 ? (
              classRoster.map((student) => {
                const isExpanded = expandedStudent === student.id;
                const scoreColor = getPerformanceColor(student.performance || 0);
                
                return (
                  <div key={student.id} className="rounded-sm border overflow-hidden" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                    <div 
                      className="p-5 cursor-pointer hover:bg-opacity-50 transition"
                      style={{ backgroundColor: 'transparent' }}
                      onClick={() => toggleStudentExpand(student.id)}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold shrink-0"
                            style={{ borderColor: scoreColor, backgroundColor: `${scoreColor}15`, color: scoreColor }}>
                            {student.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <h4 className="text-base font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                              {student.name || 'Unknown'}
                            </h4>
                            <p className="text-xs" style={{ color: `${INK}60` }}>{student.email || ''}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="text-xs px-3 py-1 rounded-full font-medium"
                            style={{ backgroundColor: `${scoreColor}15`, color: scoreColor }}>
                            {student.performance || 0}%
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                            student.flag ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {student.flag ? '⚠️ Warning' : '✅ On Track'}
                          </span>
                          {isExpanded ? 
                            <ChevronUp className="w-5 h-5" style={{ color: `${INK}55` }} /> : 
                            <ChevronDown className="w-5 h-5" style={{ color: `${INK}55` }} />
                          }
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t p-5 space-y-6" style={{ borderColor: `${INK}14`, backgroundColor: PAPER }}>
                        {/* Performance Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                            <p className="text-xs" style={{ color: `${INK}60` }}>Performance</p>
                            <p className="text-lg font-bold" style={{ fontFamily: FONT_MONO, color: INK }}>{student.performance || 0}%</p>
                          </div>
                          <div className="p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                            <p className="text-xs" style={{ color: `${INK}60` }}>Attendance</p>
                            <p className="text-lg font-bold" style={{ fontFamily: FONT_MONO, color: INK }}>{student.attendance || 0}%</p>
                          </div>
                          <div className="p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                            <p className="text-xs" style={{ color: `${INK}60` }}>Assignments</p>
                            <p className="text-lg font-bold" style={{ fontFamily: FONT_MONO, color: INK }}>{student.assignments || 0}</p>
                          </div>
                          <div className="p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                            <p className="text-xs" style={{ color: `${INK}60` }}>Status</p>
                            <p className={`text-lg font-bold ${student.submitted ? 'text-emerald-600' : 'text-red-600'}`}
                              style={{ fontFamily: FONT_MONO }}>
                              {student.submitted ? '✅ Submitted' : '❌ Pending'}
                            </p>
                          </div>
                        </div>

                        {/* Quiz Scores */}
                        {student.quizzes && student.quizzes.length > 0 && (
                          <div className="p-4 rounded-sm" style={{ backgroundColor: CARD }}>
                            <h5 className="text-xs font-semibold mb-3" style={{ color: `${INK}70` }}>Quiz Scores</h5>
                            <div className="flex gap-2 flex-wrap">
                              {student.quizzes.map((score, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium"
                                  style={{ backgroundColor: `${getPerformanceColor(score)}15`, color: getPerformanceColor(score) }}>
                                  Quiz {idx + 1}: {score}%
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Test Scores */}
                        {student.testScores && student.testScores.length > 0 && (
                          <div className="p-4 rounded-sm" style={{ backgroundColor: CARD }}>
                            <h5 className="text-xs font-semibold mb-3" style={{ color: `${INK}70` }}>Test Scores</h5>
                            <div className="flex gap-2 flex-wrap">
                              {student.testScores.map((score, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium"
                                  style={{ backgroundColor: `${getPerformanceColor(score)}15`, color: getPerformanceColor(score) }}>
                                  Test {idx + 1}: {score}%
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                <p style={{ color: `${INK}60` }}>No students found for the selected class.</p>
              </div>
            )}
          </div>
        )}


        {/* Resources Tab */}
{activeTab === 'resources' && (
  <div className="space-y-4">
    <div className="p-5 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
      <div className="flex justify-between items-center mb-4">
        <p className="text-[11px]" style={{ fontFamily: FONT_MONO, color: BRASS, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Educational Resources
        </p>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 rounded-sm text-xs flex items-center gap-2"
          style={{ backgroundColor: BRASS, color: CARD, fontFamily: FONT_MONO, letterSpacing: '0.06em', textTransform: 'uppercase' }}
        >
          <Upload className="w-4 h-4" /> Upload Resource
        </button>
      </div>
      
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <div key={resource.id} className="p-4 rounded-sm border hover:shadow-sm transition" style={{ backgroundColor: PAPER, borderColor: `${INK}14` }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium" style={{ color: INK }}>{resource.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: `${BRASS}15`, color: BRASS }}>
                      {resource.type}
                    </span>
                    <span className="text-xs" style={{ color: `${INK}60` }}>Class {resource.class}</span>
                    <span className="text-xs" style={{ color: `${INK}60` }}>• {resource.subject}</span>
                    <span className="text-xs" style={{ color: `${INK}50` }}>📥 {resource.downloads || 0}</span>
                  </div>
                  {resource.description && (
                    <p className="text-xs mt-1" style={{ color: `${INK}70` }}>{resource.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-2">
                  <button 
                    onClick={() => handleViewResource(resource)}
                    className="p-1.5 bg-white rounded-lg border hover:border-teal-300 transition" 
                    style={{ borderColor: `${INK}14` }}
                    title="View Resource"
                  >
                    <Eye className="w-4 h-4" style={{ color: `${INK}60` }} />
                  </button>
                  <button 
                    onClick={() => handleDownloadResource(resource.id)}
                    className="p-1.5 bg-white rounded-lg border hover:border-teal-300 transition" 
                    style={{ borderColor: `${INK}14` }}
                    title="Download Resource"
                  >
                    <Download className="w-4 h-4" style={{ color: MOSS }} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: `${INK}50` }}>
                <span>📅 {new Date(resource.createdAt).toLocaleDateString()}</span>
                <span>👤 {resource.uploadedByName || 'Teacher'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: `${INK}30` }} />
          <p style={{ color: `${INK}60` }}>No resources uploaded yet.</p>
          <p className="text-sm" style={{ color: `${INK}40` }}>Click "Upload Resource" to add study materials.</p>
        </div>
      )}
    </div>
  </div>
)}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <div className="space-y-4">
            <div className="p-5 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
              <div className="flex justify-between items-center mb-4">
                <p className="text-[11px]" style={{ fontFamily: FONT_MONO, color: BRASS, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Assessments & Tests
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowQuizModal(true)}
                    className="px-4 py-2 rounded-sm text-xs flex items-center gap-2"
                    style={{ backgroundColor: MOSS, color: CARD, fontFamily: FONT_MONO, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                  >
                    <Plus className="w-4 h-4" /> Create Quiz
                  </button>
                  <button 
                    onClick={() => setShowAssessmentModal(true)}
                    className="px-4 py-2 rounded-sm text-xs flex items-center gap-2"
                    style={{ backgroundColor: BRASS, color: CARD, fontFamily: FONT_MONO, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                  >
                    <Plus className="w-4 h-4" /> Create Assessment
                  </button>
                </div>
              </div>

              {/* Quizzes */}
              {quizzes.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-xs font-medium mb-3" style={{ color: `${INK}70` }}>Quizzes</h5>
                  <div className="space-y-3">
                    {quizzes.map((quiz) => (
                      <div key={quiz.id} className="p-4 rounded-sm border" style={{ backgroundColor: PAPER, borderColor: `${INK}14` }}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="font-medium" style={{ color: INK }}>{quiz.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: `${INK}60` }}>
                              <span>Class {quiz.class}</span>
                              <span>📝 {quiz.questions} questions</span>
                              <span>⏱️ {quiz.duration} min</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border`}
                              style={{ 
                                borderColor: `${getStatusBadge(quiz.status)}44`,
                                backgroundColor: `${getStatusBadge(quiz.status)}15`,
                                color: getStatusBadge(quiz.status)
                              }}>
                              {quiz.status}
                            </span>
                            <span className="text-sm font-medium" style={{ color: `${INK}70` }}>Avg: {quiz.avgScore || 0}%</span>
                            <button className="p-1.5 bg-white rounded-lg border hover:border-teal-300 transition" style={{ borderColor: `${INK}14` }}>
                              <Eye className="w-4 h-4" style={{ color: `${INK}60` }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assessments */}
              {assessments.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium mb-3" style={{ color: `${INK}70` }}>Assessments</h5>
                  <div className="space-y-3">
                    {assessments.map((assessment) => (
                      <div key={assessment.id} className="p-4 rounded-sm border" style={{ backgroundColor: PAPER, borderColor: `${INK}14` }}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="font-medium" style={{ color: INK }}>{assessment.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: `${INK}60` }}>
                              <span>Class {assessment.class}</span>
                              <span>📋 {assessment.type}</span>
                              <span>📅 {assessment.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border`}
                              style={{ 
                                borderColor: `${getStatusBadge(assessment.status)}44`,
                                backgroundColor: `${getStatusBadge(assessment.status)}15`,
                                color: getStatusBadge(assessment.status)
                              }}>
                              {assessment.status}
                            </span>
                            <button className="p-1.5 bg-white rounded-lg border hover:border-teal-300 transition" style={{ borderColor: `${INK}14` }}>
                              <Eye className="w-4 h-4" style={{ color: `${INK}60` }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {quizzes.length === 0 && assessments.length === 0 && (
                <p className="text-center py-8" style={{ color: `${INK}60` }}>No assessments or quizzes created yet.</p>
              )}

              {/* Conduct Test Button */}
              <div className="mt-6 p-4 rounded-sm border" style={{ backgroundColor: `${BRASS}08`, borderColor: `${BRASS}33` }}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h5 className="font-medium" style={{ color: BRASS }}>Conduct Online Test</h5>
                    <p className="text-sm" style={{ color: `${BRASS}80` }}>Create and conduct online tests for your students</p>
                  </div>
                  <button 
                    onClick={() => setShowTestModal(true)}
                    className="px-6 py-2.5 rounded-sm text-xs flex items-center gap-2"
                    style={{ backgroundColor: BRASS, color: CARD, fontFamily: FONT_MONO, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                  >
                    <ClipboardList className="w-4 h-4" /> Conduct Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


{/* Upload Modal */}
{showUploadModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="rounded-sm max-w-lg w-full p-6 border max-h-[90vh] overflow-y-auto" style={{ backgroundColor: CARD, borderColor: `${INK}22` }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>Upload {uploadType}</h3>
        <button 
          onClick={() => setShowUploadModal(false)} 
          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          style={{ color: `${INK}60` }}
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs block mb-1 font-medium" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Title *</label>
          <input 
            type="text" 
            value={uploadForm.title}
            onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
            className="w-full rounded-sm px-4 py-2.5 border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
            placeholder="Resource title..." 
            required
          />
        </div>
        
        <div>
          <label className="text-xs block mb-1 font-medium" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Description</label>
          <textarea 
            value={uploadForm.description}
            onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
            className="w-full rounded-sm px-4 py-2.5 border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
            placeholder="Resource description..." 
            rows="3"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs block mb-1 font-medium" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Type *</label>
            <select 
              value={uploadForm.type}
              onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
              className="w-full rounded-sm px-4 py-2.5 border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
            >
              <option value="notes">Notes</option>
              <option value="textbook">Textbook</option>
              <option value="paper">Question Paper</option>
              <option value="revision">Revision Notes</option>
              <option value="mcq">MCQ Practice</option>
              <option value="solutions">Solutions</option>
              <option value="curriculum">Curriculum</option>
              <option value="material">Study Material</option>
            </select>
          </div>
          <div>
            <label className="text-xs block mb-1 font-medium" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Category *</label>
            <select 
              value={uploadForm.category}
              onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
              className="w-full rounded-sm px-4 py-2.5 border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
            >
              <option value="Study Material">Study Material</option>
              <option value="Full Textbook PDFs">Full Textbook PDFs</option>
              <option value="Chapter Notes">Chapter Notes</option>
              <option value="Previous Year Question Papers">Previous Year Question Papers</option>
              <option value="Quick Revision Notes">Quick Revision Notes</option>
              <option value="MCQ Practice Tests">MCQ Practice Tests</option>
              <option value="Activities and Exercise Answers">Activities and Exercise Answers</option>
              <option value="CBSE Curriculum">CBSE Curriculum</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs block mb-1 font-medium" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Class *</label>
            <select 
              value={uploadForm.class}
              onChange={(e) => setUploadForm({...uploadForm, class: e.target.value})}
              className="w-full rounded-sm px-4 py-2.5 border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
            >
              <option value="">Select Class</option>
              <option value="7th">7th</option>
              <option value="8th">8th</option>
              <option value="9th">9th</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
              <option value="all">All Classes</option>
            </select>
          </div>
          <div>
            <label className="text-xs block mb-1 font-medium" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Subject *</label>
            <input 
              type="text" 
              value={uploadForm.subject}
              onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
              className="w-full rounded-sm px-4 py-2.5 border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
              placeholder="e.g., Mathematics" 
              required
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs block mb-1 font-medium" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Tags (comma separated)</label>
          <input 
            type="text" 
            value={uploadForm.tags}
            onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
            className="w-full rounded-sm px-4 py-2.5 border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
            placeholder="algebra, chapter1, class10" 
          />
        </div>
        
        <div>
          <label className="text-xs block mb-1 font-medium" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>File *</label>
          <div 
            className="border-2 border-dashed rounded-xl p-8 text-center hover:border-teal-400 transition cursor-pointer"
            style={{ borderColor: `${INK}22`, backgroundColor: PAPER }}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: `${INK}40` }} />
            <p className="text-sm" style={{ color: `${INK}50` }}>
              {uploadForm.file ? uploadForm.file.name : 'Drop your file here or click to browse'}
            </p>
            <p className="text-xs mt-1" style={{ color: `${INK}40` }}>
              {uploadForm.file ? `${(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB` : 'Supported: PDF, Word, Images'}
            </p>
            <input 
              id="fileInput"
              type="file" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUploadForm({...uploadForm, file: e.target.files[0]});
                }
              }}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
            />
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <button 
          onClick={() => {
            setShowUploadModal(false);
            setUploadForm({ title: '', description: '', class: '', type: 'notes', category: 'Study Material', subject: '', file: null, tags: '' });
          }} 
          className="flex-1 py-2.5 rounded-sm text-sm font-medium transition hover:bg-opacity-80"
          style={{ backgroundColor: `${INK}10`, color: INK }}
        >
          Cancel
        </button>
        <button 
          onClick={handleUpload} 
          className="flex-1 py-2.5 rounded-sm text-sm font-medium transition hover:opacity-80 flex items-center justify-center gap-2"
          style={{ backgroundColor: BRASS, color: CARD }}
          disabled={!uploadForm.title || !uploadForm.class || !uploadForm.subject || !uploadForm.file}
        >
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>
      {(!uploadForm.title || !uploadForm.class || !uploadForm.subject || !uploadForm.file) && (
        <p className="text-xs mt-2 text-center" style={{ color: REDINK }}>
          Please fill in all required fields (*) and select a file
        </p>
      )}
    </div>
  </div>
)}

      {/* Create Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-lg w-full p-6 border" style={{ backgroundColor: CARD, borderColor: `${INK}22` }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>Create Quiz</h3>
              <button onClick={() => setShowQuizModal(false)} className="transition-opacity hover:opacity-60" style={{ color: `${INK}60` }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Quiz Title</label>
                <input 
                  type="text" 
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                  placeholder="e.g., Algebra Quiz 1" 
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Class</label>
                <select 
                  value={quizForm.class}
                  onChange={(e) => setQuizForm({...quizForm, class: e.target.value})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Number of Questions</label>
                <input 
                  type="number" 
                  value={quizForm.questions}
                  onChange={(e) => setQuizForm({...quizForm, questions: parseInt(e.target.value)})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                  placeholder="10" 
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Duration (minutes)</label>
                <input 
                  type="number" 
                  value={quizForm.duration}
                  onChange={(e) => setQuizForm({...quizForm, duration: parseInt(e.target.value)})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                  placeholder="30" 
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowQuizModal(false)} className="flex-1 py-2 rounded-sm text-sm font-medium transition" style={{ backgroundColor: `${INK}08`, color: INK }}>Cancel</button>
              <button onClick={handleCreateQuiz} className="flex-1 py-2 rounded-sm text-sm font-medium transition" style={{ backgroundColor: MOSS, color: CARD }}>Create Quiz</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-lg w-full p-6 border" style={{ backgroundColor: CARD, borderColor: `${INK}22` }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>Create Assessment</h3>
              <button onClick={() => setShowAssessmentModal(false)} className="transition-opacity hover:opacity-60" style={{ color: `${INK}60` }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Assessment Title</label>
                <input 
                  type="text" 
                  value={assessmentForm.title}
                  onChange={(e) => setAssessmentForm({...assessmentForm, title: e.target.value})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                  placeholder="e.g., Mid Term Assessment" 
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Class</label>
                <select 
                  value={assessmentForm.class}
                  onChange={(e) => setAssessmentForm({...assessmentForm, class: e.target.value})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Type</label>
                <select 
                  value={assessmentForm.type}
                  onChange={(e) => setAssessmentForm({...assessmentForm, type: e.target.value})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                >
                  <option value="written">Written</option>
                  <option value="practical">Practical</option>
                  <option value="oral">Oral</option>
                  <option value="project">Project</option>
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Date</label>
                <input 
                  type="date" 
                  value={assessmentForm.date}
                  onChange={(e) => setAssessmentForm({...assessmentForm, date: e.target.value})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAssessmentModal(false)} className="flex-1 py-2 rounded-sm text-sm font-medium transition" style={{ backgroundColor: `${INK}08`, color: INK }}>Cancel</button>
              <button onClick={handleCreateAssessment} className="flex-1 py-2 rounded-sm text-sm font-medium transition" style={{ backgroundColor: BRASS, color: CARD }}>Create Assessment</button>
            </div>
          </div>
        </div>
      )}

      {/* Conduct Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-lg w-full p-6 border" style={{ backgroundColor: CARD, borderColor: `${INK}22` }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>Conduct Online Test</h3>
              <button onClick={() => setShowTestModal(false)} className="transition-opacity hover:opacity-60" style={{ color: `${INK}60` }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Test Title</label>
                <input 
                  type="text" 
                  value={testForm.title}
                  onChange={(e) => setTestForm({...testForm, title: e.target.value})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                  placeholder="e.g., Weekly Test - Week 3" 
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Class</label>
                <select 
                  value={testForm.class}
                  onChange={(e) => setTestForm({...testForm, class: e.target.value})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={testForm.dateTime}
                  onChange={(e) => setTestForm({...testForm, dateTime: e.target.value})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Duration (minutes)</label>
                <input 
                  type="number" 
                  value={testForm.duration}
                  onChange={(e) => setTestForm({...testForm, duration: parseInt(e.target.value)})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                  placeholder="60" 
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowTestModal(false)} className="flex-1 py-2 rounded-sm text-sm font-medium transition" style={{ backgroundColor: `${INK}08`, color: INK }}>Cancel</button>
              <button onClick={handleConductTest} className="flex-1 py-2 rounded-sm text-sm font-medium transition" style={{ backgroundColor: BRASS, color: CARD }}>Conduct Test</button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-lg w-full p-6 border" style={{ backgroundColor: CARD, borderColor: `${INK}22` }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>Generate Academic Report</h3>
              <button onClick={() => setShowReportModal(false)} className="transition-opacity hover:opacity-60" style={{ color: `${INK}60` }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Report Type</label>
                <select 
                  value={reportForm.type}
                  onChange={(e) => setReportForm({...reportForm, type: e.target.value})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                >
                  <option value="class">Class Performance Report</option>
                  <option value="individual">Individual Student Report</option>
                  <option value="subject">Subject-wise Report</option>
                  <option value="assessment">Assessment Report</option>
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Class</label>
                <select 
                  value={reportForm.class}
                  onChange={(e) => setReportForm({...reportForm, class: e.target.value})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Format</label>
                <select 
                  value={reportForm.format}
                  onChange={(e) => setReportForm({...reportForm, format: e.target.value})}
                  className="w-full rounded-sm px-4 py-2 border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowReportModal(false)} className="flex-1 py-2 rounded-sm text-sm font-medium transition" style={{ backgroundColor: `${INK}08`, color: INK }}>Cancel</button>
              <button onClick={handleGenerateReport} className="flex-1 py-2 rounded-sm text-sm font-medium flex items-center justify-center gap-2" style={{ backgroundColor: BRASS, color: CARD }}>
                <Download className="w-4 h-4" /> Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;