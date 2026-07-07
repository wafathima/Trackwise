// src/components/MentorProfile.jsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';
import mentorService from '../services/mentorService';
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
  Clock,
  Trash2,
  RefreshCw,
  AlertCircle,
  Loader,
  ChevronDown,
  User,
  HelpCircle,
  Users,
  Shield,
  MessageSquare,
  UserCheck,
  Activity,
  Calendar,
  Briefcase,
  Search,
  ChevronRight,
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

const MentorProfile = () => {
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
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    role: user?.role || 'Mentor',
    specialization: user?.specialization || '',
    yearsOfExperience: user?.yearsOfExperience || '',
    organization: user?.organization || '',
    availability: user?.availability || 'Available',
  });

  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Real data states
  const [mentorData, setMentorData] = useState({
    mentorInfo: {
      totalMentees: 0,
      activeMentees: 0,
      totalSessions: 0,
      avgRating: 0,
      specialties: [],
      expertise: [],
      languages: [],
    },
    mentees: [],
    upcomingSessions: [],
    recentActivities: [],
    pendingRequests: []
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
        mentorStatsData,
        menteesData,
        mentorProfileData
      ] = await Promise.allSettled([
        profileService.getProfile(),
        profileService.getUserStats(),
        mentorService.getMentorStats().catch(() => null),
        mentorService.getMentees().catch(() => []),
        mentorService.getMentorProfile().catch(() => null)
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
          role: data.role || 'Mentor',
          specialization: data.specialization || '',
          yearsOfExperience: data.yearsOfExperience || '',
          organization: data.organization || '',
          availability: data.availability || 'Available',
        });
        if (data.profileImage) setProfileImage(data.profileImage);
      }

      // 2. User Stats
      if (statsData.status === 'fulfilled' && statsData.value) {
        setStats(statsData.value);
      }

      // 3. Mentor Stats
      let mentorStats = null;
      if (mentorStatsData.status === 'fulfilled' && mentorStatsData.value) {
        mentorStats = mentorStatsData.value;
      }

      // 4. Mentees Data
      let mentees = [];
      if (menteesData.status === 'fulfilled' && menteesData.value) {
        mentees = menteesData.value;
      }

      // 5. Mentor Profile Data
      let mentorProfile = null;
      if (mentorProfileData.status === 'fulfilled' && mentorProfileData.value) {
        mentorProfile = mentorProfileData.value;
      }

      // Calculate mentor info from real data
      const totalMentees = mentees.length || 0;
      const activeMentees = mentees.filter(m => 
        m.status === 'Active' || m.status === 'active'
      ).length || 0;
      
      // Calculate total sessions and average rating from mentees data
      let totalSessions = 0;
      let totalRating = 0;
      let ratingCount = 0;
      
      mentees.forEach(mentee => {
        totalSessions += mentee.sessionsCompleted || 0;
        if (mentee.rating) {
          totalRating += mentee.rating;
          ratingCount++;
        }
      });

      const avgRating = ratingCount > 0 ? Math.round((totalRating / ratingCount) * 10) / 10 : 0;

      // Get specialties and expertise from mentee data
      const specialties = [...new Set(mentees.flatMap(m => m.specialties || []))];
      const expertise = [...new Set(mentees.flatMap(m => m.expertise || []))];

      // Build mentees with full details
      const menteesWithDetails = mentees.map(mentee => ({
        id: mentee.id || mentee._id,
        name: mentee.name || 'Unknown',
        grade: mentee.grade || 'N/A',
        stream: mentee.stream || 'General',
        joinedDate: mentee.joinedDate || new Date().toISOString().split('T')[0],
        sessionsCompleted: mentee.sessionsCompleted || 0,
        goals: mentee.goals || ['Improve overall performance'],
        progress: mentee.progress || {
          academic: 0,
          confidence: 0,
          communication: 0,
          overall: 0
        },
        recentSessions: mentee.recentSessions || [],
        upcomingSessions: mentee.upcomingSessions || [],
        status: mentee.status || 'Active',
        rating: mentee.rating || 0,
        email: mentee.email || '',
        phone: mentee.phone || ''
      }));

      // Build upcoming sessions from mentees data
      const allUpcomingSessions = [];
      menteesWithDetails.forEach(mentee => {
        if (mentee.upcomingSessions && mentee.upcomingSessions.length > 0) {
          mentee.upcomingSessions.forEach(session => {
            allUpcomingSessions.push({
              id: session.id || session._id || `sess_${Date.now()}`,
              mentee: mentee.name,
              topic: session.topic || 'General Session',
              date: session.date || new Date().toISOString().split('T')[0],
              time: session.time || '4:00 PM',
              duration: session.duration || 45,
              status: session.status || 'scheduled'
            });
          });
        }
      });

      // Build recent activities
      const recentActivities = [];
      menteesWithDetails.forEach(mentee => {
        if (mentee.recentSessions && mentee.recentSessions.length > 0) {
          mentee.recentSessions.slice(0, 2).forEach(session => {
            recentActivities.push({
              mentee: mentee.name,
              action: `Completed session on ${session.topic || 'General'}`,
              time: session.date || 'Recently'
            });
          });
        }
      });

      // Update mentor data
      setMentorData({
        mentorInfo: {
          totalMentees,
          activeMentees,
          totalSessions: totalSessions || 0,
          avgRating: avgRating || 0,
          specialties: specialties.length > 0 ? specialties : ['Academic Counseling', 'Career Guidance'],
          expertise: expertise.length > 0 ? expertise : ['General'],
          languages: ['English', 'Hindi'] // Default or from profile
        },
        mentees: menteesWithDetails,
        upcomingSessions: allUpcomingSessions.slice(0, 5),
        recentActivities: recentActivities.length > 0 ? recentActivities : [
          { mentee: 'System', action: 'Welcome to your mentor dashboard!', time: 'Just now' }
        ],
        pendingRequests: [] // You can add a separate endpoint for this
      });

    } catch (error) {
      console.error('Error fetching mentor data:', error);
      setError('Failed to load profile data. Please refresh the page.');
      // Set default data
      setMentorData({
        mentorInfo: {
          totalMentees: 0,
          activeMentees: 0,
          totalSessions: 0,
          avgRating: 0,
          specialties: ['Academic Counseling', 'Career Guidance'],
          expertise: ['General'],
          languages: ['English'],
        },
        mentees: [],
        upcomingSessions: [],
        recentActivities: [{ mentee: 'System', action: 'No activities yet', time: 'Just now' }],
        pendingRequests: []
      });
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
      name: user?.name || '', 
      email: user?.email || '', 
      phone: user?.phone || '',
      location: user?.location || '', 
      bio: user?.bio || '', 
      role: user?.role || 'Mentor',
      specialization: user?.specialization || '', 
      yearsOfExperience: user?.yearsOfExperience || '',
      organization: user?.organization || '', 
      availability: user?.availability || 'Available'
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

  const getStatusBadge = (status) => {
    const colors = {
      Active: { bg: `${MOSS}15`, color: MOSS, icon: '🟢' },
      active: { bg: `${MOSS}15`, color: MOSS, icon: '🟢' },
      Pending: { bg: `${BRASS}15`, color: BRASS, icon: '🟡' },
      pending: { bg: `${BRASS}15`, color: BRASS, icon: '🟡' },
      Completed: { bg: `${SLATE}15`, color: SLATE, icon: '🔵' },
      completed: { bg: `${SLATE}15`, color: SLATE, icon: '🔵' },
      Inactive: { bg: `${REDINK}15`, color: REDINK, icon: '🔴' },
      inactive: { bg: `${REDINK}15`, color: REDINK, icon: '🔴' }
    };
    return colors[status] || colors.Active;
  };

  const filteredMentees = mentorData.mentees.filter(mentee =>
    mentee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentee.grade?.includes(searchTerm) ||
    mentee.stream?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: PAPER }}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: REDINK }} />
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
          MENTOR LEDGER
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
                      {user?.role || 'Mentor'}
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
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${REDINK}15`, color: REDINK, fontFamily: FONT_MONO }}>
              <Shield className="w-3 h-3 inline mr-1" /> Mentor
            </span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${MOSS}15`, color: MOSS, fontFamily: FONT_MONO }}>
              <UserCheck className="w-3 h-3 inline mr-1" /> {formData.availability || 'Available'}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            {isEditing ? (
              <>
                <Stamp accent={INK} filled={false} onClick={handleCancel} icon={<X className="w-3.5 h-3.5" />}>Cancel</Stamp>
                <Stamp accent={REDINK} onClick={handleSave} icon={<Save className="w-3.5 h-3.5" />} disabled={isSaving}>
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
                  backgroundColor: `${roleColor}15`, color: roleColor }}>Mentor</span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <FieldRow icon={<Mail className="w-3.5 h-3.5 shrink-0" />} name="email" value={formData.email} editing={isEditing} />
                <FieldRow icon={<Phone className="w-3.5 h-3.5 shrink-0" />} name="phone" value={formData.phone} editing={isEditing} />
                <FieldRow icon={<MapPin className="w-3.5 h-3.5 shrink-0" />} name="location" value={formData.location} editing={isEditing} />
                <FieldRow icon={<Award className="w-3.5 h-3.5 shrink-0" />} name="specialization" value={formData.specialization} editing={isEditing} />
                <FieldRow icon={<Clock className="w-3.5 h-3.5 shrink-0" />} name="yearsOfExperience" value={formData.yearsOfExperience} editing={isEditing} />
                <FieldRow icon={<Briefcase className="w-3.5 h-3.5 shrink-0" />} name="organization" value={formData.organization} editing={isEditing} />
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

        {/* Mentor Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard icon={<Users className="w-4 h-4" />} value={mentorData.mentorInfo.totalMentees || 0} label="Total Mentees" accent={REDINK} />
          <StatCard icon={<UserCheck className="w-4 h-4" />} value={mentorData.mentorInfo.activeMentees || 0} label="Active Mentees" accent={MOSS} />
          <StatCard icon={<MessageSquare className="w-4 h-4" />} value={mentorData.mentorInfo.totalSessions || 0} label="Sessions Completed" accent={BRASS} />
          <StatCard icon={<Star className="w-4 h-4" />} value={`${mentorData.mentorInfo.avgRating || 0}/5`} label="Avg Rating" accent={GOLD} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b" style={{ borderColor: `${INK}14` }}>
          {['overview', 'mentees', 'sessions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 text-xs font-medium transition-colors capitalize border-b-2"
              style={{
                borderColor: activeTab === tab ? REDINK : 'transparent',
                color: activeTab === tab ? REDINK : `${INK}70`
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
              {/* Recent Activities */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5" style={{ color: SLATE }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Recent Activities</h4>
                </div>
                <div className="space-y-3">
                  {mentorData.recentActivities && mentorData.recentActivities.length > 0 ? (
                    mentorData.recentActivities.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-sm" style={{ backgroundColor: `${SLATE}05` }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: `${REDINK}15`, color: REDINK }}>
                          {activity.mentee?.charAt(0) || 'S'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.action || 'Activity'}</p>
                          <p className="text-xs" style={{ color: `${INK}60` }}>{activity.mentee || 'System'} • {activity.time || 'Recently'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: `${INK}60` }}>No recent activities.</p>
                  )}
                </div>
              </Panel>

              {/* Mentee Progress Overview */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" style={{ color: MOSS }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Mentee Progress</h4>
                </div>
                <div className="space-y-3">
                  {mentorData.mentees && mentorData.mentees.length > 0 ? (
                    mentorData.mentees.slice(0, 3).map((mentee) => (
                      <div key={mentee.id} className="p-3 rounded-sm border" style={{ borderColor: `${INK}0C` }}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{mentee.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{
                            backgroundColor: `${getProgressColor(mentee.progress?.overall || 0)}15`,
                            color: getProgressColor(mentee.progress?.overall || 0)
                          }}>
                            {mentee.progress?.overall || 0}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${INK}14` }}>
                          <div className="h-full rounded-full" style={{
                            width: `${mentee.progress?.overall || 0}%`,
                            backgroundColor: getProgressColor(mentee.progress?.overall || 0)
                          }} />
                        </div>
                        <div className="flex gap-3 mt-2 text-xs" style={{ color: `${INK}60` }}>
                          <span>Academic: {mentee.progress?.academic || 0}%</span>
                          <span>Confidence: {mentee.progress?.confidence || 0}%</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: `${INK}60` }}>No mentees assigned yet.</p>
                  )}
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Upcoming Sessions */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5" style={{ color: BRASS }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Upcoming Sessions</h4>
                </div>
                <div className="space-y-3">
                  {mentorData.upcomingSessions && mentorData.upcomingSessions.length > 0 ? (
                    mentorData.upcomingSessions.slice(0, 3).map((session, idx) => (
                      <div key={idx} className="p-3 rounded-sm" style={{ backgroundColor: `${BRASS}05`, border: `1px solid ${BRASS}20` }}>
                        <p className="text-sm font-medium">{session.mentee}</p>
                        <p className="text-xs" style={{ color: `${INK}60` }}>{session.topic}</p>
                        <div className="flex justify-between mt-2 text-xs" style={{ color: `${INK}50` }}>
                          <span>{session.date}</span>
                          <span>{session.time}</span>
                          <span>{session.duration} min</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: `${INK}60` }}>No upcoming sessions.</p>
                  )}
                </div>
              </Panel>

              {/* Mentor Specialties */}
              <Panel>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5" style={{ color: GOLD }} />
                  <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>Specialties</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mentorData.mentorInfo.specialties && mentorData.mentorInfo.specialties.length > 0 ? (
                    mentorData.mentorInfo.specialties.map((specialty, idx) => (
                      <span key={idx} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: `${GOLD}15`, color: GOLD }}>
                        {specialty}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: `${INK}60` }}>No specialties listed.</p>
                  )}
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* Mentees Tab */}
        {activeTab === 'mentees' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: `${INK}50` }} />
              <input
                type="text"
                placeholder="Search mentees by name, grade or stream..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-sm border focus:outline-none text-sm"
                style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK }}
              />
            </div>

            {mentorData.mentees && mentorData.mentees.length > 0 ? (
              filteredMentees.map((mentee) => {
                const status = getStatusBadge(mentee.status);
                const isExpanded = selectedMentee === mentee.id;
                
                return (
                  <div key={mentee.id} className="p-4 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ backgroundColor: `${REDINK}15`, color: REDINK }}>
                          {mentee.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{mentee.name}</p>
                          <div className="flex items-center gap-3 text-xs" style={{ color: `${INK}60` }}>
                            <span>Class {mentee.grade}</span>
                            <span>{mentee.stream}</span>
                            <span>Joined: {mentee.joinedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{
                            backgroundColor: status.bg,
                            color: status.color
                          }}>
                            {status.icon} {mentee.status}
                          </span>
                        </div>
                        <button 
                          onClick={() => setSelectedMentee(isExpanded ? null : mentee.id)}
                          className="text-xs px-3 py-1 rounded-full flex items-center gap-1"
                          style={{ backgroundColor: `${REDINK}15`, color: REDINK }}
                        >
                          {isExpanded ? 'Hide Details' : 'View Details'}
                          <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t space-y-4" style={{ borderColor: `${INK}0C` }}>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-2 rounded-sm text-center" style={{ backgroundColor: `${MOSS}05` }}>
                            <p className="text-xs" style={{ color: `${INK}60` }}>Academic</p>
                            <p className="text-lg font-bold" style={{ color: getProgressColor(mentee.progress?.academic || 0) }}>
                              {mentee.progress?.academic || 0}%
                            </p>
                          </div>
                          <div className="p-2 rounded-sm text-center" style={{ backgroundColor: `${SLATE}05` }}>
                            <p className="text-xs" style={{ color: `${INK}60` }}>Confidence</p>
                            <p className="text-lg font-bold" style={{ color: getProgressColor(mentee.progress?.confidence || 0) }}>
                              {mentee.progress?.confidence || 0}%
                            </p>
                          </div>
                          <div className="p-2 rounded-sm text-center" style={{ backgroundColor: `${BRASS}05` }}>
                            <p className="text-xs" style={{ color: `${INK}60` }}>Communication</p>
                            <p className="text-lg font-bold" style={{ color: getProgressColor(mentee.progress?.communication || 0) }}>
                              {mentee.progress?.communication || 0}%
                            </p>
                          </div>
                          <div className="p-2 rounded-sm text-center" style={{ backgroundColor: `${GOLD}05` }}>
                            <p className="text-xs" style={{ color: `${INK}60` }}>Overall</p>
                            <p className="text-lg font-bold" style={{ color: getProgressColor(mentee.progress?.overall || 0) }}>
                              {mentee.progress?.overall || 0}%
                            </p>
                          </div>
                        </div>

                        {mentee.goals && mentee.goals.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold mb-1" style={{ color: `${INK}60` }}>Goals</p>
                            <div className="flex flex-wrap gap-1.5">
                              {mentee.goals.map((goal, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${MOSS}10`, color: MOSS }}>
                                  🎯 {goal}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {mentee.recentSessions && mentee.recentSessions.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold mb-1" style={{ color: `${INK}60` }}>Recent Sessions</p>
                            <div className="space-y-1.5">
                              {mentee.recentSessions.slice(0, 3).map((session, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-sm" style={{ backgroundColor: `${SLATE}05` }}>
                                  <span>{session.date}</span>
                                  <span style={{ color: `${INK}70` }}>{session.topic}</span>
                                  <span style={{ color: `${INK}50` }}>{session.duration} min</span>
                                </div>
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
                <Users className="w-12 h-12 mx-auto mb-3" style={{ color: `${INK}30` }} />
                <p style={{ color: `${INK}60` }}>No mentees assigned yet</p>
                <p className="text-sm" style={{ color: `${INK}40` }}>Mentees will appear here once they're assigned to you</p>
              </div>
            )}
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <Panel>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" style={{ color: BRASS }} />
                <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem' }}>All Sessions</h4>
              </div>
              <div className="space-y-3">
                {mentorData.upcomingSessions && mentorData.upcomingSessions.length > 0 ? (
                  mentorData.upcomingSessions.map((session, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-sm" style={{ backgroundColor: `${BRASS}05`, border: `1px solid ${BRASS}20` }}>
                      <div>
                        <p className="font-medium">{session.mentee}</p>
                        <p className="text-sm" style={{ color: `${INK}60` }}>{session.topic}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium" style={{ color: BRASS }}>{session.time}</p>
                        <p className="text-xs" style={{ color: `${INK}50` }}>{session.date} • {session.duration} min</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-center" style={{ color: `${INK}60` }}>No sessions scheduled.</p>
                )}
              </div>
            </Panel>
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

export default MentorProfile;