// src/components/HelpSupport.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  BookOpen,
  Video,
  FileText,
  Users,
  ChevronDown,
  ChevronUp,
  LogOut,
  User,
} from 'lucide-react';
import logo from '../assets/logo.png';

/*  TOKENS — shared with the Ledger dashboard & modules                   */
const INK = '#1C2B39';
const PAPER = '#F1EBDA';
const CARD = '#FBF8EF';
const MOSS = '#3F6B52';
const BRASS = '#B8892B';
const REDINK = '#A63D40';
const SLATE = '#4A6C8C';

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'Work Sans', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const HelpSupport = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
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

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const categories = [
    { id: 'all', label: 'All', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'getting-started', label: 'Getting Started', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'study', label: 'Study Features', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'health', label: 'Health & Fitness', icon: <Video className="w-4 h-4" /> },
    { id: 'habits', label: 'Habit Tracking', icon: <FileText className="w-4 h-4" /> },
    { id: 'account', label: 'Account & Profile', icon: <Users className="w-4 h-4" /> },
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I get started with Trackwise?',
      answer: 'Getting started with Trackwise is easy! Simply sign up for an account, choose your role (Student, Teacher, Mentor, or Parent), and you\'ll be guided through setting up your profile. Once logged in, you can access your personalized dashboard and start tracking your studies, health, and habits right away.'
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'What are the different user roles?',
      answer: 'Trackwise supports four user roles:\n\n• Students: Track studies, workouts, and habits\n• Teachers: Manage classes and monitor student progress\n• Mentors: Guide students with personalized plans\n• Parents: Monitor their children\'s progress and achievements'
    },
    {
      id: 3,
      category: 'study',
      question: 'How do I access study materials?',
      answer: 'Study materials are organized by class and subject. Navigate to the Studies section in your dashboard, select your class and subject, and you\'ll find:\n\n• Textbook PDFs\n• Chapter notes\n• Previous year papers\n• MCQ practice tests\n• Video lectures\n\nYou can also use the AI-powered doubt clearing assistant for instant help.'
    },
    {
      id: 4,
      category: 'study',
      question: 'What is the Focus Mode with Pomodoro Timer?',
      answer: 'The Focus Mode uses the Pomodoro Technique to help you study efficiently. It works in 25-minute focused study sessions followed by 5-minute breaks. This method helps maintain concentration and prevents burnout. You can start the timer from the Studies section of your dashboard.'
    },
    {
      id: 5,
      category: 'health',
      question: 'What fitness programs are available?',
      answer: 'Trackwise offers three main fitness categories:\n\n• Fitness/Muscle Building: Beginner to advanced plans\n• Calisthenics: Bodyweight training and skill progressions\n• Yoga: Flexibility training, breathing exercises, and meditation\n\nEach program includes week-wise plans, video tutorials, and progress tracking.'
    },
    {
      id: 6,
      category: 'health',
      question: 'How do I track my nutrition?',
      answer: 'The Health module includes a nutrition section where you can:\n\n• Get recommended foods and foods to avoid\n• Track daily water intake\n• Get healthy diet suggestions\n• View nutrition awareness tips\n\nLog your meals and water consumption to maintain healthy eating habits.'
    },
    {
      id: 7,
      category: 'habits',
      question: 'How does habit tracking work?',
      answer: 'Habit tracking in Trackwise helps you build consistency. You can:\n\n• Create a daily habit checklist\n• Track completion status\n• Maintain habit streaks\n• Earn weekly badges\n• View monthly progress reports\n\nStart with 2-3 habits and gradually add more for sustainable growth.'
    },
    {
      id: 8,
      category: 'habits',
      question: 'What achievements can I earn?',
      answer: 'Trackwise rewards your consistency with various achievements:\n\n• 7-Day and 30-Day Streak Badges\n• Study Champion and Fitness Star Badges\n• Habit Master and Consistency Awards\n• Perfect Week and Monthly Achievement Trophies\n\nKeep tracking your activities to unlock all achievements!'
    },
    {
      id: 9,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'To update your profile:\n\n1. Click on your avatar in the top right corner\n2. Select "My Profile" from the dropdown\n3. Click "Edit Profile"\n4. Update your information\n5. Click "Save Changes"\n\nYou can also update your profile picture by clicking the camera icon on your avatar.'
    },
    {
      id: 10,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'If you need to reset your password:\n\n1. Go to the login page\n2. Click "Forgot Password"\n3. Enter your registered email\n4. Check your email for a reset link\n5. Click the link and set a new password\n\nFor security, make sure to use a strong password.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesCategory ;
  });

  const quickLinks = [
    { icon: <BookOpen className="w-5 h-5" />, title: 'User Guide', desc: 'Complete documentation', color: MOSS },
    { icon: <Video className="w-5 h-5" />, title: 'Video Tutorials', desc: 'Step-by-step guides', color: SLATE },
    { icon: <FileText className="w-5 h-5" />, title: 'API Documentation', desc: 'For developers', color: BRASS },
    { icon: <Users className="w-5 h-5" />, title: 'Community Forum', desc: 'Connect with others', color: REDINK },
  ];

  const contactOptions = [
    { icon: <Mail className="w-5 h-5" />, label: 'Email Support', value: 'support@trackwise.com', action: 'mailto:support@trackwise.com' },
    { icon: <Phone className="w-5 h-5" />, label: 'Phone Support', value: '+91 98765 43210', action: 'tel:+919876543210' },
    { icon: <MessageCircle className="w-5 h-5" />, label: 'Live Chat', value: 'Available 9 AM - 6 PM', action: '#' },
  ];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: PAPER, color: INK, fontFamily: FONT_BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .faq-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, padding 0.3s ease;
          opacity: 0;
          padding: 0 1.25rem;
        }
        .faq-content.open {
          max-height: 2000px;
          opacity: 1;
          padding: 1.25rem;
        }
        .faq-header {
          transition: background-color 0.2s ease;
        }
        .faq-header:hover {
          background-color: rgba(0,0,0,0.02);
        }
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
          HELP &amp; SUPPORT
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

        {/* Header */}
        <div className="border-b" style={{ borderColor: `${INK}14`, backgroundColor: `${PAPER}` }}>
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-6">
            <div className="flex items-center gap-4 mt-2">
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center border shrink-0"
                style={{ backgroundColor: `${BRASS}12`, color: BRASS, borderColor: `${BRASS}33` }}
              >
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] mb-1" style={{ fontFamily: FONT_MONO, color: BRASS, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Help Center
                </p>
                <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.9rem', letterSpacing: '-0.01em' }}>
                  How can we help you?
                </h1>
                <p className="text-sm mt-1" style={{ color: `${INK}80` }}>
                  Find answers, guides, and support for all your questions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-10">
        
          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: FONT_DISPLAY }}>
              Quick Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-sm border cursor-pointer transition-shadow hover:shadow-sm"
                  style={{ backgroundColor: CARD, borderColor: `${INK}14` }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: `${link.color}15`, color: link.color }}>
                    {link.icon}
                  </div>
                  <h3 className="text-sm font-semibold">{link.title}</h3>
                  <p className="text-xs" style={{ color: `${INK}60` }}>{link.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Categories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ fontFamily: FONT_DISPLAY }}>
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="px-4 py-2 rounded-sm text-xs flex items-center gap-1.5 transition-colors"
                  style={{
                    backgroundColor: activeCategory === cat.id ? `${BRASS}15` : 'transparent',
                    color: activeCategory === cat.id ? BRASS : `${INK}70`,
                    border: `1px solid ${activeCategory === cat.id ? BRASS : `${INK}20`}`,
                    fontFamily: FONT_MONO,
                  }}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen = expandedFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-sm border overflow-hidden transition-shadow hover:shadow-sm"
                      style={{
                        backgroundColor: CARD,
                        borderColor: isOpen ? `${BRASS}55` : `${INK}14`,
                        boxShadow: isOpen ? `0 2px 8px ${BRASS}15` : 'none'
                      }}
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="faq-header w-full px-5 py-4 flex items-center justify-between text-left"
                        style={{ backgroundColor: isOpen ? `${BRASS}08` : 'transparent' }}
                      >
                        <span className="text-sm font-medium pr-4">{faq.question}</span>
                        <span style={{ color: BRASS }} className="shrink-0">
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>
                      <div className={`faq-content ${isOpen ? 'open' : ''}`}>
                        <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: `${INK}B0}` }}>
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8" style={{ color: `${INK}60` }}>
                  <HelpCircle className="w-12 h-12 mx-auto mb-3" style={{ color: `${INK}30` }} />

                </div>
              )}
            </div>
          </div>

          {/* Contact Support */}
          <div className="rounded-sm border p-6" style={{ backgroundColor: `${BRASS}08`, borderColor: `${BRASS}33` }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: FONT_DISPLAY }}>
              <MessageCircle className="w-5 h-5" style={{ color: BRASS }} />
              Still need help?
            </h2>
            <p className="text-sm mb-6" style={{ color: `${INK}70` }}>
              Our support team is here to help you with any questions or issues.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {contactOptions.map((option, idx) => (
                <a
                  key={idx}
                  href={option.action}
                  className="p-4 rounded-sm text-center transition-colors hover:bg-opacity-50"
                  style={{ backgroundColor: CARD, border: `1px solid ${INK}14` }}
                >
                  <div className="flex justify-center mb-2" style={{ color: BRASS }}>
                    {option.icon}
                  </div>
                  <p className="text-sm font-medium">{option.label}</p>
                  <p className="text-xs" style={{ color: `${INK}60` }}>{option.value}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;