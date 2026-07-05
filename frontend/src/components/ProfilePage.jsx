// src/components/ProfilePage.jsx
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
  Settings,
  LogOut,
  Edit2,
  Save,
  X,
  Camera,
  ChevronRight,
  BookOpen,
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
  GraduationCap,
  Shield,
  Bell,
  Lock,
  Moon,
  Globe,
  Smartphone,
  Trash2,
  RefreshCw,
  AlertCircle,
  Loader,
  ChevronDown,
  User,
  HelpCircle,
} from 'lucide-react';

/* ---------------------------------------------------------------------- */
/*  TOKENS — shared with the Ledger dashboard & modules                   */
/* ---------------------------------------------------------------------- */
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

const ProfilePage = () => {
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
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    role: user?.role || 'Student',
    grade: user?.grade || '',
    school: user?.school || '',
  });
  
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // State for backend data
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
    study: [0, 0, 0, 0, 0, 0, 0],
    workout: [0, 0, 0, 0, 0, 0, 0],
    habits: [0, 0, 0, 0, 0, 0, 0]
  });

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserName = () => (user && user.name) ? user.name : '';
  
  const getUserInitials = () => {
    const name = getUserName();
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const getRoleColor = (role) => {
    const colors = {
      student: MOSS,
      teacher: BRASS,
      mentor: REDINK,
      parent: SLATE
    };
    return colors[role?.toLowerCase()] || INK;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  // Fetch all profile data
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch all data in parallel with individual error handling
      const [profileData, statsData, achievementsData, activitiesData, weeklyProgressData] = await Promise.allSettled([
        profileService.getProfile(),
        profileService.getUserStats(),
        profileService.getAchievements(),
        profileService.getRecentActivities(),
        profileService.getWeeklyProgress()
      ]);

      // Handle profile data
      if (profileData.status === 'fulfilled' && profileData.value) {
        const data = profileData.value;
        setFormData({
          name: data.name || user?.name || '',
          email: data.email || user?.email || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          role: data.role || 'Student',
          grade: data.grade || '',
          school: data.school || ''
        });
        if (data.profileImage) {
          setProfileImage(data.profileImage);
        }
      } else {
        console.warn('Profile data not available, using defaults');
      }

      // Handle stats
      if (statsData.status === 'fulfilled' && statsData.value) {
        setStats(statsData.value);
      }

      // Handle achievements
      if (achievementsData.status === 'fulfilled' && achievementsData.value) {
        setAchievements(achievementsData.value);
      } else {
        setDefaultAchievements();
      }

      // Handle activities
      if (activitiesData.status === 'fulfilled' && activitiesData.value) {
        setRecentActivities(activitiesData.value);
      } else {
        setDefaultActivities();
      }

      // Handle weekly progress
      if (weeklyProgressData.status === 'fulfilled' && weeklyProgressData.value) {
        setWeeklyData(weeklyProgressData.value);
      } else {
        setDefaultWeeklyData();
      }

    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load some profile data. Please refresh the page.');
      
      // Set fallback data
      setDefaultStats();
      setDefaultAchievements();
      setDefaultActivities();
      setDefaultWeeklyData();
    } finally {
      setIsLoading(false);
    }
  };

  // Default/fallback data
  const setDefaultStats = () => {
    setStats({
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
  };

  const setDefaultAchievements = () => {
    setAchievements([
      { icon: <Trophy className="w-5 h-5" />, title: 'Study Master', desc: 'Completed 100 study sessions', earned: false, color: BRASS },
      { icon: <Medal className="w-5 h-5" />, title: 'Fitness Champion', desc: '30-day workout streak', earned: false, color: SLATE },
      { icon: <Star className="w-5 h-5" />, title: 'Habit Builder', desc: 'Maintained 5 habits for 30 days', earned: false, color: MOSS },
      { icon: <Target className="w-5 h-5" />, title: 'Goal Setter', desc: 'Achieved 50 weekly goals', earned: false, color: REDINK },
      { icon: <Flame className="w-5 h-5" />, title: 'Streak Warrior', desc: '100-day streak on any activity', earned: false, color: BRASS },
      { icon: <Heart className="w-5 h-5" />, title: 'Wellness Guru', desc: 'Completed all wellness challenges', earned: false, color: SLATE }
    ]);
  };

  const setDefaultActivities = () => {
    setRecentActivities([
      { icon: <BookOpen className="w-4 h-4" />, action: 'No recent activities', time: '', color: MOSS }
    ]);
  };

  const setDefaultWeeklyData = () => {
    setWeeklyData({
      study: [0, 0, 0, 0, 0, 0, 0],
      workout: [0, 0, 0, 0, 0, 0, 0],
      habits: [0, 0, 0, 0, 0, 0, 0]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const updatedData = await profileService.updateProfile(formData);
      
      // Update user context
      if (updateUser) {
        updateUser(updatedData);
      }
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
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
      role: user?.role || 'Student',
      grade: user?.grade || '',
      school: user?.school || ''
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }

    setIsUploading(true);
    setError('');
    
    try {
      const response = await profileService.uploadProfileImage(file);
      setProfileImage(response.imageUrl);
      
      // Update user context
      if (updateUser) {
        updateUser({ profileImage: response.imageUrl });
      }
      
      setSuccess('Profile image updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await profileService.deleteAccount();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please try again.');
      setShowDeleteConfirm(false);
    }
  };

  const handleResetData = async () => {
    try {
      await profileService.resetData();
      setSuccess('Data reset successfully!');
      setShowDeleteConfirm(false);
      // Refresh profile data
      await fetchProfileData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error resetting data:', error);
      setError('Failed to reset data. Please try again.');
    }
  };

  const getInitials = (name) =>
    name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const getDisciplineLevel = (score) => {
    if (score >= 90) return { label: 'Excellent', color: MOSS };
    if (score >= 75) return { label: 'Good', color: SLATE };
    if (score >= 50) return { label: 'Needs Improvement', color: BRASS };
    return { label: 'Needs Attention', color: REDINK };
  };

  const level = getDisciplineLevel(stats.consistency);
  const roleColor = getRoleColor(formData.role);

  /* -------------------------- Gauge -------------------------- */
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

  /* -------------------------- Shared pieces -------------------------- */
  const Eyebrow = ({ children, accent }) => (
    <p className="text-[11px] mb-1" style={{ fontFamily: FONT_MONO, color: accent, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
      {children}
    </p>
  );

  const SectionHeading = ({ icon, title, accent }) => (
    <h4 className="flex items-center gap-2 mb-4" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>
      <span style={{ color: accent }}>{icon}</span> {title}
    </h4>
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
      {icon}
      {children}
    </button>
  );

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: PAPER }}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: MOSS }} />
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
        .dropdown-animation {
          animation: slideDown 0.2s ease-out both;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="absolute inset-0 rounded-md pointer-events-none" aria-hidden="true"
        style={{ backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, ${INK}0A 32px)` }} />

      {/* binding spine */}
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
        <nav
          className="sticky top-0 z-50 px-6 py-3 flex justify-between items-center border-b-2 -ml-11 -mr-5 md:-mr-8"
          style={{ backgroundColor: `${PAPER}F2`, borderColor: `${INK}22`, backdropFilter: 'blur(6px)' }}
        >
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="Trackwise Logo" className="h-10 w-auto" />
          </div>

          <div className="flex items-center gap-4">

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 transition-colors hover:opacity-70 px-3 py-1.5 rounded-md border"
                  style={{ borderColor: `${INK}22` }}
                >
                  <div 
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                    style={{ borderColor: getRoleColor(user.role), color: getRoleColor(user.role) }}
                  >
                    {getUserInitials()}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{getUserName()}</span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    style={{ color: `${INK}66` }}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md border shadow-lg dropdown-animation" style={{ 
                    backgroundColor: CARD, 
                    borderColor: `${INK}22`,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                  }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: `${INK}14` }}>
                      <p className="text-sm font-semibold" style={{ color: INK }}>{getUserName()}</p>
                      <p className="text-[10px] uppercase tracking-wider" style={{ fontFamily: FONT_MONO, color: getRoleColor(user.role) }}>
                        {user.role || 'Student'}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}
                        className="w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors hover:bg-opacity-10"
                        style={{ color: `${INK}CC`, backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${INK}0A`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <User className="w-4 h-4" style={{ color: `${INK}66` }} />
                        My Profile
                      </button>
                      <button
                        onClick={() => { navigate('/help-support'); setIsDropdownOpen(false); }}
                        className="w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors hover:bg-opacity-10"
                        style={{ color: `${INK}CC`, backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${INK}0A`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <HelpCircle className="w-4 h-4" style={{ color: `${INK}66` }} />
                        Help & Support
                      </button>
                    </div>
                    <div className="border-t" style={{ borderColor: `${INK}14` }} />
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
                        style={{ color: REDINK, backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${REDINK}0A`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <LogOut className="w-4 h-4" style={{ color: REDINK }} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="font-bold px-4 py-2 rounded-md text-sm text-white transition-transform active:scale-95"
                style={{ backgroundColor: INK }}
              >
                Sign In
              </button>
            )}
          </div>
        </nav>

        {/* Header with Back Button and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
          </div>
          <div className="flex items-center gap-2.5">
            {isEditing ? (
              <>
                <Stamp accent={INK} filled={false} onClick={handleCancel} icon={<X className="w-3.5 h-3.5" />}>
                  Cancel
                </Stamp>
                <Stamp accent={MOSS} onClick={handleSave} icon={<Save className="w-3.5 h-3.5" />} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Stamp>
              </>
            ) : (
              <Stamp accent={BRASS} onClick={() => setIsEditing(true)} icon={<Edit2 className="w-3.5 h-3.5" />}>
                Edit Profile
              </Stamp>
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
            {/* Profile Image */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1.5 rounded-full" style={{ border: `1px dashed ${roleColor}55` }} />
              <div
                className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 flex items-center justify-center text-2xl overflow-hidden"
                style={{ borderColor: roleColor, backgroundColor: `${roleColor}15`, fontFamily: FONT_DISPLAY, fontWeight: 600, color: roleColor }}
              >
                {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : getInitials(formData.name)}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 p-1.5 rounded-full border-2 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: `${INK}22`, backgroundColor: CARD }}
              >
                {isUploading ? (
                  <Loader className="w-3.5 h-3.5 animate-spin" style={{ color: INK }} />
                ) : (
                  <Camera className="w-3.5 h-3.5" style={{ color: INK }} />
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-wrap items-center gap-2.5">
                {isEditing ? (
                  <input
                    type="text" name="name" value={formData.name} onChange={handleInputChange}
                    className="sd-settle text-2xl bg-transparent border-b-2 px-1 py-1 focus:outline-none"
                    style={{ borderColor: roleColor, fontFamily: FONT_DISPLAY, fontWeight: 600 }}
                  />
                ) : (
                  <h1 className="text-2xl" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}>{formData.name}</h1>
                )}
                <span className="px-2.5 py-1 rounded-full text-[10px]" style={{ fontFamily: FONT_MONO, letterSpacing: '0.08em', textTransform: 'uppercase', backgroundColor: `${roleColor}15`, color: roleColor }}>
                  {formData.role}
                </span>
                {stats.rank && stats.rank !== 'Bronze' && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] flex items-center gap-1" style={{ fontFamily: FONT_MONO, letterSpacing: '0.08em', textTransform: 'uppercase', backgroundColor: `${BRASS}15`, color: BRASS }}>
                    <Trophy className="w-3 h-3" /> {stats.rank}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-[10px] flex items-center gap-1" style={{ fontFamily: FONT_MONO, letterSpacing: '0.08em', textTransform: 'uppercase', backgroundColor: `${level.color}15`, color: level.color }}>
                  <CheckCircle className="w-3 h-3" /> {level.label}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <FieldRow icon={<Mail className="w-3.5 h-3.5 shrink-0" />} name="email" value={formData.email} editing={isEditing} />
                <FieldRow icon={<Phone className="w-3.5 h-3.5 shrink-0" />} name="phone" value={formData.phone} editing={isEditing} />
                <FieldRow icon={<MapPin className="w-3.5 h-3.5 shrink-0" />} name="location" value={formData.location} editing={isEditing} />
                <FieldRow icon={<GraduationCap className="w-3.5 h-3.5 shrink-0" />} name="grade" value={formData.grade} editing={isEditing} />
              </div>

              {isEditing ? (
                <textarea
                  name="bio" value={formData.bio} onChange={handleInputChange}
                  className="sd-settle mt-3 w-full bg-transparent border rounded-sm p-2.5 text-sm focus:outline-none"
                  style={{ borderColor: `${INK}22`, fontFamily: FONT_BODY }}
                  rows="2" placeholder="Write a short bio..."
                />
              ) : (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: `${INK}80` }}>{formData.bio || 'No bio yet. Click Edit Profile to add one.'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: <Flame className="w-4 h-4" />, label: 'Study Streak', value: `${stats.studyStreak}d`, color: MOSS },
            { icon: <Dumbbell className="w-4 h-4" />, label: 'Workout Streak', value: `${stats.workoutStreak}d`, color: SLATE },
            { icon: <ClipboardCheck className="w-4 h-4" />, label: 'Habit Streak', value: `${stats.habitStreak}d`, color: BRASS },
            { icon: <Clock className="w-4 h-4" />, label: 'Study Hours', value: `${stats.totalHours}h`, color: REDINK },
            { icon: <CheckCircle className="w-4 h-4" />, label: 'Tasks Done', value: stats.completedTasks, color: MOSS },
            { icon: <Award className="w-4 h-4" />, label: 'Points', value: stats.achievementPoints, color: BRASS },
          ].map((stat, idx) => (
            <StatCard key={idx} icon={stat.icon} value={stat.value} label={stat.label} accent={stat.color} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Achievements */}
            <Panel>
              <SectionHeading icon={<Award className="w-5 h-5" />} title="Achievements" accent={BRASS} />
              <div className="space-y-2">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-sm">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2"
                      style={
                        ach.earned
                          ? { color: ach.color, borderColor: ach.color, backgroundColor: `${ach.color}12` }
                          : { color: `${INK}40`, borderColor: `${INK}20`, borderStyle: 'dashed' }
                      }
                    >
                      {ach.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: ach.earned ? INK : `${INK}70` }}>{ach.title}</p>
                      <p className="text-[10px]" style={{ color: `${INK}66` }}>{ach.desc}</p>
                    </div>
                    {ach.earned && <CheckCircle className="w-4 h-4 shrink-0" style={{ color: ach.color }} />}
                  </div>
                ))}
              </div>
              <button className="mt-3 text-[10px] transition-opacity hover:opacity-70" style={{ fontFamily: FONT_MONO, letterSpacing: '0.06em', textTransform: 'uppercase', color: BRASS }}>
                View All →
              </button>
            </Panel>

            {/* Quick Stats */}
            <Panel>
              <SectionHeading icon={<BarChart3 className="w-5 h-5" />} title="Quick Stats" accent={SLATE} />
              <div className="space-y-2">
                {[
                  { label: 'Consistency Score', value: `${stats.consistency}%`, color: MOSS },
                  { label: 'Current Level', value: stats.level || 'Beginner', color: BRASS },
                  { label: 'Total Badges', value: stats.badges, color: SLATE },
                ].map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b" style={{ borderColor: `${INK}0C` }}>
                    <span className="text-sm" style={{ color: `${INK}70` }}>{stat.label}</span>
                    <span style={{ fontFamily: FONT_MONO, fontWeight: 700, color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activities */}
            <Panel>
              <SectionHeading icon={<Clock className="w-5 h-5" />} title="Recent Activities" accent={SLATE} />
              <div className="relative pl-1">
                <div className="absolute left-[19px] top-2 bottom-2 w-px" style={{ backgroundColor: `${INK}14` }} />
                <div className="space-y-4">
                  {recentActivities.length > 0 && recentActivities[0].action !== 'No recent activities' ? (
                    recentActivities.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-3 relative">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 relative z-10"
                          style={{ backgroundColor: CARD, color: activity.color, borderColor: `${activity.color}55` }}
                        >
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{activity.action}</p>
                          <p className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>{activity.time}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 shrink-0" style={{ color: `${INK}40` }} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: `${INK}60` }}>No recent activities. Start tracking to see your progress here!</p>
                  )}
                </div>
              </div>
            </Panel>

            {/* Weekly Progress */}
            <Panel>
              <SectionHeading icon={<TrendingUp className="w-5 h-5" />} title="Weekly Progress" accent={MOSS} />
              <div className="space-y-5">
                {[
                  { label: 'Study Hours', data: weeklyData.study, color: MOSS, max: 10 },
                  { label: 'Workout Days', data: weeklyData.workout, color: SLATE, max: 1 },
                  { label: 'Habits Completed', data: weeklyData.habits, color: BRASS, max: 7 },
                ].map((item, idx) => {
                  const total = item.data.reduce((a, b) => a + b, 0);
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-2">
                        <span style={{ color: `${INK}70` }}>{item.label}</span>
                        <span style={{ fontFamily: FONT_MONO, color: item.color }}>{total} total</span>
                      </div>
                      <div className="flex items-end gap-1.5 h-16">
                        {item.data.map((value, dayIdx) => (
                          <div key={dayIdx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                            <div
                              className="w-full rounded-t-sm transition-all"
                              style={{
                                height: `${Math.max((value / item.max) * 100, value > 0 ? 8 : 3)}%`,
                                backgroundColor: value > 0 ? item.color : `${INK}14`,
                                opacity: value > 0 ? 0.85 : 1,
                              }}
                              title={`Day ${dayIdx + 1}: ${value}`}
                            />
                            <span className="text-[9px]" style={{ fontFamily: FONT_MONO, color: `${INK}55` }}>{days[dayIdx]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>
        </div>

        {/* Settings Section */}
        <Panel>
          <SectionHeading icon={<Settings className="w-5 h-5" />} title="Settings" accent={SLATE} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {[
              { icon: <Bell className="w-4 h-4" />, label: 'Notifications', desc: 'Manage notification preferences', color: BRASS },
              { icon: <Lock className="w-4 h-4" />, label: 'Privacy', desc: 'Control your privacy settings', color: SLATE },
              { icon: <Moon className="w-4 h-4" />, label: 'Theme', desc: 'Switch between light and dark mode', color: INK },
              { icon: <Globe className="w-4 h-4" />, label: 'Language', desc: 'Change your language preference', color: MOSS },
              { icon: <Smartphone className="w-4 h-4" />, label: 'Device Management', desc: 'Manage connected devices', color: SLATE },
              { icon: <Shield className="w-4 h-4" />, label: 'Security', desc: 'Update your security settings', color: REDINK },
            ].map((setting, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-sm border transition-shadow hover:shadow-sm cursor-pointer" style={{ borderColor: `${INK}0F` }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${setting.color}12`, color: setting.color }}>
                    {setting.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{setting.label}</p>
                    <p className="text-[10px]" style={{ color: `${INK}60` }}>{setting.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4" style={{ color: `${INK}45` }} />
              </div>
            ))}
          </div>
        </Panel>

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
            <p className="text-sm leading-relaxed" style={{ color: `${INK}80` }}>
              This action cannot be undone. All your data, achievements, and progress will be permanently deleted.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2.5 rounded-sm text-sm border" style={{ borderColor: `${INK}22`, fontFamily: FONT_BODY }}>
                Cancel
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2.5 rounded-sm text-sm" style={{ backgroundColor: REDINK, color: CARD, fontFamily: FONT_MONO, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;