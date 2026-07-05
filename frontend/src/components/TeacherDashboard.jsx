import { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  BookOpen, 
  ClipboardList, 
  Award, 
  TrendingUp, 
  Users, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Plus,
  X,
  Eye,
  Download,
  Activity,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const TeacherDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState('10th');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [uploadType, setUploadType] = useState('notes');

  // Mock data
  const [classRoster, setClassRoster] = useState([
    { 
      id: 1,
      name: "Alex Mercer", 
      email: "alex@example.com",
      status: "Submitted Notes assignment", 
      rank: "Excellent", 
      flag: false,
      performance: 92,
      attendance: 95,
      assignments: 8,
      quizzes: [85, 90, 88, 92],
      testScores: [88, 92, 95],
      submitted: true
    },
    { 
      id: 2,
      name: "Sarah Connor", 
      email: "sarah@example.com",
      status: "Revision test incomplete", 
      rank: "Warning", 
      flag: true,
      performance: 65,
      attendance: 70,
      assignments: 4,
      quizzes: [60, 55, 70, 65],
      testScores: [58, 62, 68],
      submitted: false
    },
    { 
      id: 3,
      name: "John Doe", 
      email: "john@example.com",
      status: "Submitted Notes assignment", 
      rank: "Good", 
      flag: false,
      performance: 78,
      attendance: 85,
      assignments: 6,
      quizzes: [75, 80, 72, 78],
      testScores: [76, 82, 80],
      submitted: true
    }
  ]);

  // Resources data
  const [resources, setResources] = useState([
    { id: 1, title: "Algebra Notes Chapter 1", type: "notes", class: "10th", date: "2024-01-15", downloads: 45 },
    { id: 2, title: "Physics Question Paper - Set 1", type: "paper", class: "10th", date: "2024-01-12", downloads: 32 },
    { id: 3, title: "Chemistry Study Material", type: "material", class: "10th", date: "2024-01-10", downloads: 28 }
  ]);

  // Quizzes data
  const [quizzes, setQuizzes] = useState([
    { id: 1, title: "Algebra Quiz 1", class: "10th", questions: 10, duration: "30 mins", status: "active", avgScore: 78 },
    { id: 2, title: "Physics Quiz 1", class: "10th", questions: 8, duration: "20 mins", status: "completed", avgScore: 82 }
  ]);

  // Assessments data
  const [assessments, setAssessments] = useState([
    { id: 1, title: "Mid Term Assessment", class: "10th", type: "written", date: "2024-02-01", status: "upcoming" },
    { id: 2, title: "Practical Assessment", class: "10th", type: "practical", date: "2024-01-28", status: "completed" }
  ]);

  // Toast component
  const Toast = ({ message, type, onClose }) => (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
      type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
      'bg-red-50 border-red-200 text-red-700'
    } backdrop-blur-xl`}>
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  // Upload handlers
  const handleUpload = () => {
    setToast({ message: `${uploadType} uploaded successfully!`, type: 'success' });
    setShowUploadModal(false);
  };

  const handleCreateQuiz = () => {
    setToast({ message: 'Quiz created successfully!', type: 'success' });
    setShowQuizModal(false);
  };

  const handleCreateAssessment = () => {
    setToast({ message: 'Assessment created successfully!', type: 'success' });
    setShowAssessmentModal(false);
  };

  const handleConductTest = () => {
    setToast({ message: 'Test conducted successfully!', type: 'success' });
    setShowTestModal(false);
  };

  const toggleStudentExpand = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-50 text-green-700 border-green-200',
      completed: 'bg-blue-50 text-blue-700 border-blue-200',
      upcoming: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return badges[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const stats = {
    totalStudents: classRoster.length,
    averagePerformance: Math.round(classRoster.reduce((acc, s) => acc + s.performance, 0) / classRoster.length),
    assignmentsSubmitted: classRoster.filter(s => s.submitted).length,
    attendanceRate: Math.round(classRoster.reduce((acc, s) => acc + s.attendance, 0) / classRoster.length),
  };

  return (
    <div className="space-y-6 animate-fadeIn bg-gray-50 min-h-screen p-6 rounded-2xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-teal-600" />
              Teacher Console 🎓
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage class {selectedClass} • {classRoster.length} students • {resources.length} resources
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'overview' 
                ? 'bg-teal-100 text-teal-700 border border-teal-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'students' 
                ? 'bg-teal-100 text-teal-700 border border-teal-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Students
            </button>
            <button 
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'resources' 
                ? 'bg-teal-100 text-teal-700 border border-teal-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Resources
            </button>
            <button 
              onClick={() => setActiveTab('assessments')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'assessments' 
                ? 'bg-teal-100 text-teal-700 border border-teal-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                  <p className="text-xs text-gray-500">Total Students</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.averagePerformance}%</p>
                  <p className="text-xs text-gray-500">Avg Performance</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.assignmentsSubmitted}/{classRoster.length}</p>
                  <p className="text-xs text-gray-500">Assignments Submitted</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</p>
                  <p className="text-xs text-gray-500">Attendance Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <button 
                onClick={() => { setUploadType('notes'); setShowUploadModal(true); }}
                className="p-3 bg-teal-50 hover:bg-teal-100 rounded-xl text-sm font-medium text-teal-700 transition border border-teal-200 flex items-center gap-2 justify-center"
              >
                <Upload className="w-4 h-4" /> Upload Notes
              </button>
              <button 
                onClick={() => { setUploadType('paper'); setShowUploadModal(true); }}
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm font-medium text-blue-700 transition border border-blue-200 flex items-center gap-2 justify-center"
              >
                <FileText className="w-4 h-4" /> Question Papers
              </button>
              <button 
                onClick={() => { setUploadType('material'); setShowUploadModal(true); }}
                className="p-3 bg-purple-50 hover:bg-purple-100 rounded-xl text-sm font-medium text-purple-700 transition border border-purple-200 flex items-center gap-2 justify-center"
              >
                <BookOpen className="w-4 h-4" /> Study Material
              </button>
              <button 
                onClick={() => setShowQuizModal(true)}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-sm font-medium text-emerald-700 transition border border-emerald-200 flex items-center gap-2 justify-center"
              >
                <ClipboardList className="w-4 h-4" /> Create Quiz
              </button>
              <button 
                onClick={() => setShowAssessmentModal(true)}
                className="p-3 bg-amber-50 hover:bg-amber-100 rounded-xl text-sm font-medium text-amber-700 transition border border-amber-200 flex items-center gap-2 justify-center"
              >
                <Plus className="w-4 h-4" /> Create Assessment
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Recent Activity
            </h4>
            <div className="space-y-3">
              {classRoster.slice(0, 3).map((student, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.status}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPerformanceColor(student.performance)}`}>
                    {student.performance}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Select Class:</label>
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-sm font-medium rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {['7th', '8th', '9th', '10th', '11th', '12th'].map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Generate Report
            </button>
          </div>

          {classRoster.map((student) => {
            const isExpanded = expandedStudent === student.id;
            
            return (
              <div key={student.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleStudentExpand(student.id)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{student.name}</h4>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPerformanceColor(student.performance)}`}>
                        {student.performance}%
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.flag ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {student.flag ? '⚠️ Warning' : '✅ On Track'}
                      </span>
                      {isExpanded ? 
                        <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-6">
                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-3 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500">Performance</p>
                        <p className="text-lg font-bold text-gray-900">{student.performance}%</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500">Attendance</p>
                        <p className="text-lg font-bold text-gray-900">{student.attendance}%</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500">Assignments</p>
                        <p className="text-lg font-bold text-gray-900">{student.assignments}</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500">Status</p>
                        <p className={`text-lg font-bold ${student.submitted ? 'text-emerald-600' : 'text-red-600'}`}>
                          {student.submitted ? '✅ Submitted' : '❌ Pending'}
                        </p>
                      </div>
                    </div>

                    {/* Quiz Scores */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">Quiz Scores</h5>
                      <div className="flex gap-2 flex-wrap">
                        {student.quizzes.map((score, idx) => (
                          <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${getPerformanceColor(score)}`}>
                            Quiz {idx + 1}: {score}%
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Test Scores */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">Test Scores</h5>
                      <div className="flex gap-2 flex-wrap">
                        {student.testScores.map((score, idx) => (
                          <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${getPerformanceColor(score)}`}>
                            Test {idx + 1}: {score}%
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Educational Resources</h4>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload Resource
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <div key={resource.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-teal-300 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{resource.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full">
                          {resource.type}
                        </span>
                        <span className="text-xs text-gray-500">Class {resource.class}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 bg-white rounded-lg border border-gray-200 hover:border-teal-300 transition">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 bg-white rounded-lg border border-gray-200 hover:border-teal-300 transition">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>📅 {resource.date}</span>
                    <span>📥 {resource.downloads} downloads</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assessments Tab */}
      {activeTab === 'assessments' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Assessments & Tests</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowQuizModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create Quiz
                </button>
                <button 
                  onClick={() => setShowAssessmentModal(true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create Assessment
                </button>
              </div>
            </div>

            {/* Quizzes */}
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Quizzes</h5>
              <div className="space-y-3">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{quiz.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>Class {quiz.class}</span>
                          <span>📝 {quiz.questions} questions</span>
                          <span>⏱️ {quiz.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(quiz.status)}`}>
                          {quiz.status}
                        </span>
                        <span className="text-sm font-medium text-gray-700">Avg: {quiz.avgScore}%</span>
                        <button className="p-1.5 bg-white rounded-lg border border-gray-200 hover:border-teal-300 transition">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessments */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Assessments</h5>
              <div className="space-y-3">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{assessment.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>Class {assessment.class}</span>
                          <span>📋 {assessment.type}</span>
                          <span>📅 {assessment.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(assessment.status)}`}>
                          {assessment.status}
                        </span>
                        <button className="p-1.5 bg-white rounded-lg border border-gray-200 hover:border-teal-300 transition">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conduct Test Button */}
            <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h5 className="font-medium text-teal-900">Conduct Online Test</h5>
                  <p className="text-sm text-teal-700">Create and conduct online tests for your students</p>
                </div>
                <button 
                  onClick={() => setShowTestModal(true)}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" /> Conduct Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Upload {uploadType}</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Title</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500" placeholder="Resource title..." />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Class</label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500">
                  {['7th', '8th', '9th', '10th', '11th', '12th'].map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-400 transition">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Drop your file here or click to browse</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUploadModal(false)} className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition">Cancel</button>
              <button onClick={handleUpload} className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition">Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Create Quiz</h3>
              <button onClick={() => setShowQuizModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Quiz Title</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500" placeholder="e.g., Algebra Quiz 1" />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Class</label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500">
                  {['7th', '8th', '9th', '10th', '11th', '12th'].map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Number of Questions</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500" placeholder="10" />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Duration</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500" placeholder="e.g., 30 mins" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowQuizModal(false)} className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition">Cancel</button>
              <button onClick={handleCreateQuiz} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition">Create Quiz</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Create Assessment</h3>
              <button onClick={() => setShowAssessmentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Assessment Title</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-amber-500" placeholder="e.g., Mid Term Assessment" />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Type</label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-amber-500">
                  <option value="written">Written</option>
                  <option value="practical">Practical</option>
                  <option value="oral">Oral</option>
                  <option value="project">Project</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Date</label>
                <input type="date" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAssessmentModal(false)} className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition">Cancel</button>
              <button onClick={handleCreateAssessment} className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition">Create Assessment</button>
            </div>
          </div>
        </div>
      )}

      {/* Conduct Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Conduct Online Test</h3>
              <button onClick={() => setShowTestModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Test Title</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500" placeholder="e.g., Weekly Test - Week 3" />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Class</label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500">
                  {['7th', '8th', '9th', '10th', '11th', '12th'].map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Date & Time</label>
                <input type="datetime-local" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Duration (minutes)</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500" placeholder="60" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowTestModal(false)} className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition">Cancel</button>
              <button onClick={handleConductTest} className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition">Conduct Test</button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Generate Academic Report</h3>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Report Type</label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500">
                  <option value="class">Class Performance Report</option>
                  <option value="individual">Individual Student Report</option>
                  <option value="subject">Subject-wise Report</option>
                  <option value="assessment">Assessment Report</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Class</label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500">
                  {['7th', '8th', '9th', '10th', '11th', '12th'].map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Format</label>
                <select className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500">
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowReportModal(false)} className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition">Cancel</button>
              <button onClick={() => { setToast({ message: 'Report generated successfully!', type: 'success' }); setShowReportModal(false); }} className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
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