// Home.jsx - Updated with dropdown menu
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from '../components/StudentDashboard';
import ParentDashboard from '../components/ParentDashboard';
import TeacherDashboard from '../components/TeacherDashboard';
import MentorDashboard from '../components/MentorDashboard';

import {
  LogOut,
  BookOpen,
  Dumbbell,
  Calendar,
  BarChart3,
  Award,
  Users,
  Heart,
  GraduationCap,
  ShieldAlert,
  Star,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  PenLine,
  User,
  Settings,
  HelpCircle
} from 'lucide-react';
import logo from '../assets/logo.png';
import hero1 from '../assets/hero1.jpg';
import hero2 from '../assets/hero2.jpg';

const HERO_PHOTO = hero2;
const BANNER_PHOTO = hero1;
const AVATARS = [
  'https://i.pravatar.cc/100?img=32',
  'https://i.pravatar.cc/100?img=47',
  'https://i.pravatar.cc/100?img=13',
];

// -- palette tokens -------------------------------------------------
const INK = '#1C2B39';     // primary text / structure
const PAPER = '#F6F1E4';   // page background
const CARD = '#FBF8EF';    // card surface, slightly lighter than page
const MOSS = '#3F6B52';    // students / growth
const BRASS = '#B8892B';   // teachers / highlight / CTA
const REDINK = '#A63D40';  // mentors / accent marks
const SLATE = '#4A6C8C';   // parents / secondary accent

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'Work Sans', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Home');
  const [expandedService, setExpandedService] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

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

  const scrollToSection = (elementRef, tabName) => {
    if (tabName === 'Features') {
      navigate('/features');
      return;
    }
    setActiveTab(tabName);
    if (elementRef?.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFeaturesClick = () => {
    navigate('/features');
  };

  const toggleService = (index) => {
    setExpandedService(expandedService === index ? null : index);
  };

  const handleLogout = () => {
    logout();
    setActiveTab('Home');
    setIsDropdownOpen(false);
    navigate('/');
  };

  const serviceDetails = [
    {
      title: 'For Students',
      shortDesc: 'Study tracking paths, exercise guidelines, and custom schedules.',
      longDesc: 'Students get access to personalized study plans, interactive learning modules, progress tracking, and a comprehensive dashboard. Features include class-wise study materials, chapter notes, previous year papers, MCQ practice tests, and focus mode with Pomodoro timer. Track your study streaks, earn achievement badges, and maintain discipline scores while balancing academics with personal development.',
      icon: <GraduationCap className="w-6 h-6" />,
      accent: MOSS
    },
    {
      title: 'For Teachers',
      shortDesc: 'Classroom updates, curriculum schedules, and score metrics.',
      longDesc: 'Teachers can upload study materials, create assessments, conduct online tests, and monitor class progress effectively. The platform provides tools for creating quizzes, managing assignments, tracking student performance, and generating academic reports. Teachers can also communicate with students and provide feedback on their progress.',
      icon: <Users className="w-6 h-6" />,
      accent: BRASS
    },
    {
      title: 'For Mentors',
      shortDesc: 'Specialized target paths, long-term goals, and active support.',
      longDesc: 'Mentors can create personalized study plans, workout schedules, and communication practice activities for their mentees. Track student progress, conduct progress reviews, answer doubts, and provide motivation. Award badges manually, monitor discipline scores, and help students stay consistent with their goals while providing guidance and accountability.',
      icon: <ShieldAlert className="w-6 h-6" />,
      accent: REDINK
    },
    {
      title: 'For Parents',
      shortDesc: 'Lifestyle logs, study streaks, and family routine metrics.',
      longDesc: "Parents can monitor their child's study hours, workout completion, daily habits, and overall progress in real-time. Track discipline scores, view achievement badges, and receive notifications about their child's performance. Access comprehensive weekly and monthly reports to understand patterns and support their child's development journey effectively.",
      icon: <Heart className="w-6 h-6" />,
      accent: SLATE
    }
  ];

  const keyFeatures = [
    {
      label: 'Study Resources',
      icon: <BookOpen className="w-5 h-5" />,
      accent: MOSS,
      description: 'Access class-wise study materials, textbook PDFs, chapter notes, previous year papers, MCQ tests, and interactive quizzes. Track your study progress with personalized recommendations and AI-powered doubt clearing.'
    },
    {
      label: 'Health & Fitness',
      icon: <Dumbbell className="w-5 h-5" />,
      accent: SLATE,
      description: 'Follow structured workout plans including fitness, calisthenics, and yoga programs. Access video tutorials, track daily workouts, maintain streaks, and earn fitness badges while monitoring your health progress.'
    },
    {
      label: 'Daily Planner',
      icon: <Calendar className="w-5 h-5" />,
      accent: BRASS,
      description: 'Create customized daily timetables for study, workout, and habits. Set reminders, track task completion, and monitor productivity levels with our intelligent planning system.'
    },
    {
      label: 'Progress Tracking',
      icon: <BarChart3 className="w-5 h-5" />,
      accent: MOSS,
      description: 'Visualize your growth with interactive charts and graphs. Track study hours, workout completion, habit consistency, and water intake. Monitor your discipline score and identify areas for improvement.'
    },
    {
      label: 'Accountability Tools',
      icon: <Users className="w-5 h-5" />,
      accent: REDINK,
      description: 'Stay accountable with mentors, teachers, and parents. Share progress, receive feedback, and maintain consistency with regular check-ins and performance reviews.'
    },
    {
      label: 'Achievements & Badges',
      icon: <Award className="w-5 h-5" />,
      accent: BRASS,
      description: 'Earn achievement badges for study mastery, fitness milestones, habit consistency, and discipline excellence. Celebrate your 7-day and 30-day streaks with special recognition.'
    }
  ];

  const getUserRole = () => (user && user.role) ? user.role : null;
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

  return (
    <div
      className="min-h-screen antialiased"
      style={{ backgroundColor: PAPER, color: INK, fontFamily: FONT_BODY }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp .7s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .fade-up { animation: none; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-animation {
          animation: slideDown 0.2s ease-out both;
        }
      `}</style>

      {/* ruled-paper background, subtle margin rule */}
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, ${INK}12 32px)` }}
        />
        <div className="hidden lg:block absolute top-0 bottom-0 left-20 w-px" style={{ backgroundColor: `${REDINK}33` }} />
      </div>

      {/* NAVBAR */}
      <nav
        className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b-2"
        style={{ backgroundColor: `${PAPER}F2`, borderColor: `${INK}22`, backdropFilter: 'blur(5px)' }}
      >
        <div className="flex items-center gap-2.5 cursor-pointer ml-9" onClick={() => setActiveTab('Home')}>
          <img src={logo} alt="Trackwise Logo" className="h-13 w-auto" />
        </div>

        <div className="hidden md:flex items-center gap-9 text-sm font-medium">
          {[
            { label: 'Home', action: () => setActiveTab('Home') },
            ...(user ? [{ label: 'Dashboard', action: () => setActiveTab('Dashboard') }] : []),
            { label: 'Features', action: () => scrollToSection(featuresRef, 'Features') },
            { label: 'About', action: () => scrollToSection(aboutRef, 'About') },
            { label: 'Contact', action: () => scrollToSection(contactRef, 'Contact') },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.label === 'Features' ? handleFeaturesClick : item.action}
              className="pb-1 border-b-2 transition-colors"
              style={{
                borderColor: activeTab === item.label ? BRASS : 'transparent',
                color: activeTab === item.label ? INK : `${INK}99`
              }}
            >
              {item.label}
            </button>
          ))}
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

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border shadow-lg dropdown-animation" style={{ 
                  backgroundColor: CARD, 
                  borderColor: `${INK}22`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }}>
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b" style={{ borderColor: `${INK}14` }}>
                    <p className="text-sm font-semibold" style={{ color: INK }}>{getUserName()}</p>
                    <p className="text-[10px] uppercase tracking-wider" style={{ fontFamily: FONT_MONO, color: getRoleColor(user.role) }}>
                      {user.role || 'Student'}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors hover:bg-opacity-10"
                      style={{ 
                        color: `${INK}CC`,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${INK}0A`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <User className="w-4 h-4" style={{ color: `${INK}66` }} />
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate('/help-support');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors hover:bg-opacity-10"
                      style={{ 
                        color: `${INK}CC`,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${INK}0A`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <HelpCircle className="w-4 h-4" style={{ color: `${INK}66` }} />
                      Help & Support
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t" style={{ borderColor: `${INK}14` }} />

                  {/* Logout */}
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
                      style={{ 
                        color: REDINK,
                        backgroundColor: 'transparent'
                      }}
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="font-bold px-5 py-2.5 rounded-md flex items-center gap-1.5 text-sm text-white transition-transform active:scale-95"
                style={{ backgroundColor: INK }}
              >
                Sign In 
              </button>
            </div>
          )}
        </div>
      </nav>

      {activeTab === 'Dashboard' && user ? (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {user.role && user.role.toLowerCase() === 'student' && <StudentDashboard user={user} />}
          {user.role && user.role.toLowerCase() === 'parent' && <ParentDashboard user={user} />}
          {user.role && user.role.toLowerCase() === 'teacher' && <TeacherDashboard user={user} />}
          {user.role && user.role.toLowerCase() === 'mentor' && <MentorDashboard user={user} />}
          
          {/* Fallback for unknown roles */}
          {!['student', 'parent', 'teacher', 'mentor'].includes(user.role?.toLowerCase()) && (
            <div className="bg-[#16161a] border border-zinc-800 p-8 rounded-2xl text-center">
              <p className="text-zinc-400">Welcome {user.name}! Your role ({user.role}) dashboard is being set up.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* HERO - Same as before */}
          <section className="relative pt-20 pb-28 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
              <div className="lg:col-span-7 text-center lg:text-left">
                <span
                  className="fade-up inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold tracking-widest uppercase"
                  style={{ color: BRASS, fontFamily: FONT_MONO }}
                >
                  <PenLine className="w-3.5 h-3.5" /> Field notes for students &amp; families
                </span>

                <h1
                  className="fade-up mt-5 text-5xl sm:text-6xl lg:text-7xl leading-[1.05]"
                  style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, animationDelay: '.08s' }}
                >
                  Keep score of
                  <br />
                  <span style={{ color: MOSS, fontStyle: 'italic', fontWeight: 500 }}>everything that matters.</span>
                </h1>

                <p
                  className="fade-up mt-6 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed"
                  style={{ color: `${INK}B3`, animationDelay: '.16s' }}
                >
                  Trackwise brings your study plan, fitness goals, and daily habits into a single, calm ledger — built for students, teachers, mentors, and parents alike.
                </p>

                <div className="fade-up mt-9 flex justify-center lg:justify-start gap-4" style={{ animationDelay: '.24s' }}>
                  {!user ? (
                    <button
                      onClick={() => navigate('/register')}
                      className="px-7 py-3.5 font-bold rounded-md text-white transition-transform active:scale-95"
                      style={{ backgroundColor: INK }}
                    >
                      Get Started
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('Dashboard')}
                      className="px-7 py-3.5 font-bold rounded-md text-white transition-transform active:scale-95"
                      style={{ backgroundColor: INK }}
                    >
                      Go To Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/features')}
                    className="px-7 py-3.5 font-semibold rounded-md border-2 transition-colors"
                    style={{ borderColor: `${INK}33`, color: INK }}
                  >
                    Explore Features
                  </button>
                </div>

                <div
                  className="fade-up mt-14 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 pt-6 border-t-2"
                  style={{ borderColor: `${INK}1A`, animationDelay: '.32s' }}
                >
                  {[
                    ['10K+', 'Students'],
                    ['95%', 'Satisfaction'],
                    ['50K+', 'Goals Hit'],
                  ].map(([value, label], i) => (
                    <div key={i} className={i > 0 ? 'border-l-2 pl-6' : ''} style={{ borderColor: `${INK}1A` }}>
                      <p className="text-2xl font-semibold" style={{ fontFamily: FONT_MONO, color: INK }}>{value}</p>
                      <p className="text-[11px] mt-1 uppercase tracking-wide" style={{ color: `${INK}80` }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative fade-up" style={{ animationDelay: '.2s' }}>
                  <div
                    className="absolute -top-3 left-10 w-20 h-6 rotate-[-6deg] z-20 shadow-sm"
                    style={{ backgroundColor: `${BRASS}CC` }}
                  />
                  <div
                    className="relative w-72 sm:w-80 aspect-[3/4] overflow-hidden rotate-[-2deg] border-2 shadow-xl"
                    style={{ borderColor: `${INK}26`, backgroundColor: CARD }}
                  >
                    <img src={HERO_PHOTO} alt="Student using Trackwise" className="w-full h-full object-cover" />
                  </div>
                  <div
                    className="absolute -bottom-7 -left-8 w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 rotate-[-8deg] shadow-lg"
                    style={{ backgroundColor: CARD, borderColor: BRASS }}
                  >
                    <GraduationCap className="w-6 h-6" style={{ color: INK }} />
                    <span className="text-[9px] font-bold uppercase tracking-wider mt-1" style={{ fontFamily: FONT_MONO, color: INK }}>
                      On Track
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LEDGER BANNER */}
          <section className="max-w-6xl mx-auto px-6">
            <div
              className="rounded-lg p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-2"
              style={{ backgroundColor: CARD, borderColor: `${INK}22` }}
            >
              <div className="lg:col-span-7 space-y-5">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border-2"
                  style={{ color: MOSS, borderColor: `${MOSS}55` }}
                >
                  Empowering Students Everyday
                </span>
                <h2 className="text-2xl sm:text-4xl leading-tight" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}>
                  Build better study habits, healthier lives, and stronger futures
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: `${INK}B3` }}>
                  An all-in-one system for managing studies, fitness, and habits — with clear accountability, for every role in a student's life.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t-2" style={{ borderColor: `${INK}1A` }}>
                  {[
                    { icon: <Users className="w-4 h-4" />, value: '10,000+', label: 'Active Students', accent: SLATE },
                    { icon: <BookOpen className="w-4 h-4" />, value: '2,500+', label: 'Study Resources', accent: MOSS },
                    { icon: <Star className="w-4 h-4" />, value: '95%', label: 'Satisfaction Rate', accent: BRASS },
                    { icon: <Award className="w-4 h-4" />, value: '50,000+', label: 'Goals Completed', accent: REDINK },
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-2" style={{ borderColor: `${s.accent}55`, color: s.accent }}>
                        {s.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-none" style={{ fontFamily: FONT_MONO }}>{s.value}</p>
                        <p className="text-[10px] mt-1.5" style={{ color: `${INK}80` }}>{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="w-full aspect-[4/3] rounded-md overflow-hidden border-2" style={{ borderColor: `${INK}22` }}>
                  <img src={BANNER_PHOTO} alt="Student reviewing progress" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </section>

          {/* SERVICES — folder tabs */}
          <section className="max-w-7xl mx-auto px-6 py-28">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: MOSS, fontFamily: FONT_MONO }}>Our Services</p>
              <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}>Built for everyone around the student</h2>
              <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: `${INK}80` }}>Tailored tools for managing routines and academic frameworks, seamlessly.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {serviceDetails.map((serv, i) => (
                <div key={i} className="relative pt-3">
                  <div className="absolute top-0 left-6 w-12 h-3 rounded-t-sm" style={{ backgroundColor: serv.accent }} />
                  <div
                    className="relative rounded-md rounded-tl-none p-6 border-2 transition-shadow hover:shadow-lg"
                    style={{ backgroundColor: CARD, borderColor: `${INK}1F` }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-5 border-2"
                      style={{ borderColor: `${serv.accent}55`, color: serv.accent }}
                    >
                      {serv.icon}
                    </div>
                    <h3 className="text-lg mb-2" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}>{serv.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: `${INK}99` }}>{serv.shortDesc}</p>

                    <button
                      onClick={() => toggleService(i)}
                      className="text-xs font-semibold mt-5 inline-flex items-center gap-1 uppercase tracking-wide"
                      style={{ color: serv.accent, fontFamily: FONT_MONO }}
                    >
                      {expandedService === i ? 'Show Less' : 'Learn More'}
                      {expandedService === i ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {expandedService === i && (
                      <div className="mt-4 pt-4 border-t-2" style={{ borderColor: `${INK}1A` }}>
                        <p className="text-xs leading-relaxed" style={{ color: `${INK}B3` }}>{serv.longDesc}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* KEY FEATURES — checklist */}
          <section ref={featuresRef} className="py-28 border-y-2" style={{ borderColor: `${INK}1A`, backgroundColor: `${INK}05` }}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: SLATE, fontFamily: FONT_MONO }}>Key Features</p>
                <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}>Everything you need, in one ledger</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {keyFeatures.map((feat, i) => (
                  <div
                    key={i}
                    className="rounded-md p-6 border-2 transition-colors"
                    style={{ backgroundColor: CARD, borderColor: `${INK}1F` }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-11 h-11 shrink-0 rounded-md flex items-center justify-center border-2"
                        style={{ borderColor: `${feat.accent}55`, color: feat.accent }}
                      >
                        {feat.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-2">{feat.label}</h3>
                        <p className="text-xs leading-relaxed" style={{ color: `${INK}99` }}>{feat.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="max-w-7xl mx-auto px-6 py-28">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: REDINK, fontFamily: FONT_MONO }}>Testimonials</p>
              <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}>Top rated by our community</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { quote: "Trackwise organized my study schedule completely. The study resources and focus mode helped me improve my grades significantly.", user: 'Alex, 10th Grade', avatar: AVATARS[0] },
                { quote: "Excellent tool for monitoring my child's consistency metrics. I can see their progress in real-time and help them stay on track.", user: 'Sarah, Parent', avatar: AVATARS[1] },
                { quote: 'The curriculum tracking helps my classes remain organized. I can easily upload materials and monitor student performance.', user: 'Mr. Sharma, Teacher', avatar: AVATARS[2] }
              ].map((rev, i) => (
                <div key={i} className="rounded-md p-6 border-2 flex flex-col justify-between" style={{ backgroundColor: CARD, borderColor: `${INK}1F` }}>
                  <span className="text-4xl leading-none mb-2" style={{ fontFamily: FONT_DISPLAY, color: REDINK }}>&ldquo;</span>
                  <p className="text-sm leading-relaxed -mt-3" style={{ color: `${INK}CC`, fontStyle: 'italic' }}>{rev.quote}</p>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t-2" style={{ borderColor: `${INK}1A` }}>
                    <div className="flex items-center gap-3">
                      <img src={rev.avatar} alt={rev.user} className="w-9 h-9 rounded-full object-cover border-2" style={{ borderColor: BRASS }} />
                      <p className="text-xs font-semibold">{rev.user}</p>
                    </div>
                    <div className="flex gap-0.5" style={{ color: BRASS }}>
                      {[...Array(5)].map((_, s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ABOUT */}
          <section ref={aboutRef} className="py-24 border-t-2" style={{ borderColor: `${INK}1A`, backgroundColor: `${INK}05` }}>
            <div className="max-w-4xl mx-auto text-center px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: MOSS, fontFamily: FONT_MONO }}>About Us</p>
              <h2 className="text-3xl sm:text-4xl mb-3" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600 }}>Success is more than grades</h2>
              <div className="w-16 h-0.5 mx-auto mb-8" style={{ backgroundColor: BRASS }} />

              <div className="space-y-4 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto text-left sm:text-center" style={{ color: `${INK}B3` }}>
                <p>
                  At Trackwise, we believe student success extends beyond academic criteria. Our platform integrates study metrics, wellness, routines, and progress visibility to make accountability effortless — for students, and everyone supporting them.
                </p>
                <p>
                  We understand that modern students face unique challenges balancing academic pressure, health concerns, and personal development. Trackwise addresses these challenges by providing a comprehensive ecosystem that nurtures discipline, focus, and holistic growth.
                </p>
                <p>
                  Our platform is built on the principle that consistent habits, proper health management, and effective study techniques are the cornerstones of success. By combining these elements into one intuitive interface, we empower students to take control of their learning journey.
                </p>
                <p>
                  Whether you're a student striving for academic excellence, a teacher managing a classroom, a mentor guiding young minds, or a parent supporting your child's growth — Trackwise provides the tools and insights needed to foster success in every aspect of a student's life.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* FOOTER — closing cover */}
      <footer ref={contactRef} className="px-8 py-12" style={{ backgroundColor: INK, color: `${PAPER}B3` }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1">
              <div className="mb-4">
                <img src={logo} alt="Trackwise Logo" className="w-32 h-auto" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <p className="text-sm max-w-sm leading-relaxed" style={{ color: `${PAPER}99` }}>
                Empowering students to study smarter, live healthier, and build better habits through integrated learning and wellness solutions.
              </p>
            </div>

            <div>
              <h5 className="font-bold uppercase text-xs tracking-wider mb-4" style={{ color: PAPER, fontFamily: FONT_MONO }}>Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setActiveTab('Home')} className="transition-colors" style={{ color: `${PAPER}99` }}>Home</button></li>
                <li><button onClick={() => scrollToSection(aboutRef, 'About')} className="transition-colors" style={{ color: `${PAPER}99` }}>About Us</button></li>
                <li><button onClick={() => scrollToSection(featuresRef, 'Features')} className="transition-colors" style={{ color: `${PAPER}99` }}>Features</button></li>
                <li><button onClick={() => scrollToSection(contactRef, 'Contact')} className="transition-colors" style={{ color: `${PAPER}99` }}>Contact</button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold uppercase text-xs tracking-wider mb-4" style={{ color: PAPER, fontFamily: FONT_MONO }}>Features</h5>
              <ul className="space-y-2 text-sm">
                <li className="transition-colors" style={{ color: `${PAPER}99` }}>Study Resources</li>
                <li className="transition-colors" style={{ color: `${PAPER}99` }}>Health &amp; Wellness</li>
                <li className="transition-colors" style={{ color: `${PAPER}99` }}>Habit Tracking</li>
                <li className="transition-colors" style={{ color: `${PAPER}99` }}>Progress Dashboard</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold uppercase text-xs tracking-wider mb-4" style={{ color: PAPER, fontFamily: FONT_MONO }}>Get in Touch</h5>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5" style={{ color: BRASS }} />
                  <span style={{ color: `${PAPER}99` }}>trackwise@gmail.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5" style={{ color: BRASS }} />
                  <span style={{ color: `${PAPER}99` }}>+91 98765 43210</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" style={{ color: BRASS }} />
                  <span style={{ color: `${PAPER}99` }}>Kerala, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: `${PAPER}22` }}>
            <p className="text-[10px]" style={{ color: `${PAPER}66`, fontFamily: FONT_MONO }}>
              &copy; {new Date().getFullYear()} Trackwise. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-[10px]">
              <a href="#" className="transition-colors" style={{ color: `${PAPER}66` }}>Privacy Policy</a>
              <a href="#" className="transition-colors" style={{ color: `${PAPER}66` }}>Terms of Service</a>
              <a href="#" className="transition-colors" style={{ color: `${PAPER}66` }}>Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;