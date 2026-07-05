import { useState, useEffect } from 'react';
import {
  BookOpen,
  Dumbbell,
  Calendar,
  Flame,
  Award,
  CheckCircle,
  Play,
  MessageCircle,
  Mic,
  Users,
  Heart,
  Droplets,
  Zap,
  Sparkles,
  X,
  AlertCircle,
  FileText,
  HelpCircle,
  Timer,
  Volume2,
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

const TAB_ACCENTS = { studies: MOSS, health: SLATE, habits: REDINK, communication: BRASS };
const TAB_LABELS = { studies: 'Studies', health: 'Health', habits: 'Habits', communication: 'Voice' };
const TAB_ICONS = {
  studies: <BookOpen className="w-3.5 h-3.5" />,
  health: <Dumbbell className="w-3.5 h-3.5" />,
  habits: <Calendar className="w-3.5 h-3.5" />,
  communication: <MessageCircle className="w-3.5 h-3.5" />,
};

/* ---------------------------------------------------------------------- */
/*  GAUGE MATH                                                             */
/* ---------------------------------------------------------------------- */
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

const StudentDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('studies');
  const [selectedClass, setSelectedClass] = useState(user?.classGroup || '10th');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedWorkoutLevel, setSelectedWorkoutLevel] = useState('beginner');
  const [selectedCategory, setSelectedCategory] = useState('fitness');
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [showDoubtAssistant, setShowDoubtAssistant] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [toast, setToast] = useState(null);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedHabits, setCompletedHabits] = useState([]);

  const [disciplineScore] = useState(87);
  const [streaks] = useState({ study: 5, workout: 3, habit: 7 });
  const [dailyHabits] = useState([
    { id: 1, name: 'Wake Up Early', time: '6:00 AM', category: 'morning' },
    { id: 2, name: 'Complete Study Goals', time: '8:00 AM', category: 'study' },
    { id: 3, name: 'Exercise Daily', time: '4:00 PM', category: 'fitness' },
    { id: 4, name: 'Drink 2.5L Water', time: 'All Day', category: 'health' },
    { id: 5, name: 'Read Books', time: '9:00 PM', category: 'evening' },
    { id: 6, name: 'Sleep on Time', time: '10:30 PM', category: 'evening' },
  ]);

  const [studyMaterials] = useState([
    { id: 1, title: 'Algebra Chapter 1', type: 'notes', subject: 'Mathematics', pages: 12 },
    { id: 2, title: 'Trigonometry Formulas', type: 'notes', subject: 'Mathematics', pages: 8 },
    { id: 3, title: "Newton's Laws", type: 'notes', subject: 'Physics', pages: 15 },
    { id: 4, title: 'Previous Year Paper 2023', type: 'paper', subject: 'Mathematics', pages: 20 },
    { id: 5, title: 'Organic Chemistry Guide', type: 'material', subject: 'Chemistry', pages: 25 },
  ]);

  const [quizzes] = useState([
    { id: 1, title: 'Algebra Quiz', subject: 'Mathematics', questions: 10, score: 85, completed: true },
    { id: 2, title: 'Physics Quiz', subject: 'Physics', questions: 8, score: 92, completed: true },
    { id: 3, title: 'Chemistry Quiz', subject: 'Chemistry', questions: 12, score: 0, completed: false },
  ]);

  const [workouts] = useState([
    { id: 1, title: 'Beginner Push-up Program', level: 'beginner', category: 'fitness', duration: '20 mins', exercises: ['Push-ups', 'Squats', 'Planks'] },
    { id: 2, title: 'Advanced Calisthenics', level: 'advanced', category: 'calisthenics', duration: '45 mins', exercises: ['Muscle-ups', 'Handstands', 'L-sits'] },
    { id: 3, title: 'Yoga for Flexibility', level: 'beginner', category: 'yoga', duration: '30 mins', exercises: ['Sun Salutation', 'Warrior Pose', 'Tree Pose'] },
  ]);

  const [videos] = useState([
    { id: 1, title: 'Full Body Workout for Beginners', level: 'beginner', category: 'fitness', duration: '15:30' },
    { id: 2, title: 'Advanced Calisthenics Tutorial', level: 'advanced', category: 'calisthenics', duration: '22:10' },
    { id: 3, title: 'Yoga for Beginners - 10 Min', level: 'beginner', category: 'yoga', duration: '10:00' },
  ]);

  const getDisciplineLevel = (score) => {
    if (score >= 90) return { label: 'Excellent', color: MOSS };
    if (score >= 75) return { label: 'Good', color: SLATE };
    if (score >= 50) return { label: 'Needs Improvement', color: BRASS };
    return { label: 'Needs Attention', color: REDINK };
  };
  const getScoreColor = (score) => (score >= 80 ? MOSS : score >= 60 ? BRASS : REDINK);
  const toggleSection = (section) => setExpandedSection(expandedSection === section ? null : section);
  const toggleHabit = (habitId) => {
    if (completedHabits.includes(habitId)) {
      setCompletedHabits(completedHabits.filter((id) => id !== habitId));
    } else {
      setCompletedHabits([...completedHabits, habitId]);
      setToast({ message: 'Entry logged. The streak holds.', type: 'success' });
    }
  };

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            clearInterval(interval);
            setIsTimerRunning(false);
            setToast({ message: 'Session complete. Step away for a moment.', type: 'success' });
          } else {
            setTimerMinutes((m) => m - 1);
            setTimerSeconds(59);
          }
        } else {
          setTimerSeconds((s) => s - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(25);
    setTimerSeconds(0);
  };

  const level = getDisciplineLevel(disciplineScore);
  const tabAccent = TAB_ACCENTS[activeTab];
  const selectStyle = { backgroundColor: PAPER, borderColor: `${INK}26`, color: INK, fontFamily: FONT_BODY };

  /* -------------------------- shared sub-components -------------------------- */
  const Toast = ({ message, type, onClose }) => (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded shadow-lg border"
      style={{ backgroundColor: CARD, borderColor: type === 'success' ? `${MOSS}55` : `${REDINK}55`, fontFamily: FONT_BODY }}
    >
      {type === 'success' ? <CheckCircle className="w-4 h-4" style={{ color: MOSS }} /> : <AlertCircle className="w-4 h-4" style={{ color: REDINK }} />}
      <span className="text-sm" style={{ color: INK }}>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-60" style={{ color: `${INK}88` }}>
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const Eyebrow = ({ children, accent }) => (
    <p
      className="text-[11px] mb-1"
      style={{ fontFamily: FONT_MONO, color: accent, letterSpacing: '0.14em', textTransform: 'uppercase' }}
    >
      {children}
    </p>
  );

  const SectionHeading = ({ eyebrow, title, accent, action, onAction }) => (
    <div className="flex justify-between items-end mb-5">
      <div>
        <Eyebrow accent={accent}>{eyebrow}</Eyebrow>
        <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.3rem', color: INK }}>{title}</h4>
      </div>
      {action && (
        <button onClick={onAction} className="text-xs pb-1" style={{ fontFamily: FONT_MONO, color: accent, letterSpacing: '0.05em' }}>
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
    <div className="p-4 rounded-sm border" style={{ backgroundColor: PAPER, borderColor: `${INK}14`, ...style }}>
      {children}
    </div>
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

  const Chip = ({ active, accent, onClick, children }) => (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs transition"
      style={
        active
          ? { backgroundColor: `${accent}17`, color: accent, fontFamily: FONT_MONO, boxShadow: `inset 0 0 0 1px ${accent}44` }
          : { backgroundColor: 'transparent', color: `${INK}70`, fontFamily: FONT_MONO }
      }
    >
      {children}
    </button>
  );

  /* -------------------------- discipline gauge -------------------------- */
  const GaugeDial = ({ score, color }) => {
    const cx = 70, cy = 74, r = 56, sw = 9;
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

  return (
    <div
      className="min-h-screen relative rounded-md"
      style={{ backgroundColor: PAPER, color: INK, fontFamily: FONT_BODY }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .sd-select:focus { outline: none; border-color: ${MOSS} !important; box-shadow: 0 0 0 1px ${MOSS}44; }
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
          THE DISCIPLINE LEDGER
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="pl-11 pr-5 md:pr-8 py-6 space-y-6">
        {/* Title page / header */}
        <div className="p-6 rounded-sm border" style={{ backgroundColor: CARD, borderColor: `${INK}1A` }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Eyebrow accent={BRASS}>Volume I &middot; Class {selectedClass}</Eyebrow>
              <h3 className="flex items-center gap-2" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.9rem' }}>
                <Sparkles className="w-5 h-5" style={{ color: BRASS }} />
                Welcome back, {user?.name || 'Student'}
              </h3>
              <p className="text-sm mt-2" style={{ color: `${INK}80` }}>
                <span style={{ fontFamily: FONT_MONO, color: level.color }}>{level.label}</span> discipline standing &middot; {streaks.study}-day study streak
              </p>
            </div>
            <div className="flex items-center gap-4">
              <GaugeDial score={disciplineScore} color={level.color} />
              <div className="text-xs leading-relaxed" style={{ fontFamily: FONT_MONO, color: `${INK}70` }}>
                DISCIPLINE<br />INDEX
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
          style={{ backgroundColor: PAPER, borderColor: `${tabAccent}33`, borderTop: `3px solid ${tabAccent}` }}
        >
          {/* Studies Tab */}
          {activeTab === 'studies' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon={<BookOpen className="w-5 h-5" />} value={studyMaterials.length} label="Study Materials" accent={MOSS} />
                <StatCard icon={<CheckCircle className="w-5 h-5" />} value={`${quizzes.filter((q) => q.completed).length}/${quizzes.length}`} label="Quizzes Completed" accent={SLATE} />
                <StatCard icon={<Flame className="w-5 h-5" />} value={streaks.study} label="Study Streak" accent={BRASS} />
                <StatCard icon={<Award className="w-5 h-5" />} value={2} label="Badges Earned" accent={REDINK} />
              </div>

              <div className="p-4 rounded-sm border flex flex-wrap items-center gap-4" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                <div className="flex items-center gap-2">
                  <label className="text-xs" style={{ fontFamily: FONT_MONO, color: `${INK}90` }}>CLASS</label>
                  <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="sd-select text-sm rounded-sm px-3 py-1.5 border" style={selectStyle}>
                    {['7th', '8th', '9th', '10th', '11th', '12th'].map((cls) => (<option key={cls} value={cls}>{cls} Standard</option>))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs" style={{ fontFamily: FONT_MONO, color: `${INK}90` }}>SUBJECT</label>
                  <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="sd-select text-sm rounded-sm px-3 py-1.5 border" style={selectStyle}>
                    {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'].map((sub) => (<option key={sub} value={sub}>{sub}</option>))}
                  </select>
                </div>
                <div className="flex gap-2 ml-auto">
                  <Stamp accent={MOSS} onClick={() => setShowPomodoro(!showPomodoro)}>
                    <Timer className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" /> Focus Mode
                  </Stamp>
                  <Stamp accent={SLATE} filled={false} onClick={() => setShowDoubtAssistant(!showDoubtAssistant)}>
                    <HelpCircle className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" /> Ask a Doubt
                  </Stamp>
                </div>
              </div>

              {showPomodoro && (
                <Card style={{ backgroundColor: `${MOSS}0A`, borderColor: `${MOSS}33` }}>
                  <div className="flex justify-between items-center mb-4">
                    <SectionHeading eyebrow="Focus Mode" title="Pomodoro Timer" accent={MOSS} />
                    <button onClick={() => setShowPomodoro(false)} style={{ color: `${INK}55` }}><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-col items-center -mt-2">
                    <div className="text-5xl" style={{ fontFamily: FONT_MONO, color: INK, fontWeight: 600 }}>
                      {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                    </div>
                    <div className="flex gap-2 mt-4">
                      {!isTimerRunning ? <Stamp accent={MOSS} onClick={startTimer}>Start</Stamp> : <Stamp accent={BRASS} onClick={pauseTimer}>Pause</Stamp>}
                      <Stamp accent={INK} filled={false} onClick={resetTimer}>Reset</Stamp>
                    </div>
                  </div>
                </Card>
              )}

              {showDoubtAssistant && (
                <Card style={{ backgroundColor: `${SLATE}0A`, borderColor: `${SLATE}33` }}>
                  <div className="flex justify-between items-center mb-4">
                    <SectionHeading eyebrow="AI Assistant" title="Ask Your Doubt" accent={SLATE} />
                    <button onClick={() => setShowDoubtAssistant(false)} style={{ color: `${INK}55` }}><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex gap-2 -mt-2">
                    <input type="text" placeholder="Type your question…" className="sd-select flex-1 rounded-sm px-3 py-2.5 border text-sm" style={selectStyle} />
                    <Stamp accent={SLATE}>Ask</Stamp>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {["Explain Newton's Laws", 'Solve a quadratic', 'Periodic table trends'].map((q, i) => (
                      <button key={i} className="px-3 py-1 rounded-full text-xs border" style={{ borderColor: `${INK}22`, color: `${INK}80`, fontFamily: FONT_BODY }}>{q}</button>
                    ))}
                  </div>
                </Card>
              )}

              <div>
                <SectionHeading eyebrow="Reference" title="Study Materials" accent={MOSS} action={expandedSection === 'materials' ? 'Show less' : 'View all'} onAction={() => toggleSection('materials')} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {studyMaterials.slice(0, expandedSection === 'materials' ? undefined : 3).map((m) => (
                    <Card key={m.id} style={{ backgroundColor: CARD }}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium">{m.title}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-sm" style={{ fontFamily: FONT_MONO, color: MOSS, backgroundColor: `${MOSS}14` }}>{m.type}</span>
                            <span className="text-[11px]" style={{ color: `${INK}66` }}>{m.subject}</span>
                          </div>
                        </div>
                        <FileText className="w-4 h-4 shrink-0" style={{ color: `${INK}55` }} />
                      </div>
                      <p className="text-[11px] mt-2" style={{ fontFamily: FONT_MONO, color: `${INK}55` }}>{m.pages} pages</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <SectionHeading eyebrow="Assessment" title="Quizzes" accent={MOSS} />
                <div className="space-y-2">
                  {quizzes.map((quiz) => (
                    <Card key={quiz.id} style={{ backgroundColor: CARD }}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">{quiz.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-[11px]" style={{ color: `${INK}66` }}>
                            <span>{quiz.subject}</span><span>{quiz.questions} questions</span>
                          </div>
                        </div>
                        {quiz.completed ? (
                          <div className="flex items-center gap-2">
                            <span style={{ fontFamily: FONT_MONO, fontWeight: 700, color: getScoreColor(quiz.score) }}>{quiz.score}%</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ fontFamily: FONT_MONO, color: MOSS, backgroundColor: `${MOSS}14` }}>Done</span>
                          </div>
                        ) : <Stamp accent={MOSS}>Start</Stamp>}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Health Tab */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon={<Dumbbell className="w-5 h-5" />} value={streaks.workout} label="Workout Streak" accent={SLATE} />
                <StatCard icon={<Droplets className="w-5 h-5" />} value="1.8L" label="Water Intake" accent={SLATE} />
                <StatCard icon={<Heart className="w-5 h-5" />} value="7.5h" label="Sleep Duration" accent={REDINK} />
                <StatCard icon={<Zap className="w-5 h-5" />} value={3} label="Workouts This Week" accent={BRASS} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <SectionHeading eyebrow="Programs" title="Workouts" accent={SLATE} />
                  <div className="flex gap-1 ml-auto mb-5">
                    {['fitness', 'calisthenics', 'yoga'].map((cat) => (
                      <Chip key={cat} active={selectedCategory === cat} accent={SLATE} onClick={() => setSelectedCategory(cat)}>{cat}</Chip>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                    <Chip key={lvl} active={selectedWorkoutLevel === lvl} accent={INK} onClick={() => setSelectedWorkoutLevel(lvl)}>{lvl}</Chip>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {workouts.filter((w) => w.category === selectedCategory && w.level === selectedWorkoutLevel).map((w) => (
                    <Card key={w.id} style={{ backgroundColor: CARD }}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-medium">{w.title}</p>
                          <p className="text-[11px]" style={{ color: `${INK}66` }}>{w.duration}</p>
                        </div>
                        <Play className="w-4 h-4" style={{ color: `${INK}55` }} />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {w.exercises.map((ex, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: `${INK}70`, backgroundColor: PAPER, border: `1px solid ${INK}18` }}>{ex}</span>
                        ))}
                      </div>
                    </Card>
                  ))}
                  {workouts.filter((w) => w.category === selectedCategory && w.level === selectedWorkoutLevel).length === 0 && (
                    <p className="text-sm col-span-2" style={{ color: `${INK}55` }}>No programs at this level yet — try another filter.</p>
                  )}
                </div>
              </div>

              <div>
                <SectionHeading eyebrow="Watch" title="Tutorials" accent={REDINK} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {videos.filter((v) => v.category === selectedCategory && v.level === selectedWorkoutLevel).map((v) => (
                    <Card key={v.id} style={{ backgroundColor: CARD }}>
                      <div className="aspect-video rounded-sm flex items-center justify-center mb-3" style={{ backgroundColor: `${REDINK}0D`, border: `1px solid ${REDINK}22` }}>
                        <Play className="w-8 h-8" style={{ color: `${REDINK}80` }} />
                      </div>
                      <p className="text-sm font-medium">{v.title}</p>
                      <p className="text-[11px]" style={{ fontFamily: FONT_MONO, color: `${INK}55` }}>{v.duration}</p>
                    </Card>
                  ))}
                  {videos.filter((v) => v.category === selectedCategory && v.level === selectedWorkoutLevel).length === 0 && (
                    <p className="text-sm col-span-3" style={{ color: `${INK}55` }}>No tutorials at this level yet — try another filter.</p>
                  )}
                </div>
              </div>

              <div>
                <SectionHeading eyebrow="Guidance" title="Nutrition &amp; Hydration" accent={SLATE} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Card style={{ backgroundColor: `${MOSS}0A`, borderColor: `${MOSS}2A` }}>
                    <h5 className="text-sm font-semibold mb-2" style={{ color: MOSS }}>Recommended</h5>
                    <ul className="text-sm space-y-1" style={{ color: `${INK}90` }}>
                      <li>Fresh fruits &amp; vegetables</li><li>Lean proteins</li><li>Whole grains</li><li>Healthy fats</li>
                    </ul>
                  </Card>
                  <Card style={{ backgroundColor: `${REDINK}0A`, borderColor: `${REDINK}2A` }}>
                    <h5 className="text-sm font-semibold mb-2" style={{ color: REDINK }}>Limit</h5>
                    <ul className="text-sm space-y-1" style={{ color: `${INK}90` }}>
                      <li>Processed foods</li><li>Excess sugar</li><li>Junk food</li><li>Sugary drinks</li>
                    </ul>
                  </Card>
                  <Card style={{ backgroundColor: `${SLATE}0A`, borderColor: `${SLATE}2A` }}>
                    <h5 className="text-sm font-semibold mb-2" style={{ color: SLATE }}>Water Intake</h5>
                    <div className="flex justify-between text-xs mb-1" style={{ color: `${INK}80` }}>
                      <span>Today</span><span style={{ fontFamily: FONT_MONO }}>1.8L / 2.5L</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${SLATE}22` }}>
                      <div className="h-full rounded-full" style={{ width: '72%', backgroundColor: SLATE }} />
                    </div>
                    <div className="mt-3"><Stamp accent={SLATE}>Log Water</Stamp></div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Habits Tab */}
          {activeTab === 'habits' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <SectionHeading eyebrow="Daily Ritual" title="Habit Tracker" accent={REDINK} />
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-sm" style={{ fontFamily: FONT_MONO, color: `${INK}70` }}>{completedHabits.length}/{dailyHabits.length}</span>
                  <span className="text-sm flex items-center gap-1" style={{ color: BRASS, fontFamily: FONT_MONO }}><Flame className="w-4 h-4" /> {streaks.habit}d</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dailyHabits.map((habit) => {
                  const done = completedHabits.includes(habit.id);
                  return (
                    <div key={habit.id} onClick={() => toggleHabit(habit.id)} className="p-4 rounded-sm border cursor-pointer transition" style={{ backgroundColor: done ? `${MOSS}0D` : CARD, borderColor: done ? `${MOSS}44` : `${INK}14` }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0" style={done ? { backgroundColor: MOSS, borderColor: MOSS } : { borderColor: `${INK}33` }}>
                            {done && <CheckCircle className="w-3.5 h-3.5" style={{ color: CARD }} />}
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: done ? `${INK}55` : INK, textDecoration: done ? 'line-through' : 'none' }}>{habit.name}</p>
                            <p className="text-[11px]" style={{ color: `${INK}60` }}>{habit.time}</p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ fontFamily: FONT_MONO, color: `${INK}70`, border: `1px solid ${INK}18` }}>{habit.category}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Card style={{ backgroundColor: `${REDINK}0A`, borderColor: `${REDINK}26` }}>
                <h5 className="text-xs mb-3" style={{ fontFamily: FONT_MONO, color: `${INK}80`, letterSpacing: '0.06em' }}>WEEKLY PROGRESS</h5>
                <div className="flex items-end gap-2 h-20">
                  {[60, 80, 40, 90, 70, 50, 30].map((p, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full rounded-t-sm" style={{ height: `${p}%`, backgroundColor: REDINK, opacity: 0.7 }} />
                      <span className="text-[10px] mt-1" style={{ color: `${INK}60` }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Communication Tab */}
          {activeTab === 'communication' && (
            <div className="space-y-6">
              <SectionHeading eyebrow="Practice" title="Voice &amp; Expression" accent={BRASS} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 -mt-3">
                {[
                  { icon: <Mic className="w-5 h-5" />, title: 'Spoken English', desc: 'Daily speaking exercises', accent: BRASS },
                  { icon: <Volume2 className="w-5 h-5" />, title: 'Listening Practice', desc: 'Sharpen comprehension', accent: SLATE },
                  { icon: <Users className="w-5 h-5" />, title: 'Public Speaking', desc: 'Confidence under an audience', accent: MOSS },
                ].map((c, i) => (
                  <Card key={i} style={{ backgroundColor: CARD }}>
                    <div style={{ color: c.accent }} className="mb-3">{c.icon}</div>
                    <h4 className="text-base" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}>{c.title}</h4>
                    <p className="text-xs mt-1 mb-3" style={{ color: `${INK}70` }}>{c.desc}</p>
                    <Stamp accent={c.accent}>Start Practice</Stamp>
                  </Card>
                ))}
              </div>
              <div>
                <SectionHeading eyebrow="Today" title="Practice Activities" accent={BRASS} />
                <div className="space-y-2">
                  {[
                    { title: 'Topic Discussion', desc: 'Speak on "The Importance of Education"' },
                    { title: 'Listening Exercise', desc: 'TED Talk: How to Speak So People Listen' },
                    { title: 'Pronunciation Drill', desc: '10-minute daily practice' },
                  ].map((a, i) => (
                    <Card key={i} style={{ backgroundColor: CARD }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{a.title}</p>
                          <p className="text-[11px]" style={{ color: `${INK}60` }}>{a.desc}</p>
                        </div>
                        <Stamp accent={MOSS}>Start</Stamp>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;