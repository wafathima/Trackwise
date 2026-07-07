// src/components/FeaturesPage.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Dumbbell,
  ClipboardCheck,
  ArrowRight,
  Users,
  Trophy,
  Flame,
  Star,
  LogOut,
  ChevronDown,
  User,
  HelpCircle,
} from 'lucide-react';
import logo from '../assets/logo.png';


const INK = '#1C2B39';
const PAPER = '#F1EBDA';
const CARD = '#FBF8EF';
const MOSS = '#3F6B52';
const BRASS = '#B8892B';
const SLATE = '#4A6C8C';
const REDINK = '#A63D40';

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'Work Sans', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const FeaturesPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
  };

  const modules = [
    {
      id: 'studies',
      chapter: 'I',
      title: 'Studies & Communication',
      subtitle: 'Academic Development',
      description: 'Comprehensive learning resources, smart assessments, and tailored workflow tools designed to elevate academic mastery.',
      icon: <BookOpen className="w-5 h-5" />,
      color: MOSS,
      metrics: ['12+ Categories', '50+ Resources'],
      features: [
        'Class-wise Study Materials',
        'Subject-wise Learning Resources',
        'Full Textbook PDFs',
        'Chapter Notes & Revision',
        'Previous Year Papers',
        'MCQ Practice Tests',
      ],
    },
    {
      id: 'health',
      chapter: 'II',
      title: 'Health Care & Foods',
      subtitle: 'Wellness & Vitality',
      description: 'Customized fitness architectures, granular workout tracking, nutrition blueprints, and structured daily health guidance.',
      icon: <Dumbbell className="w-5 h-5" />,
      color: SLATE,
      metrics: ['8+ Programs', '30+ Workouts'],
      features: [
        'Fitness & Muscle Building',
        'Calisthenics Training',
        'Yoga & Meditation Mastery',
        'Video Learning Tutorials',
        'Workout Progress Tracking',
        'Nutrition & Diet Guidance',
      ],
    },
    {
      id: 'habits',
      chapter: 'III',
      title: 'Daily Habit Tracker',
      subtitle: 'Routine & Optimization',
      description: 'Build high-impact routines, manage complex schedules, and observe longitudinal consistency patterns over time.',
      icon: <ClipboardCheck className="w-5 h-5" />,
      color: BRASS,
      metrics: ['6+ Habit Areas', '20+ Activities'],
      features: [
        'Daily Habit Checklist',
        'Habit Streak Tracking',
        'Custom Daily Timetable',
        'Study & Workout Planning',
        'Reminder Notifications',
        'Task Completion Analytics',
      ],
    },
  ];

  const globalStats = [
    { icon: <Users className="w-3.5 h-3.5" />, value: '10k+', label: 'Active Learners' },
    { icon: <BookOpen className="w-3.5 h-3.5" />, value: '2.5k+', label: 'Curated Assets' },
    { icon: <Trophy className="w-3.5 h-3.5" />, value: '50k+', label: 'Milestones Met' },
    { icon: <Flame className="w-3.5 h-3.5" />, value: '95%', label: 'Satisfaction' },
  ];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: PAPER, color: INK, fontFamily: FONT_BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .dropdown-animation {
          animation: slideDown 0.2s ease-out both;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
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
          THE DISCIPLINE LEDGER
        </div>
      </div>

      <div className="relative md:pl-9">
        {/* NAVBAR */}
        <nav
          className="sticky top-0 z-50 px-6 py-3 flex justify-between items-center border-b-2"
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

        {/* Header — Table of Contents */}
        <header className="border-b" style={{ borderColor: `${INK}14` }}>
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-[11px] mb-1" style={{ fontFamily: FONT_MONO, color: BRASS, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Table of Contents
              </p>
              <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '2rem', letterSpacing: '-0.01em' }}>
                Explore the Chapters
              </h1>
            </div>

            <div className="flex items-center gap-5 divide-x" style={{ borderColor: `${INK}14` }}>
              {globalStats.map((stat, i) => (
                <div key={i} className={`${i > 0 ? 'pl-5' : ''} flex items-center gap-2`}>
                  <div style={{ color: `${INK}55` }}>{stat.icon}</div>
                  <div>
                    <p className="text-sm leading-none" style={{ fontFamily: FONT_MONO, fontWeight: 700, color: INK }}>{stat.value}</p>
                    <p className="text-[9px] mt-1" style={{ fontFamily: FONT_MONO, letterSpacing: '0.08em', textTransform: 'uppercase', color: `${INK}55` }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 md:px-10 py-14 space-y-16">
          {/* Chapter cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                onClick={() => navigate(`/features/${module.id}`)}
                className="relative rounded-sm border p-6 transition-all duration-300 hover:-translate-y-1 group cursor-pointer flex flex-col justify-between overflow-hidden"
                style={{ backgroundColor: CARD, borderColor: `${INK}14` }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: module.color }} />

                <div className="space-y-5 pl-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-sm flex items-center justify-center border"
                        style={{ backgroundColor: `${module.color}12`, color: module.color, borderColor: `${module.color}33` }}
                      >
                        {module.icon}
                      </div>
                      <span style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '1.4rem', color: `${module.color}` }}>
                        {module.chapter}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {module.metrics.map((m, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-sm border"
                          style={{ fontFamily: FONT_MONO, borderColor: `${INK}18`, color: `${INK}80`, backgroundColor: PAPER }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px]" style={{ fontFamily: FONT_MONO, letterSpacing: '0.14em', textTransform: 'uppercase', color: `${INK}55` }}>
                      {module.subtitle}
                    </p>
                    <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.25rem' }}>{module.title}</h2>
                    <p className="text-xs leading-relaxed pt-1" style={{ color: `${INK}8A` }}>{module.description}</p>
                  </div>

                  <div className="w-full h-px" style={{ backgroundColor: `${INK}14` }} />

                  <ul className="grid grid-cols-1 gap-2">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="text-xs flex items-center gap-2.5" style={{ color: `${INK}99` }}>
                        <span className="w-2 h-px" style={{ backgroundColor: module.color, opacity: 0.6 }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 mt-5 border-t flex items-center justify-between pl-1" style={{ borderColor: `${INK}0F` }}>
                  <span className="text-[10px]" style={{ fontFamily: FONT_MONO, letterSpacing: '0.08em', textTransform: 'uppercase', color: `${INK}55` }}>
                    Full Suite Available
                  </span>
                  <span
                    className="text-xs flex items-center gap-1 transition-transform"
                    style={{ fontFamily: FONT_MONO, letterSpacing: '0.04em', color: module.color }}
                  >
                    Open <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Marginal note / pulled quote */}
          <div
            className="rounded-sm border p-10 text-center max-w-2xl mx-auto space-y-4 relative"
            style={{ backgroundColor: CARD, borderColor: `${INK}14` }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: BRASS }} />
            <Star className="w-4 h-4 mx-auto" style={{ color: BRASS }} />
            <blockquote style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 500, fontSize: '1.2rem', lineHeight: 1.6, color: INK }}>
              Trackwise brings a quiet, well-kept order to both the study desk and the daily discipline of the body.
            </blockquote>
            <cite className="block text-[10px] not-italic" style={{ fontFamily: FONT_MONO, letterSpacing: '0.14em', textTransform: 'uppercase', color: `${INK}55` }}>
              Entered into the ledger by 10,000+ active accounts
            </cite>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeaturesPage;