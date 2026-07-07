// src/components/MentorDashboard.jsx
import { useState, useEffect } from 'react';
import {
  Target,
  MessageSquareCode,
  Users,
  BookOpen,
  Dumbbell,
  MessageCircle,
  Award,
  CheckCircle,
  Plus,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  Eye
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

const TAB_ACCENTS = {
  overview: BRASS,
  mentees: MOSS
};

const TAB_LABELS = {
  overview: 'Overview',
  mentees: 'Mentees'
};

const TAB_ICONS = {
  overview: <Eye className="w-3.5 h-3.5" />,
  mentees: <Users className="w-3.5 h-3.5" />
};

  const MentorDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [expandedMentee, setExpandedMentee] = useState(null);

  // Form states
  const [planForm, setPlanForm] = useState({
    title: '',
    description: '',
    subjects: '',
    schedule: '',
    resources: ''
  });

  const [workoutForm, setWorkoutForm] = useState({
    title: '',
    type: 'fitness',
    exercises: '',
    duration: '',
    difficulty: 'beginner',
    notes: ''
  });

  const [communicationForm, setCommunicationForm] = useState({
    title: '',
    type: 'speaking',
    description: '',
    activities: '',
    frequency: 'daily',
    notes: ''
  });

  const [messageForm, setMessageForm] = useState({
    subject: '',
    content: '',
    type: 'motivation'
  });

  const [badgeForm, setBadgeForm] = useState({
    name: '',
    description: '',
    category: 'achievement'
  });

  // Fetch mentees data
  useEffect(() => {
    fetchMentees();
  }, []);

  const fetchMentees = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockMentees = [
        {
          id: 1,
          name: "Sarah Connor",
          email: "sarah@example.com",
          classGroup: "11th",
          disciplineScore: 87,
          studyStreak: 5,
          workoutStreak: 3,
          badges: ['Study Master', 'Fitness Beginner'],
          plans: [
            {
              id: 1,
              title: "JEE Advanced Prep Plan",
              description: "Comprehensive study plan for JEE Advanced",
              subjects: "Physics, Chemistry, Mathematics",
              schedule: "Daily: 6 hours",
              resources: "NCERT, HC Verma, Previous Year Papers",
              progress: 65,
              status: 'active'
            }
          ],
          workouts: [
            {
              id: 1,
              title: "Strength Training Program",
              type: "fitness",
              exercises: "Push-ups, Pull-ups, Squats",
              duration: "45 mins",
              difficulty: "intermediate",
              completed: true
            }
          ],
          communications: [
            {
              id: 1,
              title: "Speaking Practice",
              type: "speaking",
              description: "Daily speaking practice sessions",
              activities: "News reading, Topic discussions",
              frequency: "daily",
              status: 'active'
            }
          ],
          progress: [
            {
              date: "2024-01-15",
              studyHours: 4.5,
              workoutCompleted: true,
              communicationScore: 85,
              notes: "Good progress this week"
            }
          ],
          messages: [
            {
              id: 1,
              subject: "Great Progress!",
              content: "You're doing excellent work. Keep up the momentum!",
              type: "motivation",
              sentDate: "Jan 14"
            }
          ]
        },
        {
          id: 2,
          name: "Alex Mercer",
          email: "alex@example.com",
          classGroup: "12th",
          disciplineScore: 92,
          studyStreak: 8,
          workoutStreak: 6,
          badges: ['Scholar', 'Fitness Pro', 'Consistency Champion'],
          plans: [
            {
              id: 2,
              title: "NDA Physical Fitness Plan",
              description: "Physical fitness preparation for NDA",
              subjects: "Physical Training, Mental Aptitude",
              schedule: "Daily: 2 hours fitness, 3 hours study",
              resources: "Physical Training Guide, NDA Practice Sets",
              progress: 80,
              status: 'active'
            }
          ],
          workouts: [
            {
              id: 2,
              title: "Advanced Calisthenics",
              type: "calisthenics",
              exercises: "Muscle-ups, Handstands, L-sits",
              duration: "60 mins",
              difficulty: "advanced",
              completed: true
            }
          ],
          communications: [
            {
              id: 2,
              title: "Group Discussion Practice",
              type: "speaking",
              description: "GD and interview preparation",
              activities: "Group discussions, Interview practice",
              frequency: "weekly",
              status: 'active'
            }
          ],
          progress: [
            {
              date: "2024-01-15",
              studyHours: 6,
              workoutCompleted: true,
              communicationScore: 90,
              notes: "Excellent performance in all areas"
            }
          ],
          messages: [
            {
              id: 2,
              subject: "Keep Pushing!",
              content: "Your consistency is remarkable. Keep pushing towards your goals!",
              type: "motivation",
              sentDate: "Jan 13"
            }
          ]
        }
      ];

      setMentees(mockMentees);
    } catch (error) {
      console.error('Error fetching mentees:', error);
      setToast({ message: 'Failed to load mentees', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (menteeId) => {
    try {
      setToast({ message: 'Message sent successfully!', type: 'success' });
      setShowMessageModal(false);
      setMessageForm({ subject: '', content: '', type: 'motivation' });
    } catch (error) {
      console.error('Error sending message:', error);
      setToast({ message: 'Failed to send message', type: 'error' });
    }
  };

  const handleCreatePlan = async (menteeId) => {
    try {
      setToast({ message: 'Study plan created successfully!', type: 'success' });
      setShowPlanModal(false);
      setPlanForm({ title: '', description: '', subjects: '', schedule: '', resources: '' });
      fetchMentees();
    } catch (error) {
      console.error('Error creating plan:', error);
      setToast({ message: 'Failed to create plan', type: 'error' });
    }
  };

  const handleCreateWorkout = async (menteeId) => {
    try {
      setToast({ message: 'Workout plan created successfully!', type: 'success' });
      setShowWorkoutModal(false);
      setWorkoutForm({ title: '', type: 'fitness', exercises: '', duration: '', difficulty: 'beginner', notes: '' });
      fetchMentees();
    } catch (error) {
      console.error('Error creating workout plan:', error);
      setToast({ message: 'Failed to create workout plan', type: 'error' });
    }
  };

  const handleCreateCommunication = async (menteeId) => {
    try {
      setToast({ message: 'Communication plan created successfully!', type: 'success' });
      setShowCommunicationModal(false);
      setCommunicationForm({ title: '', type: 'speaking', description: '', activities: '', frequency: 'daily', notes: '' });
      fetchMentees();
    } catch (error) {
      console.error('Error creating communication plan:', error);
      setToast({ message: 'Failed to create communication plan', type: 'error' });
    }
  };

  const handleAwardBadge = async (menteeId) => {
    try {
      setToast({ message: `Badge "${badgeForm.name}" awarded successfully!`, type: 'success' });
      setShowBadgeModal(false);
      setBadgeForm({ name: '', description: '', category: 'achievement' });
      fetchMentees();
    } catch (error) {
      console.error('Error awarding badge:', error);
      setToast({ message: 'Failed to award badge', type: 'error' });
    }
  };

  const toggleMenteeExpand = (menteeId) => {
    setExpandedMentee(expandedMentee === menteeId ? null : menteeId);
  };

  const getDisciplineLevel = (score) => {
    if (score >= 90) return { label: 'Excellent', color: MOSS };
    if (score >= 75) return { label: 'Good', color: SLATE };
    if (score >= 50) return { label: 'Needs Improvement', color: BRASS };
    return { label: 'Needs Attention', color: REDINK };
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'M';
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
        <AlertCircle className="w-4 h-4" style={{ color: REDINK }} />
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: PAPER }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: `${MOSS}30`, borderTopColor: MOSS }} />
          <p className="mt-4 text-sm" style={{ color: `${INK}70` }}>Loading mentees...</p>
        </div>
      </div>
    );
  }

  const avgDiscipline = mentees.length > 0 
    ? Math.round(mentees.reduce((acc, m) => acc + m.disciplineScore, 0) / mentees.length)
    : 0;
  const level = getDisciplineLevel(avgDiscipline);

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
          MENTOR LEDGER
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="pl-11 pr-5 md:pr-8 py-6 space-y-6">
        {/* Title page / header */}
        <div className="p-6 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}1A` }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Eyebrow accent={BRASS}>Mentor's Log</Eyebrow>
              <h3 className="flex items-center gap-2" style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 600,
                fontSize: '1.9rem'
              }}>
                <Target className="w-5 h-5" style={{ color: MOSS }} />
                Welcome back, {user?.name || 'Mentor'}
              </h3>
              <p className="text-sm mt-2" style={{ color: `${INK}80` }}>
                <span style={{ fontFamily: FONT_MONO, color: level.color }}>{level.label}</span> mentorship standing &middot; {mentees.length} active mentees
              </p>
            </div>
            <div className="flex items-center gap-4">
              <GaugeDial score={avgDiscipline} color={level.color} />
              <div className="text-xs leading-relaxed" style={{ fontFamily: FONT_MONO, color: `${INK}70` }}>
                MENTEE<br />INDEX
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
                  value={mentees.length}
                  label="Active Mentees"
                  accent={BRASS}
                />
                <StatCard
                  icon={<BookOpen className="w-5 h-5" />}
                  value={mentees.reduce((acc, m) => acc + (m.plans?.length || 0), 0)}
                  label="Study Plans"
                  accent={MOSS}
                />
                <StatCard
                  icon={<Dumbbell className="w-5 h-5" />}
                  value={mentees.reduce((acc, m) => acc + (m.workouts?.length || 0), 0)}
                  label="Workout Plans"
                  accent={SLATE}
                />
                <StatCard
                  icon={<Award className="w-5 h-5" />}
                  value={mentees.reduce((acc, m) => acc + (m.badges?.length || 0), 0)}
                  label="Badges Awarded"
                  accent={REDINK}
                />
              </div>

              {/* Recent Activity */}
              <div className="p-4 rounded-sm" style={{ backgroundColor: CARD, border: `1px solid ${INK}14` }}>
                <SectionHeading eyebrow="Activity Log" title="Recent Activity" accent={BRASS} />
                <div className="space-y-2">
                  {mentees.slice(0, 3).map((mentee, idx) => {
                    const discipline = getDisciplineLevel(mentee.disciplineScore);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-sm"
                        style={{ backgroundColor: PAPER }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                            style={{
                              borderColor: discipline.color,
                              backgroundColor: `${discipline.color}15`,
                              color: discipline.color
                            }}
                          >
                            {getInitials(mentee.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: INK }}>{mentee.name}</p>
                            <p className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>
                              {mentee.plans?.[0]?.progress > 70 ? '📈 Making great progress' : '📊 Needs guidance'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}50` }}>
                          {mentee.progress?.[mentee.progress.length - 1]?.date || 'Today'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 rounded-sm" style={{ backgroundColor: CARD, border: `1px solid ${INK}14` }}>
                <SectionHeading eyebrow="Actions" title="Quick Actions" accent={MOSS} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: <BookOpen className="w-4 h-4" />, label: 'Study Plan', color: MOSS },
                    { icon: <Dumbbell className="w-4 h-4" />, label: 'Workout', color: SLATE },
                    { icon: <MessageCircle className="w-4 h-4" />, label: 'Communication', color: BRASS },
                    { icon: <Award className="w-4 h-4" />, label: 'Award Badge', color: REDINK }
                  ].map((action, idx) => (
                    <button
                      key={idx}
                      className="p-3 rounded-sm text-center transition hover:shadow-sm"
                      style={{
                        backgroundColor: PAPER,
                        border: `1px solid ${INK}14`,
                        color: action.color
                      }}
                      onClick={() => {
                        if (mentees.length > 0) {
                          setSelectedMentee(mentees[0]);
                          if (idx === 0) setShowPlanModal(true);
                          else if (idx === 1) setShowWorkoutModal(true);
                          else if (idx === 2) setShowCommunicationModal(true);
                          else if (idx === 3) setShowBadgeModal(true);
                        } else {
                          setToast({ message: 'No mentees available', type: 'error' });
                        }
                      }}
                    >
                      <div className="flex justify-center mb-1">{action.icon}</div>
                      <span className="text-[10px]" style={{ fontFamily: FONT_MONO }}>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== MENTEES TAB ==================== */}
          {activeTab === 'mentees' && (
            <div className="space-y-4">
              <SectionHeading eyebrow="Roster" title="All Mentees" accent={MOSS} />
              {mentees.map((mentee) => {
                const discipline = getDisciplineLevel(mentee.disciplineScore);
                const isExpanded = expandedMentee === mentee.id;

                return (
                  <div
                    key={mentee.id}
                    className="rounded-sm border transition-shadow hover:shadow-sm"
                    style={{
                      backgroundColor: CARD,
                      borderColor: `${INK}14`
                    }}
                  >
                    {/* Mentee Header */}
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => toggleMenteeExpand(mentee.id)}
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
                            {getInitials(mentee.name)}
                          </div>
                          <div>
                            <h4 className="text-base font-semibold" style={{ fontFamily: FONT_DISPLAY }}>
                              {mentee.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs" style={{ color: `${INK}60` }}>
                                Class {mentee.classGroup}
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
                              <Sparkles className="w-3 h-3" />
                              {mentee.studyStreak}d
                            </span>
                            <span className="flex items-center gap-1" style={{ color: SLATE }}>
                              <Dumbbell className="w-3 h-3" />
                              {mentee.workoutStreak}d
                            </span>
                            <span className="flex items-center gap-1" style={{ color: BRASS }}>
                              <Award className="w-3 h-3" />
                              {mentee.badges?.length || 0}
                            </span>
                          </div>

                          {isExpanded ?
                            <ChevronUp className="w-4 h-4" style={{ color: `${INK}55` }} /> :
                            <ChevronDown className="w-4 h-4" style={{ color: `${INK}55` }} />
                          }
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div
                        className="border-t p-5 space-y-5"
                        style={{
                          borderColor: `${INK}14`,
                          backgroundColor: PAPER
                        }}
                      >
                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Stamp accent={MOSS} onClick={() => { setSelectedMentee(mentee); setShowPlanModal(true); }}>
                            <Plus className="w-3.5 h-3.5 inline mr-1 -mt-0.5" /> Plan
                          </Stamp>
                          <Stamp accent={SLATE} onClick={() => { setSelectedMentee(mentee); setShowWorkoutModal(true); }}>
                            <Plus className="w-3.5 h-3.5 inline mr-1 -mt-0.5" /> Workout
                          </Stamp>
                          <Stamp accent={BRASS} onClick={() => { setSelectedMentee(mentee); setShowCommunicationModal(true); }}>
                            <Plus className="w-3.5 h-3.5 inline mr-1 -mt-0.5" /> Comm
                          </Stamp>
                          <Stamp accent={REDINK} onClick={() => { setSelectedMentee(mentee); setShowBadgeModal(true); }}>
                            <Award className="w-3.5 h-3.5 inline mr-1 -mt-0.5" /> Badge
                          </Stamp>
                          <Stamp accent={SLATE} filled={false} onClick={() => { setSelectedMentee(mentee); setShowMessageModal(true); }}>
                            <Send className="w-3.5 h-3.5 inline mr-1 -mt-0.5" /> Message
                          </Stamp>
                        </div>

                        {/* Badges */}
                        <div className="p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                          <h5 className="text-xs mb-2" style={{
                            fontFamily: FONT_MONO,
                            color: `${INK}70`,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase'
                          }}>
                            <Award className="w-3.5 h-3.5 inline mr-1 -mt-0.5" style={{ color: BRASS }} />
                            Badges Earned
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {mentee.badges?.map((badge, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{
                                  fontFamily: FONT_MONO,
                                  color: BRASS,
                                  backgroundColor: `${BRASS}15`,
                                  border: `1px solid ${BRASS}33`
                                }}
                              >
                                🏅 {badge}
                              </span>
                            ))}
                            {(!mentee.badges || mentee.badges.length === 0) && (
                              <span className="text-[10px]" style={{ color: `${INK}50` }}>No badges yet</span>
                            )}
                          </div>
                        </div>

                        {/* Study Plans */}
                        <div className="p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                          <h5 className="text-xs mb-2" style={{
                            fontFamily: FONT_MONO,
                            color: `${INK}70`,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase'
                          }}>
                            <BookOpen className="w-3.5 h-3.5 inline mr-1 -mt-0.5" style={{ color: MOSS }} />
                            Study Plans
                          </h5>
                          <div className="space-y-2">
                            {mentee.plans?.map((plan) => (
                              <div key={plan.id} className="p-3 rounded-sm" style={{ backgroundColor: PAPER }}>
                                <div className="flex justify-between items-start mb-1.5">
                                  <p className="text-sm font-medium" style={{ color: INK }}>{plan.title}</p>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                                    fontFamily: FONT_MONO,
                                    color: MOSS,
                                    backgroundColor: `${MOSS}15`
                                  }}>
                                    {plan.progress}%
                                  </span>
                                </div>
                                <p className="text-[11px]" style={{ color: `${INK}70` }}>{plan.subjects}</p>
                                <div className="mt-1.5 flex items-center gap-3 text-[10px]" style={{ color: `${INK}50`, fontFamily: FONT_MONO }}>
                                  <span>📅 {plan.schedule}</span>
                                  <span>📚 {plan.resources}</span>
                                </div>
                              </div>
                            ))}
                            {(!mentee.plans || mentee.plans.length === 0) && (
                              <p className="text-[10px]" style={{ color: `${INK}50` }}>No study plans yet</p>
                            )}
                          </div>
                        </div>

                        {/* Workout Plans */}
                        <div className="p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                          <h5 className="text-xs mb-2" style={{
                            fontFamily: FONT_MONO,
                            color: `${INK}70`,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase'
                          }}>
                            <Dumbbell className="w-3.5 h-3.5 inline mr-1 -mt-0.5" style={{ color: SLATE }} />
                            Workout Plans
                          </h5>
                          <div className="space-y-2">
                            {mentee.workouts?.map((workout) => (
                              <div key={workout.id} className="p-3 rounded-sm" style={{ backgroundColor: PAPER }}>
                                <div className="flex justify-between items-start mb-1.5">
                                  <p className="text-sm font-medium" style={{ color: INK }}>{workout.title}</p>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                                    fontFamily: FONT_MONO,
                                    color: workout.completed ? MOSS : BRASS,
                                    backgroundColor: workout.completed ? `${MOSS}15` : `${BRASS}15`
                                  }}>
                                    {workout.completed ? '✅ Done' : '⏳ Active'}
                                  </span>
                                </div>
                                <p className="text-[11px]" style={{ color: `${INK}70` }}>{workout.exercises}</p>
                                <div className="mt-1.5 flex items-center gap-3 text-[10px]" style={{ color: `${INK}50`, fontFamily: FONT_MONO }}>
                                  <span>⏱️ {workout.duration}</span>
                                  <span>📊 {workout.difficulty}</span>
                                </div>
                              </div>
                            ))}
                            {(!mentee.workouts || mentee.workouts.length === 0) && (
                              <p className="text-[10px]" style={{ color: `${INK}50` }}>No workout plans yet</p>
                            )}
                          </div>
                        </div>

                        {/* Communication Plans */}
                        <div className="p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                          <h5 className="text-xs mb-2" style={{
                            fontFamily: FONT_MONO,
                            color: `${INK}70`,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase'
                          }}>
                            <MessageCircle className="w-3.5 h-3.5 inline mr-1 -mt-0.5" style={{ color: BRASS }} />
                            Communication Plans
                          </h5>
                          <div className="space-y-2">
                            {mentee.communications?.map((comm) => (
                              <div key={comm.id} className="p-3 rounded-sm" style={{ backgroundColor: PAPER }}>
                                <div className="flex justify-between items-start mb-1.5">
                                  <p className="text-sm font-medium" style={{ color: INK }}>{comm.title}</p>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                                    fontFamily: FONT_MONO,
                                    color: BRASS,
                                    backgroundColor: `${BRASS}15`
                                  }}>
                                    {comm.frequency}
                                  </span>
                                </div>
                                <p className="text-[11px]" style={{ color: `${INK}70` }}>{comm.description}</p>
                                <p className="text-[10px] mt-1" style={{ color: `${INK}50` }}>Activities: {comm.activities}</p>
                              </div>
                            ))}
                            {(!mentee.communications || mentee.communications.length === 0) && (
                              <p className="text-[10px]" style={{ color: `${INK}50` }}>No communication plans yet</p>
                            )}
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                          <h5 className="text-xs mb-2" style={{
                            fontFamily: FONT_MONO,
                            color: `${INK}70`,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase'
                          }}>
                            <MessageSquareCode className="w-3.5 h-3.5 inline mr-1 -mt-0.5" style={{ color: SLATE }} />
                            Messages
                          </h5>
                          <div className="space-y-2">
                            {mentee.messages?.map((msg) => (
                              <div key={msg.id} className="p-3 rounded-sm" style={{ backgroundColor: PAPER }}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-sm font-medium" style={{ color: INK }}>{msg.subject}</p>
                                    <p className="text-[11px]" style={{ color: `${INK}70` }}>{msg.content}</p>
                                  </div>
                                  <span className="text-[10px]" style={{ fontFamily: FONT_MONO, color: `${INK}50` }}>
                                    {msg.sentDate}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {(!mentee.messages || mentee.messages.length === 0) && (
                              <p className="text-[10px]" style={{ color: `${INK}50` }}>No messages yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ==================== MODALS ==================== */}
      {/* Create Study Plan Modal */}
      {showPlanModal && selectedMentee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" style={{
            backgroundColor: CARD,
            border: `2px solid ${INK}1A`
          }}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
                <BookOpen className="w-5 h-5 inline mr-2" style={{ color: MOSS }} />
                Study Plan for {selectedMentee.name}
              </h3>
              <button onClick={() => setShowPlanModal(false)} className="transition-opacity hover:opacity-60" style={{ color: `${INK}60` }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Plan Title</label>
                <input
                  type="text"
                  value={planForm.title}
                  onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  placeholder="e.g., JEE Advanced Prep Plan"
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Description</label>
                <textarea
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  rows="2"
                  placeholder="Plan description..."
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Subjects</label>
                <input
                  type="text"
                  value={planForm.subjects}
                  onChange={(e) => setPlanForm({ ...planForm, subjects: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  placeholder="e.g., Physics, Chemistry, Mathematics"
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Schedule</label>
                <input
                  type="text"
                  value={planForm.schedule}
                  onChange={(e) => setPlanForm({ ...planForm, schedule: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  placeholder="e.g., Daily: 6 hours"
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Resources</label>
                <input
                  type="text"
                  value={planForm.resources}
                  onChange={(e) => setPlanForm({ ...planForm, resources: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  placeholder="e.g., NCERT, HC Verma"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPlanModal(false)} className="flex-1 py-2 rounded-sm text-sm font-medium" style={{ backgroundColor: `${INK}08`, color: INK }}>
                Cancel
              </button>
              <button onClick={() => handleCreatePlan(selectedMentee.id)} className="flex-1 py-2 rounded-sm text-sm font-medium" style={{ backgroundColor: MOSS, color: CARD }}>
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Workout Modal */}
      {showWorkoutModal && selectedMentee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" style={{
            backgroundColor: CARD,
            border: `2px solid ${INK}1A`
          }}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
                <Dumbbell className="w-5 h-5 inline mr-2" style={{ color: SLATE }} />
                Workout for {selectedMentee.name}
              </h3>
              <button onClick={() => setShowWorkoutModal(false)} className="transition-opacity hover:opacity-60" style={{ color: `${INK}60` }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Workout Title</label>
                <input
                  type="text"
                  value={workoutForm.title}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, title: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  placeholder="e.g., Strength Training Program"
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Type</label>
                <select
                  value={workoutForm.type}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, type: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                >
                  <option value="fitness">Fitness</option>
                  <option value="calisthenics">Calisthenics</option>
                  <option value="yoga">Yoga</option>
                  <option value="cardio">Cardio</option>
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Exercises</label>
                <input
                  type="text"
                  value={workoutForm.exercises}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, exercises: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  placeholder="e.g., Push-ups, Pull-ups, Squats"
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Duration</label>
                <input
                  type="text"
                  value={workoutForm.duration}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, duration: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  placeholder="e.g., 45 mins"
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Difficulty</label>
                <select
                  value={workoutForm.difficulty}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, difficulty: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Notes</label>
                <textarea
                  value={workoutForm.notes}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, notes: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  rows="2"
                  placeholder="Additional instructions..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowWorkoutModal(false)} className="flex-1 py-2 rounded-sm text-sm font-medium" style={{ backgroundColor: `${INK}08`, color: INK }}>
                Cancel
              </button>
              <button onClick={() => handleCreateWorkout(selectedMentee.id)} className="flex-1 py-2 rounded-sm text-sm font-medium" style={{ backgroundColor: SLATE, color: CARD }}>
                Create Workout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Communication Modal */}
      {showCommunicationModal && selectedMentee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" style={{
            backgroundColor: CARD,
            border: `2px solid ${INK}1A`
          }}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
                <MessageCircle className="w-5 h-5 inline mr-2" style={{ color: BRASS }} />
                Communication Plan for {selectedMentee.name}
              </h3>
              <button onClick={() => setShowCommunicationModal(false)} className="transition-opacity hover:opacity-60" style={{ color: `${INK}60` }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Plan Title</label>
                <input
                  type="text"
                  value={communicationForm.title}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, title: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  placeholder="e.g., Speaking Practice Program"
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Type</label>
                <select
                  value={communicationForm.type}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, type: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                >
                  <option value="speaking">Speaking</option>
                  <option value="writing">Writing</option>
                  <option value="listening">Listening</option>
                  <option value="interview">Interview Prep</option>
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Description</label>
                <textarea
                  value={communicationForm.description}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, description: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  rows="2"
                  placeholder="Plan description..."
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Activities</label>
                <input
                  type="text"
                  value={communicationForm.activities}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, activities: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  placeholder="e.g., News reading, Topic discussions"
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Frequency</label>
                <select
                  value={communicationForm.frequency}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, frequency: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCommunicationModal(false)} className="flex-1 py-2 rounded-sm text-sm font-medium" style={{ backgroundColor: `${INK}08`, color: INK }}>
                Cancel
              </button>
              <button onClick={() => handleCreateCommunication(selectedMentee.id)} className="flex-1 py-2 rounded-sm text-sm font-medium" style={{ backgroundColor: BRASS, color: CARD }}>
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageModal && selectedMentee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-lg w-full p-6" style={{
            backgroundColor: CARD,
            border: `2px solid ${INK}1A`
          }}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
                <Send className="w-5 h-5 inline mr-2" style={{ color: SLATE }} />
                Message to {selectedMentee.name}
              </h3>
              <button onClick={() => setShowMessageModal(false)} className="transition-opacity hover:opacity-60" style={{ color: `${INK}60` }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Subject</label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  placeholder="Message subject..."
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Type</label>
                <select
                  value={messageForm.type}
                  onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                >
                  <option value="motivation">Motivation</option>
                  <option value="guidance">Guidance</option>
                  <option value="feedback">Feedback</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Message</label>
                <textarea
                  value={messageForm.content}
                  onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  rows="3"
                  placeholder="Your message..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowMessageModal(false)} className="flex-1 py-2 rounded-sm text-sm font-medium" style={{ backgroundColor: `${INK}08`, color: INK }}>
                Cancel
              </button>
              <button onClick={() => handleSendMessage(selectedMentee.id)} className="flex-1 py-2 rounded-sm text-sm font-medium flex items-center justify-center gap-2" style={{ backgroundColor: SLATE, color: CARD }}>
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Award Badge Modal */}
      {showBadgeModal && selectedMentee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-lg w-full p-6" style={{
            backgroundColor: CARD,
            border: `2px solid ${INK}1A`
          }}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold" style={{ fontFamily: FONT_DISPLAY }}>
                <Award className="w-5 h-5 inline mr-2" style={{ color: BRASS }} />
                Award Badge to {selectedMentee.name}
              </h3>
              <button onClick={() => setShowBadgeModal(false)} className="transition-opacity hover:opacity-60" style={{ color: `${INK}60` }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Badge Name</label>
                <input
                  type="text"
                  value={badgeForm.name}
                  onChange={(e) => setBadgeForm({ ...badgeForm, name: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  placeholder="e.g., Consistency Champion"
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Category</label>
                <select
                  value={badgeForm.category}
                  onChange={(e) => setBadgeForm({ ...badgeForm, category: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                >
                  <option value="achievement">Achievement</option>
                  <option value="streak">Streak</option>
                  <option value="discipline">Discipline</option>
                  <option value="fitness">Fitness</option>
                  <option value="academic">Academic</option>
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: FONT_MONO, color: `${INK}60` }}>Description</label>
                <textarea
                  value={badgeForm.description}
                  onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })}
                  className="w-full rounded-sm px-3 py-2 border text-sm"
                  style={{ backgroundColor: PAPER, borderColor: `${INK}22`, color: INK, fontFamily: FONT_BODY }}
                  rows="2"
                  placeholder="Why is this badge being awarded?"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowBadgeModal(false)} className="flex-1 py-2 rounded-sm text-sm font-medium" style={{ backgroundColor: `${INK}08`, color: INK }}>
                Cancel
              </button>
              <button onClick={() => handleAwardBadge(selectedMentee.id)} className="flex-1 py-2 rounded-sm text-sm font-medium flex items-center justify-center gap-2" style={{ backgroundColor: BRASS, color: CARD }}>
                <Award className="w-4 h-4" /> Award
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;