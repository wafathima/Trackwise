// src/components/ParentProfile.jsx
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
  ChevronRight,
  Dumbbell,
  ClipboardCheck,
  Flame,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle,
  Trophy,
  Medal,
  Target,
  Heart,
  Trash2,
  RefreshCw,
  AlertCircle,
  Loader,
  ChevronDown,
  User,
  HelpCircle,
  Users,
  Calendar,
  UserCheck,
  Activity,
  Crown,
  Home,
  Briefcase,
  MessageCircle 
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

const ParentProfile = () => {
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
  const [selectedChild, setSelectedChild] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    role: user?.role || 'Parent',
    occupation: user?.occupation || '',
    childrenCount: user?.childrenCount || '',
    preferredContact: user?.preferredContact || 'email',
  });

  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChildDetails, setShowChildDetails] = useState(null);

  // Mock data - In production, fetch from API
  const [parentStats, setParentStats] = useState({
    totalChildren: 2,
    activeChildren: 2,
    averageScore: 85,
    totalAchievements: 12,
    consistencyScore: 78,
    weeklyCheckins: 5,
    totalHoursMonitored: 124,
    improvementRate: 15,
    children: [
      {
        id: 1,
        name: 'Alex Mercer',
        age: 16,
        grade: '10th',
        school: 'St. Mary\'s High School',
        disciplineScore: 87,
        studyStreak: 5,
        workoutStreak: 3,
        habitStreak: 7,
        averageScore: 85,
        achievements: ['Study Master', 'Fitness Beginner', 'Consistency Star'],
        subjects: [
          { name: 'Mathematics', score: 88, progress: 85 },
          { name: 'Physics', score: 92, progress: 90 },
          { name: 'Chemistry', score: 78, progress: 75 },
          { name: 'English', score: 85, progress: 80 }
        ],
        weeklyData: {
          study: [4.5, 5.2, 3.8, 6.0, 4.2, 5.5, 4.0],
          workout: [1, 1, 0, 1, 1, 0, 1],
          habits: [7, 6, 7, 5, 7, 6, 7]
        },
        dailyHabits: [
          { name: 'Morning Study', completed: true, time: '7:00 AM' },
          { name: 'Exercise', completed: true, time: '4:00 PM' },
          { name: 'Reading', completed: false, time: '8:00 PM' },
          { name: 'Meditation', completed: true, time: '9:30 PM' }
        ],
        notifications: [
          { id: 1, message: 'Completed 5 study sessions this week!', type: 'achievement', date: 'Jan 15' },
          { id: 2, message: 'Scored 92% in Physics test', type: 'score', date: 'Jan 14' },
          { id: 3, message: 'Study streak: 5 days!', type: 'streak', date: 'Jan 13' }
        ],
        lastActive: '2 hours ago',
        overallStatus: 'Excellent'
      },
      {
        id: 2,
        name: 'Sarah Mercer',
        age: 14,
        grade: '8th',
        school: 'St. Mary\'s High School',
        disciplineScore: 92,
        studyStreak: 7,
        workoutStreak: 5,
        habitStreak: 10,
        averageScore: 90,
        achievements: ['Math Whiz', 'Fitness Star', 'Perfect Attendance'],
        subjects: [
          { name: 'Mathematics', score: 95, progress: 92 },
          { name: 'Science', score: 90, progress: 88 },
          { name: 'English', score: 88, progress: 85 },
          { name: 'Social Studies', score: 85, progress: 82 }
        ],
        weeklyData: {
          study: [5.0, 4.8, 5.5, 6.2, 5.8, 4.5, 5.2],
          workout: [1, 1, 1, 1, 1, 1, 1],
          habits: [7, 7, 7, 7, 7, 7, 7]
        },
        dailyHabits: [
          { name: 'Morning Study', completed: true, time: '6:30 AM' },
          { name: 'Exercise', completed: true, time: '5:00 PM' },
          { name: 'Reading', completed: true, time: '8:30 PM' },
          { name: 'Meditation', completed: true, time: '9:00 PM' }
        ],
        notifications: [
          { id: 1, message: 'Earned "Math Whiz" badge!', type: 'achievement', date: 'Jan 16' },
          { id: 2, message: 'Perfect attendance this week!', type: 'achievement', date: 'Jan 15' }
        ],
        lastActive: '1 hour ago',
        overallStatus: 'Outstanding'
      }
    ],
    recentActivities: [
      { child: 'Alex', action: 'Completed Math assignment', time: '2 hours ago' },
      { child: 'Sarah', action: 'Earned "Math Whiz" badge', time: '4 hours ago' },
      { child: 'Alex', action: 'Started Physics chapter 5', time: '6 hours ago' },
      { child: 'Sarah', action: 'Completed weekly workout goal', time: '1 day ago' }
    ],
    familyGoals: [
      { title: 'Improve overall discipline score', progress: 85, target: 90 },
      { title: 'Increase study streak for Alex', progress: 60, target: 30 },
      { title: 'Maintain workout consistency', progress: 90, target: 95 }
    ]
  });

  const [stats, setStats] = useState({
    studyStreak: 0,
    workoutStreak: 0,
    habitStreak: 0,
    totalHours: 0,
    completedTasks: 0,
    achievementPoints: 0,
    rank: 'Gold',
    level: 'Advanced',
    badges: 0,
    consistency: 0
  });

  const [achievements, setAchievements] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [weeklyData, setWeeklyData] = useState({
    study: [0,0,0,0,0,0,0],
    workout: [0,0,0,0,0,0,0],
    habits: [0,0,0,0,0,0,0]
  });

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

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
      const [profileData, statsData, achievementsData, activitiesData, weeklyProgressData] = await Promise.allSettled([
        profileService.getProfile(),
        profileService.getUserStats(),
        profileService.getAchievements(),
        profileService.getRecentActivities(),
        profileService.getWeeklyProgress()
      ]);

      if (profileData.status === 'fulfilled' && profileData.value) {
        const data = profileData.value;
        setFormData({
          name: data.name || user?.name || '',
          email: data.email || user?.email || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          role: data.role || 'Parent',
          occupation: data.occupation || '',
          childrenCount: data.childrenCount || '',
          preferredContact: data.preferredContact || 'email',
        });
        if (data.profileImage) setProfileImage(data.profileImage);
      }

      if (statsData.status === 'fulfilled' && statsData.value) {
        setStats(statsData.value);
      }

      if (achievementsData.status === 'fulfilled' && achievementsData.value) {
        setAchievements(achievementsData.value);
      } else {
        setDefaultAchievements();
      }

      if (activitiesData.status === 'fulfilled' && activitiesData.value) {
        setRecentActivities(activitiesData.value);
      } else {
        setDefaultActivities();
      }

      if (weeklyProgressData.status === 'fulfilled' && weeklyProgressData.value) {
        setWeeklyData(weeklyProgressData.value);
      } else {
        setDefaultWeeklyData();
      }

    } catch (error) {
      console.error('Error fetching profile data:', error);
      setDefaultStats();
      setDefaultAchievements();
      setDefaultActivities();
      setDefaultWeeklyData();
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultStats = () => {
    setStats({
      studyStreak: 0, workoutStreak: 0, habitStreak: 0, totalHours: 0,
      completedTasks: 0, achievementPoints: 0, rank: 'Gold', level: 'Advanced',
      badges: 0, consistency: 0
    });
  };

  const setDefaultAchievements = () => {
    setAchievements([
      { icon: <Trophy className="w-5 h-5" />, title: 'Super Parent', desc: 'Supporting 2+ children', earned: false, color: BRASS },
      { icon: <Medal className="w-5 h-5" />, title: 'Consistency Champion', desc: '30-day family tracking', earned: false, color: SLATE },
      { icon: <Star className="w-5 h-5" />, title: 'Family First', desc: 'All children improved', earned: false, color: MOSS },
      { icon: <Target className="w-5 h-5" />, title: 'Goal Achiever', desc: 'Helped achieve family goals', earned: false, color: REDINK },
      { icon: <Flame className="w-5 h-5" />, title: 'Motivator', desc: 'Kept children motivated', earned: false, color: BRASS },
      { icon: <Heart className="w-5 h-5" />, title: 'Caring Parent', desc: '100+ check-ins', earned: false, color: SLATE }
    ]);
  };

  const setDefaultActivities = () => {
    setRecentActivities([
      { icon: <Users className="w-4 h-4" />, action: 'No recent activities', time: '', color: SLATE }
    ]);
  };

  const setDefaultWeeklyData = () => {
    setWeeklyData({
      study: [0,0,0,0,0,0,0],
      workout: [0,0,0,0,0,0,0],
      habits: [0,0,0,0,0,0,0]
    });
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
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
      location: user?.location || '', bio: user?.bio || '', role: user?.role || 'Parent',
      occupation: user?.occupation || '', childrenCount: user?.childrenCount || '',
      preferredContact: user?.preferredContact || 'email'
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
      setError(error.message || 'Failed to upload image. Please try again.');
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

  const level = getDisciplineLevel(stats.consistency);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: PAPER }}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: SLATE }} />
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
          THE DISCIPLINE LEDGER
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
                      {user?.role || 'Parent'}
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
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${SLATE}15`, color: SLATE, fontFamily: FONT_MONO }}>
              <Home className="w-3 h-3 inline mr-1" /> Parent
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
                <Stamp accent={SLATE} onClick={handleSave} icon={<Save className="w-3.5 h-3.5" />} disabled={isSaving}>
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
                  backgroundColor: `${roleColor}15`, color: roleColor }}>Parent</span>
                {stats.rank && stats.rank !== 'Bronze' && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] flex items-center gap-1" style={{ fontFamily: FONT_MONO,
                    letterSpacing: '0.08em', textTransform: 'uppercase', backgroundColor: `${BRASS}15`, color: BRASS }}>
                    <Trophy className="w-3 h-3" /> {stats.rank}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-[10px] flex items-center gap-1" style={{ fontFamily: FONT_MONO,
                  letterSpacing: '0.08em', textTransform: 'uppercase', backgroundColor: `${level.color}15`, color: level.color }}>
                  <CheckCircle className="w-3 h-3" /> {level.label}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <FieldRow icon={<Mail className="w-3.5 h-3.5 shrink-0" />} name="email" value={formData.email} editing={isEditing} />
                <FieldRow icon={<Phone className="w-3.5 h-3.5 shrink-0" />} name="phone" value={formData.phone} editing={isEditing} />
                <FieldRow icon={<MapPin className="w-3.5 h-3.5 shrink-0" />} name="location" value={formData.location} editing={isEditing} />
                <FieldRow icon={<Briefcase className="w-3.5 h-3.5 shrink-0" />} name="occupation" value={formData.occupation} editing={isEditing} />
                <FieldRow icon={<Users className="w-3.5 h-3.5 shrink-0" />} name="childrenCount" value={formData.childrenCount} editing={isEditing} />
                <FieldRow icon={<MessageCircle className="w-3.5 h-3.5 shrink-0" />} name="preferredContact" value={formData.preferredContact} editing={isEditing} />
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

        {/* Parent Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard icon={<Users className="w-4 h-4" />} value={parentStats.totalChildren} label="Total Children" accent={SLATE} />
          <StatCard icon={<UserCheck className="w-4 h-4" />} value={parentStats.activeChildren} label="Active Children" accent={MOSS} />
          <StatCard icon={<Award className="w-4 h-4" />} value={parentStats.totalAchievements} label="Achievements" accent={BRASS} />
          <StatCard icon={<TrendingUp className="w-4 h-4" />} value={`${parentStats.averageScore}%`} label="Avg Score" accent={MOSS} />
          <StatCard icon={<Heart className="w-4 h-4" />} value={`${parentStats.consistencyScore}%`} label="Consistency" accent={REDINK} />
          <StatCard icon={<Calendar className="w-4 h-4" />} value={parentStats.weeklyCheckins} label="Check-ins/Week" accent={SLATE} />
          <StatCard icon={<Clock className="w-4 h-4" />} value={`${parentStats.totalHoursMonitored}h`} label="Hours Monitored" accent={BRASS} />
          <StatCard icon={<TrendingUp className="w-4 h-4" />} value={`${parentStats.improvementRate}%`} label="Improvement Rate" accent={MOSS} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b" style={{ borderColor: `${INK}14` }}>
          {['overview', 'children', 'progress', 'goals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 text-xs font-medium transition-colors capitalize border-b-2"
              style={{
                borderColor: activeTab === tab ? SLATE : 'transparent',
                color: activeTab === tab ? SLATE : `${INK}70`
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
              {/* Children Overview */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5" style={{ color: SLATE }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Children Overview</h4>
                </div>
                <div className="space-y-3">
                  {parentStats.children.map((child) => (
                    <div key={child.id} className="p-3 rounded-sm border cursor-pointer hover:shadow-sm transition-shadow"
                      style={{ borderColor: `${INK}0C` }}
                      onClick={() => setSelectedChild(selectedChild === child.id ? null : child.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: `${SLATE}15`, color: SLATE }}>
                            {child.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{child.name}</p>
                            <div className="flex items-center gap-3 text-xs" style={{ color: `${INK}60` }}>
                              <span>Class {child.grade}</span>
                              <span>{child.school}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{
                            backgroundColor: child.overallStatus === 'Outstanding' ? `${MOSS}15` :
                              child.overallStatus === 'Excellent' ? `${SLATE}15` : `${BRASS}15`,
                            color: child.overallStatus === 'Outstanding' ? MOSS :
                              child.overallStatus === 'Excellent' ? SLATE : BRASS
                          }}>
                            {child.overallStatus}
                          </span>
                          <span className="text-sm font-bold" style={{ color: getProgressColor(child.disciplineScore) }}>
                            {child.disciplineScore}%
                          </span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${selectedChild === child.id ? 'rotate-90' : ''}`}
                            style={{ color: `${INK}40` }} />
                        </div>
                      </div>

                      {selectedChild === child.id && (
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: `${INK}0C` }}>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-xs" style={{ color: `${INK}60` }}>
                              <span className="block">Study Streak: <span className="font-bold" style={{ color: MOSS }}>{child.studyStreak}d</span></span>
                              <span className="block">Workout Streak: <span className="font-bold" style={{ color: SLATE }}>{child.workoutStreak}d</span></span>
                              <span className="block">Habit Streak: <span className="font-bold" style={{ color: BRASS }}>{child.habitStreak}d</span></span>
                            </div>
                            <div className="text-xs" style={{ color: `${INK}60` }}>
                              <span className="block">Avg Score: <span className="font-bold" style={{ color: MOSS }}>{child.averageScore}%</span></span>
                              <span className="block">Achievements: <span className="font-bold" style={{ color: BRASS }}>{child.achievements.length}</span></span>
                              <span className="block">Last Active: <span className="font-bold" style={{ color: SLATE }}>{child.lastActive}</span></span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Recent Activities */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5" style={{ color: SLATE }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Recent Activities</h4>
                </div>
                <div className="space-y-3">
                  {parentStats.recentActivities.map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-sm" style={{ backgroundColor: `${SLATE}05` }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: `${SLATE}15`, color: SLATE }}>
                          {activity.child.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm">{activity.action}</p>
                          <p className="text-xs" style={{ color: `${INK}60` }}>{activity.child}</p>
                        </div>
                      </div>
                      <span className="text-xs" style={{ color: `${INK}50` }}>{activity.time}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Family Goals */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5" style={{ color: BRASS }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Family Goals</h4>
                </div>
                <div className="space-y-4">
                  {parentStats.familyGoals.map((goal, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: `${INK}70` }}>{goal.title}</span>
                        <span style={{ fontFamily: FONT_MONO, color: getProgressColor(goal.progress) }}>
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${INK}14` }}>
                        <div className="h-full rounded-full" style={{
                          width: `${goal.progress}%`,
                          backgroundColor: getProgressColor(goal.progress)
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Quick Family Stats */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5" style={{ color: SLATE }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Family Summary</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border-b" style={{ borderColor: `${INK}0C` }}>
                    <span className="text-sm" style={{ color: `${INK}70` }}>Total Achievements</span>
                    <span style={{ fontFamily: FONT_MONO, color: BRASS }}>{parentStats.totalAchievements}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b" style={{ borderColor: `${INK}0C` }}>
                    <span className="text-sm" style={{ color: `${INK}70` }}>Average Score</span>
                    <span style={{ fontFamily: FONT_MONO, color: MOSS }}>{parentStats.averageScore}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b" style={{ borderColor: `${INK}0C` }}>
                    <span className="text-sm" style={{ color: `${INK}70` }}>Consistency Score</span>
                    <span style={{ fontFamily: FONT_MONO, color: SLATE }}>{parentStats.consistencyScore}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <span className="text-sm" style={{ color: `${INK}70` }}>Improvement Rate</span>
                    <span style={{ fontFamily: FONT_MONO, color: MOSS }}>+{parentStats.improvementRate}%</span>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* Children Tab - Detailed View */}
        {activeTab === 'children' && (
          <div className="space-y-4">
            {parentStats.children.map((child) => (
              <div key={child.id} className="p-4 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{ backgroundColor: `${SLATE}15`, color: SLATE }}>
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">{child.name}</p>
                      <div className="flex items-center gap-3 text-xs" style={{ color: `${INK}60` }}>
                        <span>Class {child.grade}</span>
                        <span>•</span>
                        <span>{child.school}</span>
                        <span>•</span>
                        <span style={{ color: getProgressColor(child.disciplineScore) }}>
                          {child.disciplineScore}% discipline
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full" style={{
                      backgroundColor: child.overallStatus === 'Outstanding' ? `${MOSS}15` :
                        child.overallStatus === 'Excellent' ? `${SLATE}15` : `${BRASS}15`,
                      color: child.overallStatus === 'Outstanding' ? MOSS :
                        child.overallStatus === 'Excellent' ? SLATE : BRASS
                    }}>
                      {child.overallStatus}
                    </span>
                    <Stamp accent={SLATE} onClick={() => setShowChildDetails(showChildDetails === child.id ? null : child.id)}>
                      {showChildDetails === child.id ? 'Hide Details' : 'View Details'}
                    </Stamp>
                  </div>
                </div>

                {showChildDetails === child.id && (
                  <div className="mt-4 pt-4 border-t space-y-4" style={{ borderColor: `${INK}0C` }}>
                    {/* Subjects */}
                    <div>
                      <h5 className="text-xs font-semibold mb-2" style={{ color: `${INK}70` }}>Subject Performance</h5>
                      <div className="grid grid-cols-2 gap-3">
                        {child.subjects.map((subject, idx) => (
                          <div key={idx} className="p-2 rounded-sm" style={{ backgroundColor: `${SLATE}05` }}>
                            <div className="flex justify-between text-sm">
                              <span>{subject.name}</span>
                              <span style={{ color: getProgressColor(subject.score) }}>{subject.score}%</span>
                            </div>
                            <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${INK}14` }}>
                              <div className="h-full rounded-full" style={{
                                width: `${subject.progress}%`,
                                backgroundColor: getProgressColor(subject.score)
                              }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Streaks */}
                    <div>
                      <h5 className="text-xs font-semibold mb-2" style={{ color: `${INK}70` }}>Streaks</h5>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${MOSS}15` }}>
                          <Flame className="w-3 h-3" style={{ color: MOSS }} />
                          <span className="text-xs font-bold" style={{ color: MOSS }}>{child.studyStreak}d Study</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${SLATE}15` }}>
                          <Dumbbell className="w-3 h-3" style={{ color: SLATE }} />
                          <span className="text-xs font-bold" style={{ color: SLATE }}>{child.workoutStreak}d Workout</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${BRASS}15` }}>
                          <ClipboardCheck className="w-3 h-3" style={{ color: BRASS }} />
                          <span className="text-xs font-bold" style={{ color: BRASS }}>{child.habitStreak}d Habits</span>
                        </div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h5 className="text-xs font-semibold mb-2" style={{ color: `${INK}70` }}>Achievements</h5>
                      <div className="flex flex-wrap gap-2">
                        {child.achievements.map((ach, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${BRASS}15`, color: BRASS }}>
                            🏅 {ach}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {parentStats.children.map((child) => (
              <Panel key={child.id}>
                <h4 className="font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>{child.name}'s Progress</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: `${INK}70` }}>Overall Progress</span>
                      <span style={{ fontFamily: FONT_MONO, color: getProgressColor(child.disciplineScore) }}>
                        {child.disciplineScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${INK}14` }}>
                      <div className="h-full rounded-full" style={{
                        width: `${child.disciplineScore}%`,
                        backgroundColor: getProgressColor(child.disciplineScore)
                      }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-sm" style={{ backgroundColor: `${MOSS}10` }}>
                      <p className="text-xs" style={{ color: `${INK}60` }}>Study</p>
                      <p className="text-lg font-bold" style={{ color: MOSS }}>{child.studyStreak}d</p>
                    </div>
                    <div className="p-2 rounded-sm" style={{ backgroundColor: `${SLATE}10` }}>
                      <p className="text-xs" style={{ color: `${INK}60` }}>Workout</p>
                      <p className="text-lg font-bold" style={{ color: SLATE }}>{child.workoutStreak}d</p>
                    </div>
                    <div className="p-2 rounded-sm" style={{ backgroundColor: `${BRASS}10` }}>
                      <p className="text-xs" style={{ color: `${INK}60` }}>Habits</p>
                      <p className="text-lg font-bold" style={{ color: BRASS }}>{child.habitStreak}d</p>
                    </div>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <Panel>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5" style={{ color: BRASS }} />
              <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Family Goals & Progress</h4>
            </div>
            <div className="space-y-6">
              {parentStats.familyGoals.map((goal, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{goal.title}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm" style={{ color: `${INK}60}` }}>
                        Target: {goal.target}
                      </span>
                      <span className="text-sm font-bold" style={{ color: getProgressColor(goal.progress) }}>
                        {goal.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${INK}14` }}>
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${goal.progress}%`,
                      backgroundColor: getProgressColor(goal.progress)
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
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

export default ParentProfile;