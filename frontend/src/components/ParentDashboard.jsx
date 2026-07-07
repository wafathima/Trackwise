// src/components/ParentDashboard.jsx
import { useState } from 'react';
import { 
  Heart, 
  Activity, 
  BookOpen,  
  Award,  
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Download,
  Bell,
  Star,
  Flame,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  X,
  Calendar,
  BarChart3,
  Zap,
  Droplets,
  Moon,
  Eye,
  FileText,
} from 'lucide-react';

/* ---------------------------------------------------------------------- */
/*  TOKENS                                                                 */
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

const TAB_ACCENTS = { 
  overview: BRASS, 
  progress: MOSS, 
  habits: REDINK, 
  achievements: SLATE 
};

const TAB_LABELS = { 
  overview: 'Overview', 
  progress: 'Progress', 
  habits: 'Habits', 
  achievements: 'Badges' 
};

const TAB_ICONS = {
  overview: <Eye className="w-3.5 h-3.5" />,
  progress: <BarChart3 className="w-3.5 h-3.5" />,
  habits: <Calendar className="w-3.5 h-3.5" />,
  achievements: <Award className="w-3.5 h-3.5" />,
};

/* ---------------------------------------------------------------------- */
/*  PARENT DASHBOARD                                                       */
/* ---------------------------------------------------------------------- */
const ParentDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChild, setSelectedChild] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [toast, setToast] = useState(null);

  // Mock data - In production, fetch from API
  const [childrenProfiles] = useState([
    { 
      id: 1,
      name: "Alex Mercer", 
      class: "10th", 
      disciplineScore: 87, 
      waterIntake: "1.8L / 2.5L", 
      sleep: "7.5 hrs", 
      studyStreak: 5,
      workoutStreak: 3,
      attendance: 95,
      achievements: ['Study Master', 'Fitness Beginner', 'Consistency Star'],
      weeklyStudyHours: [4.5, 5.2, 3.8, 6.0, 4.2, 5.5, 4.0],
      weeklyWorkouts: [true, true, false, true, true, false, true],
      dailyHabits: [
        { name: 'Morning Study', completed: true, time: '7:00 AM' },
        { name: 'Exercise', completed: true, time: '4:00 PM' },
        { name: 'Reading', completed: false, time: '8:00 PM' },
        { name: 'Meditation', completed: true, time: '9:30 PM' }
      ],
      subjects: [
        { name: 'Mathematics', score: 88, progress: 85 },
        { name: 'Physics', score: 92, progress: 90 },
        { name: 'Chemistry', score: 78, progress: 75 },
        { name: 'English', score: 85, progress: 80 }
      ],
      notifications: [
        { id: 1, message: 'Alex completed 5 study sessions this week!', type: 'achievement', date: 'Jan 15' },
        { id: 2, message: 'Alex scored 92% in Physics test', type: 'score', date: 'Jan 14' },
        { id: 3, message: 'Study streak: 5 days! Keep going!', type: 'streak', date: 'Jan 13' }
      ]
    },
    { 
      id: 2,
      name: "Sarah Mercer", 
      class: "8th", 
      disciplineScore: 92, 
      waterIntake: "2.0L / 2.5L", 
      sleep: "8.0 hrs", 
      studyStreak: 7,
      workoutStreak: 5,
      attendance: 98,
      achievements: ['Math Whiz', 'Fitness Star', 'Perfect Attendance'],
      weeklyStudyHours: [5.0, 4.8, 5.5, 6.2, 5.8, 4.5, 5.2],
      weeklyWorkouts: [true, true, true, true, true, true, true],
      dailyHabits: [
        { name: 'Morning Study', completed: true, time: '6:30 AM' },
        { name: 'Exercise', completed: true, time: '5:00 PM' },
        { name: 'Reading', completed: true, time: '8:30 PM' },
        { name: 'Meditation', completed: true, time: '9:00 PM' }
      ],
      subjects: [
        { name: 'Mathematics', score: 95, progress: 92 },
        { name: 'Science', score: 90, progress: 88 },
        { name: 'English', score: 88, progress: 85 },
        { name: 'Social Studies', score: 85, progress: 82 }
      ],
      notifications: [
        { id: 1, message: 'Sarah earned "Math Whiz" badge!', type: 'achievement', date: 'Jan 16' },
        { id: 2, message: 'Perfect attendance this week!', type: 'achievement', date: 'Jan 15' }
      ]
    }
  ]);

  // Stats calculations
  const stats = {
    totalChildren: childrenProfiles.length,
    averageDiscipline: Math.round(childrenProfiles.reduce((acc, c) => acc + c.disciplineScore, 0) / childrenProfiles.length),
    totalAchievements: childrenProfiles.reduce((acc, c) => acc + c.achievements.length, 0),
    totalStreak: Math.max(...childrenProfiles.map(c => c.studyStreak))
  };

  /* -------------------------- Utility Functions -------------------------- */
  const getDisciplineLevel = (score) => {
    if (score >= 90) return { label: 'Excellent', color: MOSS };
    if (score >= 75) return { label: 'Good', color: SLATE };
    if (score >= 50) return { label: 'Needs Improvement', color: BRASS };
    return { label: 'Needs Attention', color: REDINK };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return MOSS;
    if (score >= 60) return BRASS;
    return REDINK;
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'P';
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const tabAccent = TAB_ACCENTS[activeTab];

  /* -------------------------- Sub-Components -------------------------- */
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

  const Eyebrow = ({ children, accent }) => (
    <p
      className="text-[11px] mb-1"
      style={{ 
        fontFamily: FONT_MONO, 
        color: accent, 
        letterSpacing: '0.14em', 
        textTransform: 'uppercase' 
      }}
    >
      {children}
    </p>
  );

  const SectionHeading = ({ eyebrow, title, accent, action, onAction }) => (
    <div className="flex justify-between items-end mb-5">
      <div>
        <Eyebrow accent={accent}>{eyebrow}</Eyebrow>
        <h4 style={{ 
          fontFamily: FONT_DISPLAY, 
          fontWeight: 600, 
          fontSize: '1.3rem', 
          color: INK 
        }}>
          {title}
        </h4>
      </div>
      {action && (
        <button 
          onClick={onAction} 
          className="text-xs pb-1" 
          style={{ 
            fontFamily: FONT_MONO, 
            color: accent, 
            letterSpacing: '0.05em' 
          }}
        >
          {action}
        </button>
      )}
    </div>
  );

  const Stamp = ({ children, accent, filled = true, onClick }) => (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-sm text-xs transition"
      style={{
        fontFamily: FONT_MONO,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        backgroundColor: filled ? accent : 'transparent',
        color: filled ? CARD : accent,
        border: `1px solid ${accent}`,
      }}
    >
      {children}
    </button>
  );

  const Card = ({ children, style = {} }) => (
    <div 
      className="p-4 rounded-sm border" 
      style={{ backgroundColor: PAPER, borderColor: `${INK}14`, ...style }}
    >
      {children}
    </div>
  );

  const StatCard = ({ icon, value, label, accent }) => (
    <div 
      className="p-4 rounded-sm border relative overflow-hidden" 
      style={{ backgroundColor: CARD, borderColor: `${INK}14` }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: accent }} />
      <div className="flex items-center gap-3 pl-2">
        <div style={{ color: accent }}>{icon}</div>
        <div>
          <p className="text-xl leading-none" style={{ 
            fontFamily: FONT_MONO, 
            color: INK, 
            fontWeight: 600 
          }}>
            {value}
          </p>
          <p className="text-[11px] mt-1" style={{ 
            fontFamily: FONT_BODY, 
            color: `${INK}77` 
          }}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );

  const Chip = ({ active, accent, onClick, children }) => (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs transition"
      style={
        active
          ? { 
              backgroundColor: `${accent}17`, 
              color: accent, 
              fontFamily: FONT_MONO, 
              boxShadow: `inset 0 0 0 1px ${accent}44` 
            }
          : { 
              backgroundColor: 'transparent', 
              color: `${INK}70`, 
              fontFamily: FONT_MONO 
            }
      }
    >
      {children}
    </button>
  );

  /* -------------------------- Discipline Gauge -------------------------- */
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

  const level = getDisciplineLevel(stats.averageDiscipline);

  return (
    <div
      className="min-h-screen relative rounded-md"
      style={{ backgroundColor: PAPER, color: INK, fontFamily: FONT_BODY }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .sd-fade { animation: sdFade .35s ease; }
        @keyframes sdFade { from { opacity: 0; transform: translateY(4px);} to { opacity: 1; transform: translateY(0);} }
      `}</style>

      {/* ruled paper texture */}
      <div
        className="absolute inset-0 rounded-md pointer-events-none"
        aria-hidden="true"
        style={{ backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, ${INK}0A 32px)` }}
      />

      {/* binding spine */}
      <div
        className="absolute left-0 top-0 bottom-0 w-9 rounded-l-md pointer-events-none"
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
          FAMILY LEDGER
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="pl-11 pr-5 md:pr-8 py-6 space-y-6">
        {/* Title page / header */}
        <div className="p-6 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}1A` }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Eyebrow accent={BRASS}>Family Dashboard</Eyebrow>
              <h3 className="flex items-center gap-2" style={{ 
                fontFamily: FONT_DISPLAY, 
                fontWeight: 600, 
                fontSize: '1.9rem' 
              }}>
                <Heart className="w-5 h-5" style={{ color: REDINK }} />
                Welcome back, {user?.name || 'Parent'}
              </h3>
              <p className="text-sm mt-2" style={{ color: `${INK}80` }}>
                <span style={{ fontFamily: FONT_MONO, color: level.color }}>{level.label}</span> family discipline &middot; {stats.totalChildren} child{stats.totalChildren > 1 ? 'ren' : ''} enrolled
              </p>
            </div>
            <div className="flex items-center gap-4">
              <GaugeDial score={stats.averageDiscipline} color={level.color} />
              <div className="text-xs leading-relaxed" style={{ fontFamily: FONT_MONO, color: `${INK}70` }}>
                FAMILY<br />INDEX
              </div>
            </div>
          </div>

          {/* folder tab navigation */}
          <div className="flex gap-1 mt-6 -mb-px items-end">
            {Object.keys(TAB_ACCENTS).map((tab) => {
              const accent = TAB_ACCENTS[tab];
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
                    padding: active ? '11px 22px 9px' : '8px 18px 8px',
                    backgroundColor: active ? PAPER : `${accent}12`,
                    color: active ? accent : `${INK}66`,
                    fontFamily: FONT_MONO,
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    border: `1px solid ${active ? `${accent}55` : 'transparent'}`,
                    borderBottom: 'none',
                    position: 'relative',
                    zIndex: active ? 2 : 1,
                    transition: 'all .2s ease',
                  }}
                  className="flex items-center gap-1.5"
                >
                  {TAB_ICONS[tab]}
                  {TAB_LABELS[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Folder body */}
        <div
          className="rounded-sm border p-6 sd-fade"
          key={activeTab}
          style={{ 
            backgroundColor: PAPER, 
            borderColor: `${tabAccent}33`, 
            borderTop: `3px solid ${tabAccent}` 
          }}
        >

          {/* ==================== OVERVIEW TAB ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard 
                  icon={<Users className="w-5 h-5" />} 
                  value={stats.totalChildren} 
                  label="Children" 
                  accent={BRASS} 
                />
                <StatCard 
                  icon={<Award className="w-5 h-5" />} 
                  value={`${stats.averageDiscipline}%`} 
                  label="Avg Discipline" 
                  accent={MOSS} 
                />
                <StatCard 
                  icon={<Star className="w-5 h-5" />} 
                  value={stats.totalAchievements} 
                  label="Achievements" 
                  accent={SLATE} 
                />
                <StatCard 
                  icon={<Flame className="w-5 h-5" />} 
                  value={stats.totalStreak} 
                  label="Best Streak" 
                  accent={REDINK} 
                />
              </div>

              {/* Children Profiles */}
              <div className="space-y-4">
                <SectionHeading 
                  eyebrow="Family Roster" 
                  title="Children Overview" 
                  accent={BRASS} 
                />
                {childrenProfiles.map((child) => {
                  const discipline = getDisciplineLevel(child.disciplineScore);
                  const isExpanded = expandedSection === `child-${child.id}`;
                  
                  return (
                    <div 
                      key={child.id} 
                      className="rounded-sm border transition-shadow hover:shadow-sm"
                      style={{ 
                        backgroundColor: CARD, 
                        borderColor: `${INK}14` 
                      }}
                    >
                      <div 
                        className="p-5 cursor-pointer"
                        onClick={() => toggleSection(`child-${child.id}`)}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold shrink-0"
                              style={{ 
                                borderColor: discipline.color,
                                backgroundColor: `${discipline.color}15`,
                                color: discipline.color
                              }}
                            >
                              {getInitials(child.name)}
                            </div>
                            <div>
                              <h4 className="text-base font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                                {child.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs" style={{ color: `${INK}60` }}>
                                  Class {child.class}
                                </span>
                                <span 
                                  className="text-[10px] px-2 py-0.5 rounded-full"
                                  style={{ 
                                    fontFamily: FONT_MONO,
                                    color: discipline.color,
                                    backgroundColor: `${discipline.color}15`
                                  }}
                                >
                                  {discipline.label}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-3 text-xs">
                              <span className="flex items-center gap-1" style={{ color: MOSS }}>
                                <BookOpen className="w-3 h-3" />
                                {child.studyStreak}d
                              </span>
                              <span className="flex items-center gap-1" style={{ color: SLATE }}>
                                <Dumbbell className="w-3 h-3" />
                                {child.workoutStreak}d
                              </span>
                              <span className="flex items-center gap-1" style={{ color: BRASS }}>
                                <Users className="w-3 h-3" />
                                {child.attendance}%
                              </span>
                            </div>
                            
                            {isExpanded ? 
                              <ChevronUp className="w-4 h-4" style={{ color: `${INK}55` }} /> : 
                              <ChevronDown className="w-4 h-4" style={{ color: `${INK}55` }} />
                            }
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div 
                          className="border-t p-5 space-y-5"
                          style={{ 
                            borderColor: `${INK}14`,
                            backgroundColor: PAPER
                          }}
                        >
                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                              <p className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Study Streak</p>
                              <p className="text-lg font-bold" style={{ fontFamily: FONT_MONO, color: MOSS }}>
                                {child.studyStreak}d
                              </p>
                            </div>
                            <div className="p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                              <p className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Workout Streak</p>
                              <p className="text-lg font-bold" style={{ fontFamily: FONT_MONO, color: SLATE }}>
                                {child.workoutStreak}d
                              </p>
                            </div>
                            <div className="p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                              <p className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Attendance</p>
                              <p className="text-lg font-bold" style={{ fontFamily: FONT_MONO, color: BRASS }}>
                                {child.attendance}%
                              </p>
                            </div>
                            <div className="p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                              <p className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Achievements</p>
                              <p className="text-lg font-bold" style={{ fontFamily: FONT_MONO, color: REDINK }}>
                                {child.achievements.length}
                              </p>
                            </div>
                          </div>

                          {/* Recent Notifications */}
                          <div className="p-4 rounded-sm" style={{ backgroundColor: CARD }}>
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: FONT_DISPLAY }}>
                                <Bell className="w-4 h-4" style={{ color: BRASS }} />
                                Recent Updates
                              </h5>
                              <button 
                                className="text-[10px] font-medium transition-opacity hover:opacity-70"
                                style={{ fontFamily: FONT_MONO, color: BRASS }}
                              >
                                View All
                              </button>
                            </div>
                            <div className="space-y-2">
                              {child.notifications.slice(0, 3).map((notif) => (
                                <div 
                                  key={notif.id} 
                                  className="flex items-center gap-3 p-2 rounded-sm"
                                  style={{ backgroundColor: PAPER }}
                                >
                                  <div 
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ 
                                      backgroundColor: 
                                        notif.type === 'achievement' ? MOSS :
                                        notif.type === 'score' ? SLATE : BRASS
                                    }}
                                  />
                                  <span className="text-xs flex-1" style={{ color: `${INK}80` }}>
                                    {notif.message}
                                  </span>
                                  <span className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}50` }}>
                                    {notif.date}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Health & Habits Quick View */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div 
                              className="p-3 rounded-sm flex items-center gap-3"
                              style={{ backgroundColor: CARD }}
                            >
                              <Droplets className="w-5 h-5" style={{ color: SLATE }} />
                              <div>
                                <p className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Hydration</p>
                                <p className="text-sm font-semibold" style={{ fontFamily: FONT_MONO }}>
                                  {child.waterIntake}
                                </p>
                              </div>
                            </div>

                            <div 
                              className="p-3 rounded-sm flex items-center gap-3"
                              style={{ backgroundColor: CARD }}
                            >
                              <Moon className="w-5 h-5" style={{ color: REDINK }} />
                              <div>
                                <p className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Sleep</p>
                                <p className="text-sm font-semibold" style={{ fontFamily: FONT_MONO }}>
                                  {child.sleep}
                                </p>
                              </div>
                            </div>

                            <div 
                              className="p-3 rounded-sm flex items-center gap-3"
                              style={{ backgroundColor: CARD }}
                            >
                              <Zap className="w-5 h-5" style={{ color: BRASS }} />
                              <div>
                                <p className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Energy Level</p>
                                <p className="text-sm font-semibold" style={{ fontFamily: FONT_MONO }}>
                                  {child.disciplineScore}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== PROGRESS TAB ==================== */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              {childrenProfiles.map((child) => (
                <div 
                  key={child.id}
                  className="rounded-sm border p-6"
                  style={{ backgroundColor: CARD, borderColor: `${INK}14` }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-bold" style={{ fontFamily: FONT_DISPLAY }}>
                      {child.name}'s Progress
                    </h4>
                    <Stamp 
                      accent={MOSS} 
                      onClick={() => setShowReportModal(true)}
                    >
                      <Download className="w-3.5 h-3.5 inline mr-1 -mt-0.5" /> Report
                    </Stamp>
                  </div>

                  {/* Subject Performance */}
                  <div className="mb-6">
                    <h5 className="text-xs mb-3" style={{ 
                      fontFamily: FONT_MONO, 
                      color: `${INK}70`,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}>
                      Subject Performance
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {child.subjects.map((subject, idx) => (
                        <div 
                          key={idx} 
                          className="p-3 rounded-sm"
                          style={{ backgroundColor: PAPER }}
                        >
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-medium" style={{ color: INK }}>
                              {subject.name}
                            </span>
                            <span 
                              className="text-sm font-bold"
                              style={{ 
                                fontFamily: FONT_MONO,
                                color: getScoreColor(subject.score) 
                              }}
                            >
                              {subject.score}%
                            </span>
                          </div>
                          <div 
                            className="w-full h-1.5 rounded-full overflow-hidden"
                            style={{ backgroundColor: `${INK}14` }}
                          >
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${subject.progress}%`,
                                backgroundColor: getScoreColor(subject.score)
                              }}
                            />
                          </div>
                          <p className="text-[10px] mt-1" style={{ 
                            fontFamily: FONT_MONO,
                            color: `${INK}50` 
                          }}>
                            Progress: {subject.progress}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Study Hours */}
                  <div className="mb-6">
                    <h5 className="text-xs mb-3" style={{ 
                      fontFamily: FONT_MONO, 
                      color: `${INK}70`,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}>
                      Weekly Study Hours
                    </h5>
                    <div className="flex items-end gap-2 h-32 p-3 rounded-sm" style={{ backgroundColor: PAPER }}>
                      {child.weeklyStudyHours.map((hours, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full rounded-t-sm transition-all duration-500"
                            style={{ 
                              height: `${(hours / 8) * 100}%`,
                              backgroundColor: MOSS,
                              opacity: 0.7
                            }}
                          />
                          <span className="text-[10px] mt-1" style={{ 
                            fontFamily: FONT_MONO,
                            color: `${INK}50` 
                          }}>
                            {['M','T','W','T','F','S','S'][idx]}
                          </span>
                          <span className="text-[10px] font-bold" style={{ 
                            fontFamily: FONT_MONO,
                            color: INK 
                          }}>
                            {hours}h
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Workouts */}
                  <div>
                    <h5 className="text-xs mb-3" style={{ 
                      fontFamily: FONT_MONO, 
                      color: `${INK}70`,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}>
                      Weekly Workout Completion
                    </h5>
                    <div className="flex gap-2 p-3 rounded-sm" style={{ backgroundColor: PAPER }}>
                      {child.weeklyWorkouts.map((completed, idx) => (
                        <div key={idx} className="flex-1 text-center">
                          <div 
                            className="p-2 rounded-sm"
                            style={{ 
                              backgroundColor: completed ? `${MOSS}15` : `${INK}08`
                            }}
                          >
                            {completed ? 
                              <CheckCircle className="w-5 h-5 mx-auto" style={{ color: MOSS }} /> : 
                              <X className="w-5 h-5 mx-auto" style={{ color: `${INK}40` }} />
                            }
                          </div>
                          <span className="text-[10px] mt-1" style={{ 
                            fontFamily: FONT_MONO,
                            color: `${INK}50` 
                          }}>
                            {['M','T','W','T','F','S','S'][idx]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== HABITS TAB ==================== */}
          {activeTab === 'habits' && (
            <div className="space-y-6">
              {childrenProfiles.map((child) => (
                <div 
                  key={child.id}
                  className="rounded-sm border p-6"
                  style={{ backgroundColor: CARD, borderColor: `${INK}14` }}
                >
                  <h4 className="text-lg font-bold mb-4" style={{ fontFamily: FONT_DISPLAY }}>
                    {child.name}'s Daily Habits
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {child.dailyHabits.map((habit, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 rounded-sm flex items-center justify-between"
                        style={{ 
                          backgroundColor: habit.completed ? `${MOSS}08` : PAPER,
                          border: `1px solid ${habit.completed ? `${MOSS}33` : `${INK}14`}`
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ 
                              backgroundColor: habit.completed ? MOSS : `${INK}14`,
                              color: habit.completed ? CARD : `${INK}40`
                            }}
                          >
                            {habit.completed ? 
                              <CheckCircle className="w-4 h-4" /> : 
                              <Clock className="w-4 h-4" />
                            }
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ 
                              color: habit.completed ? INK : `${INK}70`,
                              textDecoration: habit.completed ? 'line-through' : 'none'
                            }}>
                              {habit.name}
                            </p>
                            <p className="text-[10px]" style={{ 
                              fontFamily: FONT_MONO,
                              color: `${INK}50` 
                            }}>
                              {habit.time}
                            </p>
                          </div>
                        </div>
                        <span 
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ 
                            fontFamily: FONT_MONO,
                            color: habit.completed ? MOSS : `${INK}50`,
                            backgroundColor: habit.completed ? `${MOSS}15` : `${INK}08`
                          }}
                        >
                          {habit.completed ? 'Done' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Discipline Score */}
                  <div 
                    className="mt-5 p-4 rounded-sm"
                    style={{ 
                      backgroundColor: `${BRASS}08`,
                      border: `1px solid ${BRASS}33`
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs" style={{ 
                          fontFamily: FONT_MONO,
                          color: `${INK}70`
                        }}>
                          Overall Discipline Score
                        </p>
                        <p className="text-2xl font-bold" style={{ 
                          fontFamily: FONT_MONO,
                          color: INK 
                        }}>
                          {child.disciplineScore}/100
                        </p>
                      </div>
                      <div 
                        className="w-16 h-16 rounded-full border-4 flex items-center justify-center"
                        style={{ borderColor: getDisciplineLevel(child.disciplineScore).color }}
                      >
                        <span className="text-lg font-bold" style={{ 
                          fontFamily: FONT_MONO,
                          color: getDisciplineLevel(child.disciplineScore).color 
                        }}>
                          {child.disciplineScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== ACHIEVEMENTS TAB ==================== */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {childrenProfiles.map((child) => (
                <div 
                  key={child.id}
                  className="rounded-sm border p-6"
                  style={{ backgroundColor: CARD, borderColor: `${INK}14` }}
                >
                  <h4 className="text-lg font-bold mb-4" style={{ fontFamily: FONT_DISPLAY }}>
                    {child.name}'s Achievements
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {child.achievements.map((achievement, idx) => (
                      <div 
                        key={idx} 
                        className="p-4 rounded-sm text-center"
                        style={{ 
                          backgroundColor: `${BRASS}08`,
                          border: `1px solid ${BRASS}33`
                        }}
                      >
                        <div 
                          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2"
                          style={{ 
                            backgroundColor: BRASS,
                            color: CARD
                          }}
                        >
                          <Award className="w-7 h-7" />
                        </div>
                        <h6 className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                          {achievement}
                        </h6>
                        <p className="text-[10px] mt-1" style={{ 
                          fontFamily: FONT_MONO,
                          color: `${INK}50` 
                        }}>
                          Earned Achievement
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Badge Statistics */}
                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-sm text-center" style={{ backgroundColor: PAPER }}>
                      <p className="text-xl font-bold" style={{ fontFamily: FONT_MONO, color: INK }}>
                        {child.achievements.length}
                      </p>
                      <p className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}50` }}>
                        Total Badges
                      </p>
                    </div>
                    <div className="p-3 rounded-sm text-center" style={{ backgroundColor: PAPER }}>
                      <p className="text-xl font-bold" style={{ fontFamily: FONT_MONO, color: MOSS }}>
                        {child.studyStreak}
                      </p>
                      <p className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}50` }}>
                        Study Streak
                      </p>
                    </div>
                    <div className="p-3 rounded-sm text-center" style={{ backgroundColor: PAPER }}>
                      <p className="text-xl font-bold" style={{ fontFamily: FONT_MONO, color: SLATE }}>
                        {child.workoutStreak}
                      </p>
                      <p className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}50` }}>
                        Workout Streak
                      </p>
                    </div>
                    <div className="p-3 rounded-sm text-center" style={{ backgroundColor: PAPER }}>
                      <p className="text-xl font-bold" style={{ fontFamily: FONT_MONO, color: BRASS }}>
                        {child.disciplineScore}%
                      </p>
                      <p className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}50` }}>
                        Discipline
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==================== REPORT MODAL ==================== */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-sm max-w-lg w-full p-6"
            style={{ backgroundColor: CARD, border: `2px solid ${INK}1A` }}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
                <FileText className="w-5 h-5 inline mr-2" style={{ color: MOSS }} />
                Weekly Report
              </h3>
              <button 
                onClick={() => setShowReportModal(false)} 
                className="transition-opacity hover:opacity-60"
                style={{ color: `${INK}60` }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ 
                  fontFamily: FONT_MONO,
                  color: `${INK}60` 
                }}>
                  Select Child
                </label>
                <select 
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ 
                    backgroundColor: PAPER,
                    borderColor: `${INK}22`,
                    color: INK,
                    fontFamily: FONT_BODY
                  }}
                >
                  {childrenProfiles.map(child => (
                    <option key={child.id} value={child.id}>{child.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-xs block mb-1" style={{ 
                  fontFamily: FONT_MONO,
                  color: `${INK}60` 
                }}>
                  Week
                </label>
                <input 
                  type="week" 
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ 
                    backgroundColor: PAPER,
                    borderColor: `${INK}22`,
                    color: INK,
                    fontFamily: FONT_BODY
                  }}
                />
              </div>
              
              <div>
                <label className="text-xs block mb-1" style={{ 
                  fontFamily: FONT_MONO,
                  color: `${INK}60` 
                }}>
                  Report Type
                </label>
                <select 
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ 
                    backgroundColor: PAPER,
                    borderColor: `${INK}22`,
                    color: INK,
                    fontFamily: FONT_BODY
                  }}
                >
                  <option value="summary">Summary Report</option>
                  <option value="detailed">Detailed Report</option>
                  <option value="academic">Academic Report</option>
                  <option value="habits">Habits Report</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowReportModal(false)} 
                className="flex-1 py-2 rounded-sm text-sm font-medium transition-colors"
                style={{ 
                  backgroundColor: `${INK}08`,
                  color: INK
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => { 
                  setToast({ message: 'Report generated successfully!', type: 'success' }); 
                  setShowReportModal(false); 
                }} 
                className="flex-1 py-2 rounded-sm text-sm font-medium flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: MOSS,
                  color: CARD
                }}
              >
                <Download className="w-4 h-4" /> Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;