// src/components/StudyResources.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import studyService from '../services/studyService';
import {
  BookOpen,
  FileText,
  FileQuestion,
  Award,
  Sparkles,
  GraduationCap,
  ArrowLeft,
  CheckCircle,
  BarChart3,
  Target,
  Search,
  Download,
  Eye,
  Calendar,
  User,
  Star,
  Brain,
  FileCheck,
  ScrollText,
  MessageCircle,
  Timer,
  Layers,
  X,
  Loader,
  ClipboardList,
  AlertTriangle
} from 'lucide-react';

// ============================================================
//  COLOR TOKENS — must be defined before any component uses them
// ============================================================
const INK = '#1C2B39';
const PAPER = '#F1EBDA';
const CARD = '#FBF8EF';
const MOSS = '#3F6B52';
const BRASS = '#B8892B';
const SLATE = '#4A6C8C';
const REDINK = '#A63D40';
const GOLD = '#D9B25C';

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'Work Sans', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const StudyResources = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [expandedItem, setExpandedItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [resources, setResources] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({
    totalResources: 0,
    totalDownloads: 0,
    totalQuizzes: 0,
    averageScore: 0
  });

  // Categories for filter
  const categories = [
    { id: 'all', label: 'All Resources', icon: <Layers className="w-4 h-4" /> },
    { id: 'textbook', label: 'Full Textbook PDFs', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'notes', label: 'Chapter Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'paper', label: 'Previous Year Papers', icon: <ScrollText className="w-4 h-4" /> },
    { id: 'revision', label: 'Quick Revision Notes', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'mcq', label: 'MCQ Practice Tests', icon: <FileQuestion className="w-4 h-4" /> },
    { id: 'solutions', label: 'Exercise Solutions', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'curriculum', label: 'Curriculum Guides', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'quiz', label: 'Quizzes', icon: <ClipboardList className="w-4 h-4" /> },
  ];

  // Classes for filter
  const classes = ['all', '7th', '8th', '9th', '10th', '11th', '12th'];

  // Subjects for filter
  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies', 'General'];

  // Fetch data on mount
  useEffect(() => {
    fetchResources();
    fetchQuizzes();
  }, []);

// Fetch resources with filters
const fetchResources = async () => {
  setLoading(true);
  try {
    console.log('studyService object:', studyService);
    console.log('studyService.getResources:', typeof studyService.getResources);
    
    const params = {
      class: selectedClass,
      subject: selectedSubject,
      search: searchTerm
    };
    
    // Map category to type if not 'all'
    if (selectedCategory !== 'all') {
      const categoryMap = {
        'textbook': 'textbook',
        'notes': 'notes',
        'paper': 'paper',
        'revision': 'revision',
        'mcq': 'mcq',
        'solutions': 'solutions',
        'curriculum': 'curriculum'
      };
      params.type = categoryMap[selectedCategory] || null;
    }
    
    console.log('Fetching resources with params:', params);
    const data = await studyService.getResources(params);
    console.log('Resources received:', data);
    setResources(data || []);
    
    // Update stats
    const totalDownloads = data.reduce((acc, r) => acc + (r.downloads || 0), 0);
    setStats(prev => ({
      ...prev,
      totalResources: data.length,
      totalDownloads: totalDownloads
    }));
    
  } catch (error) {
    console.error('Error fetching resources:', error);
    setToast({ message: 'Failed to load resources', type: 'error' });
    setTimeout(() => setToast(null), 3000);
  } finally {
    setLoading(false);
  }
};

// Fetch quizzes
const fetchQuizzes = async () => {
  try {
    console.log('Fetching quizzes...');
    const data = await studyService.getQuizzes();
    console.log('Quizzes received:', data);
    setQuizzes(data || []);
    setStats(prev => ({
      ...prev,
      totalQuizzes: data.length
    }));
  } catch (error) {
    console.error('Error fetching quizzes:', error);
  }
};

  // Fetch on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResources();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedClass, selectedSubject, selectedCategory]);

  // Handle resource download
  const handleDownload = async (resourceId) => {
    try {
      const blob = await studyService.downloadResource(resourceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const resource = resources.find(r => r.id === resourceId);
      link.download = resource?.fileName || 'download.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setResources(prev => prev.map(r => 
        r.id === resourceId ? { ...r, downloads: (r.downloads || 0) + 1 } : r
      ));
      
      setToast({ message: 'Download started!', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    } catch (error) {
      console.error('Error downloading:', error);
      setToast({ message: 'Failed to download resource', type: 'error' });
      setTimeout(() => setToast(null), 2000);
    }
  };

  // Handle view resource
//   const handleView = async (resourceId) => {
//     if (expandedItem === resourceId) {
//       setExpandedItem(null);
//       return;
//     }
    
//     try {
//       const resource = resources.find(r => r.id === resourceId);
//       if (resource?.filePath) {
//         const fileUrl = `/uploads/resources/${resource.fileName}`;
//         window.open(fileUrl, '_blank');
//         setExpandedItem(resourceId);
//       }
//     } catch (error) {
//       console.error('Error viewing resource:', error);
//       setToast({ message: 'Failed to view resource', type: 'error' });
//       setTimeout(() => setToast(null), 2000);
//     }
//   };

// src/components/StudyResources.jsx - Update the handleView function

// Handle view resource
const handleView = async (resourceId) => {
  if (expandedItem === resourceId) {
    setExpandedItem(null);
    return;
  }
  
  try {
    const resource = resources.find(r => r.id === resourceId);
    if (resource?.fileName) {
      // Open file in new tab
      const fileUrl = `http://localhost:8080/uploads/resources/${resource.fileName}`;
      window.open(fileUrl, '_blank');
      setExpandedItem(resourceId);
    } else {
      setToast({ message: 'File not available', type: 'error' });
      setTimeout(() => setToast(null), 2000);
    }
  } catch (error) {
    console.error('Error viewing resource:', error);
    setToast({ message: 'Failed to view resource', type: 'error' });
    setTimeout(() => setToast(null), 2000);
  }
};

  // Handle start quiz
  const handleStartQuiz = async (quizId) => {
    try {
      await studyService.startQuiz(quizId);
      setToast({ message: 'Quiz started!', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    } catch (error) {
      console.error('Error starting quiz:', error);
      setToast({ message: 'Failed to start quiz', type: 'error' });
      setTimeout(() => setToast(null), 2000);
    }
  };

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesClass = selectedClass === 'all' || resource.class === selectedClass || resource.class === 'all';
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    return matchesSearch && matchesClass && matchesSubject;
  });

  // Filter quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || quiz.class === selectedClass;
    const matchesSubject = selectedSubject === 'all' || quiz.subject === selectedSubject;
    return matchesSearch && matchesClass && matchesSubject;
  });

  // Get type color
  const getTypeColor = (type) => {
    const colors = {
      textbook: MOSS,
      notes: SLATE,
      paper: BRASS,
      revision: GOLD,
      mcq: REDINK,
      solutions: MOSS,
      curriculum: SLATE,
      material: MOSS
    };
    return colors[type] || INK;
  };

  // Get type icon
  const getTypeIcon = (type) => {
    const icons = {
      textbook: <BookOpen className="w-4 h-4" />,
      notes: <FileText className="w-4 h-4" />,
      paper: <ScrollText className="w-4 h-4" />,
      revision: <Sparkles className="w-4 h-4" />,
      mcq: <FileQuestion className="w-4 h-4" />,
      solutions: <FileCheck className="w-4 h-4" />,
      curriculum: <GraduationCap className="w-4 h-4" />,
      material: <FileText className="w-4 h-4" />
    };
    return icons[type] || <FileText className="w-4 h-4" />;
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
      <span className="text-sm" style={{ color: INK }}>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-60" style={{ color: `${INK}88` }}>
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  if (loading && resources.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: PAPER }}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: SLATE }} />
          <p style={{ color: `${INK}70` }}>Loading study resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: PAPER, color: INK, fontFamily: FONT_BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .resource-card {
          transition: all 0.2s ease;
        }
        .resource-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .expand-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.3s ease;
          opacity: 0;
        }
        .expand-content.open {
          max-height: 500px;
          opacity: 1;
        }
      `}</style>

      {/* ruled paper texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, ${INK}0A 32px)` }}
      />

      {/* binding spine */}
      <div
        className="fixed left-0 top-0 bottom-0 w-9 z-40 pointer-events-none hidden md:block"
        aria-hidden="true"
        style={{
          background: `linear-gradient(to right, ${INK}0F, transparent), repeating-linear-gradient(to bottom, transparent 0px, transparent 37px, ${BRASS}66 38px, ${BRASS}66 40px, transparent 41px)`,
          borderRight: `1px solid ${INK}1A`,
        }}
      >
        <div
          className="absolute left-1"
          style={{
            top: '50%',
            transform: 'translateY(-50%) rotate(180deg)',
            writingMode: 'vertical-rl',
            fontFamily: FONT_MONO,
            fontSize: '9px',
            letterSpacing: '0.2em',
            color: `${INK}55`,
          }}
        >
          STUDY RESOURCES
        </div>
      </div>

      <div className="relative md:pl-9">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Header */}
        <div className="border-b sticky top-0 z-10 backdrop-blur-md" style={{ borderColor: `${INK}14`, backgroundColor: `${PAPER}CC` }}>
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-4">
            <button
              onClick={() => navigate('/features/studies')}
              className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-100"
              style={{ fontFamily: FONT_MONO, letterSpacing: '0.1em', textTransform: 'uppercase', color: `${INK}70` }}
            >
              <ArrowLeft className="w-3 h-3" /> Back to Studies
            </button>

            <div className="flex items-center gap-4 mt-3">
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center border shrink-0"
                style={{ backgroundColor: `${MOSS}12`, color: MOSS, borderColor: `${MOSS}33` }}
              >
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] mb-1" style={{ fontFamily: FONT_MONO, color: MOSS, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Study Resources
                </p>
                <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.9rem', letterSpacing: '-0.01em' }}>
                  Learning Materials
                </h1>
                <p className="text-sm mt-1" style={{ color: `${INK}80` }}>
                  {resources.length} resources • {quizzes.length} quizzes • {stats.totalDownloads} downloads
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <BookOpen className="w-4 h-4" />, label: 'Resources', value: resources.length + quizzes.length },
              { icon: <Download className="w-4 h-4" />, label: 'Downloads', value: stats.totalDownloads },
              { icon: <FileQuestion className="w-4 h-4" />, label: 'Quizzes', value: quizzes.length },
              { icon: <Award className="w-4 h-4" />, label: 'Avg Score', value: `${stats.averageScore || 0}%` }
            ].map((stat, idx) => (
              <div key={idx} className="p-3 rounded-sm border relative overflow-hidden" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: MOSS }} />
                <div className="flex items-center gap-2 pl-2">
                  <span style={{ color: MOSS }}>{stat.icon}</span>
                  <div>
                    <p className="text-lg leading-none" style={{ fontFamily: FONT_MONO, fontWeight: 700, color: INK }}>{stat.value}</p>
                    <p className="text-[10px]" style={{ color: `${INK}60` }}>{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="rounded-sm border p-4" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: `${INK}50` }} />
                <input
                  type="text"
                  placeholder="Search resources, topics, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-sm border text-sm focus:outline-none"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-sm text-sm border focus:outline-none"
                style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 rounded-sm text-sm border focus:outline-none"
                style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls === 'all' ? 'All Classes' : `Class ${cls}`}</option>
                ))}
              </select>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 rounded-sm text-sm border focus:outline-none"
                style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
              >
                {subjects.map(sub => (
                  <option key={sub} value={sub}>{sub === 'all' ? 'All Subjects' : sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
              Resources
              <span className="text-xs font-normal ml-2" style={{ color: `${INK}60`, fontFamily: FONT_MONO }}>
                ({filteredResources.length} items)
              </span>
            </h3>

            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((resource) => {
                  const isExpanded = expandedItem === resource.id;
                  const color = getTypeColor(resource.type);
                  
                  return (
                    <div
                      key={resource.id}
                      className="resource-card rounded-sm border overflow-hidden"
                      style={{ backgroundColor: CARD, borderColor: `${INK}14` }}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span style={{ color }}>{getTypeIcon(resource.type)}</span>
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-sm"
                                style={{ backgroundColor: `${color}15`, color }}
                              >
                                {resource.type}
                              </span>
                              <span className="text-[10px]" style={{ color: `${INK}50` }}>•</span>
                              <span className="text-[10px]" style={{ color: `${INK}50` }}>
                                Class {resource.class}
                              </span>
                            </div>
                            <h4 className="text-sm font-medium mt-1 truncate" style={{ fontFamily: FONT_DISPLAY }}>
                              {resource.title}
                            </h4>
                            <p className="text-xs mt-1 line-clamp-2" style={{ color: `${INK}70` }}>
                              {resource.description}
                            </p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => handleView(resource.id)}
                              className="p-1.5 rounded-sm border transition-colors hover:opacity-70"
                              style={{ borderColor: `${INK}22` }}
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" style={{ color: `${INK}60` }} />
                            </button>
                            <button
                              onClick={() => handleDownload(resource.id)}
                              className="p-1.5 rounded-sm border transition-colors hover:opacity-70"
                              style={{ borderColor: `${INK}22` }}
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" style={{ color: MOSS }} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: `${INK}50` }}>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {resource.uploadedByName || 'Unknown'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" /> {resource.downloads || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" style={{ color: GOLD }} /> {resource.rating || 0}
                          </span>
                        </div>

                        {/* Expanded Details */}
                        <div className={`expand-content ${isExpanded ? 'open' : ''}`}>
                          <div className="pt-3 mt-3 border-t space-y-2" style={{ borderColor: `${INK}14` }}>
                            {resource.tags && resource.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {resource.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] px-2 py-0.5 rounded-full"
                                    style={{ backgroundColor: `${color}10`, color }}
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex justify-between text-xs" style={{ color: `${INK}60` }}>
                              <span>File Size: {resource.fileSize || 'N/A'}</span>
                              <span>Subject: {resource.subject}</span>
                            </div>
                            {resource.type === 'mcq' && (
                              <button
                                className="w-full py-1.5 rounded-sm text-xs font-medium transition-colors hover:opacity-80 mt-2"
                                style={{ backgroundColor: MOSS, color: CARD }}
                              >
                                Start Practice Test
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: `${INK}30` }} />
                <p style={{ color: `${INK}60` }}>No resources found matching your filters.</p>
                <p className="text-sm" style={{ color: `${INK}40` }}>Try adjusting your search or filters.</p>
              </div>
            )}
          </div>

          {/* Quizzes Section */}
          {filteredQuizzes.length > 0 && (
            <div className="space-y-4 mt-8">
              <h3 className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                Quizzes & Assessments
                <span className="text-xs font-normal ml-2" style={{ color: `${INK}60`, fontFamily: FONT_MONO }}>
                  ({filteredQuizzes.length} quizzes)
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="rounded-sm border p-4"
                    style={{ backgroundColor: CARD, borderColor: `${INK}14` }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-sm" style={{ backgroundColor: `${BRASS}15`, color: BRASS }}>
                            {quiz.status}
                          </span>
                          <span className="text-[10px]" style={{ color: `${INK}50` }}>Class {quiz.class}</span>
                        </div>
                        <h4 className="text-sm font-medium mt-1" style={{ fontFamily: FONT_DISPLAY }}>
                          {quiz.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: `${INK}60` }}>
                          <span>{quiz.subject}</span>
                          <span>📝 {quiz.questions} questions</span>
                          <span>⏱️ {quiz.duration}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: MOSS }}>{quiz.avgScore || 0}%</p>
                        <p className="text-[10px]" style={{ color: `${INK}50` }}>{quiz.attempts || 0} attempts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartQuiz(quiz.id)}
                      className="w-full mt-3 py-1.5 rounded-sm text-xs font-medium transition-colors hover:opacity-80"
                      style={{ backgroundColor: quiz.status === 'active' ? MOSS : `${INK}20`, color: quiz.status === 'active' ? CARD : `${INK}60` }}
                      disabled={quiz.status !== 'active'}
                    >
                      {quiz.status === 'active' ? 'Start Quiz' : 'Completed'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Learning Tools */}
          <div className="rounded-sm border p-6 mt-8" style={{ backgroundColor: `${MOSS}08`, borderColor: `${MOSS}2E` }}>
            <h3 className="flex items-center gap-2 mb-4" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem', color: MOSS }}>
              <Sparkles className="w-4 h-4" /> Smart Learning Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { icon: <Brain className="w-4 h-4" />, label: 'AI Doubt Assistant', desc: 'Ask any question and get instant answers' },
                { icon: <Timer className="w-4 h-4" />, label: 'Focus Mode', desc: 'Pomodoro timer with study tracking' },
                { icon: <Target className="w-4 h-4" />, label: 'Personalized Recommendations', desc: 'Get custom study suggestions' },
                { icon: <MessageCircle className="w-4 h-4" />, label: 'General Knowledge Q&A', desc: 'Expand your knowledge base' },
                { icon: <BarChart3 className="w-4 h-4" />, label: 'Progress Tracking', desc: 'Monitor your study progress' },
                { icon: <Award className="w-4 h-4" />, label: 'Weekly Badges', desc: 'Earn achievements for consistency' }
              ].map((tool, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-sm" style={{ backgroundColor: `${MOSS}05` }}>
                  <span style={{ color: MOSS }}>{tool.icon}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: INK }}>{tool.label}</p>
                    <p className="text-xs" style={{ color: `${INK}60` }}>{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <div className="rounded-sm text-center p-8 relative overflow-hidden" style={{ backgroundColor: INK }}>
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{ backgroundImage: `repeating-linear-gradient(45deg, ${PAPER} 0px, ${PAPER} 1px, transparent 1px, transparent 12px)` }}
            />
            <p className="text-[11px] mb-2 relative" style={{ fontFamily: FONT_MONO, color: `${PAPER}80`, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Ready to Learn?
            </p>
            <h3 className="relative mb-2" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.4rem', color: PAPER }}>
              Start Your Study Session
            </h3>
            <p className="relative text-sm mb-5" style={{ color: `${PAPER}90` }}>
              Access all resources, take quizzes, and track your progress
            </p>
            <button
              className="relative px-7 py-2.5 rounded-sm text-sm transition-transform active:scale-95"
              style={{ backgroundColor: PAPER, color: MOSS, fontFamily: FONT_MONO, letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              Begin Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyResources;