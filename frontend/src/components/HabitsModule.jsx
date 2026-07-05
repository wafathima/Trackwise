// src/components/HabitsModule.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  CheckCircle,
  Target,
  Calendar,
  Clock,
  Bell,
  TrendingUp,
  Award,
  Flame,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Repeat,
  Zap,
  Sun,
  Moon,
  Book,
  Dumbbell,
  Coffee,
  Minus,
  Plus
} from 'lucide-react';

/* ---------------------------------------------------------------------- */
/*  TOKENS — shared with the Ledger dashboard & Features page             */
/* ---------------------------------------------------------------------- */
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

const HabitsModule = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({ 
    habits: true,
    examples: false,
    schedule: false,
    rewards: false
  });

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    sections.forEach(s => { allExpanded[s.id] = true; });
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed = {};
    sections.forEach(s => { allCollapsed[s.id] = false; });
    setExpandedSections(allCollapsed);
  };

  const sections = [
    {
      id: 'habits',
      mark: 'A',
      title: 'Habit Management',
      icon: <ClipboardCheck className="w-4 h-4" />,
      color: BRASS,
      items: [
        'Daily Habit Checklist',
        'Habit Completion Tracking',
        'Habit Streaks',
        'Weekly Badges',
        'Monthly Progress Reports',
        'Habit Reminders',
        'Consistency Score'
      ]
    },
    {
      id: 'examples',
      mark: 'B',
      title: 'Habit Examples',
      icon: <Target className="w-4 h-4" />,
      color: MOSS,
      items: [
        'Wake Up Early (6:00 AM)',
        'Complete Study Goals',
        'Exercise Daily (30 mins)',
        'Drink Water (8 glasses)',
        'Read Books (20 pages)',
        'Sleep on Time (10:30 PM)',
        'Meditate (10 mins)',
        'Journal Writing'
      ]
    },
    {
      id: 'schedule',
      mark: 'C',
      title: 'Schedule Management',
      icon: <Calendar className="w-4 h-4" />,
      color: SLATE,
      items: [
        'Custom Daily Timetable',
        'Study Planning',
        'Workout Scheduling',
        'Reminder Notifications',
        'Task Completion Tracking',
        'Productivity Monitoring',
        'Time Block Planning',
        'Priority Setting'
      ]
    },
    {
      id: 'rewards',
      mark: 'D',
      title: 'Achievements & Rewards',
      icon: <Award className="w-4 h-4" />,
      color: REDINK,
      items: [
        '7-Day Streak Badge',
        '30-Day Streak Badge',
        'Perfect Week Award',
        'Study Champion Badge',
        'Fitness Star Badge',
        'Habit Master Award',
        'Consistency King/Queen',
        'Monthly Achievement Trophy'
      ]
    }
  ];

  const quickStats = [
    { icon: <ClipboardCheck className="w-4 h-4" />, label: 'Active Habits', value: '15+' },
    { icon: <Flame className="w-4 h-4" />, label: 'Streaks Active', value: '3.2K+' },
    { icon: <Award className="w-4 h-4" />, label: 'Badges Earned', value: '8.5K+' },
    { icon: <TrendingUp className="w-4 h-4" />, label: 'Success Rate', value: '92%' }
  ];

  const habitTips = [
    { icon: <Zap className="w-4 h-4" />, title: 'Start Small', desc: 'Begin with 2-3 habits and build gradually' },
    { icon: <Repeat className="w-4 h-4" />, title: 'Be Consistent', desc: 'Track daily to build lasting habits' },
    { icon: <Bell className="w-4 h-4" />, title: 'Set Reminders', desc: 'Get notified to stay on track' }
  ];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: PAPER, color: INK, fontFamily: FONT_BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .section-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, padding 0.3s ease;
          opacity: 0;
          padding: 0 1.25rem;
        }
        .section-content.open {
          max-height: 2000px;
          opacity: 1;
          padding: 0 1.25rem 1.25rem 1.25rem;
        }
        .section-header {
          transition: background-color 0.2s ease;
        }
        .section-header:hover {
          background-color: rgba(0,0,0,0.02);
        }
        .icon-rotate {
          transition: transform 0.3s ease;
        }
        .icon-rotate.open {
          transform: rotate(180deg);
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
        {/* Header */}
        <div className="border-b sticky top-0 z-10 backdrop-blur-md" style={{ borderColor: `${INK}14`, backgroundColor: `${PAPER}CC` }}>
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-6">
            <button
              onClick={() => navigate('/features')}
              className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-100"
              style={{ fontFamily: FONT_MONO, letterSpacing: '0.1em', textTransform: 'uppercase', color: `${INK}70` }}
            >
              <ArrowLeft className="w-3 h-3" /> Table of Contents
            </button>

            <div className="flex items-center gap-4 mt-4">
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center border shrink-0"
                style={{ backgroundColor: `${BRASS}12`, color: BRASS, borderColor: `${BRASS}33` }}
              >
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] mb-1" style={{ fontFamily: FONT_MONO, color: BRASS, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Chapter III
                </p>
                <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.9rem', letterSpacing: '-0.01em' }}>
                  Daily Habit Tracker
                </h1>
                <p className="text-sm mt-1" style={{ color: `${INK}80` }}>
                  Build productive habits, manage schedules, and track consistency for personal growth
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-10">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickStats.map((stat, index) => (
              <div key={index} className="relative rounded-sm border p-4 text-center overflow-hidden" style={{ backgroundColor: CARD, borderColor: `${INK}14` }}>
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: BRASS }} />
                <div className="flex items-center justify-center mb-1" style={{ color: BRASS }}>{stat.icon}</div>
                <p className="text-xl" style={{ fontFamily: FONT_MONO, fontWeight: 700, color: INK }}>{stat.value}</p>
                <p className="text-[11px]" style={{ color: `${INK}70` }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Sections */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-[11px]" style={{ fontFamily: FONT_MONO, color: `${INK}55`, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Entries in this Chapter
              </p>
              <div className="flex gap-2">
                <button
                  onClick={expandAll}
                  className="text-[10px] px-3 py-1 rounded-sm transition-colors hover:opacity-70"
                  style={{ 
                    fontFamily: FONT_MONO, 
                    color: BRASS,
                    border: `1px solid ${BRASS}33`,
                    backgroundColor: `${BRASS}08`
                  }}
                >
                  <Plus className="w-3 h-3 inline mr-1" /> Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="text-[10px] px-3 py-1 rounded-sm transition-colors hover:opacity-70"
                  style={{ 
                    fontFamily: FONT_MONO, 
                    color: `${INK}60`,
                    border: `1px solid ${INK}22`,
                    backgroundColor: 'transparent'
                  }}
                >
                  <Minus className="w-3 h-3 inline mr-1" /> Collapse All
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => {
                const open = !!expandedSections[section.id];
                return (
                  <div
                    key={section.id}
                    className="relative rounded-sm border overflow-hidden transition-shadow hover:shadow-sm"
                    style={{ 
                      backgroundColor: CARD, 
                      borderColor: open ? `${section.color}55` : `${INK}14`,
                      boxShadow: open ? `0 2px 8px ${section.color}15` : 'none'
                    }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: section.color }} />
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="section-header w-full pl-6 pr-5 py-4 flex items-center justify-between"
                      style={{ backgroundColor: open ? `${section.color}08` : 'transparent' }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-6 h-6 rounded-full border flex items-center justify-center text-[11px]"
                          style={{ borderColor: `${section.color}55`, color: section.color, fontFamily: FONT_MONO }}
                        >
                          {section.mark}
                        </span>
                        <span style={{ color: section.color }}>{section.icon}</span>
                        <h3 className="text-sm font-semibold">{section.title}</h3>
                        {open && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ 
                            fontFamily: FONT_MONO, 
                            color: section.color,
                            backgroundColor: `${section.color}15`
                          }}>
                            Open
                          </span>
                        )}
                      </div>
                      <span style={{ color: section.color }} className={`icon-rotate ${open ? 'open' : ''}`}>
                        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>

                    <div className={`section-content ${open ? 'open' : ''}`}>
                      <ul className="space-y-2.5">
                        {section.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm">
                            <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: section.color }} />
                            <span style={{ color: `${INK}B0` }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Habit Tips */}
          <div className="relative rounded-sm border p-6 overflow-hidden" style={{ backgroundColor: `${BRASS}0A`, borderColor: `${BRASS}2E` }}>
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: BRASS }} />
            <h3 className="flex items-center gap-2 mb-4" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem', color: BRASS }}>
              <Zap className="w-4 h-4" /> Habit Building Tips
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {habitTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-sm" style={{ backgroundColor: CARD }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${BRASS}15`, color: BRASS }}>
                    {tip.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{tip.title}</p>
                    <p className="text-xs" style={{ color: `${INK}70` }}>{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Routine Example */}
          <div className="relative rounded-sm border p-6 overflow-hidden" style={{ backgroundColor: `${SLATE}0A`, borderColor: `${SLATE}2E` }}>
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: SLATE }} />
            <h3 className="flex items-center gap-2 mb-4" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem', color: SLATE }}>
              <Clock className="w-4 h-4" /> Sample Daily Routine
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { time: '6:00 AM', activity: '🌅 Wake Up & Morning Routine', icon: Sun },
                { time: '7:00 AM', activity: '📚 Study Session 1 (2 hours)', icon: Book },
                { time: '9:00 AM', activity: '🍳 Breakfast & Break', icon: Coffee },
                { time: '10:00 AM', activity: '📖 Study Session 2 (2 hours)', icon: Book },
                { time: '12:00 PM', activity: '🥗 Lunch & Rest', icon: Coffee },
                { time: '2:00 PM', activity: '💪 Workout & Exercise', icon: Dumbbell },
                { time: '4:00 PM', activity: '📝 Study Session 3 (2 hours)', icon: Book },
                { time: '6:00 PM', activity: '🎮 Break & Relaxation', icon: Zap },
                { time: '8:00 PM', activity: '🔄 Revision & Practice', icon: Repeat },
                { time: '10:30 PM', activity: '😴 Sleep & Recovery', icon: Moon }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 text-sm p-2.5 rounded-sm" style={{ backgroundColor: CARD, border: `1px solid ${INK}0C` }}>
                    <span className="text-[10px] font-bold shrink-0 w-16" style={{ fontFamily: FONT_MONO, color: SLATE }}>{item.time}</span>
                    <span style={{ color: `${INK}B0}` }}>{item.activity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to action */}
          <div className="rounded-sm text-center p-8 relative overflow-hidden" style={{ backgroundColor: BRASS }}>
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{ backgroundImage: `repeating-linear-gradient(45deg, ${PAPER} 0px, ${PAPER} 1px, transparent 1px, transparent 12px)` }}
            />
            <p className="text-[11px] mb-2 relative" style={{ fontFamily: FONT_MONO, color: `${PAPER}80`, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Begin Chapter III
            </p>
            <h3 className="relative mb-2" style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.4rem', color: PAPER }}>
              Start Building Better Habits Today
            </h3>
            <p className="relative text-sm mb-5" style={{ color: `${PAPER}90` }}>
              Track your daily habits, earn achievements, and maintain consistency
            </p>
            <button
              className="relative px-7 py-2.5 rounded-sm text-sm transition-transform active:scale-95"
              style={{ backgroundColor: PAPER, color: BRASS, fontFamily: FONT_MONO, letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              Start Tracking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsModule;