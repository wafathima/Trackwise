// src/components/ParentProfile.jsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';
import parentService from '../services/parentService';
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
  const [showChildDetails, setShowChildDetails] = useState(null);

  // Real data states
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

  // Real data from API
  const [parentStats, setParentStats] = useState({
    totalChildren: 0,
    activeChildren: 0,
    averageScore: 0,
    totalAchievements: 0,
    consistencyScore: 0,
    weeklyCheckins: 0,
    totalHoursMonitored: 0,
    improvementRate: 0,
    children: [],
    recentActivities: [],
    familyGoals: []
  });

  const [stats, setStats] = useState({
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
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch all data in parallel
      const [
        profileData,
        statsData,
        achievementsData,
        activitiesData,
        weeklyProgressData,
        childrenData,
        familyStatsData
      ] = await Promise.allSettled([
        profileService.getProfile(),
        profileService.getUserStats(),
        profileService.getAchievements(),
        profileService.getRecentActivities(),
        profileService.getWeeklyProgress(),
        parentService.getChildren().catch(() => []),
        parentService.getFamilyStats().catch(() => null)
      ]);

      // 1. Profile Data
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

      // 2. User Stats
      if (statsData.status === 'fulfilled' && statsData.value) {
        setStats(statsData.value);
      }

      // 3. Achievements
      if (achievementsData.status === 'fulfilled' && achievementsData.value) {
        setAchievements(achievementsData.value);
      } else {
        setDefaultAchievements();
      }

      // 4. Recent Activities
      if (activitiesData.status === 'fulfilled' && activitiesData.value) {
        setRecentActivities(activitiesData.value);
      } else {
        setDefaultActivities();
      }

      // 5. Weekly Progress
      if (weeklyProgressData.status === 'fulfilled' && weeklyProgressData.value) {
        setWeeklyData(weeklyProgressData.value);
      } else {
        setDefaultWeeklyData();
      }

      // 6. Children Data
      let children = [];
      if (childrenData.status === 'fulfilled' && childrenData.value) {
        children = childrenData.value;
      }

      // 7. Family Stats
      let familyStats = null;
      if (familyStatsData.status === 'fulfilled' && familyStatsData.value) {
        familyStats = familyStatsData.value;
      }

      // Build parent stats from real data
      const totalChildren = children.length || 0;
      const activeChildren = familyStats?.activeChildren || totalChildren;
      
      // Calculate average score from children data
      let avgScore = 0;
      let totalAchievements = 0;
      let totalConsistency = 0;
      let totalStudyStreak = 0;
      let totalWorkoutStreak = 0;
      let totalHabitStreak = 0;

      children.forEach(child => {
        avgScore += child.disciplineScore || 0;
        totalAchievements += child.achievements?.length || 0;
        totalConsistency += child.disciplineScore || 0;
        totalStudyStreak += child.studyStreak || 0;
        totalWorkoutStreak += child.workoutStreak || 0;
        totalHabitStreak += child.habitStreak || 0;
      });

      const avgDiscipline = totalChildren > 0 ? Math.round(avgScore / totalChildren) : 0;
      const avgConsistency = totalChildren > 0 ? Math.round(totalConsistency / totalChildren) : 0;
      const avgStudyStreak = totalChildren > 0 ? Math.round(totalStudyStreak / totalChildren) : 0;
      const avgWorkoutStreak = totalChildren > 0 ? Math.round(totalWorkoutStreak / totalChildren) : 0;

      // Build family goals based on children data
      const familyGoals = [
        { 
          title: 'Improve overall discipline score', 
          progress: avgDiscipline,
          target: 90 
        },
        { 
          title: 'Increase study streaks', 
          progress: Math.min(avgStudyStreak * 10, 100),
          target: 50 
        },
        { 
          title: 'Maintain workout consistency', 
          progress: Math.min(avgWorkoutStreak * 15, 100),
          target: 95 
        }
      ];

      // Build children with full details
      const childrenWithDetails = children.map(child => ({
        id: child.id || child._id,
        name: child.name || 'Unknown',
        age: child.age || 16,
        grade: child.class || 'N/A',
        school: child.school || 'Not specified',
        disciplineScore: child.disciplineScore || 0,
        studyStreak: child.studyStreak || 0,
        workoutStreak: child.workoutStreak || 0,
        habitStreak: child.habitStreak || 0,
        averageScore: child.averageScore || child.disciplineScore || 0,
        achievements: child.achievements || [],
        subjects: child.subjects || [
          { name: 'Mathematics', score: 0, progress: 0 },
          { name: 'Physics', score: 0, progress: 0 },
          { name: 'Chemistry', score: 0, progress: 0 },
          { name: 'English', score: 0, progress: 0 }
        ],
        weeklyData: child.weeklyData || {
          study: [0,0,0,0,0,0,0],
          workout: [0,0,0,0,0,0,0],
          habits: [0,0,0,0,0,0,0]
        },
        dailyHabits: child.dailyHabits || [
          { name: 'Morning Study', completed: false, time: '7:00 AM' },
          { name: 'Exercise', completed: false, time: '4:00 PM' },
          { name: 'Reading', completed: false, time: '8:00 PM' },
          { name: 'Meditation', completed: false, time: '9:30 PM' }
        ],
        notifications: child.notifications || [
          { id: 1, message: 'Welcome to Trackwise!', type: 'achievement', date: new Date().toLocaleDateString() }
        ],
        lastActive: child.lastActive || 'Recently',
        overallStatus: child.disciplineScore >= 90 ? 'Outstanding' : 
                      child.disciplineScore >= 75 ? 'Excellent' : 
                      child.disciplineScore >= 50 ? 'Good' : 'Needs Attention'
      }));

      // Update parent stats
      setParentStats({
        totalChildren,
        activeChildren,
        averageScore: avgDiscipline,
        totalAchievements,
        consistencyScore: avgConsistency,
        weeklyCheckins: Math.round(totalChildren * 5), // Approximate
        totalHoursMonitored: Math.round(totalChildren * 20),
        improvementRate: Math.min(avgDiscipline, 100),
        children: childrenWithDetails,
        recentActivities: recentActivities.length > 0 ? recentActivities : [
          { child: 'System', action: 'Welcome to your profile!', time: 'Just now' }
        ],
        familyGoals
      });

    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data. Please refresh the page.');
      // Set default data
      setDefaultAchievements();
      setDefaultActivities();
      setDefaultWeeklyData();
    } finally {
      setIsLoading(false);
    }
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
      name: user?.name || '', 
      email: user?.email || '', 
      phone: user?.phone || '',
      location: user?.location || '', 
      bio: user?.bio || '', 
      role: user?.role || 'Parent',
      occupation: user?.occupation || '', 
      childrenCount: user?.childrenCount || '',
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

  const level = getDisciplineLevel(stats.consistency || parentStats.consistencyScore || 0);
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
            {stats.rank && stats.rank !== 'Bronze' && (
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
          <StatCard icon={<Users className="w-4 h-4" />} value={parentStats.totalChildren || 0} label="Total Children" accent={SLATE} />
          <StatCard icon={<UserCheck className="w-4 h-4" />} value={parentStats.activeChildren || 0} label="Active Children" accent={MOSS} />
          <StatCard icon={<Award className="w-4 h-4" />} value={parentStats.totalAchievements || 0} label="Achievements" accent={BRASS} />
          <StatCard icon={<TrendingUp className="w-4 h-4" />} value={`${parentStats.averageScore || 0}%`} label="Avg Score" accent={MOSS} />
          <StatCard icon={<Heart className="w-4 h-4" />} value={`${parentStats.consistencyScore || 0}%`} label="Consistency" accent={REDINK} />
          <StatCard icon={<Calendar className="w-4 h-4" />} value={parentStats.weeklyCheckins || 0} label="Check-ins/Week" accent={SLATE} />
          <StatCard icon={<Clock className="w-4 h-4" />} value={`${parentStats.totalHoursMonitored || 0}h`} label="Hours Monitored" accent={BRASS} />
          <StatCard icon={<TrendingUp className="w-4 h-4" />} value={`${parentStats.improvementRate || 0}%`} label="Improvement Rate" accent={MOSS} />
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
                  {parentStats.children && parentStats.children.length > 0 ? (
                    parentStats.children.map((child) => (
                      <div key={child.id} className="p-3 rounded-sm border cursor-pointer hover:shadow-sm transition-shadow"
                        style={{ borderColor: `${INK}0C` }}
                        onClick={() => setSelectedChild(selectedChild === child.id ? null : child.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                              style={{ backgroundColor: `${SLATE}15`, color: SLATE }}>
                              {child.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-medium">{child.name || 'Unknown'}</p>
                              <div className="flex items-center gap-3 text-xs" style={{ color: `${INK}60` }}>
                                <span>Class {child.grade || 'N/A'}</span>
                                <span>{child.school || 'Not specified'}</span>
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
                              {child.overallStatus || 'Good'}
                            </span>
                            <span className="text-sm font-bold" style={{ color: getProgressColor(child.disciplineScore || 0) }}>
                              {child.disciplineScore || 0}%
                            </span>
                            <ChevronRight className={`w-4 h-4 transition-transform ${selectedChild === child.id ? 'rotate-90' : ''}`}
                              style={{ color: `${INK}40` }} />
                          </div>
                        </div>

                        {selectedChild === child.id && (
                          <div className="mt-3 pt-3 border-t" style={{ borderColor: `${INK}0C` }}>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="text-xs" style={{ color: `${INK}60` }}>
                                <span className="block">Study Streak: <span className="font-bold" style={{ color: MOSS }}>{child.studyStreak || 0}d</span></span>
                                <span className="block">Workout Streak: <span className="font-bold" style={{ color: SLATE }}>{child.workoutStreak || 0}d</span></span>
                                <span className="block">Habit Streak: <span className="font-bold" style={{ color: BRASS }}>{child.habitStreak || 0}d</span></span>
                              </div>
                              <div className="text-xs" style={{ color: `${INK}60` }}>
                                <span className="block">Avg Score: <span className="font-bold" style={{ color: MOSS }}>{child.averageScore || 0}%</span></span>
                                <span className="block">Achievements: <span className="font-bold" style={{ color: BRASS }}>{child.achievements?.length || 0}</span></span>
                                <span className="block">Last Active: <span className="font-bold" style={{ color: SLATE }}>{child.lastActive || 'Recently'}</span></span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: `${INK}60` }}>No children linked to your account yet.</p>
                  )}
                </div>
              </Panel>

              {/* Recent Activities */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5" style={{ color: SLATE }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Recent Activities</h4>
                </div>
                <div className="space-y-3">
                  {parentStats.recentActivities && parentStats.recentActivities.length > 0 ? (
                    parentStats.recentActivities.map((activity, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-sm" style={{ backgroundColor: `${SLATE}05` }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: `${SLATE}15`, color: SLATE }}>
                            {activity.child?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="text-sm">{activity.action || 'Activity'}</p>
                            <p className="text-xs" style={{ color: `${INK}60` }}>{activity.child || 'System'}</p>
                          </div>
                        </div>
                        <span className="text-xs" style={{ color: `${INK}50` }}>{activity.time || 'Just now'}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: `${INK}60` }}>No recent activities.</p>
                  )}
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
                  {parentStats.familyGoals && parentStats.familyGoals.length > 0 ? (
                    parentStats.familyGoals.map((goal, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: `${INK}70` }}>{goal.title}</span>
                          <span style={{ fontFamily: FONT_MONO, color: getProgressColor(goal.progress || 0) }}>
                            {goal.progress || 0}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${INK}14` }}>
                          <div className="h-full rounded-full" style={{
                            width: `${goal.progress || 0}%`,
                            backgroundColor: getProgressColor(goal.progress || 0)
                          }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: `${INK}60` }}>No goals set yet.</p>
                  )}
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
                    <span style={{ fontFamily: FONT_MONO, color: BRASS }}>{parentStats.totalAchievements || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b" style={{ borderColor: `${INK}0C` }}>
                    <span className="text-sm" style={{ color: `${INK}70` }}>Average Score</span>
                    <span style={{ fontFamily: FONT_MONO, color: MOSS }}>{parentStats.averageScore || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b" style={{ borderColor: `${INK}0C` }}>
                    <span className="text-sm" style={{ color: `${INK}70` }}>Consistency Score</span>
                    <span style={{ fontFamily: FONT_MONO, color: SLATE }}>{parentStats.consistencyScore || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <span className="text-sm" style={{ color: `${INK}70` }}>Improvement Rate</span>
                    <span style={{ fontFamily: FONT_MONO, color: MOSS }}>+{parentStats.improvementRate || 0}%</span>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* Children Tab - Detailed View */}
        {activeTab === 'children' && (
          <div className="space-y-4">
            {parentStats.children && parentStats.children.length > 0 ? (
              parentStats.children.map((child) => (
                <div key={child.id} className="p-4 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                        style={{ backgroundColor: `${SLATE}15`, color: SLATE }}>
                        {child.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-bold">{child.name || 'Unknown'}</p>
                        <div className="flex items-center gap-3 text-xs" style={{ color: `${INK}60` }}>
                          <span>Class {child.grade || 'N/A'}</span>
                          <span>•</span>
                          <span>{child.school || 'Not specified'}</span>
                          <span>•</span>
                          <span style={{ color: getProgressColor(child.disciplineScore || 0) }}>
                            {child.disciplineScore || 0}% discipline
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
                        {child.overallStatus || 'Good'}
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
                          {child.subjects && child.subjects.length > 0 ? (
                            child.subjects.map((subject, idx) => (
                              <div key={idx} className="p-2 rounded-sm" style={{ backgroundColor: `${SLATE}05` }}>
                                <div className="flex justify-between text-sm">
                                  <span>{subject.name}</span>
                                  <span style={{ color: getProgressColor(subject.score || 0) }}>{subject.score || 0}%</span>
                                </div>
                                <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${INK}14` }}>
                                  <div className="h-full rounded-full" style={{
                                    width: `${subject.progress || 0}%`,
                                    backgroundColor: getProgressColor(subject.score || 0)
                                  }} />
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs" style={{ color: `${INK}60` }}>No subjects tracked yet.</p>
                          )}
                        </div>
                      </div>

                      {/* Streaks */}
                      <div>
                        <h5 className="text-xs font-semibold mb-2" style={{ color: `${INK}70` }}>Streaks</h5>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${MOSS}15` }}>
                            <Flame className="w-3 h-3" style={{ color: MOSS }} />
                            <span className="text-xs font-bold" style={{ color: MOSS }}>{child.studyStreak || 0}d Study</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${SLATE}15` }}>
                            <Dumbbell className="w-3 h-3" style={{ color: SLATE }} />
                            <span className="text-xs font-bold" style={{ color: SLATE }}>{child.workoutStreak || 0}d Workout</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${BRASS}15` }}>
                            <ClipboardCheck className="w-3 h-3" style={{ color: BRASS }} />
                            <span className="text-xs font-bold" style={{ color: BRASS }}>{child.habitStreak || 0}d Habits</span>
                          </div>
                        </div>
                      </div>

                      {/* Achievements */}
                      <div>
                        <h5 className="text-xs font-semibold mb-2" style={{ color: `${INK}70` }}>Achievements</h5>
                        <div className="flex flex-wrap gap-2">
                          {child.achievements && child.achievements.length > 0 ? (
                            child.achievements.map((ach, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${BRASS}15`, color: BRASS }}>
                                🏅 {ach}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs" style={{ color: `${INK}60` }}>No achievements yet</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                <p style={{ color: `${INK}60` }}>No children linked to your account yet.</p>
                <p className="text-sm mt-2" style={{ color: `${INK}40` }}>Ask your children to link your account as their parent.</p>
              </div>
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {parentStats.children && parentStats.children.length > 0 ? (
              parentStats.children.map((child) => (
                <Panel key={child.id}>
                  <h4 className="font-semibold mb-3" style={{ fontFamily: FONT_DISPLAY }}>{child.name}'s Progress</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: `${INK}70` }}>Overall Progress</span>
                        <span style={{ fontFamily: FONT_MONO, color: getProgressColor(child.disciplineScore || 0) }}>
                          {child.disciplineScore || 0}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${INK}14` }}>
                        <div className="h-full rounded-full" style={{
                          width: `${child.disciplineScore || 0}%`,
                          backgroundColor: getProgressColor(child.disciplineScore || 0)
                        }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-sm" style={{ backgroundColor: `${MOSS}10` }}>
                        <p className="text-xs" style={{ color: `${INK}60` }}>Study</p>
                        <p className="text-lg font-bold" style={{ color: MOSS }}>{child.studyStreak || 0}d</p>
                      </div>
                      <div className="p-2 rounded-sm" style={{ backgroundColor: `${SLATE}10` }}>
                        <p className="text-xs" style={{ color: `${INK}60` }}>Workout</p>
                        <p className="text-lg font-bold" style={{ color: SLATE }}>{child.workoutStreak || 0}d</p>
                      </div>
                      <div className="p-2 rounded-sm" style={{ backgroundColor: `${BRASS}10` }}>
                        <p className="text-xs" style={{ color: `${INK}60` }}>Habits</p>
                        <p className="text-lg font-bold" style={{ color: BRASS }}>{child.habitStreak || 0}d</p>
                      </div>
                    </div>
                  </div>
                </Panel>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                <p style={{ color: `${INK}60` }}>No children linked to your account yet.</p>
              </div>
            )}
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
              {parentStats.familyGoals && parentStats.familyGoals.length > 0 ? (
                parentStats.familyGoals.map((goal, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{goal.title}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm" style={{ color: `${INK}60` }}>
                          Target: {goal.target}
                        </span>
                        <span className="text-sm font-bold" style={{ color: getProgressColor(goal.progress || 0) }}>
                          {goal.progress || 0}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${INK}14` }}>
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${goal.progress || 0}%`,
                        backgroundColor: getProgressColor(goal.progress || 0)
                      }} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm" style={{ color: `${INK}60` }}>No goals set yet. Start tracking your family's progress!</p>
              )}
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