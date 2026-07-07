// src/components/TeacherProfile.jsx - Fixed version
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';
import logo from '../assets/logo.png';
import {
  Mail,
  Phone,
  MapPin,
  Award,
  Star,
  LogOut,
  Edit2,
  Save,
  X,
  Camera,
  TrendingUp,
  BarChart3,
  Clock,
  Trash2,
  RefreshCw,
  AlertCircle,
  Loader,
  ChevronDown,
  User,
  HelpCircle,
  Users,
  UserCheck,
  Activity,
  Calendar,
  GraduationCap,
  BookOpen,
  Search,
  ChevronRight,
  BookMarked,
  FileCheck,
  BarChart,
  PieChart,
  LineChart,
  Crown,
  School,
} from 'lucide-react';

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

const TeacherProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    role: user?.role || 'Teacher',
    subject: user?.subject || '',
    classes: user?.classes || '',
    school: user?.school || '',
    yearsOfExperience: user?.yearsOfExperience || '',
  });

  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Teacher data
  const [teacherData, setTeacherData] = useState({
    teacherInfo: {
      totalStudents: 45,
      activeStudents: 40,
      classes: ['10th', '11th', '12th'],
      subjects: ['Mathematics', 'Physics'],
      averageScore: 82,
      passRate: 92,
      totalHours: 320,
      assignmentsGiven: 156,
      assignmentsGraded: 142,
      studentsImproved: 32,
      totalAchievements: 18,
      avgRating: 4.7,
    },
    classPerformance: {
      '10th': 85,
      '11th': 78,
      '12th': 82
    },
    weeklyClasses: [8, 7, 9, 6, 8, 0, 0],
    students: [
      {
        id: 1,
        name: 'Alex Mercer',
        grade: '10th',
        subject: 'Mathematics',
        score: 88,
        progress: 12,
        attendance: 95,
        assignmentsCompleted: 8,
        status: 'Excellent'
      },
      {
        id: 2,
        name: 'Sarah Connor',
        grade: '10th',
        subject: 'Physics',
        score: 92,
        progress: 15,
        attendance: 98,
        assignmentsCompleted: 10,
        status: 'Outstanding'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        grade: '11th',
        subject: 'Mathematics',
        score: 72,
        progress: 8,
        attendance: 85,
        assignmentsCompleted: 6,
        status: 'Improving'
      },
      {
        id: 4,
        name: 'Emma Wilson',
        grade: '12th',
        subject: 'Physics',
        score: 78,
        progress: 10,
        attendance: 90,
        assignmentsCompleted: 7,
        status: 'Good'
      }
    ],
    recentActivities: [
      { student: 'Alex Mercer', action: 'Completed advanced math assignment', time: '2 hours ago', type: 'assignment' },
      { student: 'Sarah Connor', action: 'Scored 95% in Physics test', time: '4 hours ago', type: 'test' },
      { student: 'Mike Johnson', action: 'Improved math score by 10%', time: '1 day ago', type: 'improvement' }
    ],
    topStudents: [
      { name: 'Sarah Connor', score: 92, subject: 'Physics' },
      { name: 'Alex Mercer', score: 88, subject: 'Mathematics' },
      { name: 'Emma Wilson', score: 78, subject: 'Physics' }
    ],
    upcomingClasses: [
      { title: 'Algebra II - 10th', time: '9:00 AM', date: 'Today' },
      { title: 'Physics - 11th', time: '11:00 AM', date: 'Today' },
      { title: 'Math - 12th', time: '2:00 PM', date: 'Today' }
    ],
    subjectDistribution: {
      Mathematics: 25,
      Physics: 20
    }
  });

  const [stats, setStats] = useState({
    studyStreak: 0,
    workoutStreak: 0,
    habitStreak: 0,
    totalHours: 0,
    completedTasks: 0,
    achievementPoints: 0,
    rank: 'Platinum',
    level: 'Expert',
    badges: 0,
    consistency: 0
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const profileData = await profileService.getProfile();
      if (profileData) {
        setFormData({
          name: profileData.name || user?.name || '',
          email: profileData.email || user?.email || '',
          phone: profileData.phone || '',
          location: profileData.location || '',
          bio: profileData.bio || '',
          role: profileData.role || 'Teacher',
          subject: profileData.subject || '',
          classes: profileData.classes || '',
          school: profileData.school || '',
          yearsOfExperience: profileData.yearsOfExperience || '',
        });
        if (profileData.profileImage) setProfileImage(profileData.profileImage);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const updatedData = await profileService.updateProfile(formData);
      if (updateUser) updateUser(updatedData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
      location: user?.location || '', bio: user?.bio || '', role: user?.role || 'Teacher',
      subject: user?.subject || '', classes: user?.classes || '',
      school: user?.school || '', yearsOfExperience: user?.yearsOfExperience || ''
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }
    setIsUploading(true);
    setError('');
    try {
      const response = await profileService.uploadProfileImage(file);
      setProfileImage(response.imageUrl);
      if (updateUser) updateUser({ profileImage: response.imageUrl });
      setSuccess('Profile image updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const getRoleColor = (role) => {
    const colors = { student: MOSS, teacher: BRASS, mentor: REDINK, parent: SLATE };
    return colors[role?.toLowerCase()] || INK;
  };

  const getInitials = (name) =>
    name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const getDisciplineLevel = (score) => {
    if (score >= 90) return { label: 'Excellent', color: MOSS };
    if (score >= 75) return { label: 'Good', color: SLATE };
    if (score >= 50) return { label: 'Needs Improvement', color: BRASS };
    return { label: 'Needs Attention', color: REDINK };
  };

  const level = getDisciplineLevel(stats.consistency || 0);
  const roleColor = getRoleColor(formData.role);

  const GaugeDial = ({ score, color }) => {
    const cx = 70, cy = 74, r = 56, sw = 9;
    const polar = (cx, cy, r, angleDeg) => {
      const rad = (angleDeg * Math.PI) / 180;
      return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
    };
    const arcPath = (cx, cy, r, startAngle, endAngle) => {
      const s = polar(cx, cy, r, startAngle);
      const e = polar(cx, cy, r, endAngle);
      const large = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;
      return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
    };
    const needleAngle = 180 - (score / 100) * 180;
    const trackD = arcPath(cx, cy, r, 180, 0);
    const progD = arcPath(cx, cy, r, 180, needleAngle);
    const tip = polar(cx, cy, r - 18, needleAngle);
    return (
      <svg width="140" height="86" viewBox="0 0 140 86">
        <path d={trackD} fill="none" stroke={`${INK}14`} strokeWidth={sw} strokeLinecap="round" />
        <path d={progD} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4.5" fill={GOLD} stroke={INK} strokeWidth="1" />
        <text x={cx} y={cy - 12} textAnchor="middle" style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: '20px', fill: INK }}>
          {score}
        </text>
      </svg>
    );
  };

  const StatCard = ({ icon, value, label, accent }) => (
    <div className="p-4 rounded-sm border relative overflow-hidden" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: accent }} />
      <div className="flex items-center gap-3 pl-2">
        <div style={{ color: accent }}>{icon}</div>
        <div>
          <p className="text-xl leading-none" style={{ fontFamily: FONT_MONO, color: INK, fontWeight: 600 }}>{value}</p>
          <p className="text-[11px] mt-1" style={{ fontFamily: FONT_BODY, color: `${INK}77` }}>{label}</p>
        </div>
      </div>
    </div>
  );

  const Stamp = ({ children, accent, filled = true, onClick, icon, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-sm text-xs flex items-center gap-1.5 transition-colors hover:opacity-80 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{
        fontFamily: FONT_MONO,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        backgroundColor: filled ? accent : 'transparent',
        color: filled ? CARD : accent,
        border: `1px solid ${accent}`,
      }}
    >
      {icon}{children}
    </button>
  );

  const Panel = ({ children, style = {} }) => (
    <div className="p-5 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}14`, ...style }}>
      {children}
    </div>
  );

  const FieldRow = ({ icon, name, value, editing }) => (
    <div className="flex items-center gap-2 text-sm" style={{ color: `${INK}80` }}>
      {icon}
      {editing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          className="bg-transparent border-b px-1 focus:outline-none flex-1"
          style={{ borderColor: `${INK}26`, fontFamily: FONT_BODY }}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );

  const getProgressColor = (progress) => {
    if (progress >= 80) return MOSS;
    if (progress >= 60) return BRASS;
    return REDINK;
  };

  const getStatusColor = (status) => {
    const colors = {
      Outstanding: MOSS,
      Excellent: SLATE,
      Good: BRASS,
      Improving: '#B8892B',
      'Needs Attention': REDINK
    };
    return colors[status] || INK;
  };

  const filteredStudents = teacherData.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.grade === selectedClass;
    return matchesSearch && matchesClass;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: PAPER }}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: BRASS }} />
          <p style={{ color: `${INK}70` }}>Loading profile...</p>
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
        .dropdown-animation { animation: slideDown 0.2s ease-out both; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
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
        {/* NAVBAR */}
        <nav className="sticky top-0 z-50 px-6 py-3 flex justify-between items-center border-b-2 -ml-11 -mr-5 md:-mr-8"
          style={{ backgroundColor: `${PAPER}F2`, borderColor: `${INK}22`, backdropFilter: 'blur(6px)' }}>
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="Trackwise Logo" className="h-10 w-auto" />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-xs transition-colors hover:opacity-70"
              style={{ fontFamily: FONT_MONO, letterSpacing: '0.1em', textTransform: 'uppercase', color: `${INK}70` }}>
              ← Home
            </button>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 transition-colors hover:opacity-70 px-3 py-1.5 rounded-md border"
                style={{ borderColor: `${INK}22` }}>
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                  style={{ borderColor: getRoleColor(user?.role), color: getRoleColor(user?.role) }}>
                  {getInitials(user?.name)}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  style={{ color: `${INK}66` }} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border shadow-lg dropdown-animation"
                  style={{ backgroundColor: CARD, borderColor: `${INK}22`, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: `${INK}14` }}>
                    <p className="text-sm font-semibold" style={{ color: INK }}>{user?.name}</p>
                    <p className="text-[10px] uppercase tracking-wider" style={{ fontFamily: FONT_MONO, color: getRoleColor(user?.role) }}>
                      {user?.role || 'Teacher'}
                    </p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors hover:bg-opacity-10"
                      style={{ color: `${INK}CC`, backgroundColor: 'transparent' }}>
                      <User className="w-4 h-4" style={{ color: `${INK}66` }} /> My Profile
                    </button>
                    <button onClick={() => { navigate('/help-support'); setIsDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors hover:bg-opacity-10"
                      style={{ color: `${INK}CC`, backgroundColor: 'transparent' }}>
                      <HelpCircle className="w-4 h-4" style={{ color: `${INK}66` }} /> Help & Support
                    </button>
                  </div>
                  <div className="border-t" style={{ borderColor: `${INK}14` }} />
                  <div className="py-1">
                    <button onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
                      style={{ color: REDINK, backgroundColor: 'transparent' }}>
                      <LogOut className="w-4 h-4" style={{ color: REDINK }} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${BRASS}15`, color: BRASS, fontFamily: FONT_MONO }}>
              <BookOpen className="w-3 h-3 inline mr-1" /> Teacher
            </span>
            {stats.rank && (
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${GOLD}15`, color: GOLD, fontFamily: FONT_MONO }}>
                <Crown className="w-3 h-3 inline mr-1" /> {stats.rank}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            {isEditing ? (
              <>
                <Stamp accent={INK} filled={false} onClick={handleCancel} icon={<X className="w-3.5 h-3.5" />}>Cancel</Stamp>
                <Stamp accent={BRASS} onClick={handleSave} icon={<Save className="w-3.5 h-3.5" />} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Stamp>
              </>
            ) : (
              <Stamp accent={BRASS} onClick={() => setIsEditing(true)} icon={<Edit2 className="w-3.5 h-3.5" />}>Edit Profile</Stamp>
            )}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="p-4 rounded-sm border" style={{ backgroundColor: `${REDINK}08`, borderColor: `${REDINK}33` }}>
            <p className="text-sm" style={{ color: REDINK }}>{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 rounded-sm border" style={{ backgroundColor: `${MOSS}08`, borderColor: `${MOSS}33` }}>
            <p className="text-sm" style={{ color: MOSS }}>{success}</p>
          </div>
        )}

        {/* Profile Header */}
        <div className="rounded-sm border p-6" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative group shrink-0">
              <div className="absolute -inset-1.5 rounded-full" style={{ border: `1px dashed ${roleColor}55` }} />
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 flex items-center justify-center text-2xl overflow-hidden"
                style={{ borderColor: roleColor, backgroundColor: `${roleColor}15`, fontFamily: FONT_DISPLAY, fontWeight: 600, color: roleColor }}>
                {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : getInitials(formData.name)}
              </div>
              <button onClick={() => fileInputRef.current?.click()} disabled={isUploading}
                className="absolute bottom-0 right-0 p-1.5 rounded-full border-2 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: `${INK}22`, backgroundColor: CARD }}>
                {isUploading ? <Loader className="w-3.5 h-3.5 animate-spin" style={{ color: INK }} /> : <Camera className="w-3.5 h-3.5" style={{ color: INK }} />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-wrap items-center gap-2.5">
                {isEditing ? (
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                    className="sd-settle text-2xl bg-transparent border-b-2 px-1 py-1 focus:outline-none"
                    style={{ borderColor: roleColor, fontFamily: FONT_DISPLAY, fontWeight: 600 }} />
                ) : (
                  <h1 className="text-2xl" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}>{formData.name}</h1>
                )}
                <span className="px-2.5 py-1 rounded-full text-[10px]" style={{ fontFamily: FONT_MONO, letterSpacing: '0.08em', textTransform: 'uppercase',
                  backgroundColor: `${roleColor}15`, color: roleColor }}>Teacher</span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <FieldRow icon={<Mail className="w-3.5 h-3.5 shrink-0" />} name="email" value={formData.email} editing={isEditing} />
                <FieldRow icon={<Phone className="w-3.5 h-3.5 shrink-0" />} name="phone" value={formData.phone} editing={isEditing} />
                <FieldRow icon={<MapPin className="w-3.5 h-3.5 shrink-0" />} name="location" value={formData.location} editing={isEditing} />
                <FieldRow icon={<BookOpen className="w-3.5 h-3.5 shrink-0" />} name="subject" value={formData.subject} editing={isEditing} />
                <FieldRow icon={<School className="w-3.5 h-3.5 shrink-0" />} name="classes" value={formData.classes} editing={isEditing} />
                <FieldRow icon={<GraduationCap className="w-3.5 h-3.5 shrink-0" />} name="school" value={formData.school} editing={isEditing} />
                <FieldRow icon={<Clock className="w-3.5 h-3.5 shrink-0" />} name="yearsOfExperience" value={formData.yearsOfExperience} editing={isEditing} />
              </div>

              {isEditing ? (
                <textarea name="bio" value={formData.bio} onChange={handleInputChange}
                  className="sd-settle mt-3 w-full bg-transparent border rounded-sm p-2.5 text-sm focus:outline-none"
                  style={{ borderColor: `${INK}22`, fontFamily: FONT_BODY }} rows="2" placeholder="Write a short bio..." />
              ) : (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: `${INK}80` }}>{formData.bio || 'No bio yet. Click Edit Profile to add one.'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Teacher Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard icon={<Users className="w-4 h-4" />} value={teacherData.teacherInfo.totalStudents} label="Total Students" accent={BRASS} />
          <StatCard icon={<UserCheck className="w-4 h-4" />} value={teacherData.teacherInfo.activeStudents} label="Active Students" accent={MOSS} />
          <StatCard icon={<Award className="w-4 h-4" />} value={`${teacherData.teacherInfo.averageScore}%`} label="Avg Score" accent={SLATE} />
          <StatCard icon={<TrendingUp className="w-4 h-4" />} value={`${teacherData.teacherInfo.passRate}%`} label="Pass Rate" accent={MOSS} />
          <StatCard icon={<Clock className="w-4 h-4" />} value={`${teacherData.teacherInfo.totalHours}h`} label="Teaching Hours" accent={BRASS} />
          <StatCard icon={<BookMarked className="w-4 h-4" />} value={teacherData.teacherInfo.assignmentsGiven} label="Assignments" accent={SLATE} />
          <StatCard icon={<FileCheck className="w-4 h-4" />} value={teacherData.teacherInfo.assignmentsGraded} label="Graded" accent={MOSS} />
          <StatCard icon={<Star className="w-4 h-4" />} value={`${teacherData.teacherInfo.avgRating}/5`} label="Rating" accent={GOLD} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b" style={{ borderColor: `${INK}14` }}>
          {['overview', 'students', 'classes', 'performance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 text-xs font-medium transition-colors capitalize border-b-2"
              style={{
                borderColor: activeTab === tab ? BRASS : 'transparent',
                color: activeTab === tab ? BRASS : `${INK}70`
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Class Performance */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart className="w-5 h-5" style={{ color: BRASS }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Class Performance</h4>
                </div>
                <div className="space-y-4">
                  {Object.entries(teacherData.classPerformance).map(([className, score]) => (
                    <div key={className}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: `${INK}70` }}>Class {className}</span>
                        <span style={{ fontFamily: FONT_MONO, color: getProgressColor(score) }}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${INK}14` }}>
                        <div className="h-full rounded-full" style={{
                          width: `${score}%`,
                          backgroundColor: getProgressColor(score)
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Top Students */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5" style={{ color: GOLD }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Top Students</h4>
                </div>
                <div className="space-y-2">
                  {teacherData.topStudents.map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-sm" style={{ backgroundColor: `${GOLD}05` }}>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold" style={{ color: GOLD }}>#{idx + 1}</span>
                        <span className="font-medium">{student.name}</span>
                        <span className="text-xs" style={{ color: `${INK}60` }}>{student.subject}</span>
                      </div>
                      <span style={{ fontFamily: FONT_MONO, color: MOSS }}>{student.score}%</span>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Upcoming Classes */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5" style={{ color: SLATE }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Upcoming Classes</h4>
                </div>
                <div className="space-y-2">
                  {teacherData.upcomingClasses.map((cls, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-sm" style={{ backgroundColor: `${SLATE}05` }}>
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4" style={{ color: BRASS }} />
                        <div>
                          <p className="text-sm font-medium">{cls.title}</p>
                          <p className="text-xs" style={{ color: `${INK}60` }}>{cls.date}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium" style={{ color: BRASS }}>{cls.time}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Subject Distribution */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="w-5 h-5" style={{ color: SLATE }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Subject Distribution</h4>
                </div>
                <div className="space-y-2">
                  {Object.entries(teacherData.subjectDistribution).map(([subject, count]) => (
                    <div key={subject}>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: `${INK}70` }}>{subject}</span>
                        <span style={{ fontFamily: FONT_MONO, color: BRASS }}>{count}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${INK}14` }}>
                        <div className="h-full rounded-full" style={{
                          width: `${(count / teacherData.teacherInfo.totalStudents) * 100}%`,
                          backgroundColor: BRASS
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Quick Stats */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5" style={{ color: SLATE }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Teaching Summary</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border-b" style={{ borderColor: `${INK}0C` }}>
                    <span className="text-sm" style={{ color: `${INK}70` }}>Students Improved</span>
                    <span style={{ fontFamily: FONT_MONO, color: MOSS }}>{teacherData.teacherInfo.studentsImproved}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b" style={{ borderColor: `${INK}0C` }}>
                    <span className="text-sm" style={{ color: `${INK}70` }}>Total Achievements</span>
                    <span style={{ fontFamily: FONT_MONO, color: BRASS }}>{teacherData.teacherInfo.totalAchievements}</span>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <span className="text-sm" style={{ color: `${INK}70` }}>Avg Rating</span>
                    <span style={{ fontFamily: FONT_MONO, color: GOLD }}>{teacherData.teacherInfo.avgRating}/5</span>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: `${INK}50` }} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
                />
              </div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 rounded-sm text-sm border focus:outline-none"
                style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
              >
                <option value="all">All Classes</option>
                {teacherData.teacherInfo.classes.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            {filteredStudents.map((student) => {
              const isExpanded = selectedStudent === student.id;
              return (
                <div key={student.id} className="p-4 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: `${BRASS}15`, color: BRASS }}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <div className="flex items-center gap-3 text-xs" style={{ color: `${INK}60` }}>
                          <span>Class {student.grade}</span>
                          <span>{student.subject}</span>
                          <span>Attendance: {student.attendance}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm" style={{ color: `${INK}60` }}>Score</p>
                        <p className="text-lg font-bold" style={{ color: getProgressColor(student.score) }}>
                          {student.score}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm" style={{ color: `${INK}60` }}>Progress</p>
                        <p className="text-lg font-bold" style={{ color: MOSS }}>
                          +{student.progress}%
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full" style={{
                        backgroundColor: `${getStatusColor(student.status)}15`,
                        color: getStatusColor(student.status)
                      }}>
                        {student.status}
                      </span>
                      <button 
                        onClick={() => setSelectedStudent(isExpanded ? null : student.id)}
                        className="text-xs px-3 py-1 rounded-full flex items-center gap-1"
                        style={{ backgroundColor: `${BRASS}15`, color: BRASS }}
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                        <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: `${INK}0C` }}>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="p-2 rounded-sm" style={{ backgroundColor: `${SLATE}05` }}>
                          <p className="text-xs" style={{ color: `${INK}60` }}>Assignments</p>
                          <p className="font-bold">{student.assignmentsCompleted}</p>
                        </div>
                        <div className="p-2 rounded-sm" style={{ backgroundColor: `${MOSS}05` }}>
                          <p className="text-xs" style={{ color: `${INK}60` }}>Attendance</p>
                          <p className="font-bold" style={{ color: getProgressColor(student.attendance) }}>
                            {student.attendance}%
                          </p>
                        </div>
                        <div className="p-2 rounded-sm" style={{ backgroundColor: `${BRASS}05` }}>
                          <p className="text-xs" style={{ color: `${INK}60` }}>Status</p>
                          <p className="font-bold" style={{ color: getStatusColor(student.status) }}>
                            {student.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacherData.teacherInfo.classes.map((className) => (
              <Panel key={className}>
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-5 h-5" style={{ color: BRASS }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}>Class {className}</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: `${INK}70` }}>Performance</span>
                    <span style={{ fontFamily: FONT_MONO, color: getProgressColor(teacherData.classPerformance[className]) }}>
                      {teacherData.classPerformance[className]}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${INK}14` }}>
                    <div className="h-full rounded-full" style={{
                      width: `${teacherData.classPerformance[className]}%`,
                      backgroundColor: getProgressColor(teacherData.classPerformance[className])
                    }} />
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: `${INK}60` }}>
                    <span>Students: {teacherData.students.filter(s => s.grade === className).length}</span>
                    <span>Subject: {teacherData.teacherInfo.subjects.join(', ')}</span>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <Panel>
              <div className="flex items-center gap-2 mb-4">
                <LineChart className="w-5 h-5" style={{ color: MOSS }} />
                <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Weekly Class Schedule</h4>
              </div>
              <div className="flex items-end gap-2 h-32">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full rounded-t-sm transition-all"
                      style={{
                        height: `${Math.max((teacherData.weeklyClasses[idx] / 9) * 100, teacherData.weeklyClasses[idx] > 0 ? 8 : 3)}%`,
                        backgroundColor: teacherData.weeklyClasses[idx] > 0 ? BRASS : `${INK}14`,
                        opacity: teacherData.weeklyClasses[idx] > 0 ? 0.85 : 1,
                      }} />
                    <span className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}55` }}>{day}</span>
                    <span className="text-[9px]" style={{ fontFamily: FONT_MONO, color: `${INK}55` }}>{teacherData.weeklyClasses[idx]}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" style={{ color: MOSS }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Student Progress</h4>
                </div>
                <div className="space-y-3">
                  {teacherData.students.slice(0, 5).map((student) => (
                    <div key={student.id}>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: `${INK}70` }}>{student.name}</span>
                        <span style={{ fontFamily: FONT_MONO, color: getProgressColor(student.progress) }}>
                          +{student.progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${INK}14` }}>
                        <div className="h-full rounded-full" style={{
                          width: `${student.progress}%`,
                          backgroundColor: getProgressColor(student.progress)
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5" style={{ color: SLATE }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Recent Activities</h4>
                </div>
                <div className="space-y-3">
                  {teacherData.recentActivities.slice(0, 5).map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-sm" style={{ backgroundColor: `${SLATE}05` }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: `${SLATE}15`, color: SLATE }}>
                        {activity.student.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs" style={{ color: `${INK}60` }}>{activity.student} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="p-5 rounded-sm border relative overflow-hidden" style={{ backgroundColor: `${REDINK}08`, borderColor: `${REDINK}2E` }}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: REDINK }} />
          <h4 className="flex items-center gap-2 mb-1" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.05rem', color: REDINK }}>
            <AlertCircle className="w-4 h-4" /> Danger Zone
          </h4>
          <p className="text-xs mb-4" style={{ color: `${INK}70` }}>These actions are permanent and cannot be reversed.</p>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Stamp accent={REDINK} onClick={() => setShowDeleteConfirm(true)} icon={<Trash2 className="w-3.5 h-3.5" />}>Delete Account</Stamp>
            <Stamp accent={REDINK} filled={false} onClick={() => setShowDeleteConfirm(true)} icon={<RefreshCw className="w-3.5 h-3.5" />}>Reset Data</Stamp>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-md w-full p-6 border relative overflow-hidden" style={{ backgroundColor: CARD, borderColor: `${REDINK}55` }}>
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: REDINK }} />
            <p className="text-[11px] mb-2" style={{ fontFamily: FONT_MONO, color: REDINK, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Final Entry</p>
            <h3 className="text-xl mb-2" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}>Delete Account?</h3>
            <p className="text-sm leading-relaxed" style={{ color: `${INK}80` }}>This action cannot be undone. All your data, achievements, and progress will be permanently deleted.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2.5 rounded-sm text-sm border" style={{ borderColor: `${INK}22`, fontFamily: FONT_BODY }}>Cancel</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2.5 rounded-sm text-sm" style={{ backgroundColor: REDINK, color: CARD, fontFamily: FONT_MONO, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;